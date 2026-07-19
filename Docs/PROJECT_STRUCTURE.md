# Project Structure

This document outlines the complete directory layout for the **Smart Soft Skills Management System for Placement Readiness**.

## Base Directories

*   **[Backend/](file:///c:/Users/karth/Downloads/python%20training/softskiils/Backend)**: Contains the Express.js server, Node API services, models, middlewares, database queries, scripts, and utilities.
*   **[Frontend/](file:///c:/Users/karth/Downloads/python%20training/softskiils/Frontend)**: Contains the React.js client application styled with Tailwind CSS, utilizing Framer Motion for animations.
*   **[Database/](file:///c:/Users/karth/Downloads/python%20training/softskiils/Database)**: Holds the PostgreSQL schemas, configurations, and initialization query scripts.
*   **[Docs/](file:///c:/Users/karth/Downloads/python%20training/softskiils/Docs)**: Contains developer guides, API specifications, and architectural maps.

---

## Detailed Directory Map

### Backend Layout
```
Backend/
├── config/             # Configuration managers (Database, Cloudinary, App configs)
├── controllers/        # Express request/response routers mapping logic
├── database/           # Schema definitions and tables initialization sql
├── middleware/         # Auth guards, role permissions check, request validators
├── models/             # DB interaction interfaces (Users, Students, evaluations)
├── routes/             # REST endpoint mapping
├── scripts/            # Database initialization and mock data seeder scripts
├── services/           # External API interfaces (Gemini/OpenAI, notifications)
├── uploads/            # Temporary directories for local uploads
├── utils/              # Standard logging helpers and error utilities
├── server.js           # Server application initializer
└── package.json        # Backend NPM package manifest
```

### Frontend Layout
```
Frontend/
├── public/             # Static public assets
├── src/
│   ├── animations/     # Framer motion layout transitions
│   ├── api/            # Centralized Axios client client-side API requests
│   ├── assets/         # App logo, graphics, icons
│   ├── components/     # Reusable UI widgets (cards, list, loaders)
│   ├── contexts/       # Global state engines (AuthContext, DarkMode)
│   ├── hooks/          # Domain hooks (useAuth, useFetch)
│   ├── layouts/        # Page shells (Dashboard, Authentication, Main)
│   ├── pages/          # 22 requested UI views
│   ├── routes/         # Router routing table and private components
│   ├── services/       # Client side api connectors
│   ├── styles/         # Global typography and tailwind layout inputs
│   ├── utils/          # Client string/data helper systems
│   ├── App.jsx         # App mounting configuration
│   └── main.jsx        # Mounting point
├── index.html          # Web page frame
├── tailwind.config.js  # Style system configurations
└── package.json        # Frontend NPM package manifest
```
