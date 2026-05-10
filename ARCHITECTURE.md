# 🏗️ HabitFlow Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER DEVICES                         │
│  (Desktop, Mobile, Tablet - Any Browser with JavaScript)    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Static Files:                                        │  │
│  │  • index.html (Single Page Application)              │  │
│  │  • config.js (Environment Configuration)             │  │
│  │  • Embedded CSS & JavaScript                         │  │
│  │                                                       │  │
│  │  Features:                                            │  │
│  │  • User Authentication UI                            │  │
│  │  • Habit Tracking Interface                          │  │
│  │  • Year Overview Visualization                       │  │
│  │  • Special Projects Management                       │  │
│  │  • Admin Dashboard (Admin Only)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
                         │ (CORS Protected)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Render)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express Server                            │  │
│  │                                                       │  │
│  │  API Endpoints:                                       │  │
│  │  • POST /api/auth/signup                             │  │
│  │  • POST /api/auth/login                              │  │
│  │  • GET  /api/auth/me                                 │  │
│  │  • GET  /api/habits                                  │  │
│  │  • POST /api/habits                                  │  │
│  │  • POST /api/habits/:id/toggle                       │  │
│  │  • DELETE /api/habits/:id                            │  │
│  │  • GET  /api/habits/logs/year                        │  │
│  │  • GET  /api/community                               │  │
│  │  • GET  /api/admin/stats (Admin Only)               │  │
│  │  • DELETE /api/admin/users/:id (Admin Only)         │  │
│  │                                                       │  │
│  │  Security:                                            │  │
│  │  • JWT Authentication                                │  │
│  │  • bcrypt Password Hashing                           │  │
│  │  • CORS Protection                                   │  │
│  │  • Security Headers                                  │  │
│  │  • Admin Route Guards                                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ Supabase Client
                         │ (Service Role Key)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (Supabase)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │                                                       │  │
│  │  Tables:                                              │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ users                                        │    │  │
│  │  │ • id (uuid, primary key)                    │    │  │
│  │  │ • email (text, unique)                      │    │  │
│  │  │ • name (text)                               │    │  │
│  │  │ • password_hash (text)                      │    │  │
│  │  │ • is_admin (boolean)                        │    │  │
│  │  │ • created_at (timestamptz)                  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ habits                                       │    │  │
│  │  │ • id (uuid, primary key)                    │    │  │
│  │  │ • user_id (uuid, foreign key → users)       │    │  │
│  │  │ • name (text)                               │    │  │
│  │  │ • time (text)                               │    │  │
│  │  │ • created_at (timestamptz)                  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ habit_logs                                   │    │  │
│  │  │ • id (uuid, primary key)                    │    │  │
│  │  │ • habit_id (uuid, foreign key → habits)     │    │  │
│  │  │ • user_id (uuid, foreign key → users)       │    │  │
│  │  │ • log_date (date)                           │    │  │
│  │  │ • done (boolean)                            │    │  │
│  │  │ • created_at (timestamptz)                  │    │  │
│  │  │ • UNIQUE(habit_id, log_date)                │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  Features:                                            │  │
│  │  • Row Level Security (RLS)                          │  │
│  │  • Indexes for Performance                           │  │
│  │  • Cascade Deletes                                   │  │
│  │  • pg_cron for Daily Cleanup                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Signup/Login
```
User → Frontend → POST /api/auth/signup
                ↓
            Backend validates
                ↓
            Hash password (bcrypt)
                ↓
            Insert into users table
                ↓
            Generate JWT token
                ↓
            Return token + user data
                ↓
            Frontend stores token
```

### 2. Create Habit
```
User → Frontend → POST /api/habits
                ↓
            Backend verifies JWT
                ↓
            Insert into habits table
                ↓
            Return habit data
                ↓
            Frontend updates UI
```

### 3. Mark Habit Complete
```
User → Frontend → POST /api/habits/:id/toggle
                ↓
            Backend verifies JWT
                ↓
            Verify habit ownership
                ↓
            Upsert into habit_logs
                ↓
            Return success
                ↓
            Frontend updates checkbox
```

