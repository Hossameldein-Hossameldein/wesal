// Awareness Map JavaScript for Wesal
document.addEventListener('DOMContentLoaded', function() {
    initializeAwarenessMap();
    checkAuthenticationRequired();
});

let currentUser = null;
let awarenessLevels = [];
let currentLevel = 0;
let userProgress = {};

function initializeAwarenessMap() {
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize awareness levels
    initializeAwarenessLevels();
    
    // Load user progress
    loadUserProgress();
    
    // Setup UI
    setupEventListeners();
    renderAwarenessMap();
    updateProgressIndicator();
    
    // Initialize logout functionality
    setupLogout();
}

function checkAuthenticationRequired() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

function initializeAwarenessLevels() {
    awarenessLevels = [
        {
            id: 1,
            name: 'البداية - اليقظة الأولى',
            description: 'في هذا المستوى تبدأ رحلة الوعي الحقيقية. تتعلم كيفية ملاحظة أفكارك ومشاعرك دون الحكم عليها.',
            icon: '🌱',
            color: 'from-green-400 to-blue-500',
            position: { top: '80%', left: '10%' },
            requirements: [
                'إكمال تمرين التنفس الواعي',
                'ممارسة التأمل لمدة 5 دقائق يومياً لمدة 3 أيام',
                'كتابة منشور عن تجربتك الأولى'
            ],
            exercises: [
                {
                    title: 'تمرين التنفس الواعي',
                    description: 'اجلس في مكان هادئ واغمض عينيك. ركز على أنفاسك الطبيعية دون تغييرها. لاحظ كيف يدخل الهواء وكيف يخرج. إذا شرد ذهنك، أعده بلطف للتنفس.',
                    duration: '5 دقائق',
                    steps: [
                        'اجلس في وضعية مريحة',
                        'اغمض عينيك وتنفس طبيعياً',
                        'ركز على الشهيق والزفير',
                        'لاحظ الأحاسيس في جسدك',
                        'عندما يشرد الذهن، أعده للتنفس'
                    ]
                }
            ],
            minScore: 0,
            maxScore: 30
        },
        {
            id: 2,
            name: 'الاستبصار - فهم الذات',
            description: 'تطوير القدرة على فهم أنماط التفكير والسلوك الداخلية، والبدء في تحديد العوائق الذهنية.',
            icon: '🔍',
            color: 'from-blue-500 to-purple-500',
            position: { top: '65%', left: '25%' },
            requirements: [
                'إكمال تمرين مراقبة الأفكار',
                'تحديد 3 أنماط تفكير سلبية شخصية',
                'ممارسة التأمل لمدة 10 دقائق يومياً'
            ],
            exercises: [
                {
                    title: 'تمرين مراقبة الأفكار',
                    description: 'اجلس في صمت وراقب أفكارك كما لو كنت تراقب الغيوم في السماء. لا تتدخل أو تحكم، فقط راقب وسجل.',
                    duration: '10 دقائق',
                    steps: [
                        'اتخذ وضعية التأمل',
                        'اسمح للأفكار بالمرور',
                        'راقب بدون حكم',
                        'سجل الأنماط التي تلاحظها',
                        'اختتم بتنفس عميق'
                    ]
                }
            ],
            minScore: 31,
            maxScore: 60
        },
        {
            id: 3,
            name: 'التطهير - تحرير العوائق',
            description: 'العمل على تحرير العوائق العاطفية والذهنية القديمة التي تمنع النمو الروحي.',
            icon: '🌊',
            color: 'from-purple-500 to-pink-500',
            position: { top: '50%', left: '40%' },
            requirements: [
                'ممارسة تمرين التحرر العاطفي',
                'كتابة رسالة مسامحة للذات',
                'إكمال جلسة تأمل التطهير'
            ],
            exercises: [
                {
                    title: 'تمرين التحرر العاطفي',
                    description: 'تقنية لتحرير المشاعر المكبوتة والعوائق العاطفية من خلال التنفس والحركة الواعية.',
                    duration: '15 دقيقة',
                    steps: [
                        'تحديد المشاعر المكبوتة',
                        'التنفس العميق في منطقة الألم',
                        'السماح للمشاعر بالخروج',
                        'الحركة التعبيرية إذا لزم الأمر',
                        'الانتهاء بتأكيدات إيجابية'
                    ]
                }
            ],
            minScore: 61,
            maxScore: 100
        },
        {
            id: 4,
            name: 'التوازن - انسجام الطاقات',
            description: 'تحقيق التوازن بين جميع جوانب الحياة: الجسدية، العقلية، العاطفية، والروحية.',
            icon: '⚖️',
            color: 'from-pink-500 to-orange-400',
            position: { top: '35%', left: '55%' },
            requirements: [
                'ممارسة تمرين توازن الطاقات',
                'إنشاء روتين يومي متوازن',
                'إكمال تأمل الشاكرات السبع'
            ],
            exercises: [
                {
                    title: 'تمرين توازن الطاقات',
                    description: 'تمرين شامل لتنسيق وتوازن الطاقات في الجسم من خلال التنفس والتصور.',
                    duration: '20 دقيقة',
                    steps: [
                        'الاستلقاء في وضعية مريحة',
                        'التنفس في كل مركز طاقة',
                        'تصور الضوء يتحرك عبر الجسم',
                        'توازن الطاقات بالتنفس',
                        'إحكام الإغلاق بالامتنان'
                    ]
                }
            ],
            minScore: 101,
            maxScore: 140
        },
        {
            id: 5,
            name: 'الحكمة - المعرفة العميقة',
            description: 'تطوير الحكمة الداخلية والقدرة على رؤية الحقيقة وراء الأوهام والأشكال الظاهرية.',
            icon: '🦉',
            color: 'from-orange-400 to-yellow-400',
            position: { top: '20%', left: '70%' },
            requirements: [
                'دراسة النصوص الروحية العميقة',
                'ممارسة التأمل التحليلي',
                'مشاركة الحكمة مع الآخرين'
            ],
            exercises: [
                {
                    title: 'تأمل الحكمة الداخلية',
                    description: 'تمرين للوصول إلى مصدر الحكمة الداخلية والحصول على إرشادات من الذات العليا.',
                    duration: '25 دقيقة',
                    steps: [
                        'دخول في حالة تأمل عميق',
                        'طرح سؤال على الذات العليا',
                        'الاستماع للإجابات الداخلية',
                        'تسجيل الرؤى والإلهامات',
                        'تطبيق الحكمة في الحياة'
                    ]
                }
            ],
            minScore: 141,
            maxScore: 180
        },
        {
            id: 6,
            name: 'التنوير - الوعي الكامل',
            description: 'الوصول إلى حالة الوعي الكامل والاتحاد مع الوجود. هذا هو الهدف الأسمى للرحلة الروحية.',
            icon: '✨',
            color: 'from-yellow-400 to-white',
            position: { top: '5%', left: '85%' },
            requirements: [
                'العيش في حالة وعي مستمر',
                'خدمة الآخرين من مكان المحبة',
                'تجسيد الحكمة في كل لحظة'
            ],
            exercises: [
                {
                    title: 'تأمل الوحدة الكاملة',
                    description: 'الممارسة الأسمى للتأمل التي تؤدي إلى اختبار الوحدة مع كل ما هو موجود.',
                    duration: '30+ دقيقة',
                    steps: [
                        'تجاوز حدود الذات الشخصية',
                        'الذوبان في الوعي المطلق',
                        'اختبار الوحدة مع الوجود',
                        'العودة بالحكمة والمحبة',
                        'تجسيد النور في العالم'
                    ]
                }
            ],
            minScore: 181,
            maxScore: 200
        }
    ];
}

