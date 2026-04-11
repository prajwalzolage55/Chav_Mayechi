# Chav Mayechi — Homemade Laddus with Love ❤️

Chav Mayechi is a premium web application for an artisan culinary brand specializing in homemade Maharashtrian laddus. Engineered with a sophisticated "Culinary Editorial" design system, the platform offers a seamless shopping and order management experience.

## ✨ Features
- **Premium User Interface**: Cinematic hero section, scroll-reveal animations, and high-end aesthetics (Noto Serif & Inter) styled iteratively using Tailwind CSS.
- **Authentication System**: Secure user registration, login, and session management powered by Firebase Auth.
- **Role-Based Access Control**: Fully distinct interfaces and capabilities for regular users and administrators.
- **Menu & Ordering**: Dynamic product catalogue loading locally with robust scalable order placement architecture.
- **Admin Dashboard**: A high-end admin panel (Gourmet Editorial aesthetic) to view user demographics, manage incoming orders, and inspect the "Collector Network".
- **Fully Responsive**: Mobile-first architecture ensuring a premium experience across desktops, tablets, and smartphones.

## 🛠️ Technology Stack
- **Frontend Core**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling System**: Tailwind CSS (Utility-first) via CDN, Custom CSS (`index.css`/`style.css`)
- **Backend & Database**: Firebase Firestore (NoSQL Document Store)
- **Authentication**: Firebase Authentication (Email & Password)
- **Hosting environment**: Firebase Hosting
- **Iconography**: Google Material Symbols Outlined & Lucide Icons

## 📂 Project Structure
```text
chav/
├── css/
│   └── style.css          # Global custom styles and overrides
├── images/                # Static image assets and brand logo
├── js/
│   ├── auth-service.js    # Firebase authentication flow and RBAC logic
│   ├── firebase-config.js # Firebase service initialization
│   ├── orders-service.js  # CRUD operations for order management
│   ├── products-data.js   # Dynamic product catalog data store
│   └── ui.js              # Shared UI components (Navbar, Footers, Nav Drawers)
├── admin.html             # Administrator dashboard panel
├── dashboard.html         # Customer profile and past orders dashboard
├── index.html             # Landing page with dynamic hero and featured dishes
├── login.html             # Secure user login interface
├── order.html             # Seamless order placement interface
├── products.html          # Complete product and laddu catalog
├── register.html          # New user registration interface
├── firebase.json          # Firebase hosting routing & ignore configuration
└── .firebaserc            # Firebase project and deployment aliases
```

## 🚀 Local Development Setup

The application is completely static and modular, meaning no heavy build systems (like Webpack/Vite) are required to run the core architecture locally.

### Prerequisites
- A local web server (e.g., VS Code Live Server, Python HTTP server, or `http-server` via npm)
- Valid Firebase Project (Firestore + Authentication)

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd chav
   ```

2. **Configure Firebase:**
   Access `js/firebase-config.js` and input your Firebase configuration object containing your private API key and project environment variables.
   
3. **Serve Locally:**
   Using Python (built-in):
   ```bash
   python -m http.server 3000
   ```
   Or using Node.js:
   ```bash
   npx http-server . -p 3000
   ```

4. **Launch Application:**
   Navigate to `http://localhost:3000` in your preferred local browser.

## ☁️ Deployment

This platform is optimized for sub-second delivery via Firebase Hosting. 

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate the CLI with your Google Account:
   ```bash
   firebase login
   ```
3. Deploy directly to the global CDN:
   ```bash
   firebase deploy
   ```

## 🎨 Design System Fundamentals
The site follows an exclusively curated "Culinary Editorial" design vocabulary:
- **Palette**: `primary` (#98462f / rust), `surface` (#fbf9f4 / warm off-white), `on-surface` (#1c1b1b / deep charcoal).
- **Typography**: A tasteful balance between *Noto Serif* (elegant traditional headlines) and *Inter* (modern clean body text).
- **Layouts**: High-end visual cues leveraging subtle drop shadows `.editorial-shadow`, thin 1px borders for structure, and smooth glassmorphism components.

---

> *Crafted with precision for Chav Mayechi. The Digital Atelier of Homemade Heritage.*
