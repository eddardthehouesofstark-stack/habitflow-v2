# Special Projects Feature - Deployment Guide

## Overview
The Special Projects feature allows users to create time-limited projects with deadlines, track active projects with live countdowns, mark projects as complete (archived, never deleted), and view completed projects separately. All data is persisted in the Supabase PostgreSQL database.

## Database Changes

### 1. Run SQL Schema in Supabase

Go to your Supabase Dashboard → SQL Editor and run the following SQL (already added to `backend/schema.sql`):

```sql
-- ═══════════════════════════════════════════════
--  8. SPECIAL PROJECTS TABLE
--  For time-limited projects with deadlines
-- ═══════════════════════════════════════════════

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  category text not null,  -- Personal, Work, Learning, Health, Creative, Finance, Other
  accent_color text not null default '#7F77DD',
  completed_at timestamptz,  -- null = active, set = completed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for projects
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_completed on projects(completed_at);
create index if not exists idx_projects_end_date on projects(end_date);

-- Enable RLS for projects
alter table projects enable row level security;
```

## Backend Changes

### New API Endpoints (already added to `backend/server.js`)

1. **GET /api/projects** - Get all projects (active and completed)
2. **POST /api/projects** - Create new project
3. **PUT /api/projects/:id** - Update project
4. **PATCH /api/projects/:id/complete** - Mark project as complete
5. **DELETE /api/projects/:id** - Delete project permanently

## Frontend Changes

### 1. Updated Modal (`frontend/index.html`)
- Replaced old project modal with new fields:
  - Project Name (required, max 60 chars)
  - Description (optional)
  - Start Date (required, defaults to today)
  - Deadline (required, defaults to 30 days from now)
  - Category Tag (required: Personal, Work, Learning, Health, Creative, Finance, Other)
  - Accent Color (required: 7 preset colors with visual picker)

### 2. Updated Special Projects Page
- **Active Projects Section**: Shows all active projects with countdown timers
- **Completed Projects Section**: Shows archived completed projects
- **Add New Project Card**: Always first in active section

### 3. Project Card Features

#### Active Project Cards:
- 3px colored top border (accent color)
- Project name + category badge
- Description (if provided)
- Date range (start → end)
- Color-coded countdown:
  - 🟢 Green: >7 days left
  - 🟡 Amber: 1-7 days left
  - 🔴 Red: Due today or overdue
- Complete button (moves to completed section)
- Delete button (permanent removal)

#### Completed Project Cards:
- Same design with 80% opacity
- Green "Completed" badge with checkmark
- Completion date + category
- Delete button only (no complete button)

### 4. JavaScript Functions
- `loadProjects()` - Fetches all projects from backend
- `renderProjectCards()` - Renders active and completed sections
- `createProject()` - Creates new project via API
- `completeProject()` - Marks project as complete
- `deleteProject()` - Permanently deletes project
- `calculateCountdown()` - Calculates days remaining
- `startCountdownTimer()` - Updates countdowns every 60 seconds

### 5. CSS Styles
- Color picker with 7 preset colors
- Modal form with 2-column date picker row
- Project card header with title + badge
- Countdown badges (safe/warning/danger)
- Complete and delete button styles
- Completed project badge with checkmark icon

## Deployment Steps

### 1. Database Setup
```bash
# Go to Supabase Dashboard → SQL Editor
# Run the SQL from backend/schema.sql (section 8)
# Verify the projects table was created
```

### 2. Backend Deployment (Render)
```bash
# The backend code is already updated in backend/server.js
# Render will auto-deploy from GitHub on next push
# Or manually trigger deployment in Render dashboard
```

### 3. Frontend Deployment (Vercel)
```bash
# The frontend code is already updated in frontend/index.html
# Vercel will auto-deploy from GitHub on next push
# Or manually trigger deployment in Vercel dashboard
```

