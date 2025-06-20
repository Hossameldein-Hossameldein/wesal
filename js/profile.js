// Profile JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    checkAuthenticationRequired();
});

let currentUser = null;
let userPosts = [];
let userInteractions = [];

function initializeProfile() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI
    loadUserProfile();
    setupEventListeners();
    loadUserActivity();
    loadAchievements();
    
    // Initialize logout functionality
    setupLogout();
}

function checkAuthenticationRequired() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

function loadUserProfile() {
    // Update profile information
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const profileAvatar = document.getElementById('profile-avatar');
    const awarenessScore = document.getElementById('awareness-tone');
    const interactionCount = document.getElementById('interaction-count');
    const postsCount = document.getElementById('posts-count');

    if (profileName) profileName.textContent = currentUser.name;
    if (profileBio) profileBio.textContent = currentUser.bio || 'في رحلة البحث عن النور الداخلي';
    
    if (profileAvatar) {
        profileAvatar.textContent = currentUser.name.charAt(0);
        profileAvatar.className = `w-32 h-32 ${getProfileColor(currentUser.profileColor || 'purple-pink')} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg`;
    }

    if (awarenessScore) awarenessScore.textContent = currentUser.awarenesTone || 0;
    if (interactionCount) interactionCount.textContent = currentUser.interactionCount || 0;
    if (postsCount) postsCount.textContent = currentUser.postsCount || 0;

    // Update progress bars
    updateProgressBars();
}

function updateProgressBars() {
    // Awareness level progress
    const awarenessProgress = document.getElementById('awareness-progress');
    const awarenessLevel = document.getElementById('awareness-level');
    const meditationProgress = document.getElementById('meditation-progress');
    const meditationDays = document.getElementById('meditation-days');

    if (awarenessProgress && awarenessLevel) {
        const score = currentUser.awarenesTone || 0;
        const progressPercent = Math.min((score / 200) * 100, 100);
        awarenessProgress.style.width = `${progressPercent}%`;
        
        if (score < 50) awarenessLevel.textContent = 'المبتدئ';
        else if (score < 100) awarenessLevel.textContent = 'المتوسط';
        else if (score < 150) awarenessLevel.textContent = 'متقدم';
        else awarenessLevel.textContent = 'خبير';
    }

    if (meditationProgress && meditationDays) {
        const days = currentUser.meditationDays || 0;
        const progressPercent = Math.min((days / 30) * 100, 100);
        meditationProgress.style.width = `${progressPercent}%`;
        meditationDays.textContent = days;
    }
}

function setupEventListeners() {
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditModal);
    }

    // Edit modal handlers
    const closeModal = document.getElementById('close-modal');
    const cancelEdit = document.getElementById('cancel-edit');
    const editForm = document.getElementById('edit-form');

    if (closeModal) closeModal.addEventListener('click', closeEditModal);
    if (cancelEdit) cancelEdit.addEventListener('click', closeEditModal);
    if (editForm) editForm.addEventListener('submit', handleProfileUpdate);

    // Filter buttons
    const filterButtons = document.querySelectorAll('[id^="filter-"]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => filterPosts(e.target.id.replace('filter-', '')));
    });

    // Color selection
    const colorButtons = document.querySelectorAll('[data-color]');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => selectProfileColor(e.target.dataset.color));
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('wesal_user');
            window.location.href = 'index.html';
        });
    }
}

function openEditModal() {
    const modal = document.getElementById('edit-modal');
    const editName = document.getElementById('edit-name');
    const editBio = document.getElementById('edit-bio');

    if (editName) editName.value = currentUser.name;
    if (editBio) editBio.value = currentUser.bio || '';

    // Highlight current color
    const currentColor = currentUser.profileColor || 'purple-pink';
    const colorButtons = document.querySelectorAll('[data-color]');
    colorButtons.forEach(btn => {
        if (btn.dataset.color === currentColor) {
            btn.classList.add('border-purple-600');
        } else {
            btn.classList.remove('border-purple-600');
        }
    });

    modal.classList.remove('hidden');
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
}

function selectProfileColor(colorName) {
    const colorButtons = document.querySelectorAll('[data-color]');
    colorButtons.forEach(btn => {
        if (btn.dataset.color === colorName) {
            btn.classList.add('border-purple-600');
        } else {
            btn.classList.remove('border-purple-600');
        }
    });
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const newName = document.getElementById('edit-name').value.trim();
    const newBio = document.getElementById('edit-bio').value.trim();
    const selectedColor = document.querySelector('[data-color].border-purple-600')?.dataset.color || 'purple-pink';

    if (!newName) {
        showNotification('يرجى إدخال الاسم', 'error');
        return;
    }

    // Update user data
    currentUser.name = newName;
    currentUser.bio = newBio;
    currentUser.profileColor = selectedColor;

    // Save to localStorage
    localStorage.setItem('wesal_user', JSON.stringify(currentUser));

    // Update UI
    loadUserProfile();
    closeEditModal();

    showNotification('تم تحديث الملف الشخصي بنجاح ✨', 'success');
}

