// Library JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeLibrary();
    checkAuthenticationRequired();
});

let currentUser = null;
let allContent = [];
let savedContent = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 12;

function initializeLibrary() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize content and UI
    initializeContent();
    loadSavedContent();
    setupEventListeners();
    displayFeaturedContent();
    displayAllContent();
    updateSavedContentDisplay();
    
    // Initialize logout functionality
    setupLogout();
}

function checkAuthenticationRequired() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

function initializeContent() {
    allContent = [
        // Books
        {
            id: 'book_1',
            title: 'قوة الآن',
            description: 'دليل للتنوير الروحي والعيش في اللحظة الحاضرة. يعلمك كيفية التحرر من عقلك والوصول لحالة السلام الداخلي.',
            type: 'books',
            level: 'مبتدئ',
            duration: '4 ساعات قراءة',
            author: 'إيكهارت تول',
            featured: true,
            sections: [
                'فهم العقل والألم النفسي',
                'قوة اللحظة الحاضرة',
                'الدخول في الآن',
                'استراتيجيات التحول الذهني'
            ],
            content: `
                <h2>الفصل الأول: فهم العقل والألم النفسي</h2>
                <p>العقل البشري أداة رائعة، لكنه يمكن أن يصبح عبئاً عندما نتوحد معه بشكل كامل. معظم الألم النفسي الذي نواجهه ليس ضرورياً - إنه من صنع العقل نفسه.</p>
                
                <h3>التحرر من العقل</h3>
                <p>الخطوة الأولى نحو التحرر هي إدراك أنك لست عقلك. يمكنك مراقبة أفكارك دون أن تكون هذه الأفكار. هذا الوعي هو بداية الحرية الحقيقية.</p>
                
                <h3>الألم النفسي</h3>
                <p>الألم النفسي ينشأ من تعلقنا بالماضي أو قلقنا حول المستقبل. عندما نتعلم العيش في اللحظة الحاضرة، نكتشف أن معظم مشاكلنا موجودة فقط في أذهاننا.</p>
            `
        },
        {
            id: 'book_2',
            title: 'الطريق إلى الحب',
            description: 'رحلة في اكتشاف المحبة الحقيقية التي تبدأ من الداخل. كتاب يرشدك لفهم طبيعة الحب الإلهي والإنساني.',
            type: 'books',
            level: 'متوسط',
            duration: '3 ساعات قراءة',
            author: 'جلال الدين الرومي',
            featured: true,
            sections: [
                'حب الذات',
                'المحبة الإلهية',
                'العلاقات الواعية',
                'خدمة الآخرين'
            ],
            content: `
                <h2>الفصل الأول: حب الذات</h2>
                <p>المحبة الحقيقية تبدأ من الداخل. عندما نتعلم أن نحب أنفسنا حباً غير مشروط، نصبح قادرين على تقديم هذا الحب للعالم.</p>
                
                <h3>قبول الذات</h3>
                <p>قبول الذات لا يعني الرضا بالعيوب، بل يعني احتضان كامل لكل جانب من جوانب شخصيتنا - النور والظلال معاً.</p>
            `
        },
        {
            id: 'book_3',
            title: 'فن التأمل',
            description: 'دليل شامل لتعلم التأمل من البداية حتى الاحتراف. يحتوي على تقنيات متنوعة لجميع المستويات.',
            type: 'books',
            level: 'جميع المستويات',
            duration: '5 ساعات قراءة',
            author: 'ماتيو ريكارد',
            featured: false,
            sections: [
                'أسس التأمل',
                'تقنيات التنفس',
                'تأمل الوعي',
                'التأمل في الحياة اليومية'
            ]
        },

        // Audio meditations
        {
            id: 'audio_1',
            title: 'تأمل الصباح المنور',
            description: 'جلسة تأمل صباحية لبدء يومك بطاقة إيجابية وتركيز عالي. مناسبة للمبتدئين والمتقدمين.',
            type: 'audio',
            level: 'جميع المستويات',
            duration: '15 دقيقة',
            narrator: 'د. أمينة الصفا',
            featured: true,
            audioUrl: '#', // في تطبيق حقيقي، سيكون هذا رابط الملف الصوتي
            content: `
                <div class="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-6 text-center">
                    <h2 class="text-2xl font-bold text-orange-900 mb-4">🎵 تأمل الصباح المنور</h2>
                    <p class="text-orange-800 mb-6">جلسة تأمل هادئة لبدء يومك بسكينة وتركيز</p>
                    
                    <div class="bg-white/80 rounded-lg p-4 mb-6">
                        <div class="flex items-center justify-center space-x-reverse space-x-4 mb-4">
                            <button class="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors">
                                ▶️
                            </button>
                            <div class="flex-1">
                                <div class="bg-orange-200 h-2 rounded-full">
                                    <div class="bg-orange-600 h-2 rounded-full" style="width: 0%"></div>
                                </div>
                                <div class="flex justify-between text-sm text-orange-700 mt-1">
                                    <span>0:00</span>
                                    <span>15:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-right space-y-3 text-orange-800">
                        <h3 class="font-bold">محتوى الجلسة:</h3>
                        <ul class="space-y-2 text-sm">
                            <li>• تهيئة الجسد والعقل (3 دقائق)</li>
                            <li>• تمرين التنفس الواعي (5 دقائق)</li>
                            <li>• تأمل النور الداخلي (5 دقائق)</li>
                            <li>• تأكيدات إيجابية لليوم (2 دقيقة)</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 'audio_2',
            title: 'تأمل النوم العميق',
            description: 'جلسة مهدئة لإعداد العقل والجسم للنوم العميق والمريح. تساعد على التخلص من توتر اليوم.',
            type: 'audio',
            level: 'مبتدئ',
            duration: '20 دقيقة',
            narrator: 'د. يوسف السكون',
            featured: false,
            content: `
                <div class="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-6 text-center">
                    <h2 class="text-2xl font-bold text-indigo-900 mb-4">🌙 تأمل النوم العميق</h2>
                    <p class="text-indigo-800 mb-6">جلسة مهدئة لنوم هادئ ومريح</p>
                    <div class="bg-white/80 rounded-lg p-4">
                        <p class="text-indigo-700">هذا التأمل مصمم خصيصاً لمساعدتك على الاسترخاء والدخول في نوم عميق ومريح.</p>
                    </div>
                </div>
            `
        },

        // Articles
        {
            id: 'article_1',
            title: 'كيف تبدأ رحلة الوعي الذاتي',
            description: 'مقال شامل يوضح الخطوات الأولى لبدء رحلة اكتشاف الذات والوعي الروحي. مناسب للمبتدئين.',
            type: 'articles',
            level: 'مبتدئ',
            duration: '10 دقائق قراءة',
            author: 'فريق وصال',
            featured: true,
            content: `
                <article class="prose prose-lg max-w-none">
                    <h1>كيف تبدأ رحلة الوعي الذاتي</h1>
                    
                    <p class="lead">رحلة الوعي الذاتي هي أعظم مغامرة يمكن للإنسان أن يخوضها. إنها رحلة اكتشاف الذات الحقيقية والوصول للسلام الداخلي.</p>
                    
                    <h2>الخطوة الأولى: التوقف والملاحظة</h2>
                    <p>في عالم مليء بالضوضاء والمشتتات، الخطوة الأولى هي تعلم التوقف. خذ لحظات في يومك للتوقف وملاحظة ما يحدث داخلك وحولك.</p>
                    
                    <blockquote>
                        "بين المثير والاستجابة توجد مساحة. في هذه المساحة تكمن قوتنا في الاختيار. في اختيارنا تكمن حريتنا ونموّنا."
                    </blockquote>
                    
                    <h2>الخطوة الثانية: طرح الأسئلة العميقة</h2>
                    <p>ابدأ بطرح أسئلة عميقة على نفسك:</p>
                    <ul>
                        <li>من أنا حقاً وراء كل الأدوار التي ألعبها؟</li>
                        <li>ما الذي يحفزني حقاً في الحياة؟</li>
                        <li>ما هي قيمي الأساسية؟</li>
                        <li>كيف أريد أن أساهم في هذا العالم؟</li>
                    </ul>
                    
                    <h2>الخطوة الثالثة: ممارسة التأمل</h2>
                    <p>التأمل هو أداة قوية لتطوير الوعي الذاتي. ابدأ بـ 5 دقائق يومياً واتركها تنمو تدريجياً.</p>
                    
                    <h2>الخطوة الرابعة: المراقبة بدون حكم</h2>
                    <p>تعلم مراقبة أفكارك ومشاعرك دون إصدار أحكام. هذا يساعدك على فهم أنماط تفكيرك وسلوكك.</p>
                    
                    <h2>الخلاصة</h2>
                    <p>رحلة الوعي الذاتي مستمرة مدى الحياة. كن صبوراً مع نفسك واستمتع بكل خطوة في هذه الرحلة المقدسة.</p>
                </article>
            `
        },
        {
            id: 'article_2',
            title: 'قوة الامتنان في تغيير الحياة',
            description: 'استكشاف علمي وروحي لقوة الامتنان وكيف يمكن أن يحول حياتك بطرق مذهلة.',
            type: 'articles',
            level: 'متوسط',
            duration: '8 دقائق قراءة',
            author: 'د. نورا الحكيم',
            featured: false,
            content: `
                <article class="prose prose-lg max-w-none">
                    <h1>قوة الامتنان في تغيير الحياة</h1>
                    <p>الامتنان ليس مجرد شعور لطيف، بل هو قوة تحويلية حقيقية يمكنها تغيير حياتك جذرياً.</p>
                </article>
            `
        },

        // Exercises
        {
            id: 'exercise_1',
            title: 'تمرين التنفس 4-7-8',
            description: 'تقنية تنفس بسيطة وفعالة للاسترخاء وتهدئة الجهاز العصبي. مثالية لإدارة التوتر والقلق.',
            type: 'exercises',
            level: 'مبتدئ',
            duration: '5 دقائق',
            instructor: 'د. سلام النفس',
            featured: true,
            content: `
                <div class="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6">
                    <h2 class="text-2xl font-bold text-green-900 mb-4">🌬️ تمرين التنفس 4-7-8</h2>
                    
                    <div class="bg-white/80 rounded-lg p-4 mb-6">
                        <h3 class="font-bold text-green-800 mb-3">كيفية الممارسة:</h3>
                        <ol class="list-decimal list-inside space-y-2 text-green-700">
                            <li>اجلس في وضعية مريحة مع استقامة الظهر</li>
                            <li>ضع طرف لسانك خلف أسنانك العلوية</li>
                            <li>أخرج كل الهواء من رئتيك بقوة</li>
                            <li>أغمض فمك واستنشق من الأنف لمدة 4 عدات</li>
                            <li>احبس أنفاسك لمدة 7 عدات</li>
                            <li>أخرج الهواء من فمك لمدة 8 عدات</li>
                            <li>كرر الدورة 4 مرات</li>
                        </ol>
                    </div>
                    
                    <div class="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 class="font-bold text-blue-800 mb-2">الفوائد:</h4>
                        <ul class="list-disc list-inside space-y-1 text-blue-700">
                            <li>تقليل التوتر والقلق</li>
                            <li>تحسين جودة النوم</li>
                            <li>تهدئة الجهاز العصبي</li>
                            <li>زيادة التركيز</li>
                        </ul>
                    </div>
                    
                    <div class="bg-yellow-50 rounded-lg p-4">
                        <h4 class="font-bold text-yellow-800 mb-2">💡 نصائح مهمة:</h4>
                        <ul class="list-disc list-inside space-y-1 text-yellow-700">
                            <li>ابدأ بدورات قليلة وازد تدريجياً</li>
                            <li>لا تجبر نفسك إذا شعرت بالدوار</li>
                            <li>مارس التمرين يومياً للحصول على أفضل النتائج</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 'exercise_2',
            title: 'تأمل المسح الجسدي',
            description: 'تمرين شامل لتطوير الوعي الجسدي والتخلص من التوتر المخزن في العضلات.',
            type: 'exercises',
            level: 'متوسط',
            duration: '15 دقيقة',
            instructor: 'د. هدى الراحة',
            featured: false,
            content: `
                <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
                    <h2 class="text-2xl font-bold text-purple-900 mb-4">🧘‍♀️ تأمل المسح الجسدي</h2>
                    <p class="text-purple-800">تمرين لتطوير الوعي الجسدي والاسترخاء العميق</p>
                </div>
            `
        }
    ];
}

