// Community JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunity();
    checkAuthenticationRequired();
});

let currentUser = null;
let posts = [];
let currentPage = 1;
const postsPerPage = 10;

function initializeCommunity() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI
    updateUserGreeting();
    setupEventListeners();
    loadCommunityStats();
    loadPosts();
    
    // Initialize logout functionality
    setupLogout();
}

function checkAuthenticationRequired() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

function updateUserGreeting() {
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting && currentUser) {
        userGreeting.textContent = `مرحبًا ${currentUser.name}`;
    }
}

function setupEventListeners() {
    // Create post form
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }

    // Close modal
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closePostModal);
    }
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

async function handleCreatePost(e) {
    e.preventDefault();
    
    const content = document.getElementById('post-content').value.trim();
    if (!content) {
        showNotification('يرجى كتابة محتوى للمنشور', 'error');
        return;
    }

    const newPost = {
        id: generatePostId(),
        userId: currentUser.id,
        userName: currentUser.name,
        userInitial: currentUser.name.charAt(0),
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        isLiked: false,
        type: 'awareness'
    };

    // Add to posts array
    posts.unshift(newPost);
    savePosts();
    
    // Update user's post count
    currentUser.postsCount = (currentUser.postsCount || 0) + 1;
    localStorage.setItem('wesal_user', JSON.stringify(currentUser));
    
    // Clear form
    document.getElementById('post-content').value = '';
    
    // Refresh posts display
    displayPosts();
    loadCommunityStats();
    
    showNotification('تم نشر منشورك بنجاح ✨', 'success');
}

function loadPosts() {
    // Load posts from localStorage or initialize with sample data
    const storedPosts = localStorage.getItem('wesal_posts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    } else {
        initializeDemoPosts();
    }
    
    displayPosts();
}

function initializeDemoPosts() {
    posts = [
        {
            id: 'post_1',
            userId: 'demo-user-1',
            userName: 'سارة النور',
            userInitial: 'س',
            content: 'بدأت يومي بجلسة تأمل رائعة في الحديقة. الطبيعة تعلمنا الكثير عن السكينة والهدوء الداخلي. #التأمل_الصباحي #لحظة_وعي',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 12,
            comments: [
                {
                    id: 'comment_1',
                    userId: 'demo-user-2',
                    userName: 'أحمد الهادي',
                    content: 'كلامك جميل جداً، التأمل في الطبيعة له سحر خاص',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
                }
            ],
            isLiked: false,
            type: 'awareness'
        },
        {
            id: 'post_2',
            userId: 'demo-user-2',
            userName: 'أحمد الهادي',
            userInitial: 'أ',
            content: 'قرأت اليوم عن قوة الامتنان وكيف يمكن أن تغير نظرتنا للحياة. أشعر بامتنان عميق لكل النعم التي أحاطني بها الله. #الامتنان',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            likes: 8,
            comments: [],
            isLiked: false,
            type: 'gratitude'
        },
        {
            id: 'post_3',
            userId: 'demo-user-1',
            userName: 'سارة النور',
            userInitial: 'س',
            content: 'تجربة جميلة في ورشة الوعي الذاتي اليوم. تعلمت أن النور الحقيقي يأتي من الداخل وأن رحلة الاكتشاف لا تنتهي أبداً.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            likes: 15,
            comments: [],
            isLiked: true,
            type: 'workshop'
        }
    ];
    
    savePosts();
}

function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    const paginatedPosts = posts.slice(0, currentPage * postsPerPage);
    
    postsContainer.innerHTML = paginatedPosts.map(post => createPostHTML(post)).join('');
    
    // Add event listeners to posts
    paginatedPosts.forEach(post => {
        const postElement = document.querySelector(`[data-post-id="${post.id}"]`);
        if (postElement) {
            setupPostInteractions(postElement, post);
        }
    });
}

function createPostHTML(post) {
    const timeAgo = getTimeAgo(post.timestamp);
    const userColor = getUserColor(post.userId);
    
    return `
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg post-card" data-post-id="${post.id}">
            <div class="flex items-start space-x-reverse space-x-4 mb-4">
                <div class="w-12 h-12 ${userColor} rounded-full flex items-center justify-center text-white font-bold">
                    ${post.userInitial}
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-purple-900">${post.userName}</h3>
                        <span class="text-purple-600 text-sm">${timeAgo}</span>
                    </div>
                    <div class="text-purple-600 text-sm">${getPostTypeLabel(post.type)}</div>
                </div>
            </div>
            
            <div class="text-purple-800 mb-4 leading-relaxed">${post.content}</div>
            
            <div class="flex items-center justify-between pt-4 border-t border-purple-100">
                <div class="flex items-center space-x-reverse space-x-6">
                    <button class="like-btn flex items-center space-x-reverse space-x-2 text-purple-600 hover:text-pink-600 transition-colors ${post.isLiked ? 'text-pink-600' : ''}" data-post-id="${post.id}">
                        <span class="like-icon">${post.isLiked ? '❤️' : '🤍'}</span>
                        <span class="like-count">${post.likes}</span>
                        <span class="like-text">نورك لمسني</span>
                    </button>
                    
                    <button class="comment-btn flex items-center space-x-reverse space-x-2 text-purple-600 hover:text-blue-600 transition-colors" data-post-id="${post.id}">
                        <span>💬</span>
                        <span>${post.comments.length}</span>
                        <span>تعليق</span>
                    </button>
                </div>
                
                <button class="share-btn text-purple-600 hover:text-green-600 transition-colors" data-post-id="${post.id}">
                    <span>📤 مشاركة</span>
                </button>
            </div>
            
            ${post.comments.length > 0 ? createCommentsHTML(post.comments) : ''}
        </div>
    `;
}