function loadUserProgress() {
    // Load progress from localStorage or initialize
    const storedProgress = localStorage.getItem('wesal_user_progress');
    if (storedProgress) {
        userProgress = JSON.parse(storedProgress);
    } else {
        userProgress = {
            currentLevel: 1,
            completedLevels: [],
            exercisesCompleted: [],
            totalScore: currentUser.awarenesTone || 0
        };
        saveUserProgress();
    }

    // Determine current level based on score
    currentLevel = awarenessLevels.find(level => 
        userProgress.totalScore >= level.minScore && userProgress.totalScore <= level.maxScore
    )?.id || 1;
}

function saveUserProgress() {
    localStorage.setItem('wesal_user_progress', JSON.stringify(userProgress));
    
    // Also update user's awareness tone
    currentUser.awarenesTone = userProgress.totalScore;
    localStorage.setItem('wesal_user', JSON.stringify(currentUser));
}

function setupEventListeners() {
    // Exercise modal buttons
    const closeExerciseModal = document.getElementById('close-exercise-modal');
    const completeExercise = document.getElementById('complete-exercise');
    const skipExercise = document.getElementById('skip-exercise');

    if (closeExerciseModal) closeExerciseModal.addEventListener('click', closeExerciseModal);
    if (completeExercise) completeExercise.addEventListener('click', handleCompleteExercise);
    if (skipExercise) skipExercise.addEventListener('click', closeExerciseModal);

    // Level detail modal buttons
    const closeLevelModal = document.getElementById('close-level-modal');
    const startLevel = document.getElementById('start-level');

    if (closeLevelModal) closeLevelModal.addEventListener('click', closeLevelDetailModal);
    if (startLevel) startLevel.addEventListener('click', handleStartLevel);

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

function renderAwarenessMap() {
    const levelsContainer = document.getElementById('awareness-levels');
    if (!levelsContainer) return;

    levelsContainer.innerHTML = awarenessLevels.map((level, index) => {
        const isCompleted = userProgress.completedLevels.includes(level.id);
        const isCurrent = currentLevel === level.id;
        const isAvailable = level.id <= currentLevel || isCompleted;
        
        return `
            <div class="absolute transform -translate-x-1/2 -translate-y-1/2" 
                 style="top: ${level.position.top}; left: ${level.position.left};">
                <div class="awareness-level-node ${isAvailable ? 'available' : 'locked'} ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}"
                     data-level-id="${level.id}"
                     onclick="handleLevelClick(${level.id})">
                    <div class="w-20 h-20 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}">
                        <span class="text-2xl">${level.icon}</span>
                    </div>
                    <div class="mt-3 text-center">
                        <div class="font-bold text-purple-900 text-sm mb-1">${level.name.split(' - ')[0]}</div>
                        <div class="text-purple-600 text-xs">${level.name.split(' - ')[1]}</div>
                        ${isCompleted ? '<div class="text-green-600 text-xs mt-1">✓ مكتمل</div>' : ''}
                        ${isCurrent ? '<div class="text-orange-600 text-xs mt-1">← موقعك الحالي</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateProgressIndicator() {
    const currentLevelName = document.getElementById('current-level-name');
    const overallProgress = document.getElementById('overall-progress');

    if (currentLevelName) {
        const level = awarenessLevels.find(l => l.id === currentLevel);
        currentLevelName.textContent = level ? level.name : 'المستوى الأول';
    }

    if (overallProgress) {
        const progressPercent = (userProgress.totalScore / 200) * 100;
        overallProgress.style.width = `${Math.min(progressPercent, 100)}%`;
    }
}

function handleLevelClick(levelId) {
    const level = awarenessLevels.find(l => l.id === levelId);
    if (!level) return;

    const isAvailable = levelId <= currentLevel || userProgress.completedLevels.includes(levelId);
    if (!isAvailable) {
        showNotification('يجب إكمال المستويات السابقة أولاً', 'error');
        return;
    }

    openLevelDetailModal(level);
}

function openLevelDetailModal(level) {
    const modal = document.getElementById('level-modal');
    const levelTitle = document.getElementById('level-title');
    const levelDescription = document.getElementById('level-description');
    const requirementsList = document.getElementById('requirements-list');

    if (levelTitle) levelTitle.textContent = level.name;
    if (levelDescription) levelDescription.textContent = level.description;
    
    if (requirementsList) {
        requirementsList.innerHTML = level.requirements.map(req => 
            `<li class="text-purple-600">${req}</li>`
        ).join('');
    }

    modal.classList.remove('hidden');
}

function closeLevelDetailModal() {
    const modal = document.getElementById('level-modal');
    modal.classList.add('hidden');
}

function handleStartLevel() {
    closeLevelDetailModal();
    const level = awarenessLevels.find(l => l.id === currentLevel);
    if (level && level.exercises.length > 0) {
        openExerciseModal(level.exercises[0]);
    }
}

function openExerciseModal(exercise) {
    const modal = document.getElementById('exercise-modal');
    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseContent = document.getElementById('exercise-content');

    if (exerciseTitle) exerciseTitle.textContent = exercise.title;
    
    if (exerciseContent) {
        exerciseContent.innerHTML = `
            <div class="space-y-4">
                <div class="bg-purple-50 rounded-xl p-4">
                    <h4 class="font-bold text-purple-900 mb-2">الوصف:</h4>
                    <p class="text-purple-700">${exercise.description}</p>
                </div>
                
                <div class="bg-blue-50 rounded-xl p-4">
                    <h4 class="font-bold text-blue-900 mb-2">المدة المقترحة: ${exercise.duration}</h4>
                </div>
                
                <div class="bg-green-50 rounded-xl p-4">
                    <h4 class="font-bold text-green-900 mb-3">خطوات التمرين:</h4>
                    <ol class="list-decimal list-inside space-y-2">
                        ${exercise.steps.map(step => `<li class="text-green-800">${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="bg-yellow-50 rounded-xl p-4">
                    <h4 class="font-bold text-yellow-900 mb-2">💡 نصيحة:</h4>
                    <p class="text-yellow-800">خذ وقتك ولا تستعجل. كل تجربة فريدة ومهمة في رحلتك.</p>
                </div>
            </div>
        `;
    }

    modal.classList.remove('hidden');
}

function closeExerciseModal() {
    const modal = document.getElementById('exercise-modal');
    modal.classList.add('hidden');
}

function handleCompleteExercise() {
    // Award points for completing exercise
    const pointsEarned = 10;
    userProgress.totalScore += pointsEarned;
    
    // Check if user advanced to next level
    const newLevel = awarenessLevels.find(level => 
        userProgress.totalScore >= level.minScore && userProgress.totalScore <= level.maxScore
    )?.id || currentLevel;

    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        userProgress.completedLevels.push(currentLevel - 1);
        showNotification(`🎉 تهانينا! وصلت للمستوى ${currentLevel}`, 'success');
    } else {
        showNotification(`✨ ممتاز! كسبت ${pointsEarned} نقطة وعي`, 'success');
    }

    // Save progress
    saveUserProgress();
    
    // Update UI
    updateProgressIndicator();
    renderAwarenessMap();
    
    closeExerciseModal();
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

function showNotification(message, type = 'info') {
    if (window.WesalUtils && window.WesalUtils.showNotification) {
        window.WesalUtils.showNotification(message, type);
    } else {
        console.log(message);
    }
}

// Add CSS for level nodes
const style = document.createElement('style');
style.textContent = `
    .awareness-level-node.available {
        transition: all 0.3s ease;
    }
    
    .awareness-level-node.available:hover {
        transform: translateY(-5px);
    }
    
    .awareness-level-node.current::after {
        content: '';
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 3px solid #F59E0B;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .awareness-level-node.completed::before {
        content: '✓';
        position: absolute;
        top: -10px;
        right: -10px;
        background: #10B981;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        z-index: 10;
    }
    
    @keyframes pulse {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
