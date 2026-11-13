# ☕ Brewly & Co. — Specialty Coffee E-Commerce Platform

A modern, full-stack specialty coffee e-commerce and subscription platform built using **React, Vite, Node.js, Express.js, MongoDB, and Stripe Test Mode**.

Brewly & Co. provides a personalized coffee shopping experience with product customization, intelligent coffee recommendations, subscription management, secure demo checkout, order tracking, and a comprehensive admin dashboard.

## 🚀 Key Features

### 🛍️ Coffee Shopping Experience
- Browse specialty coffee collections with detailed product information.
- Search, filter, and sort products by roast level, price, and ratings.
- View coffee origins, processing methods, altitude, and flavor profiles.
- Customize coffee grind types and bag weights.
- Manage shopping cart and wishlist.
- Apply promotional discount codes.

### ☕ Personalized Coffee Experience
- Interactive coffee customization.
- Coffee recommendation quiz based on customer preferences.
- Personalized roast and brewing suggestions.
- Barista AI chat assistant for coffee-related guidance.
- Customer reviews and ratings.

### 💳 Checkout & Payments
- Stripe integration using **Test Mode (Demo Payments Only)**.
- Cash on Delivery (COD) option.
- Order confirmation and receipt generation.
- Discount and delivery charge calculations.
- Order history and shipment tracking.

**Note:** Stripe is configured for testing and demonstration purposes. No real payments are intended to be processed.

### 📦 Coffee Subscriptions
- Customizable coffee subscription plans.
- Flexible delivery frequencies of 1, 2, or 4 weeks.
- Coffee grind and bag weight customization.
- Subscriber discounts.
- Subscription management.

### 🚚 Order Tracking & Notifications
- Order placement and confirmation.
- Shipment status tracking.
- Customer notification center.
- Automated email notifications using Nodemailer.
- Order history and receipts.

### 🤖 Barista AI Assistant
- Interactive coffee guidance chatbot.
- Coffee roast and grind recommendations.
- Brewing tips and flavor suggestions.
- Chat message storage using MongoDB.

### 📊 Admin Dashboard
- JWT-protected admin authentication.
- Product management (Create, Read, Update, Delete).
- Inventory and stock management.
- Order processing and fulfillment updates.
- Customer review management.
- Coupon and discount management.
- Sales analytics and revenue overview.
- Subscription and notification management.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Payments | Stripe API (Test Mode) |
| Email | Nodemailer, SMTP |
| Icons | Lucide React |
| Version Control | Git, GitHub |
| Deployment | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```text
Brewly-Co/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── authUtils.js
│   ├── db.js
│   ├── mailer.js
│   ├── seedAdmin.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── package.json
├── README.md
└── .gitignore
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maheknankani/Brewly-Co..git
cd Brewly-Co.
```

### 2. Install Dependencies

Install dependencies in the project root, frontend, and backend.

```bash
npm install
cd client
npm install
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory using `.env.example` as the reference.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=your_stripe_test_secret_key
ADMIN_USER=your_admin_username
ADMIN_PASS=your_secure_admin_password
```

Add SMTP and other required environment variables according to your backend configuration.

Never commit real credentials or `.env` files to GitHub.

### 4. Seed Admin Account

```bash
cd server
npm run seed:admin
```

Configure your own secure admin credentials before running the seed command.

### 5. Start Development Servers

From the project root:

```bash
npm run dev
```

**Frontend:** http://localhost:5173

**Backend:** http://localhost:5000

## 💳 Stripe Test Payments

This project uses Stripe Test Mode for demonstration purposes.

| Test Scenario | Test Card Number |
|---|---|
| Successful Payment | `4242 4242 4242 4242` |
| 3D Secure Authentication | `4000 0027 6000 3184` |
| Generic Declined Payment | `4000 0000 0000 0002` |
| Expired Card | `4000 0000 0000 0069` |
| Incorrect CVC | `4000 0000 0000 0127` |

Use any valid future expiration date and a suitable test CVC.

All payments must be performed in Stripe Test Mode.

## 🔐 Security

- JWT-based admin authentication.
- Password hashing using bcrypt.
- Environment-based secret management.
- Protected backend routes.
- MongoDB data persistence.
- Stripe test payment integration.

**Security notice:** Production deployment requires verification of authorization, customer order privacy, payment confirmation, and server-side validation.

## 🌐 Deployment

The project is designed to be deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Payment Testing:** Stripe Test Mode

Deployment URLs will be added after successful deployment.

## 🎯 Project Purpose

Brewly & Co. is developed as a full-stack portfolio project demonstrating modern web development, e-commerce functionality, REST API integration, database management, authentication, payment testing, and responsive user interface design.

## 👩‍💻 Developer

**Mahek Nankani**

GitHub: https://github.com/maheknankani

## 📄 License

This project is intended for educational and portfolio demonstration purposes.