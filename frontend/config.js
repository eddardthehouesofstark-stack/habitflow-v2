// ═══════════════════════════════════════════════
// HabitFlow Frontend Configuration
// ═══════════════════════════════════════════════
// This file automatically detects the environment and
// sets the correct API URL
// ═══════════════════════════════════════════════

const CONFIG = {
    // Automatically detect environment
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',
    
    // API Base URLs
    API_BASE_URL: (() => {
        const hostname = window.location.hostname;
        
        // Development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3002/api';
        }
        
        // Production - UPDATE THIS WITH YOUR DEPLOYED BACKEND URL
        return 'https://habitflow-v2-backend.onrender.com/api';
        
        // Alternative: Use environment-specific URLs
        // if (hostname.includes('vercel.app')) {
        //     return 'https://habitflow-backend.onrender.com/api';
        // }
        // if (hostname.includes('netlify.app')) {
        //     return 'https://habitflow-backend.onrender.com/api';
        // }
        // if (hostname.includes('yourdomain.com')) {
        //     return 'https://api.yourdomain.com/api';
        // }
        
        // Fallback
        // return 'http://localhost:3002/api';
    })(),
    
    // App Settings
    APP_NAME: 'HabitFlow',
    VERSION: '1.0.0',
    
    // Feature Flags
    FEATURES: {
        enableAnalytics: false,
        enableNotifications: false,
        debugMode: window.location.hostname === 'localhost'
    }
};

// Log configuration in development
if (CONFIG.isDevelopment) {
    console.log('🔧 HabitFlow Config:', {
        environment: CONFIG.isDevelopment ? 'Development' : 'Production',
        apiUrl: CONFIG.API_BASE_URL,
        hostname: window.location.hostname
    });
}

// Make config globally available
window.HABITFLOW_CONFIG = CONFIG;
