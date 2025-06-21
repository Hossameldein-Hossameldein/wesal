// Theme Management for Wesal
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupToggleListeners();
        this.updateToggleState();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('wesal_theme');
        } catch (error) {
            return 'light';
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('wesal_theme', theme);
        } catch (error) {
            console.warn('Could not save theme preference');
        }
    }

    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;
        
        if (theme === 'dark') {
            body.classList.add('dark');
            html.classList.add('dark');
        } else {
            body.classList.remove('dark');
            html.classList.remove('dark');
        }
        
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.updateToggleState();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
    }

    setupToggleListeners() {
        // Find all theme toggle buttons
        const toggleButtons = document.querySelectorAll('.theme-toggle, #theme-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTheme();
            });
        });
    }

    updateToggleState() {
        const toggleButtons = document.querySelectorAll('.theme-toggle, #theme-toggle');
        
        toggleButtons.forEach(button => {
            if (this.currentTheme === 'dark') {
                button.classList.add('dark-mode');
            } else {
                button.classList.remove('dark-mode');
            }
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for global access
window.ThemeManager = themeManager;