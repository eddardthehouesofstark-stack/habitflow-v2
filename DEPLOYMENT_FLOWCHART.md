# 📊 HabitFlow Deployment Flowchart

Visual guide showing which files are deployed to each platform.

---

## 🗂️ File Distribution Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR LOCAL PROJECT                          │
│                         (habitflow/)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ git push
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          GITHUB                                 │
│                    (All files stored)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐   ┌───────────────────┐
        │   RENDER          │   │   VERCEL          │
        │   (Backend)       │   │   (Frontend)      │
        └───────────────────┘   └───────────────────┘
```

---

## 📦 Render (Backend Deployment)

### What Render Uses

```
habitflow/
└── backend/                    ← Root Directory: "backend"
    ├── server.js              ✅ Main application file
    ├── package.json           ✅ Dependencies & scripts
    ├── package-lock.json      ✅ Dependency lock file
    ├── schema.sql             ✅ Database schema (reference only)
    ├── .node-version          ✅ Node.js version (18)
    ├── Procfile               ✅ Process configuration
    └── .env                   ❌ NOT uploaded (use Render env vars)
```

### Render Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  RENDER DASHBOARD SETTINGS                                  │
├─────────────────────────────────────────────────────────────┤
│  Name:              habitflow-backend                       │
│  Root Directory:    backend                                 │
│  Environment:       Node                                    │
│  Build Command:     npm install                             │
│  Start Command:     npm start                               │
│  Instance Type:     Free                                    │
├─────────────────────────────────────────────────────────────┤
│  ENVIRONMENT VARIABLES (Add manually in dashboard):         │
│  ├─ SUPABASE_URL                                           │
│  ├─ SUPABASE_SERVICE_ROLE_KEY                              │
│  ├─ JWT_SECRET                                             │
│  ├─ NODE_ENV = production                                  │
│  └─ FRONTEND_URL (add after Vercel deployment)            │
└─────────────────────────────────────────────────────────────┘
```

### What Render Does

```
1. Reads: backend/package.json
   └─ Installs dependencies: npm install

2. Reads: backend/.node-version
   └─ Uses Node.js version 18

3. Reads: backend/Procfile (optional)
   └─ Knows how to start: node server.js

4. Runs: npm start
   └─ Executes: node server.js

5. Exposes: https://habitflow-backend.onrender.com
```

---

## 🌐 Vercel (Frontend Deployment)

### What Vercel Uses

```
habitflow/
└── frontend/                   ← Root Directory: "frontend"
    ├── index.html             ✅ Main HTML file (entire app)
    └── config.js              ✅ Configuration file
```

### Vercel Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  VERCEL DASHBOARD SETTINGS                                  │
├─────────────────────────────────────────────────────────────┤
│  Framework Preset:  Other                                   │
│  Root Directory:    frontend                                │
│  Build Command:     (leave empty)                           │
│  Output Directory:  (leave empty)                           │
│  Install Command:   (leave empty)                           │
├─────────────────────────────────────────────────────────────┤
│  NO ENVIRONMENT VARIABLES NEEDED                            │
│  (Configuration is in frontend/config.js)                   │
└─────────────────────────────────────────────────────────────┘
```

### What Vercel Does

```
1. Reads: frontend/index.html
   └─ Serves as main page

2. Reads: frontend/config.js
   └─ Loads configuration

3. Serves: Static files via CDN

4. Exposes: https://habitflow.vercel.app
```

---

## 🔄 Complete Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: LOCAL DEVELOPMENT                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  habitflow/                                                     │
│  ├── frontend/                                                  │
│  │   ├── index.html          ← Your app                        │
│  │   └── config.js           ← API configuration               │
│  ├── backend/                                                   │
│  │   ├── server.js           ← Express server                  │
│  │   ├── package.json        ← Dependencies                    │
│  │   ├── .env                ← Local secrets (NOT committed)   │
│  │   ├── .node-version       ← Node version                    │
│  │   └── Procfile            ← Start command                   │
│  ├── .gitignore              ← Excludes .env files             │
│  └── vercel.json             ← Vercel routing config           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ git add .
                              │ git commit -m "Ready for deployment"
                              │ git push origin master
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: GITHUB REPOSITORY                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  All files stored (except .env - blocked by .gitignore)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│  STEP 3A: RENDER          │   │  STEP 3B: VERCEL          │
│  (Backend)                │   │  (Frontend)               │
├───────────────────────────┤   ├───────────────────────────┤
│                           │   │                           │
│  Pulls from GitHub:       │   │  Pulls from GitHub:       │
│  └─ backend/ folder       │   │  └─ frontend/ folder      │
│                           │   │                           │
│  Uses:                    │   │  Uses:                    │
│  ├─ server.js            │   │  ├─ index.html           │
│  ├─ package.json         │   │  └─ config.js            │
│  ├─ package-lock.json    │   │                           │
│  ├─ .node-version        │   │  Serves:                  │
│  └─ Procfile             │   │  └─ Static files via CDN  │
│                           │   │                           │
│  Runs:                    │   │  Output:                  │
│  └─ npm install          │   │  └─ habitflow.vercel.app  │
│  └─ npm start            │   │                           │
│                           │   │  No build needed!         │
│  Output:                  │   │  Just serves files        │
│  └─ habitflow-backend    │   │                           │
│      .onrender.com        │   │                           │
│                           │   │                           │
└───────────────────────────┘   └───────────────────────────┘
```

---

## 📋 File Checklist

### ✅ Files That MUST Exist

