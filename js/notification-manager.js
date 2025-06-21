// Notification Manager for Wesal
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        this.createContainer();
        
        // Listen for theme changes to update notification styles
        window.addEventListener('themeChanged', () => {
            this.updateNotificationStyles();
        });
    }

    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        this.container = container;
    }

    show(message, type = 'info', duration = this.defaultDuration, options = {}) {
        const notification = this.createNotification(message, type, duration, options);
        this.addNotification(notification);
        return notification.id;
    }

    success(message, duration, options = {}) {
        return this.show(message, 'success', duration, options);
    }

    error(message, duration, options = {}) {
        return this.show(message, 'error', duration, options);
    }

    warning(message, duration, options = {}) {
        return this.show(message, 'warning', duration, options);
    }

    info(message, duration, options = {}) {
        return this.show(message, 'info', duration, options);
    }

    createNotification(message, type, duration, options) {
        const id = this.generateId();
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const notification = {
            id,
            message,
            type,
            duration,
            options,
            element: null,
            timer: null
        };

        // Create DOM element
        const element = document.createElement('div');
        element.className = `notification ${type}`;
        element.setAttribute('data-notification-id', id);
        element.style.pointerEvents = 'auto';

        element.innerHTML = `
            <div class="notification-content">
                <div style="display: flex; align-items: center;">
                    <span class="notification-icon">${icons[type] || 'ℹ'}</span>
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close" onclick="notificationManager.dismiss('${id}')">
                    ×
                </button>
            </div>
        `;

        notification.element = element;
        return notification;
    }

    addNotification(notification) {
        // Remove oldest notification if we exceed max
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications[0];
            this.dismiss(oldest.id);
        }

        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Trigger animation
        setTimeout(() => {
            notification.element.classList.add('show');
        }, 10);

        // Auto dismiss if duration is set
        if (notification.duration > 0) {
            notification.timer = setTimeout(() => {
                this.dismiss(notification.id);
            }, notification.duration);
        }

        // Add click to dismiss if enabled
        if (notification.options.clickToDismiss !== false) {
            notification.element.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    this.dismiss(notification.id);
                }
            });
        }
    }

    dismiss(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        // Clear timer
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        // Animate out
        notification.element.classList.remove('show');
        
        setTimeout(() => {
            // Remove from DOM
            if (notification.element && notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            
            // Remove from array
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 400);
    }

    dismissAll() {
        this.notifications.forEach(notification => {
            this.dismiss(notification.id);
        });
    }

    updateNotificationStyles() {
        // Update existing notifications for theme changes
        this.notifications.forEach(notification => {
            if (notification.element) {
                // The CSS will handle the theme changes automatically
                // This method is here for future enhancements
            }
        });
    }

    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get notification count
    getCount() {
        return this.notifications.length;
    }

    // Check if notifications are supported
    isSupported() {
        return typeof document !== 'undefined';
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Enhanced showNotification function for backward compatibility
function showNotification(message, type = 'info', duration = 5000, options = {}) {
    return notificationManager.show(message, type, duration, options);
}

// Export for global access
window.NotificationManager = notificationManager;
window.showNotification = showNotification;