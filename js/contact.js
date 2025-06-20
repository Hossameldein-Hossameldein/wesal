// Contact JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeContact();
    checkAuthenticationRequired();
});

let currentUser = null;
let chatMessages = [];
let isChatOpen = false;

function initializeContact() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI components
    setupEventListeners();
    initializeChat();
    setupFAQ();
    
    // Initialize logout functionality
    setupLogout();
}

function checkAuthenticationRequired() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

function setupEventListeners() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }

    // Chat functionality
    const openChatBtn = document.getElementById('open-chat');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const sendMessage = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');

    if (openChatBtn) openChatBtn.addEventListener('click', openChatInterface);
    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', closeChatInterface);
    if (sendMessage) sendMessage.addEventListener('click', sendChatMessage);
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Success message close
    const closeSuccess = document.getElementById('close-success');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeSuccessMessage);
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

async function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        inquiryType: document.getElementById('inquiry-type').value,
        message: document.getElementById('message').value.trim()
    };

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    if (!isValidEmail(formData.email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store message locally (in real app, this would go to server)
        const messageData = {
            ...formData,
            id: generateMessageId(),
            userId: currentUser.id,
            timestamp: new Date().toISOString(),
            status: 'submitted'
        };
        
        saveContactMessage(messageData);
        
        // Clear form
        e.target.reset();
        
        // Show success message
        showSuccessModal();
        
    } catch (error) {
        showNotification('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function initializeChat() {
    // Initialize chat with welcome message
    chatMessages = [
        {
            id: 'welcome',
            sender: 'bot',
            message: 'مرحبًا بك! أنا مساعد وصال الذكي. كيف يمكنني مساعدتك اليوم؟',
            timestamp: new Date().toISOString()
        }
    ];
    
    updateChatDisplay();
}

function openChatInterface() {
    const chatInterface = document.getElementById('chat-interface');
    if (chatInterface) {
        chatInterface.classList.remove('hidden');
        isChatOpen = true;
    }
}

function toggleChat() {
    const chatInterface = document.getElementById('chat-interface');
    if (chatInterface) {
        if (isChatOpen) {
            closeChatInterface();
        } else {
            openChatInterface();
        }
    }
}

function closeChatInterface() {
    const chatInterface = document.getElementById('chat-interface');
    if (chatInterface) {
        chatInterface.classList.add('hidden');
        isChatOpen = false;
    }
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;

    // Add user message
    const userMessage = {
        id: generateMessageId(),
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(userMessage);
    chatInput.value = '';
    updateChatDisplay();

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const botResponse = generateBotResponse(message);
    const botMessage = {
        id: generateMessageId(),
        sender: 'bot',
        message: botResponse,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(botMessage);
    updateChatDisplay();
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('تأمل') || message.includes('meditation')) {
        return 'التأمل رحلة جميلة نحو الداخل. يمكنك البدء بـ 5 دقائق يومياً من خلال زيارة خريطة الوعي أو المكتبة الروحية.';
    }
    
    if (message.includes('مساعدة') || message.includes('help')) {
        return 'أنا هنا لمساعدتك! يمكنني إرشادك في رحلتك الروحية، أو الإجابة على أسئلتك حول استخدام المنصة.';
    }
    
    if (message.includes('بداية') || message.includes('ابدأ')) {
        return 'مرحباً بك في بداية رحلتك! أنصحك بزيارة خريطة الوعي للبدء بالمستوى الأول، أو تصفح المكتبة للمحتوى التعليمي.';
    }
    
    if (message.includes('مشكلة') || message.includes('خطأ')) {
        return 'أعتذر عن أي مشاكل تواجهها. يمكنك إرسال تفاصيل المشكلة عبر نموذج التواصل وسيتم الرد عليك في أقرب وقت.';
    }
    
    if (message.includes('شكرا') || message.includes('شكراً')) {
        return 'العفو! أتمنى أن أكون قد ساعدتك. أي شيء آخر تحتاج إليه؟';
    }

    // Default responses
    const defaultResponses = [
        'هذا سؤال رائع! هل يمكنك توضيح أكثر حتى أستطيع مساعدتك بشكل أفضل؟',
        'أقدر اهتمامك. يمكنك أيضاً تصفح الأسئلة الشائعة أدناه للمزيد من المعلومات.',
        'أفهم استفسارك. للحصول على إجابة مفصلة، يمكنك إرسال رسالة عبر نموذج التواصل.',
        'شكراً لك على التواصل. هل تريد مني مساعدتك في شيء محدد؟'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function updateChatDisplay() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (!chatMessagesContainer) return;

    chatMessagesContainer.innerHTML = chatMessages.map(msg => {
        const isUser = msg.sender === 'user';
        return `
            <div class="chat-message ${isUser ? 'user' : 'bot'} p-3 rounded-lg max-w-[80%] ${isUser ? 'ml-auto bg-purple-600 text-white' : 'mr-auto bg-purple-100 text-purple-800'}">
                <p>${msg.message}</p>
                <div class="text-xs mt-1 opacity-70">${formatTime(msg.timestamp)}</div>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                icon.textContent = '−';
            } else {
                answer.classList.add('hidden');
                icon.textContent = '+';
            }
        });
    });
}

function showSuccessModal() {
    const successMessage = document.getElementById('success-message');
    const overlay = document.getElementById('overlay');
    
    if (successMessage && overlay) {
        overlay.classList.remove('hidden');
        successMessage.classList.remove('hidden');
        successMessage.classList.add('modal-enter');
    }
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const overlay = document.getElementById('overlay');
    
    if (successMessage && overlay) {
        overlay.classList.add('hidden');
        successMessage.classList.add('hidden');
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

function saveContactMessage(messageData) {
    try {
        const existingMessages = JSON.parse(localStorage.getItem('wesal_contact_messages') || '[]');
        existingMessages.push(messageData);
        localStorage.setItem('wesal_contact_messages', JSON.stringify(existingMessages));
    } catch (error) {
        console.error('Error saving contact message:', error);
    }
}

function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    if (window.WesalUtils && window.WesalUtils.showNotification) {
        window.WesalUtils.showNotification(message, type);
    } else {
        console.log(message);
    }
}
