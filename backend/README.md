# Trivoxa Technologies — Backend API

Express.js REST API for the Trivoxa Technologies website. Handles admin authentication, page data persistence, contact form submissions, and optional email notifications.

## 📁 Structure

```
backend/
├── data/                        # JSON data files (auto-seeded from src/data on first run)
│   └── contactSubmissions.json  # Contact form entries (git-ignored)
├── middleware/
│   └── auth.js                  # JWT verification middleware
├── routes/
│   ├── auth.js                  # POST /api/auth/login, GET /api/auth/verify
│   ├── data.js                  # GET/PUT /api/data/:key
│   ├── contact.js               # POST /api/contact
│   └── submissions.js           # GET/PATCH/DELETE /api/submissions
├── .env                         # Environment variables (git-ignored)
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
Edit `.env` with your values:
```env
PORT=5000
JWT_SECRET=your_strong_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password_here

# Optional — email notifications for contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=hello@trivoxatech.com
```

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login with username + password, returns JWT |
| GET | `/api/auth/verify` | ✅ | Verify token validity |

**Login request body:**
```json
{ "username": "admin", "password": "trivoxa@2024" }
```

### Page Data
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/data/:key` | ❌ | Read a page's JSON data |
| PUT | `/api/data/:key` | ✅ | Save updated JSON data |

**Allowed keys:** `homeData`, `aboutData`, `blogsData`, `blogDetailData`, `careersData`, `contactData`, `courseDetailsData`, `coursesData`, `portfolioData`, `servicesData`, `servicesQuoteData`

> On first GET, data is auto-seeded from `src/data/` if no backend copy exists yet.

### Contact Form
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | ❌ | Submit contact form |

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555 000 1234",
  "interest": "web-development",
  "message": "I'd like to enroll..."
}
```

### Submissions (Admin)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/submissions` | ✅ | List all contact submissions |
| PATCH | `/api/submissions/:id/read` | ✅ | Mark a submission as read |
| DELETE | `/api/submissions/:id` | ✅ | Delete a submission |

## 🔐 Authentication

All protected routes require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

Tokens expire after **8 hours**. The frontend stores the token in `localStorage` under `trivoxa_admin_token`.

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `cors` | Cross-origin requests from React dev server |
| `jsonwebtoken` | JWT sign & verify |
| `bcryptjs` | Password hashing |
| `nodemailer` | Email notifications (optional) |
| `dotenv` | Environment variable loading |
| `nodemon` | Dev auto-restart |

## 🌐 Frontend Integration

The React frontend communicates with this API via `src/utils/api.js`.

Set the API base URL in the frontend `.env` if deploying to a different host:
```env
REACT_APP_API_URL=https://api.trivoxatech.com/api
```

Default is `http://localhost:5000/api`.

## 🚀 Deployment Notes

- Set a strong `JWT_SECRET` in production
- Change default `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Use a process manager like **PM2**: `pm2 start server.js --name trivoxa-api`
- Place behind **Nginx** as a reverse proxy for SSL termination
- `data/` folder must be writable by the Node process