function loadSavedContent() {
    const saved = localStorage.getItem('wesal_saved_content');
    savedContent = saved ? JSON.parse(saved) : [];
    updateSavedCount();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleFilterChange(e.target.dataset.filter));
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreContent);
    }

    // Modal close buttons
    const closeContentModal = document.getElementById('close-content-modal');
    if (closeContentModal) {
        closeContentModal.addEventListener('click', closeContentDetailModal);
    }

    // Content viewer close button
    const closeViewer = document.getElementById('close-viewer');
    if (closeViewer) {
        closeViewer.addEventListener('click', closeContentViewer);
    }

    // Logout functionality
    setupLogout();
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

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredContent = allContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredContent);
}

function handleFilterChange(filter) {
    currentFilter = filter;
    currentPage = 1;

    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    displayAllContent();
}

function displayFeaturedContent() {
    const featuredContainer = document.getElementById('featured-content');
    if (!featuredContainer) return;

    const featured = allContent.filter(item => item.featured);
    
    featuredContainer.innerHTML = featured.map(item => createContentCard(item, true)).join('');
    
    // Add event listeners
    featured.forEach(item => {
        addContentCardListeners(item);
    });
}

function displayAllContent() {
    const allContentContainer = document.getElementById('all-content');
    if (!allContentContainer) return;

    let filteredContent = allContent;
    if (currentFilter !== 'all') {
        filteredContent = allContent.filter(item => item.type === currentFilter);
    }

    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const contentToShow = filteredContent.slice(startIndex, endIndex);

    allContentContainer.innerHTML = contentToShow.map(item => createContentCard(item)).join('');

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredContent.length ? 'none' : 'block';
    }

    // Add event listeners
    contentToShow.forEach(item => {
        addContentCardListeners(item);
    });
}

