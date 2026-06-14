# FanStay — MERN Sports Travel & Booking Platform

FanStay combines Airbnb-style accommodation booking with sports event discovery. Guests can find stays near major sporting events (e.g. FIFA World Cup matches), book them, and pay with cryptocurrency (Coinbase Commerce) or approved gift cards. Hosts manage listings, availability, pricing, and reservations. Admins manage users, listings, bookings, host approvals, gift card providers, and review moderation.

---

## 1. Folder Structure

```
fanstay/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   ├── cloudinary.js         # Cloudinary config
│   │   │   └── coinbase.js           # Coinbase Commerce config
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Property.js
│   │   │   ├── Booking.js
│   │   │   ├── Event.js
│   │   │   ├── Payment.js
│   │   │   ├── Review.js
│   │   │   ├── GiftCardProvider.js
│   │   │   └── Message.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT + RBAC
│   │   │   ├── errorMiddleware.js    # Global error handler
│   │   │   ├── upload.js             # Multer config
│   │   │   ├── rateLimiter.js        # Rate limiting
│   │   │   └── validators.js         # express-validator rules
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── propertyController.js
│   │   │   ├── eventController.js
│   │   │   ├── bookingController.js
│   │   │   ├── paymentController.js  # Crypto + gift card flows
│   │   │   ├── reviewController.js
│   │   │   ├── messageController.js
│   │   │   ├── hostController.js     # Earnings dashboard
│   │   │   ├── adminController.js
│   │   │   ├── uploadController.js
│   │   │   └── assistantController.js # AI travel assistant
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── propertyRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   ├── hostRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   └── assistantRoutes.js
│   │   ├── services/
│   │   │   └── socketService.js      # Socket.IO real-time chat
│   │   ├── utils/
│   │   │   ├── token.js
│   │   │   ├── email.js
│   │   │   ├── cloudinaryUpload.js
│   │   │   └── seed.js               # Seed script
│   │   ├── app.js                    # Express app config
│   │   └── server.js                 # Entry point (HTTP + Socket.IO)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── render.yaml                   # Render deployment config
│
├── frontend/
│   ├── src/
│   │   ├── api/                      # Axios API modules
│   │   │   ├── axios.js
│   │   │   ├── authAPI.js
│   │   │   ├── propertyAPI.js
│   │   │   ├── eventAPI.js
│   │   │   ├── bookingAPI.js
│   │   │   ├── paymentAPI.js
│   │   │   └── index.js              # reviews, messages, host, admin, upload, assistant
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── themeSlice.js         # Dark mode
│   │   │   └── searchSlice.js
│   │   ├── context/
│   │   │   ├── SocketContext.jsx     # Real-time messaging
│   │   │   └── LanguageContext.jsx   # Multi-language support
│   │   ├── components/
│   │   │   ├── layout/ (Navbar, Footer)
│   │   │   ├── common/ (SearchBar, Skeletons, AIAssistant, ProtectedRoute)
│   │   │   ├── property/ (PropertyCard, ImageGallery, PropertyMap)
│   │   │   ├── event/ (EventCard)
│   │   │   ├── booking/ (BookingWidget)
│   │   │   ├── payment/ (CryptoPayment, GiftCardPayment)
│   │   │   └── review/ (Reviews)
│   │   ├── pages/
│   │   │   ├── Home.jsx, Explore.jsx, Events.jsx, EventDetail.jsx
│   │   │   ├── PropertyDetail.jsx, Favorites.jsx, BookingDetail.jsx, Messages.jsx, Profile.jsx
│   │   │   ├── auth/ (Login, Register)
│   │   │   ├── guest/ (GuestDashboard)
│   │   │   ├── host/ (HostDashboard, HostListings, ListingForm, HostReservations)
│   │   │   └── admin/ (AdminDashboard, AdminUsers, AdminProperties, AdminBookings, AdminHostApplications, AdminGiftCards, AdminReviews)
│   │   ├── styles/ (global.css, auth.css, dashboard.css, forms.css)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/favicon.svg
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                   # Vercel deployment config
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md (this file)
```

