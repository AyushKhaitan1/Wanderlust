# 🧭 Wanderlust - Full-Stack Vacation Rental Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

Wanderlust is a production-ready, full-stack vacation rental web application inspired by Airbnb. Built with the **MVC (Model-View-Controller)** architecture using **Node.js, Express, MongoDB (Mongoose), and EJS**, it provides an interactive, responsive, and secure experience for both hosts and travelers.

---

## ✨ Features

### 🎨 Modern & Responsive UI
- **Dark / Light Mode Toggle**: Seamless theme switching with instant persistence in `localStorage`.
- **Airbnb-Style Card Grid**: Responsive layout (`1 to 4 columns`) with image zoom hover micro-animations.
- **Category Filter Carousel**: 11 travel categories (*Trending, Rooms, Iconic Cities, Mountains, Castles, Pools, Camping, Farms, Arctic, Domes, Boats*) with smooth scroll navigation buttons.
- **Live Search**: Instant keyword filtering across destinations, cities, and countries.
- **Tax Switch Toggle**: Real-time switch that dynamically calculates prices inclusive of 18% GST.
- **Wishlist / Favorites**: Interactive heart toggle on each card with toast feedback and local persistence.

### 🗺️ Interactive Maps & Location
- **Leaflet.js & OpenStreetMap**: Interactive map embedded on every listing page with custom red house pins, location popups, and a *"Recenter"* button.
- **Automated Geocoding**: Maps coordinates for major worldwide destinations with dynamic Nominatim fallback geocoding.

### 📅 Interactive Booking Widget
- **Dynamic Price & Date Calculator**: Live date pickers calculating total nights, cleaning fees, service fees, taxes, and final total.
- **Reservation Confirmation**: Interactive booking confirmation modal with complete stay breakdown and alert toasts.

### 🔐 Authentication & Authorization
- **User Authentication**: Built with `Passport.js`, `passport-local`, and `passport-local-mongoose` featuring salted password hashing.
- **Session & Cookies**: `express-session` with 7-day persistent cookies (`httpOnly`).
- **Role-Based Access Control**:
  - `isLoggedIn`: Protects listing creation and review submission; redirects users back to their intended destination post-login.
  - `isOwner`: Restricts **Edit** and **Delete** buttons exclusively to the listing creator.
  - `isReviewAuthor`: Only review authors can delete their own reviews.

### ⭐ Reviews & Rating System
- **1-to-Many Relationships**: Listings contain an array of `Review` ObjectIds with author references.
- **Starability 5-Star Widget**: Interactive CSS star rating input (1–5 stars) and review cards with user timestamps.
- **Cascading Delete**: Mongoose `post("findOneAndDelete")` middleware automatically purges all associated reviews when a listing is removed.

### 🛡️ Validation & Error Handling
- **Client-Side Validation**: Bootstrap 5 `needs-validation` form feedback.
- **Server-Side Validation**: `Joi` schema validation for listings and reviews.
- **Centralized Error Handling**: Custom `ExpressError` class with `wrapAsync` wrapper and a dedicated error template.

---

## 📁 Project Structure

```
Wanderlust/
├── controllers/          # Business logic handlers
│   ├── listings.js       # Listing CRUD, search & category filtering
│   ├── reviews.js        # Review creation & deletion
│   └── users.js          # User signup, login & logout
├── models/               # Mongoose schemas
│   ├── listing.js        # Listing schema with owner, reviews & cascade delete
│   ├── review.js         # Review schema with rating, comment & author
│   └── user.js           # User schema with passport-local-mongoose
├── routes/               # Express modular routers
│   ├── listing.js        # /listings routes
│   ├── review.js         # /listings/:id/reviews routes
│   └── user.js           # /signup, /login, /logout routes
├── utils/                # Error handling helpers
│   ├── ExpressError.js   # Custom HTTP error class
│   └── wrapAsync.js      # Async handler wrapper
├── middleware.js         # Auth, permissions & Joi validation middlewares
├── schema.js             # Joi validation schemas
├── views/                # Dynamic EJS templates
│   ├── layouts/
│   │   └── boilerplate.ejs # Master layout (Navbar, Flashes, Leaflet, Footer)
│   ├── includes/
│   │   ├── navbar.ejs    # Responsive navbar with search, theme toggle & user dropdown
│   │   ├── footer.ejs    # Footer with copyright & social links
│   │   └── flash.ejs     # Dismissible success & error alert banners
│   ├── listings/
│   │   ├── index.ejs     # Airbnb card grid, category filters & tax switch
│   │   ├── show.ejs      # Listing details, Leaflet map, booking card & reviews
│   │   ├── new.ejs       # Create listing form
│   │   └── edit.ejs      # Edit listing form
│   ├── users/
│   │   ├── signup.ejs    # User registration
│   │   └── login.ejs     # User login
│   └── error.ejs         # Custom error template
├── public/               # Static assets
│   ├── css/
│   │   ├── style.css     # Airbnb design system, dark mode & transitions
│   │   └── rating.css    # Starability 5-star rating widget
│   └── js/
│       └── script.js     # Dark mode, map init, booking calculator & toasts
├── init/
│   ├── data.js           # Seed dataset (29 worldwide listings)
│   └── index.js          # Database seeder with demo users & reviews
├── .env                  # Environment configuration
├── .gitignore            # Git ignore file
├── app.js                # Express app entry point
└── package.json          # Node dependencies & scripts
```

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` or a MongoDB Atlas URI.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or use the existing one):
```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SECRET=wanderlustsecretkey2026
NODE_ENV=development
```

### 3. Seed the Database
Populate the database with demo users, sample listings, and reviews:
```bash
node init/index.js
```

### 4. Start the Application
```bash
node app.js
```
Open your browser and navigate to:
**`http://localhost:8080/listings`**

---

## 🔑 Demo Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin / Host** | `wanderlust_admin` | `admin123` | Full access; owner of all seed listings (can Edit & Delete) |
| **Traveler** | `alice_travels` | `traveler123` | Author of sample reviews; can create stays and reviews |

*Or register your own user account instantly via the **Sign up** button.*

---

## 🛣️ API & Route Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/listings` | Display all listings (with search & category filters) | Public |
| `GET` | `/listings/new` | Form to create a new listing | Logged In |
| `POST` | `/listings` | Create a new listing | Logged In |
| `GET` | `/listings/:id` | Detailed listing view (map, reviews, booking widget) | Public |
| `GET` | `/listings/:id/edit` | Form to edit listing | Owner Only |
| `PUT` | `/listings/:id` | Update listing | Owner Only |
| `DELETE` | `/listings/:id` | Delete listing & cascade delete its reviews | Owner Only |
| `POST` | `/listings/:id/reviews` | Submit a 5-star review | Logged In |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete a review | Review Author Only |
| `GET` | `/signup` / `POST` | User registration | Public |
| `GET` | `/login` / `POST` | User authentication | Public |
| `GET` | `/logout` | Terminate session | Logged In |

---

## 📜 License
This project was developed as part of the Apna College Delta Full-Stack Web Development curriculum and is open source under the [ISC License](LICENSE).