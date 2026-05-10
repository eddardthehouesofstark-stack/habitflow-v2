const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── SUPABASE ───
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // use service role key on backend (bypasses RLS)
);

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE: auth guard ───
function authGuard(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing token' });
    try {
        req.user = jwt.verify(header.slice(7), JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// ─── AUTH ROUTES ───

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data: existing } = await supabase
        .from('users').select('id').eq('email', email).single();
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
        .from('users')
        .insert({ email, name: name || email.split('@')[0], password_hash: hashed })
        .select('id, email, name, is_admin')
        .single();

    if (error) return res.status(500).json({ error: error.message });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin || false } });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: user } = await supabase
        .from('users').select('*').eq('email', email).single();
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin || false } });
});

// GET /api/auth/me
app.get('/api/auth/me', authGuard, async (req, res) => {
    const { data: user } = await supabase
        .from('users').select('id, email, name, is_admin').eq('id', req.user.id).single();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// ─── HABITS ROUTES ───

// GET /api/habits  — get today's habits with done status
app.get('/api/habits', authGuard, async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: habits, error } = await supabase
        .from('habits')
        .select(`id, name, time, habit_logs(done, log_date)`)
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    const result = habits.map(h => {
        const todayLog = h.habit_logs?.find(l => l.log_date === today);
        return { id: h.id, name: h.name, time: h.time, done: todayLog?.done || false };
    });

    res.json({ habits: result });
});

// POST /api/habits  — add a new habit
app.post('/api/habits', authGuard, async (req, res) => {
    const { name, time } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const { data: habit, error } = await supabase
        .from('habits')
        .insert({ user_id: req.user.id, name, time: time || null })
        .select('id, name, time')
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ habit: { ...habit, done: false } });
});

// POST /api/habits/:id/toggle  — mark habit done/undone for today
app.post('/api/habits/:id/toggle', authGuard, async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Verify ownership
    const { data: habit } = await supabase
        .from('habits').select('id').eq('id', id).eq('user_id', req.user.id).single();
    if (!habit) return res.status(403).json({ error: 'Not your habit' });

    // Upsert the log for today
    const { error } = await supabase
        .from('habit_logs')
        .upsert({ habit_id: id, user_id: req.user.id, log_date: today, done },
            { onConflict: 'habit_id,log_date' });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
});

// DELETE /api/habits/:id
app.delete('/api/habits/:id', authGuard, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('habits').delete().eq('id', id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
});

// GET /api/habits/logs/year  — return this year's log summary
app.get('/api/habits/logs/year', authGuard, async (req, res) => {
    const year = new Date().getFullYear();
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const { data: habits } = await supabase
        .from('habits').select('id').eq('user_id', req.user.id);
    const habitIds = habits.map(h => h.id);

    if (!habitIds.length) return res.json({ logs: {} });

    const { data: logs } = await supabase
        .from('habit_logs')
        .select('log_date, done, habit_id')
        .in('habit_id', habitIds)
        .gte('log_date', start)
        .lte('log_date', end);

    // Group by day-of-year and determine done/partial
    const byDate = {};
    for (const l of logs || []) {
        if (!byDate[l.log_date]) byDate[l.log_date] = { total: 0, done: 0 };
        byDate[l.log_date].total++;
        if (l.done) byDate[l.log_date].done++;
    }

    const startOfYear = new Date(`${year}-01-01`);
    const result = {};
    for (const [dateStr, counts] of Object.entries(byDate)) {
        const dayNum = Math.floor((new Date(dateStr) - startOfYear) / 86400000) + 1;
        result[dayNum] = counts.done === counts.total && counts.total > 0 ? 'done'
            : counts.done > 0 ? 'partial' : 'missed';
    }
    res.json({ logs: result });
});

// ─── COMMUNITY ROUTE ───