### 4. Push to GitHub
```bash
git add .
git commit -m "feat: Add Special Projects feature with full backend integration"
git push origin main
```

### 5. Verify Deployment
1. Wait for Render backend to deploy (~2-3 minutes)
2. Wait for Vercel frontend to deploy (~1 minute)
3. Test the feature:
   - Login to your app
   - Navigate to "Special Projects"
   - Click "Add New Project"
   - Fill in all fields and create
   - Verify project appears in Active Projects
   - Test countdown timer
   - Test complete button (moves to Completed section)
   - Test delete button

## Feature Behavior

### Creating Projects
- Start date defaults to today
- End date defaults to 30 days from now
- Accent color defaults to purple (#7F77DD)
- All fields except description are required
- End date must be after start date

### Countdown Timer
- Updates automatically every 60 seconds
- Color-coded based on days remaining:
  - Green: More than 7 days
  - Amber: 1-7 days
  - Red: Due today or overdue
- Shows "X days overdue" for past deadlines

### Completing Projects
- Moves project from Active to Completed section
- Sets `completed_at` timestamp
- Never permanently deleted (archived)
- Can be deleted manually from Completed section

### Deleting Projects
- Confirmation dialog required
- Permanent removal from database
- Works for both active and completed projects

## Troubleshooting

### Projects not loading
- Check browser console for errors
- Verify backend API is running
- Check Supabase connection
- Verify projects table exists

### Countdown not updating
- Check if `startCountdownTimer()` is called
- Verify `setInterval` is running
- Check browser console for errors

### Can't create project
- Verify all required fields are filled
- Check end date is after start date
- Check backend logs for errors
- Verify API endpoint is accessible

## Database Schema Reference

```typescript
interface Project {
  id: string;              // UUID
  user_id: string;         // UUID (foreign key to users)
  name: string;            // Project name (max 60 chars)
  description: string | null;  // Optional description
  start_date: string;      // ISO date (YYYY-MM-DD)
  end_date: string;        // ISO date (YYYY-MM-DD)
  category: string;        // Personal, Work, Learning, Health, Creative, Finance, Other
  accent_color: string;    // Hex color (#7F77DD, #4ade80, etc.)
  completed_at: string | null;  // ISO timestamp or null
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

## API Response Examples

### GET /api/projects
```json
{
  "active": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Launch blog redesign",
      "description": "Revamp the entire blog UI",
      "start_date": "2026-05-18",
      "end_date": "2026-05-30",
      "category": "Work",
      "accent_color": "#7F77DD",
      "completed_at": null,
      "created_at": "2026-05-18T10:00:00.000Z",
      "updated_at": "2026-05-18T10:00:00.000Z"
    }
  ],
  "completed": []
}
```

### POST /api/projects
```json
{
  "project": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Launch blog redesign",
    "description": "Revamp the entire blog UI",
    "start_date": "2026-05-18",
    "end_date": "2026-05-30",
    "category": "Work",
    "accent_color": "#7F77DD",
    "completed_at": null,
    "created_at": "2026-05-18T10:00:00.000Z",
    "updated_at": "2026-05-18T10:00:00.000Z"
  }
}
```

## Success Criteria

✅ Database table created successfully
✅ Backend API endpoints working
✅ Frontend modal with all required fields
✅ Active projects display with countdown
✅ Completed projects display separately
✅ Complete button moves projects to completed
✅ Delete button removes projects permanently
✅ Countdown timer updates every 60 seconds
✅ Color-coded countdown badges
✅ Responsive design on mobile
✅ Data persists across sessions

## Next Steps (Optional Enhancements)

1. Add project tasks/subtasks
2. Add project milestones
3. Add project progress tracking
4. Add project detail page
5. Add project editing
6. Add project filtering/sorting
7. Add project search
8. Add project statistics
9. Add project notifications
10. Add project sharing

---

**Status**: ✅ Ready for deployment
**Last Updated**: May 18, 2026
**Version**: 1.0.0
