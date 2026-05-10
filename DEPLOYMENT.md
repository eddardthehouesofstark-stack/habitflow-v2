# 🚀 HabitFlow Deployment Guide

This guide covers secure deployment of both frontend and backend components.

## 📋 Table of Contents
1. [Backend Deployment (Render/Railway/Heroku)](#backend-deployment)
2. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
3. [Environment Variables](#environment-variables)
4. [Security Checklist](#security-checklist)
5. [Post-Deployment](#post-deployment)

---

## 🔧 Backend Deployment

### Option 1: Render (Recommended - Free Tier Available)

#### Step 1: Prepare Your Backend

1. **Add a start script** to `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. **Create `backend/.node-version` file**:
```
18
```

#### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `habitflow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables**:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase service role key
   - `PORT`: 3002 (or leave empty, Render assigns automatically)
   - `NODE_ENV`: production

6. Click "Create Web Service"

7. **Note your backend URL**: `https://habitflow-backend.onrender.com`

---

### Option 2: Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - Add environment variables (same as above)
5. Deploy

---

### Option 3: Heroku

1. Install Heroku CLI
2. Create `backend/Procfile`:
```
web: node server.js
```

3. Deploy:
```bash
cd backend
heroku create habitflow-backend
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
heroku config:set NODE_ENV=production
git push heroku master
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Update Frontend API URL

1. **Open `frontend/index.html`**
2. **Find the API_BASE_URL** (around line 20-30):
```javascript
const API_BASE_URL = 'http://localhost:3002/api';
```

3. **Replace with your deployed backend URL**:
```javascript
const API_BASE_URL = 'https://habitflow-backend.onrender.com/api';
```

#### Step 2: Create `vercel.json` in root directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

#### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Output Directory**: Leave empty
5. Click "Deploy"

6. **Your app will be live at**: `https://habitflow.vercel.app`

---

### Option 2: Netlify

#### Step 1: Create `netlify.toml` in root:
```toml
[build]
  publish = "frontend"
  command = "echo 'No build needed'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: Leave empty
   - **Publish directory**: `.`
5. Deploy

---

### Option 3: GitHub Pages

1. **Create `frontend/.nojekyll` file** (empty file)

2. **Update repository settings**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: `master` → `/frontend`
   - Save

3. **Your site**: `https://yourusername.github.io/habitflow`

---

## 🔐 Environment Variables

### Backend Environment Variables

**Required:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
NODE_ENV=production
PORT=3002
```

**Optional (for enhanced security):**
```env
JWT_SECRET=your-random-secret-key-here
CORS_ORIGIN=https://habitflow.vercel.app
```

### How to Set Environment Variables

**Render:**
- Dashboard → Environment → Add Environment Variable

**Railway:**
- Project → Variables → New Variable

**Heroku:**
```bash
heroku config:set VARIABLE_NAME=value
```

**Vercel/Netlify:**
- Not needed for frontend (static files)

---

## 🔒 Security Checklist

### Before Deployment:

- [ ] **Never commit `.env` files** (already in `.gitignore`)
- [ ] **Use environment variables** for all secrets
- [ ] **Enable HTTPS** (automatic on Vercel/Netlify/Render)
- [ ] **Update CORS settings** in backend to allow only your frontend domain
- [ ] **Use strong Supabase service role key**
- [ ] **Enable Row Level Security** in Supabase
- [ ] **Set `NODE_ENV=production`** in backend
- [ ] **Update API_BASE_URL** in frontend to production backend URL

### Update Backend CORS (in `backend/server.js`):

```javascript
const cors = require('cors');

// Replace with your actual frontend URL
const allowedOrigins = [
  'https://habitflow.vercel.app',
  'https://your-custom-domain.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 🎯 Post-Deployment

### 1. Test Your Deployment

- [ ] Visit your frontend URL
- [ ] Test signup/login
- [ ] Create a habit
- [ ] Check habit completion
- [ ] Test admin dashboard (with admin account)
- [ ] Test on mobile devices
- [ ] Check browser console for errors

### 2. Update Database

Run this in Supabase SQL Editor:
```sql
-- Set your admin email
UPDATE users SET is_admin = true WHERE email = 'eddardthehouesofstatk@gmail.com';
```

### 3. Monitor Your App

**Render:**
- View logs in Dashboard → Logs

**Vercel:**
- View analytics in Dashboard → Analytics

**Supabase:**
- Monitor database in Dashboard → Database → Logs

### 4. Set Up Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render:**
1. Go to Settings → Custom Domain
2. Add domain and update DNS

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**:
```bash
git add .
git commit -m "Update: Feature description"
git push origin master
```

2. **Automatic deployment** triggers on both platforms
3. **Check deployment status** in respective dashboards

---

## 🐛 Troubleshooting

### Frontend can't connect to backend:
- Check API_BASE_URL in frontend/index.html
- Verify backend is running (visit backend URL)
- Check CORS settings in backend
- Check browser console for errors

### Backend crashes:
- Check environment variables are set
- View logs in hosting platform
- Verify Supabase credentials
- Check Node.js version compatibility

### Database connection fails:
- Verify SUPABASE_URL and SUPABASE_KEY
- Check Supabase project is active
- Verify network/firewall settings

---

## 📊 Deployment Comparison

| Platform | Frontend | Backend | Free Tier | Custom Domain | Auto Deploy |
|----------|----------|---------|-----------|---------------|-------------|
| Vercel   | ✅ Best  | ❌      | ✅ Yes    | ✅ Yes        | ✅ Yes      |
| Netlify  | ✅ Good  | ❌      | ✅ Yes    | ✅ Yes        | ✅ Yes      |
| Render   | ✅ Good  | ✅ Best | ✅ Yes    | ✅ Yes        | ✅ Yes      |
| Railway  | ✅ Good  | ✅ Good | ⚠️ Limited| ✅ Yes        | ✅ Yes      |
| Heroku   | ❌       | ✅ Good | ⚠️ Limited| ✅ Yes        | ✅ Yes      |

**Recommended Combination:**
- **Frontend**: Vercel (fast, free, excellent DX)
- **Backend**: Render (free tier, easy setup, reliable)
- **Database**: Supabase (already using)

---

## 💡 Pro Tips

1. **Use environment-specific configs**:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3002/api'
  : 'https://habitflow-backend.onrender.com/api';
```

2. **Enable caching** for better performance
3. **Set up monitoring** (Sentry, LogRocket)
4. **Regular backups** of Supabase database
5. **Use CDN** for static assets (automatic on Vercel/Netlify)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check browser console and server logs
4. Contact: pragad555990@gmail.com

---

**Deployment Checklist:**
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] API_BASE_URL updated in frontend
- [ ] CORS configured in backend
- [ ] Database schema applied
- [ ] Admin user created
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

🎉 **Your HabitFlow app is now live!**