function createCommentsHTML(comments) {
    const commentsHTML = comments.slice(0, 2).map(comment => `
        <div class="flex items-start space-x-reverse space-x-3 py-2">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ${comment.userName.charAt(0)}
            </div>
            <div class="flex-1">
                <div class="bg-purple-50 rounded-lg p-3">
                    <div class="font-semibold text-purple-900 text-sm">${comment.userName}</div>
                    <div class="text-purple-700 text-sm">${comment.content}</div>
                </div>
                <div class="text-purple-500 text-xs mt-1">${getTimeAgo(comment.timestamp)}</div>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="mt-4 pt-4 border-t border-purple-100">
            <div class="space-y-2">
                ${commentsHTML}
                ${comments.length > 2 ? `<div class="text-purple-600 text-sm cursor-pointer hover:text-purple-800">عرض ${comments.length - 2} تعليق إضافي...</div>` : ''}
            </div>
        </div>
    `;
}

function setupPostInteractions(postElement, post) {
    // Like button
    const likeBtn = postElement.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => toggleLike(post.id));
    }
    
    // Comment button
    const commentBtn = postElement.querySelector('.comment-btn');
    if (commentBtn) {
        commentBtn.addEventListener('click', () => openPostModal(post.id));
    }
    
    // Share button
    const shareBtn = postElement.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => sharePost(post.id));
    }
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    
    // Update user's interaction count
    if (post.isLiked) {
        currentUser.interactionCount = (currentUser.interactionCount || 0) + 1;
        localStorage.setItem('wesal_user', JSON.stringify(currentUser));
    }
    
    savePosts();
    displayPosts();
    
    if (post.isLiked) {
        showNotification('✨ نورك أضاء المنشور', 'success');
    }
}

function openPostModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('post-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = createPostDetailHTML(post);
    modal.classList.remove('hidden');
}

function closePostModal() {
    const modal = document.getElementById('post-modal');
    modal.classList.add('hidden');
}

function createPostDetailHTML(post) {
    return `
        <div class="space-y-4">
            ${createPostHTML(post)}
            
            <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-bold text-purple-900 mb-3">أضف تعليق</h4>
                <div class="flex space-x-reverse space-x-3">
                    <input type="text" id="comment-input" placeholder="شارك رأيك..." 
                           class="flex-1 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none">
                    <button id="add-comment-btn" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        إضافة
                    </button>
                </div>
            </div>
        </div>
    `;
}

function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Create a simple share text
    const shareText = `شاهد هذا المنشور الملهم من ${post.userName} على وصال: "${post.content.substring(0, 100)}..."`;
    
    if (navigator.share) {
        navigator.share({
            title: 'منشور من وصال',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('تم نسخ رابط المنشور', 'success');
        });
    }
}

function loadMorePosts() {
    currentPage++;
    displayPosts();
    
    // Hide load more button if all posts are loaded
    const totalPages = Math.ceil(posts.length / postsPerPage);
    if (currentPage >= totalPages) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

function loadCommunityStats() {
    // Update community stats
    const activeUsers = document.getElementById('active-users');
    const dailyPosts = document.getElementById('daily-posts');
    const totalInteractions = document.getElementById('total-interactions');
    
    if (activeUsers) {
        activeUsers.textContent = Math.floor(Math.random() * 100) + 50;
    }
    
    if (dailyPosts) {
        const todayPosts = posts.filter(post => {
            const postDate = new Date(post.timestamp);
            const today = new Date();
            return postDate.toDateString() === today.toDateString();
        }).length;
        dailyPosts.textContent = todayPosts;
    }
    
    if (totalInteractions) {
        const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
        const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
        totalInteractions.textContent = totalLikes + totalComments;
    }
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

function savePosts() {
    localStorage.setItem('wesal_posts', JSON.stringify(posts));
}

function generatePostId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

function getUserColor(userId) {
    const colors = [
        'bg-gradient-to-br from-purple-500 to-pink-500',
        'bg-gradient-to-br from-blue-500 to-green-500',
        'bg-gradient-to-br from-orange-500 to-red-500',
        'bg-gradient-to-br from-green-500 to-teal-500'
    ];
    
    const hash = userId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
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
