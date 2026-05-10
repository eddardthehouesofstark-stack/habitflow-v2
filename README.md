# 🎯 HabitFlow

A beautiful, modern habit tracking application with special project management and admin dashboard.

## ✨ Features

- **Daily Habit Tracking** - Track your habits with an intuitive interface
- **Streak Tracking** - Monitor your progress with streak counters
- **Special Projects** - Create and manage project-specific tasks
- **Admin Dashboard** - Comprehensive user management and analytics
- **Glassmorphism UI** - Modern, elegant design with smooth animations
- **Year Overview** - Visual representation of your habit completion throughout the year

## 🚀 Tech Stack

**Frontend:**
- HTML5
- CSS3 (Glassmorphism, Animations)
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- Supabase (PostgreSQL)
- bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd habitflow
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=3002
```

4. **Set up the database:**
- Go to your Supabase Dashboard
- Navigate to SQL Editor
- Run the SQL script from `backend/schema.sql`
- Enable the `pg_cron` extension for automatic daily resets

5. **Update admin email:**
In `backend/schema.sql`, update the admin email to your email:
```sql
update users set is_admin = true where email = 'your-email@gmail.com';
```

## 🏃 Running the Application

1. **Start the backend server:**
```bash
cd backend
node server.js
```
Server will run on `http://localhost:3002`

2. **Open the frontend:**
Open `frontend/index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend -p 8000
```

## 📱 Usage

### For Users:
1. **Sign Up/Login** - Create an account or log in
2. **Add Habits** - Click "Add Habit" to create new habits
3. **Track Progress** - Check off completed habits daily
4. **View Stats** - Monitor your streaks and completion rates
5. **Special Projects** - Create projects with custom tasks

### For Admins:
1. Log in with your admin account
2. Click "Admin Dashboard" in the navigation
3. View user statistics and platform activity
4. Manage users (view details, delete accounts)

## 🎨 Features in Detail

### Habit Tracking
- Daily habit checklist with time reminders
- Automatic streak calculation
- Visual year overview with color-coded completion
- Glassmorphism card design with gradient borders

### Special Projects
- Create custom projects with tasks
- Optional descriptions
- Track project-specific progress
- Clean, emoji-free design

### Admin Dashboard
- Total user count
- Total habits created
- Active users today
- Platform completion rate
- Recent users list with stats
- User management (delete users)

## 🔒 Security

- Passwords are hashed using bcrypt
- Environment variables for sensitive data
- Row Level Security (RLS) enabled on Supabase
- Admin-only routes protected with middleware
- `.env` files excluded from version control

## 📁 Project Structure

```
habitflow/
├── frontend/
│   └── index.html          # Main application file
├── backend/
│   ├── server.js           # Express server
│   ├── schema.sql          # Database schema
│   ├── .env               # Environment variables (not in repo)
│   └── package.json        # Dependencies
├── .gitignore
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Creator

**Pragadeesh S**

- Instagram: [@npc.mode_](https://www.instagram.com/npc.mode_?igsh=MWdpYXR4dDJhbGFkYQ==)
- LinkedIn: [pragadeesh-s](https://www.linkedin.com/in/pragadeesh-s-21564b384)
- Email: pragad555990@gmail.com

## 🐛 Known Issues

None at the moment. Please report any bugs in the Issues section.

## 🔮 Future Enhancements

- Mobile app version
- Dark/Light theme toggle
- Habit categories and tags
- Export data functionality
- Social features (share progress)
- Habit reminders/notifications

## 💬 Support

For support, email pragad555990@gmail.com or open an issue in the repository.

---

Made with ❤️ by Pragadeesh S