// GET /api/community  — public stats for all users
app.get('/api/community', authGuard, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const { data: users } = await supabase
        .from('users').select('id, name, email');

    const communityData = await Promise.all(users.map(async (u) => {
        const { data: habits } = await supabase
            .from('habits').select('id').eq('user_id', u.id);
        const totalHabits = habits?.length || 0;
        const habitIds = habits?.map(h => h.id) || [];

        let completedToday = 0;
        if (habitIds.length) {
            const { data: todayLogs } = await supabase
                .from('habit_logs')
                .select('done')
                .in('habit_id', habitIds)
                .eq('log_date', today)
                .eq('done', true);
            completedToday = todayLogs?.length || 0;
        }

        // Simple streak: count consecutive days back from yesterday with at least 1 done
        let streak = 0;
        const checkDate = new Date(); checkDate.setDate(checkDate.getDate() - 1);
        for (let i = 0; i < 365; i++) {
            const ds = checkDate.toISOString().split('T')[0];
            if (!habitIds.length) break;
            const { data: dl } = await supabase
                .from('habit_logs').select('done').in('habit_id', habitIds).eq('log_date', ds).eq('done', true);
            if (!dl?.length) break;
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        return { id: u.id, name: u.name, email: u.email, total_habits: totalHabits, completed_today: completedToday, streak };
    }));

    // hide yourself, sort by streak
    const others = communityData
        .filter(u => u.id !== req.user.id)
        .sort((a, b) => b.streak - a.streak);

    res.json({ users: others });
});

// ─── START ───
app.listen(PORT, () => console.log(`HabitFlow backend running on http://localhost:${PORT}`));

// ─── ADMIN ROUTES ───

// GET /api/admin/stats  — get platform statistics (ADMIN ONLY)
app.get('/api/admin/stats', authGuard, async (req, res) => {
    try {
        // Check if user is admin
        const { data: user } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', req.user.id)
            .single();
        
        if (!user || !user.is_admin) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const today = new Date().toISOString().split('T')[0];

        // Total users
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Total habits
        const { count: totalHabits } = await supabase
            .from('habits')
            .select('*', { count: 'exact', head: true });

        // Active users today (users with at least one completion today)
        const { data: todayLogs } = await supabase
            .from('habit_logs')
            .select('user_id')
            .eq('log_date', today)
            .eq('done', true);
        
        const activeToday = new Set(todayLogs?.map(l => l.user_id) || []).size;

        // Total completions today
        const completionsToday = todayLogs?.length || 0;

        // Completion rate (today's completions / total habits)
        const completionRate = totalHabits > 0 ? Math.round((completionsToday / totalHabits) * 100) : 0;

        // Recent users with their stats
        const { data: users } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        const recentUsers = await Promise.all(users.map(async (u) => {
            const { data: habits } = await supabase
                .from('habits').select('id').eq('user_id', u.id);
            const habitIds = habits?.map(h => h.id) || [];
            
            // Calculate streak
            let streak = 0;
            const checkDate = new Date(); 
            checkDate.setDate(checkDate.getDate() - 1);
            for (let i = 0; i < 365; i++) {
                const ds = checkDate.toISOString().split('T')[0];
                if (!habitIds.length) break;
                const { data: dl } = await supabase
                    .from('habit_logs')
                    .select('done')
                    .in('habit_id', habitIds)
                    .eq('log_date', ds)
                    .eq('done', true);
                if (!dl?.length) break;
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                total_habits: habitIds.length,
                streak
            };
        }));

        // Calculate average streak
        const avgStreak = recentUsers.length > 0 
            ? Math.round(recentUsers.reduce((sum, u) => sum + u.streak, 0) / recentUsers.length)
            : 0;

        res.json({
            totalUsers,
            totalHabits,
            activeToday,
            completionRate,
            completionsToday,
            avgStreak,
            totalProjects: 0, // Placeholder - you can add projects table later
            recentUsers
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/users/:id  — delete a user (ADMIN ONLY)
app.delete('/api/admin/users/:id', authGuard, async (req, res) => {
    try {
        // Check if user is admin
        const { data: admin } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', req.user.id)
            .single();
        
        if (!admin || !admin.is_admin) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const userIdToDelete = req.params.id;

        // Prevent admin from deleting themselves
        if (userIdToDelete === req.user.id) {
            return res.status(400).json({ error: 'You cannot delete your own account' });
        }

        // Delete user (cascade will delete habits and logs automatically)
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userIdToDelete);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: error.message });
    }
});