#### For Render (Backend)
- [x] `backend/server.js` - Main application
- [x] `backend/package.json` - Dependencies
- [x] `backend/package-lock.json` - Lock file
- [x] `backend/.node-version` - Node version
- [x] `backend/Procfile` - Start command (optional, npm start works)

#### For Vercel (Frontend)
- [x] `frontend/index.html` - Main HTML file
- [x] `frontend/config.js` - Configuration
- [x] `vercel.json` - Routing config (in root)

### ❌ Files That Should NOT Be Uploaded

- [ ] `backend/.env` - Secrets (use platform env vars instead)
- [ ] `backend/.env.local` - Local secrets
- [ ] `backend/.env.production` - Production secrets
- [ ] `node_modules/` - Dependencies (installed by platform)
- [ ] `.git/` - Git history (handled by platform)

---

## 🎯 Deployment Decision Tree

```
START: Which platform am I deploying to?
│
├─ RENDER (Backend)
│  │
│  ├─ What folder? → backend/
│  │
│  ├─ What files are used?
│  │  ├─ server.js ✅
│  │  ├─ package.json ✅
│  │  ├─ package-lock.json ✅
│  │  ├─ .node-version ✅
│  │  └─ Procfile ✅
│  │
│  ├─ What about .env? → ❌ Use Render dashboard env vars
│  │
│  └─ Build command? → npm install
│     Start command? → npm start
│
└─ VERCEL (Frontend)
   │
   ├─ What folder? → frontend/
   │
   ├─ What files are used?
   │  ├─ index.html ✅
   │  └─ config.js ✅
   │
   ├─ What about env vars? → ❌ Not needed (in config.js)
   │
   └─ Build command? → (none - static files)
      Output? → Serve files as-is
```

---

## 🔐 Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL DEVELOPMENT                                          │
├─────────────────────────────────────────────────────────────┤
│  backend/.env (NOT committed to Git)                        │
│  ├─ SUPABASE_URL=...                                       │
│  ├─ SUPABASE_SERVICE_ROLE_KEY=...                          │
│  └─ JWT_SECRET=...                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ .gitignore blocks .env
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  GITHUB                                                     │
├─────────────────────────────────────────────────────────────┤
│  ❌ .env files NOT uploaded                                 │
│  ✅ .env.production.example uploaded (template only)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER DASHBOARD                                           │
├─────────────────────────────────────────────────────────────┤
│  Manually add environment variables:                        │
│  ├─ SUPABASE_URL                                           │
│  ├─ SUPABASE_SERVICE_ROLE_KEY                              │
│  ├─ JWT_SECRET                                             │
│  ├─ NODE_ENV=production                                    │
│  └─ FRONTEND_URL=https://habitflow.vercel.app              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Visual File Mapping

```
YOUR PROJECT                    RENDER              VERCEL
habitflow/                      (Backend)           (Frontend)
│
├── frontend/
│   ├── index.html         ────────────────────────> ✅ Used
│   └── config.js          ────────────────────────> ✅ Used
│
├── backend/
│   ├── server.js          ────────> ✅ Used
│   ├── package.json       ────────> ✅ Used
│   ├── package-lock.json  ────────> ✅ Used
│   ├── .node-version      ────────> ✅ Used
│   ├── Procfile           ────────> ✅ Used
│   ├── schema.sql         ────────> ⚠️  Reference only
│   └── .env               ────────> ❌ NOT uploaded
│
├── vercel.json            ────────────────────────> ✅ Used
├── netlify.toml           ────────> ❌ Not used    ❌ Not used
├── .gitignore             ────────> ⚠️  Git only   ⚠️  Git only
├── README.md              ────────> ⚠️  Docs only  ⚠️  Docs only
└── DEPLOYMENT.md          ────────> ⚠️  Docs only  ⚠️  Docs only
```

---

## 🚀 Quick Reference

### Render Needs
```
Root Directory: backend
Files Used:
  ✅ server.js
  ✅ package.json
  ✅ package-lock.json
  ✅ .node-version
  ✅ Procfile
Environment Variables:
  ⚙️  Add manually in dashboard
```

### Vercel Needs
```
Root Directory: frontend
Files Used:
  ✅ index.html
  ✅ config.js
Environment Variables:
  ❌ None (configured in config.js)
```

---

## 💡 Key Points

### Render (Backend)
1. **Only looks at** `backend/` folder
2. **Installs dependencies** from `package.json`
3. **Runs** `npm start` which executes `server.js`
4. **Environment variables** added manually in dashboard
5. **Does NOT** upload `.env` files (blocked by `.gitignore`)

### Vercel (Frontend)
1. **Only looks at** `frontend/` folder
2. **Serves static files** (no build process)
3. **Uses** `vercel.json` for routing
4. **Configuration** in `config.js` (no env vars needed)
5. **Automatically** serves via global CDN

---

## ✅ Pre-Deployment Checklist

### Before Pushing to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] `backend/package.json` has `"start": "node server.js"`
- [ ] `backend/.node-version` exists with `18`
- [ ] `frontend/config.js` exists
- [ ] All files committed and pushed

### Render Setup
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Backend URL noted

### Vercel Setup
- [ ] Root directory set to `frontend`
- [ ] No build command needed
- [ ] Frontend URL noted

### After Deployment
- [ ] Update `frontend/config.js` with Render backend URL
- [ ] Commit and push changes
- [ ] Add `FRONTEND_URL` to Render with Vercel URL
- [ ] Test the application

---

**Last Updated**: 2026-05-11  
**Version**: 1.0.0

🎉 **Now you know exactly which files go where!**
