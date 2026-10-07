
🍔 Foodie – Food Ordering Web Application

Foodie is a full-stack MERN food ordering web application that allows customers to browse food, manage their cart, place orders, make online payments, and track their orders.

It also includes a dedicated admin panel for managing foods, customers, orders, payments, and dashboard statistics.

 🚀 Features

👤 Customer Features

- Customer registration and login
- JWT-based authentication
- Browse food menu
- Search and explore food categories
- Food details
- Add food to cart
- Update cart quantity
- Remove items from cart
- Checkout and delivery address
- Cash on Delivery
- Razorpay Test Mode payment
- Order confirmation
- View order history
- Customer profile
- Logout

👨‍💼 Admin Features

- Separate admin login
- Admin dashboard
- Food management
- Add new food
- Edit food
- Delete food
- Food availability management
- Customer management
- Customer details
- Order management
- Order details
- Update order status
- Payment status management
- Revenue statistics
- Today's orders and revenue
- Pending and delivered order statistics

 🔐 Security

- JWT authentication
- Password hashing with bcrypt
- Protected customer routes
- Protected admin routes
- Server-side food price calculation
- Food availability validation
- Razorpay payment signature verification
- Environment variables for sensitive credentials


## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Context API
- CSS
- Font Awesome

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Razorpay

### Database

- MongoDB Atlas

### Payment

- Razorpay Test Mode



## 📁 Project Structure

Food-Ordering-Web/
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── createAdmin.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── data/
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md

## 💳 Razorpay Test Mode

This project uses Razorpay Test Mode for online payments.

No real money is charged while using Razorpay Test Mode.

For production deployment, replace the test credentials with the appropriate production credentials and configure the payment flow according to Razorpay's production requirements.

## 🔐 Environment Variables

Sensitive credentials are intentionally excluded from GitHub.

Never commit:
.env
The project's `.gitignore` protects environment files and `node_modules`.

## 📊 Admin Dashboard

The admin dashboard provides information including:

* Total foods
* Total orders
* Total customers
* Total revenue
* Today's orders
* Today's revenue
* Pending orders
* Delivered orders

## 📦 Order Flow
Browse Food
     ↓
Add to Cart
     ↓
Checkout
     ↓
Login / Register
     ↓
Delivery Details
     ↓
COD / Razorpay
     ↓
Order Created
     ↓
Order Confirmation
     ↓
My Orders




## 🔒 Authentication Flow


Customer
   ↓
Register / Login
   ↓
JWT Token
   ↓
Protected Customer Routes

Admin
   ↓
Admin Login
   ↓
JWT Token
   ↓
Admin Protected Routes




## 🧪 Current Status

The application has been tested with:

* Customer registration
* Customer login
* Admin login
* Food management
* Cart functionality
* Checkout
* Cash on Delivery
* Razorpay Test Mode
* Order creation
* Order history
* Customer management
* Admin dashboard
* Order status management
* MongoDB Atlas connection



## 🌐 Repository

GitHub:

https://github.com/Diptiranjan-Das-4/Food-Ordering-Web



## 👨‍💻 Developer

**Dipti Ranjan Das**

Built as a full-stack MERN food ordering application.



## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

