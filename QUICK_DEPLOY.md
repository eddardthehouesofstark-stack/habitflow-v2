# ⚡ Quick Deploy Guide

Get HabitFlow deployed in 15 minutes!

## 🎯 What You'll Need

- GitHub account
- Render account (free)
- Vercel account (free)
- Supabase project (already set up)

---

## 📦 Step 1: Push to GitHub (2 minutes)

```bash
# If not already done
git add .
git commit -m "Prepare for deployment"

# Create GitHub repository at github.com/new
# Then push:
git remote add origin https://github.com/yourusername/habitflow.git
git branch -M master
git push -u origin master
```

---

## 🔧 Step 2: Deploy Backend to Render (5 minutes)

1. **Go to**: https://render.com
2. **Sign up/Login** with GitHub
3. **Click**: "New +" → "Web Service"
4. **Select**: Your `habitflow` repository
5. **Configure**:
   ```
   Name: habitflow-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. **Add Environment Variables**:
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
   JWT_SECRET = (generate with: openssl rand -base64 32)
   NODE_ENV = production
   ```

7. **Click**: "Create Web Service"
8. **Wait** for deployment (2-3 minutes)
9. **Copy** your backend URL: `https://habitflow-backend.onrender.com`

---

## 🌐 Step 3: Update Frontend Config (1 minute)

1. **Open**: `frontend/config.js`
2. **Find** line ~18:
   ```javascript
   return 'https://habitflow-backend.onrender.com/api';
   ```
3. **Replace** with YOUR Render backend URL
4. **Save** and commit:
   ```bash
   git add frontend/config.js
   git commit -m "Update: Production API URL"
   git push
   ```

---

## 🚀 Step 4: Deploy Frontend to Vercel (3 minutes)

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click**: "Add New" → "Project"
4. **Import**: Your `habitflow` repository
5. **Configure**:
   ```
   Framework Preset: Other
   Root Directory: frontend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   ```
6. **Click**: "Deploy"
7. **Wait** for deployment (1-2 minutes)
8. **Copy** your frontend URL: `https://habitflow.vercel.app`

---

## 🔄 Step 5: Update Backend CORS (2 minutes)

1. **Go back to**: Render dashboard
2. **Click**: Your `habitflow-backend` service
3. **Go to**: "Environment"
4. **Add variable**:
   ```
   FRONTEND_URL = https://habitflow.vercel.app
   ```
   (Use YOUR Vercel URL)
5. **Click**: "Save Changes"
6. **Wait** for automatic redeploy (1 minute)

---

## ✅ Step 6: Test Your App (2 minutes)

1. **Visit**: Your Vercel URL
2. **Test**:
   - [ ] Page loads
   - [ ] Signup works
   - [ ] Login works
   - [ ] Create habit
   - [ ] Mark habit complete
   - [ ] Admin dashboard (with admin account)

---

## 🎉 Done!

Your HabitFlow app is now live!

**Frontend**: https://habitflow.vercel.app  
**Backend**: https://habitflow-backend.onrender.com

---

## 🔧 Common Issues

### "Failed to fetch" error
- Check `frontend/config.js` has correct backend URL
- Verify backend is running (visit `/health` endpoint)
- Check CORS settings

### Backend not starting
- Check environment variables are set correctly
- View logs in Render dashboard
- Verify Supabase credentials

### CORS error
- Ensure `FRONTEND_URL` in Render matches Vercel URL exactly
- No trailing slashes
- Include `https://`

---

## 📱 Next Steps

- [ ] Set up custom domain
- [ ] Enable monitoring
- [ ] Share with users!
- [ ] Star the repo ⭐

---

## 💡 Pro Tips

1. **Free tier limits**:
   - Render: Spins down after 15 min inactivity (first request may be slow)
   - Vercel: Unlimited bandwidth for personal projects
   - Supabase: 500MB database, 2GB bandwidth/month

2. **Keep backend alive**:
   - Use a service like UptimeRobot to ping your backend every 5 minutes
   - Or upgrade to paid tier ($7/month)

3. **Custom domain**:
   - Buy domain from Namecheap/Google Domains
   - Add to Vercel: Settings → Domains
   - Update CORS in backend

4. **Monitoring**:
   - Set up Sentry for error tracking
   - Use Vercel Analytics
   - Monitor Supabase usage

---

**Need help?** Email: pragad555990@gmail.com

**Full guide**: See `DEPLOYMENT.md`
