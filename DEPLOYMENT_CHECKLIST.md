# 🚀 HabitFlow Deployment Checklist

Use this checklist to ensure a smooth, secure deployment.

## 📋 Pre-Deployment

### Backend Preparation
- [ ] Review `backend/.env.production.example`
- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Verify Supabase credentials are correct
- [ ] Test backend locally: `cd backend && npm start`
- [ ] Check all API endpoints work
- [ ] Review CORS configuration in `server.js`

### Frontend Preparation
- [ ] Update `frontend/config.js` with production backend URL
- [ ] Test frontend locally with production backend
- [ ] Check browser console for errors
- [ ] Test on mobile viewport
- [ ] Verify all features work (signup, login, habits, admin)

### Database
- [ ] Run `backend/schema.sql` in Supabase SQL Editor
- [ ] Enable `pg_cron` extension in Supabase
- [ ] Set admin user: `UPDATE users SET is_admin = true WHERE email = 'your-email@gmail.com'`
- [ ] Verify Row Level Security is enabled
- [ ] Test database connection from backend

### Security
- [ ] `.env` files are in `.gitignore` ✅
- [ ] No secrets committed to Git
- [ ] Strong JWT_SECRET generated
- [ ] CORS configured for production domains only
- [ ] HTTPS enabled (automatic on Vercel/Netlify/Render)
- [ ] Security headers configured in backend

---

## 🔧 Backend Deployment (Render)

### Step 1: Create Web Service
- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select repository

### Step 2: Configure Service
- [ ] **Name**: `habitflow-backend`
- [ ] **Root Directory**: `backend`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Instance Type**: Free (or paid for better performance)

### Step 3: Environment Variables
Add these in Render Dashboard → Environment:

- [ ] `SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
- [ ] `JWT_SECRET` = `your-generated-secret`
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `https://habitflow.vercel.app` (update after frontend deploy)

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Note your backend URL: `https://habitflow-backend.onrender.com`
- [ ] Test health endpoint: `https://habitflow-backend.onrender.com/health`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Configuration
- [ ] Open `frontend/config.js`
- [ ] Update production API URL to your Render backend URL
- [ ] Save and commit changes

### Step 2: Deploy to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Configure:
  - **Framework Preset**: Other
  - **Root Directory**: `frontend`
  - **Build Command**: Leave empty
  - **Output Directory**: Leave empty

### Step 3: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Note your frontend URL: `https://habitflow.vercel.app`

### Step 4: Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Add/Update `FRONTEND_URL` environment variable with Vercel URL
- [ ] Restart backend service

---

## ✅ Post-Deployment Testing

### Basic Functionality
- [ ] Visit frontend URL
- [ ] Page loads without errors
- [ ] Check browser console (F12) - no errors
- [ ] Test signup with new account
- [ ] Test login with created account
- [ ] Create a new habit
- [ ] Mark habit as complete
- [ ] Check year overview displays
- [ ] Test special projects
- [ ] Logout and login again

### Admin Features
- [ ] Login with admin account (eddardthehouesofstatk@gmail.com)
- [ ] Admin button visible in navigation
- [ ] Admin dashboard loads
- [ ] Statistics display correctly
- [ ] Recent users list shows
- [ ] Test user deletion (create test user first)

### Mobile Testing
- [ ] Open on mobile device or use browser DevTools
- [ ] Test responsive layout
- [ ] Test touch interactions
- [ ] Verify all features work on mobile

### Performance
- [ ] Page loads in < 3 seconds
- [ ] API responses are fast
- [ ] No console errors or warnings
- [ ] Images/assets load properly

---

## 🔒 Security Verification

- [ ] HTTPS enabled (check for padlock in browser)
- [ ] No `.env` files in repository
- [ ] CORS only allows your frontend domain
- [ ] JWT tokens expire after 30 days
- [ ] Admin routes protected
- [ ] Passwords are hashed (never stored plain text)
- [ ] SQL injection protection (using Supabase client)
- [ ] XSS protection headers enabled

---

## 📊 Monitoring Setup

### Render
- [ ] Check "Logs" tab for errors
- [ ] Set up email notifications for failures
- [ ] Monitor resource usage

### Vercel
- [ ] Check "Deployments" for build status
- [ ] Review "Analytics" (if available)
- [ ] Set up deployment notifications

### Supabase
- [ ] Monitor "Database" → "Logs"
- [ ] Check "API" → "Logs" for errors
- [ ] Review "Database" → "Usage" for limits

---

## 🎯 Optional Enhancements

### Custom Domain
- [ ] Purchase domain (Namecheap, Google Domains, etc.)
- [ ] Add to Vercel: Settings → Domains
- [ ] Update DNS records
- [ ] Update CORS in backend with new domain
- [ ] Test with custom domain

### SSL Certificate
- [ ] Automatic on Vercel/Netlify/Render ✅
- [ ] Verify HTTPS works
- [ ] Check certificate validity

### Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Set up CDN (automatic on Vercel)
- [ ] Optimize images (if any)
- [ ] Enable caching headers

### Monitoring & Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Add Google Analytics (optional)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure log aggregation

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. Check `frontend/config.js` has correct backend URL
2. Verify backend is running (visit `/health` endpoint)
3. Check CORS settings in `backend/server.js`
4. Look for errors in browser console (F12)
5. Verify `FRONTEND_URL` in backend environment variables

### Backend crashes or errors
1. Check Render logs for error messages
2. Verify all environment variables are set
3. Test Supabase connection
4. Check Node.js version compatibility
5. Review recent code changes

### Database connection fails
1. Verify `SUPABASE_URL` is correct
2. Check `SUPABASE_SERVICE_ROLE_KEY` is valid
3. Ensure Supabase project is active
4. Check Supabase dashboard for issues
5. Verify network/firewall settings

### CORS errors
1. Check `FRONTEND_URL` matches actual frontend domain
2. Verify CORS configuration in `server.js`
3. Ensure protocol matches (http vs https)
4. Check for trailing slashes in URLs
5. Review browser console for specific CORS error

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **HabitFlow Issues**: Create issue on GitHub
- **Email Support**: pragad555990@gmail.com

---

## ✨ Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Users can signup and login
- ✅ Habits can be created and tracked
- ✅ Admin dashboard works for admin users
- ✅ All features work on mobile
- ✅ HTTPS is enabled
- ✅ No console errors
- ✅ Performance is acceptable (< 3s load time)

---

**Last Updated**: 2026-05-11  
**Version**: 1.0.0

🎉 **Congratulations on deploying HabitFlow!**
