// Authentication JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginFormElement = document.getElementById('login-form-element');
    const signupFormElement = document.getElementById('signup-form-element');

    // Tab switching
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', () => switchTab('login'));
        signupTab.addEventListener('click', () => switchTab('signup'));
    }

    // Form submissions
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }

    // Initialize floating particles animation
    initializeFloatingParticles();
}

function switchTab(tabType) {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (tabType === 'login') {
        loginTab.classList.add('bg-purple-600', 'text-white');
        loginTab.classList.remove('text-purple-600');
        signupTab.classList.remove('bg-purple-600', 'text-white');
        signupTab.classList.add('text-purple-600');
        
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        signupTab.classList.add('bg-purple-600', 'text-white');
        signupTab.classList.remove('text-purple-600');
        loginTab.classList.remove('bg-purple-600', 'text-white');
        loginTab.classList.add('text-purple-600');
        
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showError('يرجى ملء جميع الحقول');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check stored users or create demo login
        const storedUsers = getStoredUsers();
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user || (email === 'demo@wesal.com' && password === 'demo123')) {
            const userData = user || {
                id: 'demo-user',
                name: 'مستخدم تجريبي',
                email: email,
                joinDate: new Date().toISOString(),
                awarenessLevel: 'المبتدئ',
                awarenesTone: 25,
                interactionCount: 12,
                postsCount: 5,
                isDemo: true
            };
            
            // Store user session
            localStorage.setItem('wesal_user', JSON.stringify(userData));
            
            // Show success message
            showSuccessMessage(userData.name, false);
        } else {
            showError('بيانات الدخول غير صحيحة');
        }
    } catch (error) {
        showError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        showError('يرجى ملء جميع الحقول');
        return;
    }

    if (password !== confirmPassword) {
        showError('كلمات المرور غير متطابقة');
        return;
    }

    if (password.length < 6) {
        showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user already exists
        const storedUsers = getStoredUsers();
        if (storedUsers.find(u => u.email === email)) {
            showError('المستخدم موجود بالفعل');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: name,
            email: email,
            password: password, // In real app, this would be hashed
            joinDate: new Date().toISOString(),
            awarenessLevel: 'المبتدئ',
            awarenesTone: 0,
            interactionCount: 0,
            postsCount: 0,
            bio: 'في رحلة البحث عن النور الداخلي',
            profileColor: 'purple-pink',
            trialDays: 3
        };
        
        // Store user
        storedUsers.push(newUser);
        localStorage.setItem('wesal_users', JSON.stringify(storedUsers));
        localStorage.setItem('wesal_user', JSON.stringify(newUser));
        
        // Show success message
        showSuccessMessage(newUser.name, true);
    } catch (error) {
        showError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showSuccessMessage(userName, isNewUser) {
    const successMessage = document.getElementById('success-message');
    const overlay = document.getElementById('overlay');
    const welcomeText = document.getElementById('welcome-text');
    const continueBtn = document.getElementById('continue-btn');

    if (isNewUser) {
        welcomeText.textContent = 'بدأت تجربتك المجانية لمدة 3 أيام';
    } else {
        welcomeText.textContent = `مرحبًا بعودتك ${userName}`;
    }

    // Show modal
    overlay.classList.remove('hidden');
    successMessage.classList.remove('hidden');
    successMessage.classList.add('modal-enter');

    // Handle continue button
    continueBtn.addEventListener('click', () => {
        window.location.href = 'community.html';
    });

    // Auto redirect after 3 seconds
    setTimeout(() => {
        window.location.href = 'community.html';
    }, 3000);
}

function showError(message) {
    if (window.NotificationManager) {
        window.NotificationManager.error(message);
    } else if (window.WesalUtils && window.WesalUtils.showNotification) {
        window.WesalUtils.showNotification(message, 'error');
    } else {
        alert(message);
    }
}

function getStoredUsers() {
    try {
        const users = localStorage.getItem('wesal_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        return [];
    }
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function initializeFloatingParticles() {
    const particles = document.querySelectorAll('.floating-particle');
    
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * 1.5}s`;
        particle.style.animationDuration = `${8 + index * 2}s`;
        
        // Add random movement
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        particle.style.left = `${randomX}%`;
        particle.style.top = `${randomY}%`;
    });
}

// Initialize demo data if not exists
function initializeDemoData() {
    const existingUsers = getStoredUsers();
    if (existingUsers.length === 0) {
        const demoUsers = [
            {
                id: 'demo-user-1',
                name: 'سارة النور',
                email: 'sara@example.com',
                password: 'demo123',
                joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                awarenessLevel: 'المتوسط',
                awarenesTone: 75,
                interactionCount: 45,
                postsCount: 12,
                bio: 'متأملة نشطة في رحلة البحث عن السلام الداخلي',
                profileColor: 'blue-green'
            },
            {
                id: 'demo-user-2',
                name: 'أحمد الهادي',
                email: 'ahmed@example.com',
                password: 'demo123',
                joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                awarenessLevel: 'متقدم',
                awarenesTone: 120,
                interactionCount: 89,
                postsCount: 23,
                bio: 'باحث روحي ومعلم في فنون التأمل والوعي',
                profileColor: 'green-teal'
            }
        ];
        
        localStorage.setItem('wesal_users', JSON.stringify(demoUsers));
    }
}

// Initialize demo data on page load
initializeDemoData();
