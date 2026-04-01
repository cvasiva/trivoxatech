const router      = require("express").Router();
const requireAuth = require("../middleware/auth");
const Visitor     = require("../models/Visitor");

// ── POST /api/visitors  (public — called from frontend on each page load)
router.post("/", async (req, res) => {
  const { page = "/", sessionId = "" } = req.body;
  const ip        = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
  const userAgent = req.headers["user-agent"] || "";
  const referrer  = req.headers.referer || req.body.referrer || "";

  await Visitor.create({ page, ip, userAgent, referrer, sessionId });
  res.json({ success: true });
});

// ── GET /api/visitors/stats  (admin only)
router.get("/stats", requireAuth, async (_, res) => {
  const now   = new Date();
  const day   = new Date(now); day.setHours(0, 0, 0, 0);
  const week  = new Date(now); week.setDate(now.getDate() - 6); week.setHours(0, 0, 0, 0);
  const month = new Date(now); month.setDate(1); month.setHours(0, 0, 0, 0);

  const [total, today, thisWeek, thisMonth, byPage, daily30] = await Promise.all([
    Visitor.countDocuments(),
    Visitor.countDocuments({ createdAt: { $gte: day } }),
    Visitor.countDocuments({ createdAt: { $gte: week } }),
    Visitor.countDocuments({ createdAt: { $gte: month } }),

    // top pages
    Visitor.aggregate([
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    // last 30 days daily breakdown
    Visitor.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({ total, today, thisWeek, thisMonth, byPage, daily30 });
});

module.exports = router;
