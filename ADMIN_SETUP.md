# Admin Dashboard Setup Guide

## 🔒 Admin Access Control

The admin dashboard is now **ONLY visible to admin users**. Regular users cannot see or access it.

## 📋 Setup Steps

### 1. Update Your Database

Run this SQL in your **Supabase Dashboard → SQL Editor**:

```sql
-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set YOUR email as admin (REPLACE WITH YOUR ACTUAL EMAIL)
UPDATE users SET is_admin = true WHERE email = 'eddardthehouesofstatk@gmail.com';
```

### 2. Restart Your Backend Server

```bash
cd backend
node server.js
```

### 3. Login Again

- Logout from your current session
- Login with your email: `pragad555990@gmail.com`
- You should now see the **👑 Admin** button in the navigation

## 🎯 What You Can See

### Main Statistics:
- **👥 Total Users** - Number of registered accounts
- **✅ Total Habits** - All habits created on the platform
- **🔥 Active Today** - Users who completed habits today
- **📊 Completion Rate** - Overall platform completion percentage

### Recent Users:
- List of 10 most recent users
- Their names, emails, habit counts, and streaks

### Platform Activity:
- Total completions today
- Average streak across all users
- Total projects

## 🔐 Security Features

✅ **Backend Protection**: Admin endpoint checks `is_admin` field  
✅ **Frontend Protection**: Admin button hidden for non-admin users  
✅ **Access Denied**: Non-admin users get 403 error if they try to access  

## 👤 Making Other Users Admin

To make another user an admin, run this SQL:

```sql
UPDATE users SET is_admin = true WHERE email = 'their-email@example.com';
```

## 🚫 Removing Admin Access

To remove admin access from a user:

```sql
UPDATE users SET is_admin = false WHERE email = 'their-email@example.com';
```

## 📝 Notes

- Only users with `is_admin = true` can see the admin dashboard
- The admin button appears in red with a crown emoji (👑)
- All statistics are pulled in real-time from your database
- The page auto-refreshes data when you visit it

---

**Your Admin Email**: eddardthehouesofstatk@gmail.com  
**Access Level**: Full platform statistics and user management