function createContentCard(item, isFeatured = false) {
    const isSaved = savedContent.includes(item.id);
    const typeIcon = getTypeIcon(item.type);
    const cardSize = isFeatured ? 'lg:col-span-1' : '';

    return `
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cardSize}" data-content-id="${item.id}">
            <div class="flex justify-between items-start mb-4">
                <div class="text-3xl">${typeIcon}</div>
                <button class="save-btn text-2xl ${isSaved ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors" data-content-id="${item.id}">
                    ${isSaved ? '⭐' : '☆'}
                </button>
            </div>
            
            <h3 class="text-xl font-bold text-purple-900 mb-2 cursor-pointer hover:text-purple-700 transition-colors" onclick="openContentDetail('${item.id}')">${item.title}</h3>
            
            <p class="text-purple-600 text-sm mb-4 line-clamp-3">${item.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">${getTypeLabel(item.type)}</span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">${item.level}</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">${item.duration}</span>
            </div>
            
            ${item.author ? `<div class="text-purple-500 text-sm mb-4">بواسطة: ${item.author}</div>` : ''}
            
            <div class="flex space-x-reverse space-x-3">
                <button class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors" onclick="startContent('${item.id}')">
                    ابدأ الآن
                </button>
                <button class="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors" onclick="openContentDetail('${item.id}')">
                    التفاصيل
                </button>
            </div>
        </div>
    `;
}

