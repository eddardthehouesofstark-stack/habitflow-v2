# Changelog

All notable changes to HabitFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-11

### Added
- Initial release of HabitFlow
- Daily habit tracking with checkbox interface
- Streak tracking and statistics
- Year overview visualization
- Special projects with custom tasks
- Admin dashboard with user management
- User authentication (signup/login)
- Glassmorphism UI design
- Gradient borders and hover animations
- Social media links (Instagram, LinkedIn, Email)
- Fade-in animations on page load
- User deletion feature for admins
- Platform activity statistics
- Git repository initialization

### Features
- **Habit Management**: Create, track, and delete habits
- **Progress Tracking**: Daily completion tracking with streak counters
- **Visual Overview**: Color-coded year view showing habit completion
- **Special Projects**: Create projects with optional descriptions and tasks
- **Admin Dashboard**: 
  - Total users count
  - Total habits created
  - Active users today
  - Platform completion rate
  - Recent users list
  - User management (delete users)
- **Modern UI**: 
  - Glassmorphism design
  - Smooth animations
  - Gradient borders
  - Hover effects
  - Responsive layout

### Security
- Password hashing with bcrypt
- Admin-only routes protection
- Environment variables for sensitive data
- Row Level Security on database
- `.env` files excluded from version control

### Database
- Supabase PostgreSQL integration
- Automatic daily reset with pg_cron
- User, habits, and habit_logs tables
- Indexes for performance optimization

---

## Future Releases

### Planned Features
- Mobile app version
- Dark/Light theme toggle
- Habit categories and tags
- Export data functionality
- Social features (share progress)
- Push notifications for habit reminders
- Weekly/Monthly reports
- Habit templates
- Multi-language support

---

**Note**: This is the initial release. Future updates will be documented here.
