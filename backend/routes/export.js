const router      = require("express").Router();
const requireAuth = require("../middleware/auth");
const ExcelJS     = require("exceljs");
const ContactSubmission    = require("../models/ContactSubmission");
const EnrollSubmission     = require("../models/EnrollSubmission");
const NewsletterSubscriber = require("../models/NewsletterSubscriber");

// ── Helpers ──────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const HEADER_STYLE = {
  font:      { bold: true, color: { argb: "FFFFFFFF" } },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } },
  alignment: { horizontal: "center" },
};

const EXPIRED_STYLE = {
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDE8E8" } },
  font: { color: { argb: "FFB91C1C" }, italic: true },
};

function autoWidth(ws) {
  ws.columns.forEach((col) => {
    let max = col.header ? String(col.header).length : 10;
    col.eachCell({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > max) max = len;
    });
    col.width = Math.min(max + 4, 55);
  });
}

// Group docs by "YYYY-MM" key
function groupByMonth(docs) {
  const map = {};
  docs.forEach((d) => {
    const dt  = new Date(d.createdAt);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(d);
  });
  // sort keys newest first
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

function sheetLabel(key) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`;
}

function isExpired(doc) {
  return Date.now() - new Date(doc.createdAt).getTime() > 30 * 24 * 60 * 60 * 1000;
}

// Add one worksheet per month group
function addMonthSheets(wb, groups, columns, rowMapper) {
  groups.forEach(([key, docs]) => {
    const ws = wb.addWorksheet(sheetLabel(key));
    ws.columns = columns.map((c) => ({ ...c }));

    // header row
    const hRow = ws.getRow(1);
    columns.forEach((c, i) => {
      hRow.getCell(i + 1).value = c.header;
      Object.assign(hRow.getCell(i + 1), HEADER_STYLE);
    });
    hRow.commit();

    // data rows
    docs.forEach((doc) => {
      const row    = ws.addRow(rowMapper(doc));
      const expiry = isExpired(doc);
      if (expiry) {
        row.eachCell((cell) => {
          cell.fill = EXPIRED_STYLE.fill;
          cell.font = EXPIRED_STYLE.font;
        });
      }
      row.commit();
    });

    autoWidth(ws);
  });
}

// ── GET /api/export/all ──────────────────────────────────────
router.get("/all", requireAuth, async (req, res) => {
  // Only fetch last 30 days — expired data is excluded from export
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [contacts, enrolls, newsletter] = await Promise.all([
    ContactSubmission.find({ createdAt: { $gte: since30 } }).sort({ createdAt: -1 }).lean(),
    EnrollSubmission.find({ createdAt: { $gte: since30 } }).sort({ createdAt: -1 }).lean(),
    NewsletterSubscriber.find({ createdAt: { $gte: since30 } }).sort({ createdAt: -1 }).lean(),
  ]);

  const wb      = new ExcelJS.Workbook();
  wb.creator    = "Trivoxa Technologies";
  wb.created    = new Date();
  wb.properties = { date1904: false };

  // ── Summary sheet ────────────────────────────────────────
  const summary = wb.addWorksheet("📊 Summary");
  summary.columns = [
    { header: "Category",    key: "cat",   width: 24 },
    { header: "Total (30d)", key: "total", width: 16 },
    { header: "Exported On", key: "date",  width: 24 },
  ];
  summary.getRow(1).eachCell((cell) => Object.assign(cell, HEADER_STYLE));
  [
    { cat: "Contact & Quotes", total: contacts.length,   date: new Date().toLocaleString() },
    { cat: "Enrollments",      total: enrolls.length,    date: new Date().toLocaleString() },
    { cat: "Newsletter",       total: newsletter.length, date: new Date().toLocaleString() },
  ].forEach((r) => summary.addRow(r));
  autoWidth(summary);

  // ── Contact & Quotes — month-wise sheets ─────────────────
  const contactCols = [
    { header: "Type",     key: "type"     },
    { header: "Name",     key: "name"     },
    { header: "Email",    key: "email"    },
    { header: "Phone",    key: "phone"    },
    { header: "Interest", key: "interest" },
    { header: "Service",  key: "service"  },
    { header: "Budget",   key: "budget"   },
    { header: "Timeline", key: "timeline" },
    { header: "Message",  key: "message"  },
    { header: "Read",     key: "read"     },
    { header: "Date",     key: "date"     },
    { header: "Expires",  key: "expires"  },
  ];
  addMonthSheets(wb, groupByMonth(contacts), contactCols, (c) => ({
    type:     c.type,
    name:     c.name,
    email:    c.email,
    phone:    c.phone    || "—",
    interest: c.interest || "—",
    service:  c.service  || "—",
    budget:   c.budget   || "—",
    timeline: c.timeline || "—",
    message:  c.message,
    read:     c.read ? "Yes" : "No",
    date:     new Date(c.createdAt).toLocaleString(),
    expires:  new Date(new Date(c.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }));

  // ── Enrollments — month-wise sheets ──────────────────────
  const enrollCols = [
    { header: "Name",     key: "name"     },
    { header: "Email",    key: "email"    },
    { header: "Phone",    key: "phone"    },
    { header: "WhatsApp", key: "whatsapp" },
    { header: "Course",   key: "course"   },
    { header: "Message",  key: "message"  },
    { header: "Date",     key: "date"     },
    { header: "Expires",  key: "expires"  },
  ];
  addMonthSheets(wb, groupByMonth(enrolls), enrollCols, (e) => ({
    name:     e.name,
    email:    e.email,
    phone:    e.phone,
    whatsapp: e.whatsapp,
    course:   e.course   || "—",
    message:  e.message,
    date:     new Date(e.createdAt).toLocaleString(),
    expires:  new Date(new Date(e.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }));

  // ── Newsletter — month-wise sheets ───────────────────────
  const newsCols = [
    { header: "Email",   key: "email"   },
    { header: "Source",  key: "source"  },
    { header: "Date",    key: "date"    },
    { header: "Expires", key: "expires" },
  ];
  addMonthSheets(wb, groupByMonth(newsletter), newsCols, (n) => ({
    email:   n.email,
    source:  n.source || "website",
    date:    new Date(n.createdAt).toLocaleString(),
    expires: new Date(new Date(n.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }));

  const filename = `trivoxa-data-${new Date().toISOString().slice(0, 10)}.xlsx`;
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
});

// ── DELETE /api/export/purge-expired  (manual purge, admin only) ──
router.delete("/purge-expired", requireAuth, async (_, res) => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [c, e, n] = await Promise.all([
    ContactSubmission.deleteMany({ createdAt: { $lt: cutoff } }),
    EnrollSubmission.deleteMany({ createdAt: { $lt: cutoff } }),
    NewsletterSubscriber.deleteMany({ createdAt: { $lt: cutoff } }),
  ]);
  res.json({
    success: true,
    deleted: {
      contacts:    c.deletedCount,
      enrollments: e.deletedCount,
      newsletter:  n.deletedCount,
    },
  });
});

// ── GET /api/export/counts ───────────────────────────────────
router.get("/counts", requireAuth, async (_, res) => {
  const since30  = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [contacts, enrolls, newsletter] = await Promise.all([
    ContactSubmission.countDocuments({ createdAt: { $gte: since30 } }),
    EnrollSubmission.countDocuments({ createdAt: { $gte: since30 } }),
    NewsletterSubscriber.countDocuments({ createdAt: { $gte: since30 } }),
  ]);
  res.json({
    contacts,
    enrolls,
    newsletter,
    shouldAutoDownload: contacts >= 500 || enrolls >= 500 || newsletter >= 500,
  });
});

module.exports = router;