function loadUserActivity() {
    const recentActivity = document.getElementById('recent-activity');
    if (!recentActivity) return;

    // Get user's recent activities
    const activities = generateRecentActivities();
    
    recentActivity.innerHTML = activities.map(activity => `
        <div class="flex items-center space-x-reverse space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <div class="text-lg">${activity.icon}</div>
            <div class="flex-1">
                <div class="text-purple-800 text-sm">${activity.description}</div>
                <div class="text-purple-500 text-xs">${getTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function generateRecentActivities() {
    const activities = [
        {
            icon: '✨',
            description: 'أكملت تمرين التأمل الصباحي',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            icon: '💖',
            description: 'تفاعلت مع منشور ملهم',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            icon: '📚',
            description: 'قرأت مقال عن الوعي الذاتي',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            icon: '🌱',
            description: 'انضممت إلى مجتمع وصال',
            timestamp: new Date(currentUser.joinDate).toISOString()
        }
    ];

    return activities.slice(0, 4);
}

function loadAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    if (!achievementsContainer) return;

    const achievements = calculateAchievements();
    
    achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="text-center p-3 rounded-xl ${achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'} transition-all duration-300 hover:scale-105">
            <div class="text-2xl mb-1 ${achievement.earned ? '' : 'grayscale opacity-50'}">${achievement.icon}</div>
            <div class="text-xs ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'} font-semibold">${achievement.name}</div>
        </div>
    `).join('');
}

function calculateAchievements() {
    const userScore = currentUser.awarenesTone || 0;
    const userPosts = currentUser.postsCount || 0;
    const userInteractions = currentUser.interactionCount || 0;
    const joinDate = new Date(currentUser.joinDate);
    const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    return [
        {
            name: 'بداية النور',
            icon: '🌟',
            earned: userScore >= 10,
            description: 'حصلت على أول 10 نقاط وعي'
        },
        {
            name: 'المتفاعل',
            icon: '💫',
            earned: userInteractions >= 5,
            description: 'تفاعلت مع 5 منشورات'
        },
        {
            name: 'الكاتب',
            icon: '✍️',
            earned: userPosts >= 3,
            description: 'نشرت 3 منشورات'
        },
        {
            name: 'الأسبوع الأول',
            icon: '📅',
            earned: daysSinceJoin >= 7,
            description: 'مرّ أسبوع على انضمامك'
        },
        {
            name: 'الواعي',
            icon: '🧘‍♀️',
            earned: userScore >= 50,
            description: 'وصلت للمستوى المتوسط'
        },
        {
            name: 'النور المشع',
            icon: '✨',
            earned: userScore >= 100,
            description: 'وصلت للمستوى المتقدم'
        }
    ];
}

function loadUserPosts() {
    // Load user's posts from localStorage
    const allPosts = JSON.parse(localStorage.getItem('wesal_posts') || '[]');
    userPosts = allPosts.filter(post => post.userId === currentUser.id);
    
    displayFilteredPosts('all');
}

function filterPosts(filterType) {
    // Update filter button states
    const filterButtons = document.querySelectorAll('[id^="filter-"]');
    filterButtons.forEach(btn => {
        if (btn.id === `filter-${filterType}`) {
            btn.classList.add('bg-purple-600', 'text-white');
            btn.classList.remove('text-purple-600');
        } else {
            btn.classList.remove('bg-purple-600', 'text-white');
            btn.classList.add('text-purple-600');
        }
    });

    displayFilteredPosts(filterType);
}

function displayFilteredPosts(filterType) {
    const postsHistory = document.getElementById('posts-history');
    if (!postsHistory) return;

    // Load posts if not already loaded
    if (userPosts.length === 0) {
        loadUserPosts();
    }

    let postsToShow = userPosts;
    
    if (filterType === 'posts') {
        postsToShow = userPosts;
    } else if (filterType === 'interactions') {
        // Show posts user interacted with (simplified)
        const allPosts = JSON.parse(localStorage.getItem('wesal_posts') || '[]');
        postsToShow = allPosts.filter(post => post.isLiked && post.userId !== currentUser.id);
    }

    if (postsToShow.length === 0) {
        postsHistory.innerHTML = `
            <div class="text-center py-8 text-purple-600">
                <div class="text-4xl mb-4">📝</div>
                <p>لا توجد منشورات بعد</p>
                <p class="text-sm mt-2">ابدأ بمشاركة تجربتك الروحية مع المجتمع</p>
            </div>
        `;
        return;
    }

    postsHistory.innerHTML = postsToShow.map(post => `
        <div class="bg-white/80 rounded-xl p-4 border border-purple-200">
            <div class="flex justify-between items-start mb-2">
                <div class="text-purple-800 text-sm">${getTimeAgo(post.timestamp)}</div>
                <div class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">${getPostTypeLabel(post.type)}</div>
            </div>
            <div class="text-purple-900 mb-3">${post.content}</div>
            <div class="flex items-center space-x-reverse space-x-4 text-sm text-purple-600">
                <span>❤️ ${post.likes}</span>
                <span>💬 ${post.comments.length}</span>
            </div>
        </div>
    `).join('');
}

// Utility functions
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('wesal_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function getProfileColor(colorName) {
    const colors = {
        'purple-pink': 'bg-gradient-to-br from-purple-500 to-pink-500',
        'blue-green': 'bg-gradient-to-br from-blue-500 to-green-500',
        'orange-red': 'bg-gradient-to-br from-orange-500 to-red-500',
        'green-teal': 'bg-gradient-to-br from-green-500 to-teal-500'
    };
    
    return colors[colorName] || colors['purple-pink'];
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `${diffMins} دقيقة`;
    if (diffHours < 24) return `${diffHours} ساعة`;
    if (diffDays < 7) return `${diffDays} يوم`;
    
    return postTime.toLocaleDateString('ar-SA');
}

function getPostTypeLabel(type) {
    const labels = {
        'awareness': 'لحظة وعي',
        'gratitude': 'امتنان',
        'workshop': 'ورشة عمل',
        'meditation': 'تأمل',
        'reflection': 'تأمل وتفكر'
    };
    
    return labels[type] || 'منشور عام';
}

function showNotification(message, type = 'info') {
    if (window.WesalUtils && window.WesalUtils.showNotification) {
        window.WesalUtils.showNotification(message, type);
    } else {
        console.log(message);
    }
}

// Initialize posts display on page load
setTimeout(loadUserPosts, 500);