---

## 2. Tech Stack

- **Frontend:** React 18 + Vite, React Router v6, Redux Toolkit, Axios, Socket.IO client, Leaflet (maps), react-toastify
- **Backend:** Node.js + Express, Mongoose, JWT, Google OAuth (google-auth-library), Socket.IO
- **Database:** MongoDB (Atlas in production)
- **File storage:** Cloudinary
- **Payments:** Coinbase Commerce (crypto), custom gift card review workflow
- **Security:** Helmet, CORS, express-rate-limit, express-mongo-sanitize, xss-clean, express-validator

---

## 3. Local Setup

### Backend

```bash
cd backend
cp .env.example .env       # fill in your values
npm install
npm run seed                # populate sample data (optional but recommended)
npm run dev                  # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env        # fill in your values
npm install
npm run dev                  # starts on http://localhost:5173
```

### Seeded test accounts (after running `npm run seed`)

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@fanstay.com  | Admin1234  |
| Host  | host1@fanstay.com  | Host1234   |
| Host  | host2@fanstay.com  | Host1234   |
| Guest | guest1@fanstay.com | Guest1234  |
| Guest | guest2@fanstay.com | Guest1234  |

---

## 4. Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL (for CORS, cookies, redirect URLs) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `COOKIE_EXPIRES_DAYS` | httpOnly cookie lifetime in days |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `CLOUDINARY_*` | Cloudinary credentials |
| `COINBASE_COMMERCE_API_KEY` | Coinbase Commerce API key |
| `COINBASE_COMMERCE_WEBHOOK_SECRET` | Shared secret for webhook signature verification |
| `EMAIL_*` | SMTP credentials for booking confirmation emails |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend Socket.IO URL, e.g. `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | Same Google OAuth Client ID as backend |

---

## 5. Payment Flows

### Crypto (Coinbase Commerce)

1. Guest creates a booking with `paymentMethod: 'crypto'` (status `pending`).
2. Guest clicks "Pay with Crypto" → `POST /api/payments/crypto/create-charge` creates a Coinbase Commerce charge and a `Payment` record.
3. Guest completes payment on the hosted Coinbase Commerce checkout page (opens in a new tab).
4. Coinbase sends a webhook to `POST /api/payments/crypto/webhook`. The signature is verified using `COINBASE_COMMERCE_WEBHOOK_SECRET` (HMAC-SHA256 over the raw body).
5. On `charge:confirmed`, the `Payment` is marked `completed`, and the `Booking` is updated to `paymentStatus: 'paid'`, `bookingStatus: 'confirmed'`. A confirmation email is sent.

**Important:** the webhook route is registered in `app.js` **before** the JSON body parser, using `express.raw()`, so the raw bytes are available for signature verification.

### Gift Card

1. Guest creates a booking with `paymentMethod: 'gift_card'`.
2. Guest submits the gift card code + photo via `POST /api/payments/giftcard/submit` (multipart form). A `Payment` record is created with `status: 'awaiting_admin_review'`.
3. Admin reviews pending submissions at `/admin/gift-cards` (`GET /api/payments/giftcard/pending`).
4. Admin approves/rejects via `PUT /api/payments/giftcard/:paymentId/review`.
5. On approval, `Payment.status = 'completed'`, `Booking.paymentStatus = 'paid'`, `Booking.bookingStatus = 'confirmed'`, and a confirmation email is sent.

---

## 6. Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo (or connect the monorepo and set the root directory to `frontend`).
2. In Vercel: **New Project** → import repo → set **Root Directory** to `frontend`.
3. Set environment variables (`VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_GOOGLE_CLIENT_ID`) pointing to your deployed backend.
4. Build command: `npm run build`, Output directory: `dist` (Vite default). The included `vercel.json` handles SPA routing rewrites.

### Backend → Render or Railway

**Render** (using the included `render.yaml`):
1. Push the repo to GitHub.
2. In Render: **New** → **Blueprint** → select the repo. Render will detect `backend/render.yaml`.
3. Fill in the `sync: false` environment variables in the Render dashboard (Mongo URI, JWT secret, Cloudinary, Coinbase, Google OAuth, email credentials, `CLIENT_URL`).
4. Deploy. Render builds with `npm install` and starts with `npm start`.

**Railway**:
1. Create a new project from the GitHub repo, set root directory to `backend`.
2. Add the same environment variables as above.
3. Set the start command to `npm start` (or let Railway detect it from `package.json`).
4. Railway provides a public URL — use it as `VITE_API_URL` / `VITE_SOCKET_URL` (with `/api` suffix for the API URL).

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (0.0.0.0/0 for simplicity, or restrict to your deployment's IPs).
3. Copy the connection string into `MONGO_URI` in your backend environment.

### Coinbase Commerce Webhook

After deploying the backend, register the webhook URL in your Coinbase Commerce dashboard:
`https://<your-backend-domain>/api/payments/crypto/webhook`