function addContentCardListeners(item) {
    const saveBtn = document.querySelector(`[data-content-id="${item.id}"].save-btn`);
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSaveContent(item.id);
        });
    }
}

function updateSavedContentDisplay() {
    const savedContainer = document.getElementById('saved-content');
    if (!savedContainer) return;

    if (savedContent.length === 0) {
        savedContainer.innerHTML = `
            <div class="col-span-full text-center py-8 text-purple-600">
                <div class="text-4xl mb-4">⭐</div>
                <p>لم تحفظ أي محتوى بعد</p>
                <p class="text-sm mt-2">اضغط على النجمة لحفظ المحتوى المفضل لديك</p>
            </div>
        `;
        return;
    }

    const saved = allContent.filter(item => savedContent.includes(item.id));
    savedContainer.innerHTML = saved.map(item => `
        <div class="bg-white/80 rounded-xl p-4 shadow-lg">
            <div class="text-2xl mb-2">${getTypeIcon(item.type)}</div>
            <h4 class="font-bold text-purple-900 text-sm mb-2">${item.title}</h4>
            <div class="flex justify-between items-center">
                <span class="text-purple-600 text-xs">${item.duration}</span>
                <button class="text-purple-600 hover:text-purple-800 transition-colors" onclick="startContent('${item.id}')">
                    ابدأ
                </button>
            </div>
        </div>
    `).join('');
}