### 4. Admin Dashboard
```
Admin → Frontend → GET /api/admin/stats
                 ↓
             Backend verifies JWT
                 ↓
             Check is_admin = true
                 ↓
             Query all users/habits/logs
                 ↓
             Calculate statistics
                 ↓
             Return aggregated data
                 ↓
             Frontend displays dashboard
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
├─ HTTPS (TLS 1.3)
├─ Automatic SSL certificates (Vercel/Render)
└─ Secure WebSocket connections

Layer 2: Application Security
├─ CORS (Origin validation)
├─ Security Headers
│  ├─ X-Frame-Options: DENY
│  ├─ X-Content-Type-Options: nosniff
│  ├─ X-XSS-Protection: 1; mode=block
│  └─ Strict-Transport-Security
├─ JWT Authentication (30-day expiry)
└─ Password Hashing (bcrypt, 10 rounds)

Layer 3: API Security
├─ Authentication Middleware (authGuard)
├─ Admin Route Guards (is_admin check)
├─ Input Validation
└─ Rate Limiting (platform-level)

Layer 4: Database Security
├─ Row Level Security (RLS)
├─ Service Role Key (backend only)
├─ Parameterized Queries (SQL injection prevention)
├─ Cascade Deletes
└─ Unique Constraints

Layer 5: Environment Security
├─ Environment Variables (no hardcoded secrets)
├─ .gitignore (.env files excluded)
├─ Separate dev/prod configurations
└─ Secret rotation capability
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                               │
├─────────────────────────────────────────────────────────────┤
│  Frontend: localhost:8000 (Live Server)                     │
│  Backend:  localhost:3002 (Node.js)                         │
│  Database: Supabase Cloud                                   │
│  CORS:     Allow localhost                                  │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ git push
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      GITHUB                                  │
├─────────────────────────────────────────────────────────────┤
│  Repository: habitflow                                       │
│  Branch: master                                              │
│  Webhooks: → Vercel, Render                                 │
└─────────────────────────────────────────────────────────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐
│   VERCEL (Frontend)  │  │   RENDER (Backend)   │
├──────────────────────┤  ├──────────────────────┤
│  Auto Deploy         │  │  Auto Deploy         │
│  CDN Distribution    │  │  Container Runtime   │
│  Edge Network        │  │  Health Checks       │
│  SSL Certificate     │  │  SSL Certificate     │
│  DDoS Protection     │  │  Auto Scaling        │
└──────────────────────┘  └──────────────────────┘
                │                 │
                └────────┬────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION                                │
├─────────────────────────────────────────────────────────────┤
│  Frontend: https://habitflow.vercel.app                     │
│  Backend:  https://habitflow-backend.onrender.com           │
│  Database: Supabase Cloud (PostgreSQL)                      │
│  CORS:     Allow production domains only                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
```
┌─────────────────────────────────────┐
│  HTML5                               │
│  • Semantic markup                   │
│  • Single Page Application           │
│  • Responsive design                 │
├─────────────────────────────────────┤
│  CSS3                                │
│  • Glassmorphism effects             │
│  • CSS Grid & Flexbox                │
│  • Animations & Transitions          │
│  • Custom properties (variables)     │
├─────────────────────────────────────┤
│  JavaScript (ES6+)                   │
│  • Vanilla JS (no frameworks)        │
│  • Async/Await                       │
│  • Fetch API                         │
│  • Local Storage                     │
│  • DOM Manipulation                  │
└─────────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────────┐
│  Node.js v18+                        │
│  • Event-driven architecture         │
│  • Non-blocking I/O                  │
├─────────────────────────────────────┤
│  Express.js                          │
│  • RESTful API                       │
│  • Middleware support                │
│  • Route handling                    │
├─────────────────────────────────────┤
│  Dependencies                        │
│  • @supabase/supabase-js (DB)       │
│  • bcryptjs (Password hashing)       │
│  • jsonwebtoken (JWT auth)           │
│  • cors (CORS handling)              │
│  • dotenv (Environment vars)         │
└─────────────────────────────────────┘
```

### Database
```
┌─────────────────────────────────────┐
│  Supabase (PostgreSQL 15)           │
│  • Managed PostgreSQL                │
│  • Row Level Security                │
│  • Real-time subscriptions           │
│  • Automatic backups                 │
│  • pg_cron extension                 │
└─────────────────────────────────────┘
```

---

## Scalability Considerations

### Current Capacity (Free Tier)
- **Frontend**: Unlimited requests (Vercel)
- **Backend**: ~100 concurrent connections (Render)
- **Database**: 500MB storage, 2GB bandwidth/month (Supabase)

### Bottlenecks
1. **Backend**: Render free tier spins down after 15 min inactivity
2. **Database**: 500MB storage limit
3. **Bandwidth**: 2GB/month on Supabase

### Scaling Strategy
```
Phase 1: Free Tier (0-100 users)
├─ Current setup
└─ No changes needed