Copy the **shared secret** from the Coinbase Commerce webhook settings into `COINBASE_COMMERCE_WEBHOOK_SECRET`.

### Google OAuth

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add your frontend domain(s) (including `http://localhost:5173` for local dev) to **Authorized JavaScript origins**.
3. Use the same Client ID in both `backend/.env` (`GOOGLE_CLIENT_ID`) and `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`).

---

## 7. Security Notes

- JWTs are stored in httpOnly cookies (primary) with a localStorage fallback for the `Authorization` header (useful for cross-domain deployments where third-party cookies may be blocked).
- All write endpoints are protected by `protect` (JWT auth) and `authorize(...roles)` (RBAC) middleware.
- `express-mongo-sanitize` and `xss-clean` sanitize inputs against NoSQL injection and XSS.
- `express-rate-limit` is applied globally and more strictly on auth and payment routes.
- `express-validator` validates request bodies for registration, login, listings, bookings, reviews, and events.
- Coinbase webhook signatures are verified via HMAC-SHA256 before trusting any payment update.
- CSRF: since the API is consumed by a separate frontend origin using JWT bearer/cookie auth (not session cookies for state-changing forms), CSRF risk is mitigated by `SameSite` cookie settings and CORS restricted to `CLIENT_URL`. If you add traditional cookie-session-based forms, add `csurf` middleware (already in `package.json` dependencies) to those routes.

---

## 8. Bonus Features Implemented

- **AI travel assistant**: floating chat widget (`/api/assistant/query`) suggests upcoming events and nearby stays based on free-text queries. Designed to be swapped for a real LLM call.
- **Host verification badges**: `isHostVerified` flag shown on listings and profiles.
- **Referral system**: each user gets a `referralCode`; new users can sign up with a referrer's code (`referredBy`).
- **Multi-language support**: English, Spanish, French via `LanguageContext` with a language switcher in the navbar.
- **Real-time messaging**: Socket.IO-based guest↔host chat (`/messages/:userId`).
- **Interactive maps**: Leaflet map on property detail pages.
- **Dark mode**: theme toggle persisted to localStorage, driven by CSS variables.
- **Skeleton loaders**: used across property grids, event grids, and detail pages.

Push notifications are stubbed via Socket.IO `notification` events (emitted on new messages); wiring this to a browser push service (e.g. Web Push / FCM) is a natural extension.

---

## 9. Production Readiness Notes

- Replace `console.log`/`console.error` calls with a structured logger (e.g. Winston/Pino) for production.
- Add automated tests (Jest + Supertest for backend, Vitest + React Testing Library for frontend).
- Add image optimization/resizing via Cloudinary transformations in `<img>` URLs (e.g. `?w=400,q_auto,f_auto`).
- Add pagination cursors for very large datasets instead of skip/limit for the `Message` and `Booking` collections.
- Consider moving the AI assistant to a real LLM API call (Anthropic/OpenAI) with function calling against the properties/events APIs.
- Add CI (GitHub Actions) to run lint/tests and deploy on merge to `main`.