function toggleSaveContent(contentId) {
    const index = savedContent.indexOf(contentId);
    if (index > -1) {
        savedContent.splice(index, 1);
        showNotification('تم إزالة المحتوى من نورك المحفوظ', 'info');
    } else {
        savedContent.push(contentId);
        showNotification('تم إضافة المحتوى إلى نورك المحفوظ ⭐', 'success');
    }
    
    localStorage.setItem('wesal_saved_content', JSON.stringify(savedContent));
    updateSavedCount();
    updateSavedContentDisplay();
    
    // Update save button
    const saveBtn = document.querySelector(`[data-content-id="${contentId}"].save-btn`);
    if (saveBtn) {
        const isSaved = savedContent.includes(contentId);
        saveBtn.textContent = isSaved ? '⭐' : '☆';
        saveBtn.className = `save-btn text-2xl ${isSaved ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`;
    }
}

function updateSavedCount() {
    const savedCount = document.getElementById('saved-count');
    if (savedCount) {
        savedCount.textContent = `${savedContent.length} محتوى محفوظ`;
    }
}

function openContentDetail(contentId) {
    const content = allContent.find(item => item.id === contentId);
    if (!content) return;

    const modal = document.getElementById('content-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDuration = document.getElementById('modal-duration');
    const modalLevel = document.getElementById('modal-level');
    const modalDescription = document.getElementById('modal-description');

    if (modalTitle) modalTitle.textContent = content.title;
    if (modalType) modalType.textContent = getTypeLabel(content.type);
    if (modalDuration) modalDuration.textContent = content.duration;
    if (modalLevel) modalLevel.textContent = content.level;
    if (modalDescription) modalDescription.textContent = content.description;

    // Update modal buttons
    const startContentBtn = document.getElementById('start-content');
    const saveContentBtn = document.getElementById('save-content');
    
    if (startContentBtn) {
        startContentBtn.onclick = () => {
            closeContentDetailModal();
            startContent(contentId);
        };
    }
    
    if (saveContentBtn) {
        const isSaved = savedContent.includes(contentId);
        saveContentBtn.textContent = isSaved ? 'محفوظ في نورك ⭐' : 'أضف إلى نوري ✨';
        saveContentBtn.onclick = () => toggleSaveContent(contentId);
    }

    modal.classList.remove('hidden');
}

function closeContentDetailModal() {
    const modal = document.getElementById('content-modal');
    modal.classList.add('hidden');
}

function startContent(contentId) {
    const content = allContent.find(item => item.id === contentId);
    if (!content) return;

    const viewer = document.getElementById('content-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerContent = document.getElementById('viewer-content');

    if (viewerTitle) viewerTitle.textContent = content.title;
    if (viewerContent) {
        viewerContent.innerHTML = content.content || `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">${getTypeIcon(content.type)}</div>
                <h2 class="text-2xl font-bold text-purple-900 mb-4">${content.title}</h2>
                <p class="text-purple-700 mb-6">${content.description}</p>
                <div class="bg-purple-100 rounded-xl p-4">
                    <p class="text-purple-800">هذا المحتوى قيد التطوير. سيكون متاحاً قريباً!</p>
                </div>
            </div>
        `;
    }

    viewer.classList.remove('hidden');
    
    // Track user engagement
    updateUserProgress(contentId);
}

function closeContentViewer() {
    const viewer = document.getElementById('content-viewer');
    viewer.classList.add('hidden');
}

function loadMoreContent() {
    currentPage++;
    displayAllContent();
}

function updateUserProgress(contentId) {
    // Update user's library progress
    const userProgress = JSON.parse(localStorage.getItem('wesal_library_progress') || '{}');
    if (!userProgress[contentId]) {
        userProgress[contentId] = {
            startedAt: new Date().toISOString(),
            progress: 0,
            completed: false
        };
    }
    
    userProgress[contentId].lastAccessed = new Date().toISOString();
    localStorage.setItem('wesal_library_progress', JSON.stringify(userProgress));
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

function getTypeIcon(type) {
    const icons = {
        'books': '📚',
        'audio': '🎵',
        'articles': '📝',
        'exercises': '🧘‍♀️'
    };
    return icons[type] || '📄';
}

function getTypeLabel(type) {
    const labels = {
        'books': 'كتاب',
        'audio': 'صوتي',
        'articles': 'مقال',
        'exercises': 'تمرين'
    };
    return labels[type] || 'محتوى';
}

function showNotification(message, type = 'info') {
    if (window.WesalUtils && window.WesalUtils.showNotification) {
        window.WesalUtils.showNotification(message, type);
    } else {
        console.log(message);
    }
}

// Make functions globally available
window.openContentDetail = openContentDetail;
window.startContent = startContent;