Phase 2: Light Usage (100-1,000 users)
├─ Upgrade Render to Starter ($7/month)
│  └─ Always-on, no spin down
├─ Keep Vercel free tier
└─ Keep Supabase free tier

Phase 3: Medium Usage (1,000-10,000 users)
├─ Upgrade Supabase to Pro ($25/month)
│  ├─ 8GB database
│  └─ 50GB bandwidth
├─ Upgrade Render to Standard ($25/month)
│  └─ Better performance
└─ Consider Vercel Pro for analytics

Phase 4: High Usage (10,000+ users)
├─ Supabase Pro or Team plan
├─ Render Standard or Pro
├─ Add Redis for caching
├─ Implement CDN for assets
├─ Add load balancer
└─ Database read replicas
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                      MONITORING STACK                        │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel)
├─ Deployment logs
├─ Analytics (page views, performance)
├─ Error tracking (console errors)
└─ Build logs

Backend (Render)
├─ Application logs
├─ Health check endpoint (/health)
├─ CPU & Memory usage
├─ Request/Response times
└─ Error rates

Database (Supabase)
├─ Query performance
├─ Connection pool status
├─ Storage usage
├─ API logs
└─ Slow query logs

Optional Integrations
├─ Sentry (Error tracking)
├─ LogRocket (Session replay)
├─ UptimeRobot (Uptime monitoring)
└─ Google Analytics (User analytics)
```

---

## Backup & Recovery

### Automated Backups
- **Supabase**: Daily automatic backups (7-day retention on free tier)
- **Code**: Git repository on GitHub
- **Configuration**: Environment variables documented

### Manual Backup
```bash
# Export database
supabase db dump > backup.sql

# Backup code
git push origin master

# Document environment variables
# See backend/.env.production.example
```

### Recovery Procedure
1. Restore database from Supabase backup
2. Redeploy from Git repository
3. Reconfigure environment variables
4. Test all functionality

---

## Performance Optimization

### Frontend
- ✅ Minified CSS/JS (inline)
- ✅ Lazy loading images
- ✅ Efficient DOM manipulation
- ✅ Local storage caching
- ✅ CDN delivery (Vercel Edge Network)

### Backend
- ✅ Database connection pooling
- ✅ Indexed database queries
- ✅ JWT token caching
- ⚠️ TODO: Redis caching
- ⚠️ TODO: Response compression

### Database
- ✅ Indexes on foreign keys
- ✅ Indexes on frequently queried columns
- ✅ Unique constraints
- ✅ Cascade deletes
- ⚠️ TODO: Query optimization

---

## Cost Breakdown

### Current (Free Tier)
```
Vercel:    $0/month (Unlimited bandwidth)
Render:    $0/month (Spins down after 15 min)
Supabase:  $0/month (500MB, 2GB bandwidth)
Domain:    $0/month (using platform domains)
───────────────────────────────────────────
Total:     $0/month
```

### Recommended (Production)
```
Vercel:    $0/month (Free tier sufficient)
Render:    $7/month (Starter - always on)
Supabase:  $25/month (Pro - 8GB, 50GB bandwidth)
Domain:    $12/year (Optional custom domain)
───────────────────────────────────────────
Total:     $32/month + $12/year
```

---

## Future Enhancements

### Short Term
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] User profile customization
- [ ] Habit categories
- [ ] Data export (CSV/JSON)

### Medium Term
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Social features (share progress)
- [ ] Habit templates
- [ ] Weekly/Monthly reports

### Long Term
- [ ] AI-powered habit suggestions
- [ ] Integration with fitness trackers
- [ ] Team/Family accounts
- [ ] Gamification (badges, levels)
- [ ] API for third-party integrations

---

**Last Updated**: 2026-05-11  
**Version**: 1.0.0  
**Architecture**: Serverless + Managed Database
