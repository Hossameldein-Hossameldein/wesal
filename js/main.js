// Main JavaScript for Wesal Website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize homepage interactions
    initializeHomepage();
    
    // Check authentication status
    checkAuthStatus();
});

function initializeAnimations() {
    // Fade in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('section > div, .hover-lift').forEach(el => {
        observer.observe(el);
    });

    // Add floating animation to light elements
    createFloatingLights();
}

function createFloatingLights() {
    const floatingLights = document.querySelectorAll('.floating-light');
    
    floatingLights.forEach((light, index) => {
        light.style.animationDelay = `${index * 2}s`;
        light.style.animationDuration = `${6 + index}s`;
    });
}

function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeHomepage() {
    const startJourneyBtn = document.getElementById('start-journey-btn');
    
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            // Check if user is logged in
            const user = getCurrentUser();
            if (user) {
                window.location.href = 'awareness-map.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // Initialize dynamic stats (if on homepage)
    updateCommunityStats();
}

function updateCommunityStats() {
    // Simulate dynamic community stats
    const stats = {
        activeUsers: Math.floor(Math.random() * 500) + 200,
        dailyPosts: Math.floor(Math.random() * 50) + 20,
        totalInteractions: Math.floor(Math.random() * 2000) + 1000
    };

    // Update stats with animation
    animateNumber('active-users', stats.activeUsers);
    animateNumber('daily-posts', stats.dailyPosts);
    animateNumber('total-interactions', stats.totalInteractions);
}

function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentNumber = 0;
    const increment = targetNumber / 50;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber);
    }, 50);
}

function checkAuthStatus() {
    const user = getCurrentUser();
    const authButtons = document.querySelectorAll('.auth-required');
    
    authButtons.forEach(btn => {
        if (user) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('wesal_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notification.classList.add(bgColor, 'text-white');
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button class="mr-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for use in other files
window.WesalUtils = {
    getCurrentUser,
    showNotification,
    formatDate,
    formatTime,
    animateNumber
};
