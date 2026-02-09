// game.js - מנוע המשחק + Supabase Integration

// ═══════════════════════════════════════
// Supabase Init
// ═══════════════════════════════════════
const SUPABASE_URL = 'https://vrjrnnmbaankcococoeu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyanJubm1iYWFua2NvY29jb2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDU0MTgsImV4cCI6MjA4NjE4MTQxOH0.MtBgdNjF7EyCdK0IHA9aBWZpSTk1q3IajJMuerO7vno';
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const HEART_RECOVERY_MINUTES = 20;

// ═══════════════════════════════════════
// Sound Manager (Web Audio API)
// ═══════════════════════════════════════
class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('storyGameSound') !== 'off';
        this.ctx = null;
    }

    getContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.ctx;
    }

    play(type) {
        if (!this.enabled) return;
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();
            switch (type) {
                case 'correct': this._playCorrect(ctx); break;
                case 'wrong': this._playWrong(ctx); break;
                case 'levelUp': this._playLevelUp(ctx); break;
                case 'achievement': this._playAchievement(ctx); break;
                case 'click': this._playClick(ctx); break;
            }
        } catch (e) { /* audio not supported */ }
    }

    _playTone(ctx, freq, duration, type = 'sine', gain = 0.3) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.value = gain;
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    _playCorrect(ctx) {
        this._playTone(ctx, 523, 0.15, 'sine', 0.2);
        setTimeout(() => this._playTone(ctx, 659, 0.15, 'sine', 0.2), 100);
        setTimeout(() => this._playTone(ctx, 784, 0.2, 'sine', 0.25), 200);
    }

    _playWrong(ctx) {
        this._playTone(ctx, 200, 0.3, 'triangle', 0.2);
    }

    _playLevelUp(ctx) {
        [523, 587, 659, 784, 880].forEach((f, i) => {
            setTimeout(() => this._playTone(ctx, f, 0.2, 'sine', 0.2), i * 100);
        });
    }

    _playAchievement(ctx) {
        [784, 988, 1175].forEach((f, i) => {
            setTimeout(() => this._playTone(ctx, f, 0.25, 'sine', 0.15), i * 150);
        });
    }

    _playClick(ctx) {
        this._playTone(ctx, 600, 0.05, 'sine', 0.1);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('storyGameSound', this.enabled ? 'on' : 'off');
        return this.enabled;
    }
}

// ═══════════════════════════════════════
// Auth Manager
// ═══════════════════════════════════════
class AuthManager {
    constructor(game) {
        this.game = game;
        this.user = null;
        this.isGuest = false;
    }

    showLogin() {
        document.getElementById('auth-form-login').style.display = 'flex';
        document.getElementById('auth-form-register').style.display = 'none';
        this.clearError();
    }

    showRegister() {
        document.getElementById('auth-form-login').style.display = 'none';
        document.getElementById('auth-form-register').style.display = 'flex';
        this.clearError();
    }

    showError(msg) {
        const el = document.getElementById('auth-error');
        el.textContent = msg;
        el.style.display = 'block';
    }

    clearError() {
        document.getElementById('auth-error').style.display = 'none';
    }

    setLoading(btnId, loading) {
        const btn = document.getElementById(btnId);
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    async loginWithGoogle() {
        this.clearError();
        const { error } = await _supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) this.showError(error.message);
    }

    async loginWithEmail() {
        this.clearError();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        if (!email || !password) {
            this.showError('נא למלא אימייל וסיסמה');
            return;
        }
        this.setLoading('auth-login-btn', true);
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        this.setLoading('auth-login-btn', false);
        if (error) {
            this.showError('אימייל או סיסמה שגויים');
            return;
        }
        this.user = data.user;
        this.game.onAuthSuccess(data.user);
    }

    async registerWithEmail() {
        this.clearError();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        if (!email || !password) {
            this.showError('נא למלא אימייל וסיסמה');
            return;
        }
        if (password.length < 6) {
            this.showError('הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }
        this.setLoading('auth-register-btn', true);
        const { data, error } = await _supabase.auth.signUp({ email, password });
        this.setLoading('auth-register-btn', false);
        if (error) {
            this.showError(error.message);
            return;
        }
        this.user = data.user;
        this.game.onAuthSuccess(data.user);
    }

    async continueAsGuest() {
        this.isGuest = true;
        this.user = null;
        this.game.onAuthSuccess(null);
    }

    async logout() {
        await _supabase.auth.signOut();
        this.user = null;
        this.isGuest = false;
        this.game.hideUserMenu();
        // Show auth screen
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('app-header').style.display = 'none';
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('progress-wrapper').style.display = 'none';
    }

    async checkSession() {
        const { data: { session } } = await _supabase.auth.getSession();
        if (session?.user) {
            this.user = session.user;
            return session.user;
        }
        return null;
    }
}

// ═══════════════════════════════════════
// Main Game Class
// ═══════════════════════════════════════
class StoryGame {
    constructor() {
        this.currentScreen = 'home';
        this.currentModule = null;
        this.currentLesson = null;
        this.currentExerciseIndex = 0;
        this.selectedAnswer = null;
        this.exerciseAnswered = false;
        this.isDailyChallenge = false;
        this.lessonMistakes = 0;
        this.onboardingStep = 0;
        this.saveDebounceTimer = null;
        this.heartTimerInterval = null;
        this.userMenuOpen = false;

        // Managers
        this.sound = new SoundManager();
        this.authManager = new AuthManager(this);

        // Player data (loaded later)
        this.playerData = this.getDefaultPlayerData();

        // Story builder
        this.storyBuilderData = { currentStep: 0, answers: {} };

        // Story steps
        this.storySteps = [
            {
                id: 'target',
                title: 'שלב 1: קהל היעד',
                question: 'למי הסיפור הזה מיועד? תארו את הלקוח האידיאלי שלכם.',
                hint: 'חשבו: מה הכאב שלהם? מה הם מחפשים? מה מעכב אותם?',
                example: 'מאמנות עסקיות בתחילת הדרך שיודעות שהן טובות במה שהן עושות, אבל מתקשות למכור את עצמן ומרגישות לא אותנטיות כשהן מנסות לשווק.',
                mentorMessage: 'מעולה שהתחלנו! הכרת קהל היעד היא הבסיס לכל סיפור טוב. ככל שתהיו יותר ספציפיים, הסיפור ידבר ישירות ללב שלהם.'
            },
            {
                id: 'before',
                title: 'שלב 2: הלפני - הכאב',
                question: 'תארו את המצב של הלקוח לפני שפגש אתכם. מה היה הכאב? מה הוא הרגיש?',
                hint: 'השתמשו בתיאורים רגשיים וספציפיים. מה הוא חשב? מה הוא עשה? איך זה השפיע על החיים שלו?',
                example: 'היא הייתה יושבת מול המחשב שעות, מנסה לכתוב פוסט לפייסבוק. כל מילה הרגישה מזויפת. "מי אני בכלל שאגיד לאנשים מה לעשות?" היא שאלה את עצמה. בלילות היא שכבה ערה וחשבה על כל הכסף שהשקיעה בהכשרה - ועל אפס הלקוחות שיש לה.',
                mentorMessage: 'זה השלב הכי חשוב! ככל שתתארו את הכאב בצורה מדויקת יותר, הקהל ירגיש "וואו, היא מבינה אותי". זה מה שיוצר אמון.'
            },
            {
                id: 'turning',
                title: 'שלב 3: נקודת המפנה',
                question: 'מה היה הרגע שבו משהו השתנה? מה קרה שהוביל לשינוי?',
                hint: 'זה יכול להיות: פגישה ראשונה, תובנה פתאומית, רגע של החלטה, או אירוע מסוים.',
                example: 'בפגישה השלישית שלנו, שאלתי אותה שאלה פשוטה: "מה היית אומרת לחברה הכי טובה שלך שמרגישה ככה?" היא ענתה מיד, בלי להסס, במילים הכי אותנטיות שאפשר. "זה!" אמרתי לה, "ככה את צריכה לדבר עם הקהל שלך."',
                mentorMessage: 'נקודת המפנה היא הלב של הסיפור. כאן הקהל מבין שיש דרך אחרת - ושאתם יודעים להוביל אותה.'
            },
            {
                id: 'after',
                title: 'שלב 4: האחרי - השינוי',
                question: 'מה השתנה? איך נראים החיים של הלקוח היום?',
                hint: 'היו ספציפיים: מספרים, הרגשות, שינויים קונקרטיים. מה הוא יכול לעשות עכשיו שלא יכל קודם?',
                example: 'היום, 6 חודשים אחרי, יש לה 12 לקוחות קבועים. אבל יותר חשוב - היא כותבת פוסטים בהנאה. "אני פשוט מדברת כמו שאני מדברת עם חברות," היא סיפרה לי בשיחה האחרונה, "ואנשים מגיבים כאילו אני קוראת להם את המחשבות."',
                mentorMessage: 'ה"אחרי" צריך להיות ספציפי ומדיד. לא "היא מרגישה טוב יותר" אלא תוצאות קונקרטיות שהקהל יכול לדמיין לעצמו.'
            },
            {
                id: 'message',
                title: 'שלב 5: המסר והקריאה לפעולה',
                question: 'מה המסר המרכזי שאתם רוצים שהקהל ייקח? ומה הצעד הבא שאתם מזמינים אותם לעשות?',
                hint: 'המסר צריך להיות משפט אחד חזק. הקריאה לפעולה צריכה להיות ספציפית וקלה לביצוע.',
                example: 'אם גם את מרגישה שיש לך המון לתת אבל לא יודעת איך להגיד את זה בלי להרגיש מזויפת - את לא לבד, ויש דרך אחרת. אני מזמינה אותך לשיחת היכרות קצרה, בלי התחייבות, רק לראות אם אני יכולה לעזור.',
                mentorMessage: 'סיום חזק = לקוחות שפועלים! המסר צריך לתת תקווה, והקריאה לפעולה צריכה להיות רכה אבל ברורה.'
            }
        ];

        // Mentor messages
        this.mentorMessages = {
            welcome: [
                "היי! אני גל, ואני כאן ללוות אותך בדרך להפוך לסטוריטלר מעולה!",
                "ברוכים הבאים! אני גל, המנטור שלך לסיפורים שמושכים לקוחות.",
                "שמח לראות אותך! יחד נלמד ליצור סיפורים שמשנים עסקים."
            ],
            moduleIntro: {
                1: "פתיחה טובה היא חצי מהדרך! בואו נלמד איך לגרום לקהל לרצות לשמוע עוד.",
                2: "סיפורי טרנספורמציה של לקוחות הם הכלי השיווקי החזק ביותר שיש. מוכנים?",
                3: "פגיעות היא לא חולשה - היא סופר-פאוור! בואו נלמד להשתמש בה.",
                4: "נקודת המפנה היא הרגע הקסום שבו הקהל מבין שהשינוי אפשרי. בואו!",
                5: "סיום חזק = לקוחות שפועלים. זה השיעור האחרון והוא קריטי!"
            },
            lessonStart: [
                "מעולה! בואו נתחיל. קחו את הזמן, אין לחץ.",
                "אני לצידך בכל שלב. בהצלחה!",
                "זוכרים - כל תשובה נכונה מקרבת אתכם להיות מספרי סיפורים מדהימים!"
            ],
            correctAnswer: [
                "מדהים! בדיוק ככה!",
                "וואו, את/ה ממש תופס/ת את זה!",
                "נכון מאוד! רואים שיש לך אינסטינקט טוב!",
                "יופי! הלקוחות שלך ישמחו לשמוע סיפורים כאלה!",
                "מצוין! את/ה בדרך הנכונה!"
            ],
            wrongAnswer: [
                "לא נורא! טעויות הן חלק מהלמידה.",
                "קרוב! בפעם הבאה תנסו לחשוב מה היה מושך אתכם כלקוחות.",
                "לא בדיוק, אבל זו הזדמנות ללמוד משהו חדש!",
                "אל דאגה, גם אני טעיתי המון בהתחלה!"
            ],
            encouragement: [
                "את/ה עושה עבודה נהדרת!",
                "כל תרגיל מקרב אותך למטרה!",
                "אני גאה בך!",
                "המשיכו ככה!"
            ],
            lessonComplete: [
                "איזה כיף! סיימת שיעור נוסף!",
                "מעולה! עוד צעד לקראת סיפורים שמושכים לקוחות!",
                "אלופים! הידע הזה ישנה לכם את השיווק!"
            ]
        };

        // Achievements
        this.achievements = [
            { id: 'first_lesson', title: 'צעד ראשון', desc: 'סיימת את השיעור הראשון', icon: '🎯', condition: (data) => Object.keys(data.completedLessons).length >= 1 },
            { id: 'five_lessons', title: 'בדרך הנכונה', desc: 'סיימת 5 שיעורים', icon: '📚', condition: (data) => Object.keys(data.completedLessons).length >= 5 },
            { id: 'all_lessons', title: 'מאסטר', desc: 'סיימת את כל השיעורים', icon: '👑', condition: (data) => Object.keys(data.completedLessons).length >= 15 },
            { id: 'streak_3', title: 'התמדה', desc: '3 ימים ברצף', icon: '🔥', condition: (data) => data.streak >= 3 },
            { id: 'streak_7', title: 'שבוע של הצלחה', desc: '7 ימים ברצף', icon: '⭐', condition: (data) => data.streak >= 7 },
            { id: 'streak_30', title: 'מחויבות אמיתית', desc: '30 ימים ברצף', icon: '💎', condition: (data) => data.streak >= 30 },
            { id: 'xp_500', title: 'צובר נקודות', desc: 'צברת 500 XP', icon: '🏅', condition: (data) => data.xp >= 500 },
            { id: 'xp_1000', title: 'אלוף XP', desc: 'צברת 1000 XP', icon: '🏆', condition: (data) => data.xp >= 1000 },
            { id: 'first_story', title: 'סיפור ראשון', desc: 'יצרת סיפור בתרגול חופשי', icon: '✍️', condition: (data) => data.storiesCreated >= 1 },
            { id: 'five_stories', title: 'סופר מספר', desc: 'יצרת 5 סיפורים', icon: '📖', condition: (data) => data.storiesCreated >= 5 },
            { id: 'perfect_lesson', title: 'מושלם!', desc: 'סיימת שיעור בלי טעויות', icon: '💯', condition: (data) => data.perfectLessons >= 1 },
            { id: 'accuracy_80', title: 'דיוק גבוה', desc: 'דיוק של 80% ומעלה', icon: '🎯', condition: (data) => data.totalCorrectAnswers > 0 && (data.totalCorrectAnswers / (data.totalCorrectAnswers + data.totalWrongAnswers)) >= 0.8 }
        ];

        // Init ripple effect on all interactive elements
        this.initRipple();

        // Init auth flow
        this.initAuth();
    }

    // ═══════════════════════════════════════
    // Ripple Effect
    // ═══════════════════════════════════════
    initRipple() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .option-btn, .word-chip, .compare-card, .module-card, .lesson-item, .daily-challenge-btn, .practice-mode-btn, .path-node:not(.locked), .home-path-node:not(.locked)');
            if (!target) return;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // ═══════════════════════════════════════
    // Auth Flow
    // ═══════════════════════════════════════
    async initAuth() {
        // Show loading
        document.getElementById('auth-screen').style.display = 'flex';

        // Check existing session
        const user = await this.authManager.checkSession();
        if (user) {
            this.onAuthSuccess(user);
        }
        // else: auth screen stays visible, wait for user action

        // Listen for auth state changes (handles Google redirect)
        _supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user && !this.authManager.user) {
                this.authManager.user = session.user;
                this.onAuthSuccess(session.user);
            }
        });
    }

    async onAuthSuccess(user) {
        // Show loading screen
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('loading-screen').style.display = 'flex';

        // Load player data
        await this.loadPlayerData(user);

        // Hide loading, show game
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app-header').style.display = 'block';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('progress-wrapper').style.display = 'block';

        // Update user menu email
        if (user) {
            document.getElementById('user-menu-email').textContent = user.email || 'משתמש';
        } else {
            document.getElementById('user-menu-email').textContent = 'מצב אורח';
        }

        // Update sound toggle
        document.getElementById('sound-toggle').textContent = this.sound.enabled ? '🔊' : '🔇';

        // Init game
        this.updateStreak();
        this.recoverHearts();
        this.updateStatsDisplay();
        this.startHeartTimer();

        // Check onboarding
        if (!this.playerData.onboardingComplete) {
            this.showOnboarding();
        } else {
            this.renderHomeScreen();
        }
    }

    // ═══════════════════════════════════════
    // Data Persistence (Supabase + LocalStorage)
    // ═══════════════════════════════════════
    getDefaultPlayerData() {
        return {
            xp: 0,
            level: 1,
            hearts: 5,
            maxHearts: 5,
            streak: 0,
            lastPlayDate: null,
            lastHeartLost: null,
            completedLessons: {},
            moduleProgress: {},
            achievements: [],
            totalCorrectAnswers: 0,
            totalWrongAnswers: 0,
            storiesCreated: 0,
            perfectLessons: 0,
            dailyChallengeCompleted: null,
            reviewQueue: [],
            lastReviewDate: null,
            onboardingComplete: false,
            longestStreak: 0,
            weeklyActivity: {},
            moduleAccuracy: {},
            perfectLessonsList: []
        };
    }

    async loadPlayerData(user) {
        // Try Supabase first if logged in
        if (user) {
            try {
                const { data, error } = await _supabase
                    .from('story_game_players')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (data && !error) {
                    // Map DB fields to local playerData
                    this.playerData = {
                        xp: data.xp || 0,
                        level: data.level || 1,
                        hearts: data.hearts || 5,
                        maxHearts: data.max_hearts || 5,
                        streak: data.streak || 0,
                        lastPlayDate: data.last_play_date || null,
                        lastHeartLost: data.last_heart_lost || null,
                        completedLessons: data.completed_lessons || {},
                        moduleProgress: {},
                        achievements: data.achievements || [],
                        totalCorrectAnswers: data.total_correct || 0,
                        totalWrongAnswers: data.total_wrong || 0,
                        storiesCreated: data.stories_created || 0,
                        perfectLessons: data.perfect_lessons || 0,
                        dailyChallengeCompleted: data.daily_challenge_completed || null,
                        reviewQueue: [],
                        lastReviewDate: null,
                        onboardingComplete: true // if they have DB data, onboarding was done
                    };
                    // Also cache to localStorage
                    localStorage.setItem('storyGameData', JSON.stringify(this.playerData));
                    return;
                }

                // No DB row yet — check localStorage for migration
                const local = this.loadFromLocalStorage();
                if (local && Object.keys(local.completedLessons).length > 0) {
                    // Migrate local data to Supabase
                    this.playerData = local;
                    await this.createSupabaseRow(user);
                    return;
                }

                // Brand new user
                this.playerData = this.getDefaultPlayerData();
                await this.createSupabaseRow(user);
                return;
            } catch (e) {
                console.warn('Supabase load failed, falling back to localStorage', e);
            }
        }

        // Guest mode or Supabase failed — use localStorage
        this.playerData = this.loadFromLocalStorage() || this.getDefaultPlayerData();
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('storyGameData');
            if (saved) return JSON.parse(saved);
        } catch (e) { /* ignore */ }
        return null;
    }

    async createSupabaseRow(user) {
        if (!user) return;
        try {
            await _supabase.from('story_game_players').upsert({
                user_id: user.id,
                xp: this.playerData.xp,
                level: this.playerData.level,
                hearts: this.playerData.hearts,
                max_hearts: this.playerData.maxHearts,
                streak: this.playerData.streak,
                last_play_date: this.playerData.lastPlayDate,
                last_heart_lost: this.playerData.lastHeartLost,
                completed_lessons: this.playerData.completedLessons,
                achievements: this.playerData.achievements,
                total_correct: this.playerData.totalCorrectAnswers,
                total_wrong: this.playerData.totalWrongAnswers,
                stories_created: this.playerData.storiesCreated,
                perfect_lessons: this.playerData.perfectLessons,
                daily_challenge_completed: this.playerData.dailyChallengeCompleted
            }, { onConflict: 'user_id' });
        } catch (e) {
            console.warn('Failed to create Supabase row', e);
        }
    }

    savePlayerData() {
        // Always save to localStorage immediately
        localStorage.setItem('storyGameData', JSON.stringify(this.playerData));

        // Debounced save to Supabase
        if (this.authManager.user) {
            clearTimeout(this.saveDebounceTimer);
            this.saveDebounceTimer = setTimeout(() => this.saveToSupabase(), 1000);
        }
    }

    async saveToSupabase() {
        if (!this.authManager.user) return;
        try {
            await _supabase.from('story_game_players').update({
                xp: this.playerData.xp,
                level: this.playerData.level,
                hearts: this.playerData.hearts,
                max_hearts: this.playerData.maxHearts,
                streak: this.playerData.streak,
                last_play_date: this.playerData.lastPlayDate,
                last_heart_lost: this.playerData.lastHeartLost,
                completed_lessons: this.playerData.completedLessons,
                achievements: this.playerData.achievements,
                total_correct: this.playerData.totalCorrectAnswers,
                total_wrong: this.playerData.totalWrongAnswers,
                stories_created: this.playerData.storiesCreated,
                perfect_lessons: this.playerData.perfectLessons,
                daily_challenge_completed: this.playerData.dailyChallengeCompleted,
                updated_at: new Date().toISOString()
            }).eq('user_id', this.authManager.user.id);
        } catch (e) {
            console.warn('Supabase save failed', e);
        }
    }

    // ═══════════════════════════════════════
    // Heart Recovery System
    // ═══════════════════════════════════════
    recoverHearts() {
        if (this.playerData.hearts >= this.playerData.maxHearts) {
            this.playerData.lastHeartLost = null;
            return;
        }
        if (!this.playerData.lastHeartLost) return;

        const lostTime = new Date(this.playerData.lastHeartLost).getTime();
        const now = Date.now();
        const elapsed = now - lostTime;
        const recovered = Math.floor(elapsed / (HEART_RECOVERY_MINUTES * 60 * 1000));

        if (recovered > 0) {
            this.playerData.hearts = Math.min(
                this.playerData.maxHearts,
                this.playerData.hearts + recovered
            );
            if (this.playerData.hearts >= this.playerData.maxHearts) {
                this.playerData.lastHeartLost = null;
            } else {
                // Advance the timestamp by recovered hearts
                const newTime = lostTime + recovered * HEART_RECOVERY_MINUTES * 60 * 1000;
                this.playerData.lastHeartLost = new Date(newTime).toISOString();
            }
            this.savePlayerData();
        }
    }

    startHeartTimer() {
        if (this.heartTimerInterval) clearInterval(this.heartTimerInterval);
        this.heartTimerInterval = setInterval(() => this.updateHeartTimer(), 1000);
        this.updateHeartTimer();
    }

    updateHeartTimer() {
        const bar = document.getElementById('heart-timer-bar');
        if (this.playerData.hearts >= this.playerData.maxHearts || !this.playerData.lastHeartLost) {
            bar.style.display = 'none';
            return;
        }

        bar.style.display = 'block';
        const lostTime = new Date(this.playerData.lastHeartLost).getTime();
        const now = Date.now();
        const elapsed = now - lostTime;
        const totalMs = HEART_RECOVERY_MINUTES * 60 * 1000;
        const remaining = totalMs - (elapsed % totalMs);
        const progress = ((totalMs - remaining) / totalMs) * 100;

        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);

        document.getElementById('heart-timer-text').textContent =
            `❤️ +1 בעוד ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        document.getElementById('heart-timer-fill').style.width = progress + '%';

        // Check if a heart recovered
        if (elapsed >= totalMs) {
            this.recoverHearts();
            this.updateStatsDisplay();
        }
    }

    // ═══════════════════════════════════════
    // Onboarding
    // ═══════════════════════════════════════
    showOnboarding() {
        this.onboardingStep = 0;
        document.getElementById('onboarding-overlay').style.display = 'flex';
        this.renderOnboardingStep();
    }

    renderOnboardingStep() {
        const steps = [
            {
                icon: '🎯',
                title: 'ברוכים הבאים לסטורי גיים!',
                text: 'כאן תלמדו ליצור סיפורים שמושכים לקוחות - צעד אחרי צעד, בדרך כיפית ואינטראקטיבית.'
            },
            {
                icon: '👨‍🏫',
                title: 'הכירו את גל, המנטור שלכם',
                text: 'גל ילווה אתכם בכל שלב - ייתן טיפים, עידוד, ויעזור לכם להבין מה הופך סיפור לכלי שיווקי חזק.'
            },
            {
                icon: '🚀',
                title: 'בואו נתחיל!',
                text: 'תרגלו תרגילים, צברו XP, שמרו על סטריק יומי ופתחו הישגים. מוכנים?'
            }
        ];

        const step = steps[this.onboardingStep];
        const content = document.getElementById('onboarding-step-content');
        content.innerHTML = `
            <span class="onboarding-icon">${step.icon}</span>
            <h2>${step.title}</h2>
            <p>${step.text}</p>
        `;

        // Dots
        const dotsEl = document.getElementById('onboarding-dots');
        dotsEl.innerHTML = steps.map((_, i) => {
            let cls = 'onboarding-dot';
            if (i < this.onboardingStep) cls += ' done';
            if (i === this.onboardingStep) cls += ' active';
            return `<div class="${cls}"></div>`;
        }).join('');

        // Button text
        const btn = document.getElementById('onboarding-btn');
        btn.textContent = this.onboardingStep === steps.length - 1 ? 'בואו נתחיל! 🎉' : 'הבא';
    }

    nextOnboardingStep() {
        this.sound.play('click');
        this.onboardingStep++;
        if (this.onboardingStep >= 3) {
            // Done
            document.getElementById('onboarding-overlay').style.display = 'none';
            this.playerData.onboardingComplete = true;
            this.savePlayerData();
            this.renderHomeScreen();
        } else {
            this.renderOnboardingStep();
        }
    }

    // ═══════════════════════════════════════
    // Screen Transitions
    // ═══════════════════════════════════════
    transitionTo(renderFn) {
        const container = document.getElementById('game-container');
        container.classList.add('fade-out');
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            renderFn.call(this);
            container.classList.remove('fade-out');
        }, 200);
    }

    // ═══════════════════════════════════════
    // Sound Toggle
    // ═══════════════════════════════════════
    toggleSound() {
        const enabled = this.sound.toggle();
        document.getElementById('sound-toggle').textContent = enabled ? '🔊' : '🔇';
        if (enabled) this.sound.play('click');
    }

    // ═══════════════════════════════════════
    // User Menu
    // ═══════════════════════════════════════
    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
        document.getElementById('user-menu').style.display = this.userMenuOpen ? 'block' : 'none';
        if (this.userMenuOpen) {
            // Close on click outside
            setTimeout(() => {
                const handler = (e) => {
                    if (!e.target.closest('.user-menu') && !e.target.closest('.user-menu-btn')) {
                        this.hideUserMenu();
                        document.removeEventListener('click', handler);
                    }
                };
                document.addEventListener('click', handler);
            }, 10);
        }
    }

    hideUserMenu() {
        this.userMenuOpen = false;
        document.getElementById('user-menu').style.display = 'none';
    }

    // ═══════════════════════════════════════
    // Mentor HTML
    // ═══════════════════════════════════════
    createMentorHTML(message, showName = true, mood = 'idle') {
        return `
            <div class="mentor-container mentor-enter">
                <div class="mentor-avatar mentor-${mood}">
                    <img src="mentor-gal.png" alt="גל" />
                </div>
                <div class="mentor-bubble">
                    ${showName ? '<div class="mentor-name">גל - המנטור שלך</div>' : ''}
                    <div class="mentor-message">${message}</div>
                </div>
            </div>
        `;
    }

    animateMentor(mood) {
        const avatar = document.querySelector('.mentor-avatar');
        if (!avatar) return;
        avatar.className = 'mentor-avatar';
        void avatar.offsetWidth; // force reflow
        avatar.classList.add(`mentor-${mood}`);
    }

    getRandomMessage(messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    // ═══════════════════════════════════════
    // Streak
    // ═══════════════════════════════════════
    updateStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.playerData.lastPlayDate;

        if (lastPlay) {
            const lastDate = new Date(lastPlay);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastPlay === today) {
                // already played today
            } else if (lastDate.toDateString() === yesterday.toDateString()) {
                this.playerData.streak++;
                this.playerData.lastPlayDate = today;
                this.savePlayerData();
            } else {
                this.playerData.streak = 1;
                this.playerData.lastPlayDate = today;
                this.savePlayerData();
            }
        } else {
            this.playerData.streak = 1;
            this.playerData.lastPlayDate = today;
            this.savePlayerData();
        }

        // Track longest streak
        if (this.playerData.streak > (this.playerData.longestStreak || 0)) {
            this.playerData.longestStreak = this.playerData.streak;
            this.savePlayerData();
        }
    }

    // ═══════════════════════════════════════
    // Stats Display
    // ═══════════════════════════════════════
    updateStatsDisplay() {
        document.getElementById('xp-value').textContent = this.playerData.xp;
        document.getElementById('streak-value').textContent = this.playerData.streak;
        this.renderHearts();
    }

    renderHearts() {
        const container = document.getElementById('hearts-container');
        let html = '';
        for (let i = 0; i < this.playerData.maxHearts; i++) {
            const isEmpty = i >= this.playerData.hearts;
            html += `<span class="heart ${isEmpty ? 'empty' : ''}">❤️</span>`;
        }
        container.innerHTML = html;
    }

    // ═══════════════════════════════════════
    // Level System
    // ═══════════════════════════════════════
    calculateLevel() {
        const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000];
        for (let i = xpThresholds.length - 1; i >= 0; i--) {
            if (this.playerData.xp >= xpThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    getLevelName(level) {
        const names = ['מתחיל', 'מספר סיפורים', 'מעורר השראה', 'מחבר קהל', 'מומחה שיווק', 'אמן סטוריטלינג', 'מגנט לקוחות', 'אגדה'];
        return names[level - 1] || 'אגדה';
    }

    getLevelProgressInfo() {
        const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000];
        const currentLevel = this.playerData.level;
        const currentXP = this.playerData.xp;
        const currentThreshold = xpThresholds[currentLevel - 1] || 0;
        const nextThreshold = xpThresholds[currentLevel] || xpThresholds[xpThresholds.length - 1];
        const xpInLevel = currentXP - currentThreshold;
        const xpNeeded = nextThreshold - currentThreshold;
        const progress = Math.min(100, (xpInLevel / xpNeeded) * 100);
        const xpToNext = nextThreshold - currentXP;
        return { progress, xpToNext: Math.max(0, xpToNext), currentXP, nextThreshold };
    }

    // ═══════════════════════════════════════
    // Achievements
    // ═══════════════════════════════════════
    renderAchievementsGrid() {
        return this.achievements.slice(0, 8).map(achievement => {
            const isUnlocked = this.playerData.achievements.includes(achievement.id);
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.title}</div>
                </div>
            `;
        }).join('');
    }

    checkAchievements() {
        let newAchievements = [];
        this.achievements.forEach(achievement => {
            if (!this.playerData.achievements.includes(achievement.id) && achievement.condition(this.playerData)) {
                this.playerData.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        });
        if (newAchievements.length > 0) {
            this.savePlayerData();
            this.showAchievementPopup(newAchievements[0]);
        }
    }

    showAchievementPopup(achievement) {
        this.sound.play('achievement');
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-icon">${achievement.icon}</div>
            <div class="achievement-popup-content">
                <div class="achievement-popup-title">הישג חדש!</div>
                <div class="achievement-popup-name">${achievement.title}</div>
                <div class="achievement-popup-desc">${achievement.desc}</div>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }

    // ═══════════════════════════════════════
    // Daily Challenge
    // ═══════════════════════════════════════
    startDailyChallenge() {
        const today = new Date().toDateString();
        if (this.playerData.dailyChallengeCompleted === today) return;

        const availableModules = MODULES.filter((module, index) => {
            if (index === 0) return true;
            return this.getModuleProgress(MODULES[index - 1].id) >= 50;
        });

        if (availableModules.length === 0) {
            this.transitionTo(() => this.openModule(1));
            return;
        }

        const randomModule = availableModules[Math.floor(Math.random() * availableModules.length)];
        this.isDailyChallenge = true;
        this.dailyChallengeExercisesLeft = 3;
        this.transitionTo(() => this.openModule(randomModule.id));
    }

    completeDailyChallenge() {
        this.playerData.dailyChallengeCompleted = new Date().toDateString();
        this.addXP(50);
        this.savePlayerData();
        this.isDailyChallenge = false;

        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-icon').textContent = '🎯';
        document.getElementById('modal-title').textContent = 'אתגר יומי הושלם!';
        document.getElementById('modal-text').textContent = 'קיבלת +50 XP בונוס! חזרו מחר לאתגר חדש.';
        document.getElementById('modal-buttons').innerHTML = `
            <button class="btn btn-primary" onclick="game.closeModal()">מעולה!</button>
        `;
        modal.classList.add('show');
    }

    // ═══════════════════════════════════════
    // Home Screen
    // ═══════════════════════════════════════
    renderHomeScreen() {
        this.currentScreen = 'home';
        const container = document.getElementById('game-container');
        const welcomeMessage = this.getRandomMessage(this.mentorMessages.welcome);

        const levelInfo = this.getLevelProgressInfo();
        const dailyChallengeCompleted = this.playerData.dailyChallengeCompleted === new Date().toDateString();

        // Build journey path nodes
        let pathNodesHtml = '';

        // START node — daily challenge
        pathNodesHtml += `
            <div class="home-path-node special" onclick="game.startDailyChallenge()">
                <div class="home-path-icon">${dailyChallengeCompleted ? '✅' : '🎯'}</div>
                <div class="home-path-info">
                    <div class="home-path-label">אתגר יומי</div>
                    <div class="home-path-title">${dailyChallengeCompleted ? 'הושלם היום!' : 'השלימו 3 תרגילים'}</div>
                    <div class="home-path-desc">${dailyChallengeCompleted ? 'כל הכבוד! חזרו מחר' : 'קבלו בונוס XP!'}</div>
                </div>
                <div class="home-path-arrow">${dailyChallengeCompleted ? '' : '←'}</div>
            </div>
        `;

        // Story Builder node
        pathNodesHtml += `
            <div class="home-path-node special" onclick="game.transitionTo(function() { game.startStoryBuilder() })">
                <div class="home-path-icon">✍️</div>
                <div class="home-path-info">
                    <div class="home-path-label">תרגול חופשי</div>
                    <div class="home-path-title">בנה סיפור</div>
                    <div class="home-path-desc">צרו סיפור שלם עם ליווי של גל</div>
                </div>
                <div class="home-path-arrow">←</div>
            </div>
        `;

        // Module nodes — track unlock transitions
        const previousLocked = this._previousLockedModules || [];
        const currentLocked = [];

        MODULES.forEach((module, index) => {
            const progress = this.getModuleProgress(module.id);
            const isCompleted = progress === 100;
            const isLocked = index > 0 && this.getModuleProgress(MODULES[index - 1].id) < 50;
            const isPerfect = this.playerData.perfectLessonsList &&
                module.lessons && module.lessons.every(l =>
                    this.playerData.perfectLessonsList.includes(`${module.id}-${l.id}`)
                );

            if (isLocked) currentLocked.push(module.id);
            const justUnlocked = previousLocked.includes(module.id) && !isLocked;

            let stateClass = 'available';
            let stateIcon = module.icon;
            if (isLocked) {
                stateClass = 'locked';
                stateIcon = '🔒';
            } else if (isPerfect) {
                stateClass = 'completed';
                stateIcon = '⭐';
            } else if (isCompleted) {
                stateClass = 'completed';
                stateIcon = '✅';
            }

            if (justUnlocked) stateClass += ' just-unlocked';

            pathNodesHtml += `
                <div class="home-path-node ${stateClass}"
                     onclick="${isLocked ? '' : `game.transitionTo(function() { game.openModule(${module.id}) })`}">
                    <div class="home-path-icon">${stateIcon}</div>
                    <div class="home-path-info">
                        <div class="home-path-label">מודול ${index + 1}</div>
                        <div class="home-path-title">${module.title}</div>
                        <div class="home-path-desc">${module.description}</div>
                        <div class="home-path-progress">
                            <div class="home-path-progress-bar">
                                <div class="home-path-progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="home-path-progress-text">${progress}%</span>
                        </div>
                    </div>
                    <div class="home-path-arrow">${isLocked ? '' : '←'}</div>
                </div>
            `;
        });

        // GOAL node
        const totalProgress = MODULES.reduce((sum, m) => sum + this.getModuleProgress(m.id), 0);
        const overallProgress = Math.round(totalProgress / MODULES.length);
        pathNodesHtml += `
            <div class="home-path-node goal" style="cursor: default;">
                <div class="home-path-icon">🏆</div>
                <div class="home-path-info">
                    <div class="home-path-label">יעד</div>
                    <div class="home-path-title">מאסטר הסטוריטלינג</div>
                    <div class="home-path-desc">השלימו את כל המודולים</div>
                    <div class="home-path-progress">
                        <div class="home-path-progress-bar">
                            <div class="home-path-progress-fill" style="width: ${overallProgress}%"></div>
                        </div>
                        <span class="home-path-progress-text">${overallProgress}%</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = `
            ${this.createMentorHTML(welcomeMessage, true, 'wave')}

            <!-- התקדמות רמה -->
            <div class="level-progress-container">
                <div class="level-info">
                    <div class="level-current">
                        <span class="level-badge">רמה ${this.playerData.level}</span>
                        <span class="level-name">${this.getLevelName(this.playerData.level)}</span>
                    </div>
                    <span class="level-next">${levelInfo.xpToNext} XP לרמה הבאה</span>
                </div>
                <div class="level-progress-bar">
                    <div class="level-progress-fill" style="width: ${levelInfo.progress}%"></div>
                </div>
                <div class="level-xp-text">
                    <span>${levelInfo.currentXP} XP</span>
                    <span>${levelInfo.nextThreshold} XP</span>
                </div>
            </div>

            <!-- מסלול למידה -->
            <div class="home-journey">
                <div class="home-path-container">
                    <div class="home-path-line"></div>
                    ${pathNodesHtml}
                </div>
            </div>

            <!-- הישגים -->
            <div class="achievements-section">
                <div class="achievements-title">🏆 הישגים</div>
                <div class="achievements-grid">
                    ${this.renderAchievementsGrid()}
                </div>
            </div>
        `;

        this._previousLockedModules = currentLocked;

        this.hideProgressBar();
        this.hideFooter();
    }

    // ═══════════════════════════════════════
    // Story Builder
    // ═══════════════════════════════════════
    startStoryBuilder() {
        this.currentScreen = 'storyBuilder';
        this.storyBuilderData = { currentStep: 0, answers: {} };
        this.renderStoryBuilderStep();
    }

    renderStoryBuilderStep() {
        const container = document.getElementById('game-container');
        const step = this.storySteps[this.storyBuilderData.currentStep];
        const totalSteps = this.storySteps.length;
        const currentStepNum = this.storyBuilderData.currentStep;

        let dotsHtml = '';
        for (let i = 0; i < totalSteps; i++) {
            let dotClass = 'story-step-dot';
            if (i < currentStepNum) dotClass += ' completed';
            if (i === currentStepNum) dotClass += ' active';
            dotsHtml += `<div class="${dotClass}"></div>`;
        }

        const savedAnswer = this.storyBuilderData.answers[step.id] || '';

        container.innerHTML = `
            <div class="story-builder">
                <button class="back-btn" onclick="game.exitStoryBuilder()">✕</button>

                <div class="story-steps">
                    ${dotsHtml}
                </div>

                ${this.createMentorHTML(step.mentorMessage)}

                <div class="story-step-content">
                    <div class="story-step-title">${step.title}</div>
                    <div class="story-step-question">${step.question}</div>

                    <textarea
                        class="story-textarea"
                        id="story-answer"
                        placeholder="${step.hint}"
                        oninput="game.updateStoryAnswer('${step.id}')"
                    >${savedAnswer}</textarea>

                    <div class="story-example">
                        <div class="story-example-label">💡 דוגמה:</div>
                        <div class="story-example-text">${step.example}</div>
                    </div>
                </div>

                <div class="story-nav">
                    <div class="container">
                        ${currentStepNum > 0 ?
                            '<button class="btn btn-secondary" onclick="game.prevStoryStep()">← הקודם</button>' :
                            '<div></div>'
                        }
                        ${currentStepNum < totalSteps - 1 ?
                            '<button class="btn btn-primary" onclick="game.nextStoryStep()">הבא →</button>' :
                            '<button class="btn btn-primary" onclick="game.showStoryPreview()">סיום ותצוגה מקדימה</button>'
                        }
                    </div>
                </div>
            </div>
        `;

        this.hideProgressBar();
    }

    updateStoryAnswer(stepId) {
        const textarea = document.getElementById('story-answer');
        this.storyBuilderData.answers[stepId] = textarea.value;
    }

    nextStoryStep() {
        this.sound.play('click');
        this.updateStoryAnswer(this.storySteps[this.storyBuilderData.currentStep].id);
        if (this.storyBuilderData.currentStep < this.storySteps.length - 1) {
            this.storyBuilderData.currentStep++;
            this.transitionTo(() => this.renderStoryBuilderStep());
        }
    }

    prevStoryStep() {
        this.sound.play('click');
        this.updateStoryAnswer(this.storySteps[this.storyBuilderData.currentStep].id);
        if (this.storyBuilderData.currentStep > 0) {
            this.storyBuilderData.currentStep--;
            this.transitionTo(() => this.renderStoryBuilderStep());
        }
    }

    showStoryPreview() {
        this.updateStoryAnswer(this.storySteps[this.storyBuilderData.currentStep].id);
        const container = document.getElementById('game-container');
        const answers = this.storyBuilderData.answers;

        container.innerHTML = `
            <div class="story-builder">
                <button class="back-btn" onclick="game.transitionTo(function() { game.renderStoryBuilderStep() })">← חזרה לעריכה</button>

                ${this.createMentorHTML('וואו! יצרת סיפור שלם! בואו נראה איך הוא נראה ביחד. את/ה יכול/ה להעתיק אותו ולהשתמש בו בשיווק שלך.')}

                <div class="story-preview">
                    <div class="story-preview-title">🎯 הסיפור שלך</div>

                    <div class="story-preview-section">
                        <div class="story-preview-label">קהל היעד</div>
                        <div class="story-preview-text">${answers.target || ''}</div>
                    </div>

                    <div class="story-preview-section">
                        <div class="story-preview-label">הלפני - הכאב</div>
                        <div class="story-preview-text">${answers.before || ''}</div>
                    </div>

                    <div class="story-preview-section">
                        <div class="story-preview-label">נקודת המפנה</div>
                        <div class="story-preview-text">${answers.turning || ''}</div>
                    </div>

                    <div class="story-preview-section">
                        <div class="story-preview-label">האחרי - השינוי</div>
                        <div class="story-preview-text">${answers.after || ''}</div>
                    </div>

                    <div class="story-preview-section">
                        <div class="story-preview-label">המסר וקריאה לפעולה</div>
                        <div class="story-preview-text">${answers.message || ''}</div>
                    </div>
                </div>

                <div class="story-complete-actions">
                    <button class="btn btn-primary copy-btn btn-full" onclick="game.copyStory()">
                        📋 העתק את הסיפור
                    </button>
                    <button class="btn btn-secondary btn-full" onclick="game.transitionTo(function() { game.startStoryBuilder() })">
                        ✍️ התחל סיפור חדש
                    </button>
                    <button class="btn btn-secondary btn-full" onclick="game.transitionTo(function() { game.renderHomeScreen() })">
                        🏠 חזרה לתפריט
                    </button>
                </div>
            </div>
        `;

        this.playerData.storiesCreated = (this.playerData.storiesCreated || 0) + 1;
        this.savePlayerData();
        this.addXP(100);
        this.checkAchievements();
    }

    copyStory() {
        const answers = this.storyBuilderData.answers;
        const storyText = `📌 קהל היעד:
${answers.target || ''}

😔 הלפני - הכאב:
${answers.before || ''}

⚡ נקודת המפנה:
${answers.turning || ''}

🌟 האחרי - השינוי:
${answers.after || ''}

🎯 המסר וקריאה לפעולה:
${answers.message || ''}`;

        navigator.clipboard.writeText(storyText).then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ הועתק!';
            btn.style.background = 'var(--accent-green)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        });
    }

    exitStoryBuilder() {
        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-icon').textContent = '✍️';
        document.getElementById('modal-title').textContent = 'לצאת מבניית הסיפור?';
        document.getElementById('modal-text').textContent = 'הסיפור שלך יישמר ותוכל להמשיך אותו אחר כך.';
        document.getElementById('modal-buttons').innerHTML = `
            <button class="btn btn-secondary" onclick="game.closeModalAndStay()">להישאר</button>
            <button class="btn btn-danger" onclick="game.confirmExitStoryBuilder()">לצאת</button>
        `;
        modal.classList.add('show');
    }

    confirmExitStoryBuilder() {
        document.getElementById('modal-overlay').classList.remove('show');
        this.transitionTo(() => this.renderHomeScreen());
    }

    // ═══════════════════════════════════════
    // Module Progress
    // ═══════════════════════════════════════
    getModuleProgress(moduleId) {
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return 0;
        const totalLessons = module.lessons.length;
        let completedLessons = 0;
        module.lessons.forEach(lesson => {
            if (this.playerData.completedLessons[`${moduleId}-${lesson.id}`]) {
                completedLessons++;
            }
        });
        return Math.round((completedLessons / totalLessons) * 100);
    }

    // ═══════════════════════════════════════
    // Module Screen
    // ═══════════════════════════════════════
    openModule(moduleId) {
        this.currentModule = MODULES.find(m => m.id === moduleId);
        if (!this.currentModule) return;

        this.currentScreen = 'module';
        const container = document.getElementById('game-container');
        const moduleIntroMessage = this.mentorMessages.moduleIntro[moduleId] || "בואו נתחיל!";
        const perfectList = this.playerData.perfectLessonsList || [];

        // Progress
        const completedCount = this.currentModule.lessons.filter(l =>
            this.playerData.completedLessons[`${moduleId}-${l.id}`]
        ).length;
        const totalCount = this.currentModule.lessons.length;
        const progressPct = Math.round((completedCount / totalCount) * 100);

        // Build visual learning path
        let pathHtml = this.currentModule.lessons.map((lesson, index) => {
            const lessonKey = `${moduleId}-${lesson.id}`;
            const isCompleted = this.playerData.completedLessons[lessonKey];
            const isPerfect = perfectList.includes(lessonKey);
            const isLocked = index > 0 && !this.playerData.completedLessons[`${moduleId}-${this.currentModule.lessons[index - 1].id}`];
            const isAvailable = !isLocked && !isCompleted;

            let stateClass = 'locked';
            let icon = '🔒';
            let onclick = '';

            if (isPerfect) {
                stateClass = 'perfect';
                icon = '⭐';
                onclick = `onclick="game.startLesson(${lesson.id})"`;
            } else if (isCompleted) {
                stateClass = 'completed';
                icon = '✅';
                onclick = `onclick="game.startLesson(${lesson.id})"`;
            } else if (isAvailable) {
                stateClass = 'available';
                icon = '▶️';
                onclick = `onclick="game.startLesson(${lesson.id})"`;
            }

            return `
                <div class="path-node-row">
                    ${index < this.currentModule.lessons.length - 1 ? '<div class="path-connector"></div>' : ''}
                    <div class="path-node ${stateClass}" ${onclick}>
                        <div class="path-node-icon">${icon}</div>
                        <div class="path-node-info">
                            <div class="path-node-number">שיעור ${index + 1}</div>
                            <div class="path-node-title">${lesson.title}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.transitionTo(function() { game.renderHomeScreen() })">
                → חזרה
            </button>
            <div class="learning-path-header">
                <h2>${this.currentModule.icon} ${this.currentModule.title}</h2>
                <div class="learning-path-progress">
                    <span>${completedCount}/${totalCount} שיעורים</span>
                    <div class="learning-path-progress-bar">
                        <div class="learning-path-progress-fill" style="width: ${progressPct}%"></div>
                    </div>
                </div>
            </div>
            <div class="module-intro">
                ${this.createMentorHTML(moduleIntroMessage)}
            </div>
            <div class="learning-path">
                ${pathHtml}
            </div>
        `;

        this.hideProgressBar();
        this.hideFooter();
    }

    // ═══════════════════════════════════════
    // Lesson & Exercise
    // ═══════════════════════════════════════
    startLesson(lessonId) {
        this.currentLesson = this.currentModule.lessons.find(l => l.id === lessonId);
        if (!this.currentLesson) return;

        if (this.playerData.hearts <= 0) {
            this.showNoHeartsModal();
            return;
        }

        this.currentScreen = 'exercise';
        this.currentExerciseIndex = 0;
        this.lessonMistakes = 0;
        this.showProgressBar();
        this.renderExercise();
    }

    renderExercise() {
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        if (!exercise) {
            this.completeLesson();
            return;
        }

        this.selectedAnswer = null;
        this.exerciseAnswered = false;
        this.updateProgressBar();

        const container = document.getElementById('game-container');

        switch (exercise.type) {
            case 'multiple-choice':
                this.renderMultipleChoice(container, exercise);
                break;
            case 'fill-blank':
                this.renderFillBlank(container, exercise);
                break;
            case 'order':
                this.renderOrder(container, exercise);
                break;
            case 'identify':
                this.renderIdentify(container, exercise);
                break;
            case 'compare':
                this.renderCompare(container, exercise);
                break;
            case 'improve':
                this.renderImprove(container, exercise);
                break;
            case 'match':
                this.renderMatch(container, exercise);
                break;
        }

        this.showFooter();

        // Order exercises: check button must be enabled immediately
        // (showFooter disables it, but order has no "selection" step)
        if (exercise.type === 'order') {
            this.enableCheckButton();
        }
    }

    createExerciseTip(exerciseType) {
        const tips = {
            'multiple-choice': "💡 חשבו מה היה מושך אתכם כלקוחות - זו בדרך כלל התשובה הנכונה!",
            'fill-blank': "💡 המילה הנכונה היא זו שיוצרת את הרגש החזק ביותר.",
            'order': "💡 חשבו על המסע של הקהל - מה הם צריכים לשמוע קודם?",
            'identify': "💡 חפשו את החלק שגורם לכם להרגיש משהו.",
            'compare': "💡 דמיינו את עצמכם כלקוח - איזו גרסה הייתה גורמת לכם לעצור ולקרוא?",
            'improve': "💡 חפשו את האפשרות שמוסיפה רגש, ספציפיות או חיבור אישי.",
            'match': "💡 חפשו את הקשר הלוגי בין העמודות - מה מתחבר למה?"
        };
        return tips[exerciseType] || "";
    }

    renderMultipleChoice(container, exercise) {
        const letters = ['א', 'ב', 'ג', 'ד'];
        const tip = this.createExerciseTip('multiple-choice');
        const optionsHtml = exercise.options.map((option, index) => `
            <button class="option-btn" onclick="game.selectOption(${index})">
                <span class="option-letter">${letters[index]}</span>
                <span>${option}</span>
            </button>
        `).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">בחירה מרובה</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="options-list">
                    ${optionsHtml}
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;
    }

    selectOption(index) {
        if (this.exerciseAnswered) return;
        this.sound.play('click');
        this.selectedAnswer = index;
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
        this.enableCheckButton();
    }

    renderFillBlank(container, exercise) {
        const templateHtml = exercise.template.replace('___', '<span class="blank-slot" id="blank-slot">___</span>');
        const tip = this.createExerciseTip('fill-blank');

        const wordsHtml = this.shuffleArray([...exercise.options]).map((word, index) => `
            <button class="word-chip" data-word-index="${exercise.options.indexOf(word)}" onclick="game.selectWord(this)">${word}</button>
        `).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">השלמת משפט</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="fill-blank-container">
                    <div class="template-text">${templateHtml}</div>
                    <div class="word-bank">${wordsHtml}</div>
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;
    }

    selectWord(el) {
        if (this.exerciseAnswered) return;
        this.sound.play('click');
        const index = parseInt(el.dataset.wordIndex);
        const word = el.textContent;
        this.selectedAnswer = index;
        document.getElementById('blank-slot').textContent = word;
        document.getElementById('blank-slot').classList.add('filled');

        document.querySelectorAll('.word-chip').forEach((chip) => {
            chip.classList.toggle('selected', chip === el);
        });

        this.enableCheckButton();
    }

    renderOrder(container, exercise) {
        const shuffled = this.shuffleArray([...exercise.items].map((item, i) => ({ item, originalIndex: i })));
        const tip = this.createExerciseTip('order');

        const itemsHtml = shuffled.map((obj, index) => `
            <div class="order-item" draggable="true" data-index="${index}" data-original="${obj.originalIndex}"
                 ondragstart="game.dragStart(event)" ondragover="game.dragOver(event)"
                 ondrop="game.drop(event)" ondragend="game.dragEnd(event)"
                 ontouchstart="game.touchStart(event)" ontouchmove="game.touchMove(event)" ontouchend="game.touchEnd(event)">
                <span class="order-number">${index + 1}</span>
                <span>${obj.item}</span>
                <span class="drag-handle">⋮⋮</span>
            </div>
        `).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">סידור לפי סדר</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="order-container" id="order-container">
                    ${itemsHtml}
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;

        this.enableCheckButton();
    }

    // Drag & Drop
    dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }

    dragOver(e) {
        e.preventDefault();
        const item = e.target.closest('.order-item');
        if (item && !item.classList.contains('dragging')) {
            item.classList.add('drag-over');
        }
    }

    drop(e) {
        e.preventDefault();
        const container = document.getElementById('order-container');
        const dragging = container.querySelector('.dragging');
        const target = e.target.closest('.order-item');

        if (target && dragging && target !== dragging) {
            const items = [...container.children];
            const dragIndex = items.indexOf(dragging);
            const targetIndex = items.indexOf(target);

            if (dragIndex < targetIndex) {
                target.after(dragging);
            } else {
                target.before(dragging);
            }
            this.updateOrderNumbers();
        }

        document.querySelectorAll('.order-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    dragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.order-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    // Touch reorder for mobile
    touchStart(e) {
        const item = e.target.closest('.order-item');
        if (!item) return;
        this.touchDragItem = item;
        this.touchStartY = e.touches[0].clientY;
        item.classList.add('dragging');
    }

    touchMove(e) {
        if (!this.touchDragItem) return;
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const container = document.getElementById('order-container');
        const items = [...container.querySelectorAll('.order-item:not(.dragging)')];

        for (const item of items) {
            const rect = item.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (touchY < midY) {
                container.insertBefore(this.touchDragItem, item);
                this.updateOrderNumbers();
                break;
            }
            if (item === items[items.length - 1] && touchY >= midY) {
                container.appendChild(this.touchDragItem);
                this.updateOrderNumbers();
            }
        }
    }

    touchEnd(e) {
        if (this.touchDragItem) {
            this.touchDragItem.classList.remove('dragging');
            this.touchDragItem = null;
        }
    }

    updateOrderNumbers() {
        document.querySelectorAll('.order-item').forEach((item, index) => {
            item.querySelector('.order-number').textContent = index + 1;
        });
    }

    renderIdentify(container, exercise) {
        const tip = this.createExerciseTip('identify');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">זיהוי בטקסט</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="identify-instructions">סמנו את החלק הרלוונטי בטקסט</div>
                <div class="identify-text" id="identify-text" onmouseup="game.handleTextSelection()" ontouchend="setTimeout(function(){game.handleTextSelection()}, 100)">${exercise.text}</div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;

        this.enableCheckButton();
    }

    handleTextSelection() {
        if (this.exerciseAnswered) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length > 0) {
            const container = document.getElementById('identify-text');
            const range = selection.getRangeAt(0);
            const start = this.getTextOffset(container, range.startContainer, range.startOffset);
            const end = start + text.length;

            this.selectedAnswer = { start, end, text };

            const fullText = container.textContent;
            const before = fullText.substring(0, start);
            const selected = fullText.substring(start, end);
            const after = fullText.substring(end);

            container.innerHTML = `${before}<span class="highlight">${selected}</span>${after}`;
            this.enableCheckButton();
        }
    }

    getTextOffset(container, node, offset) {
        let totalOffset = 0;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            if (walker.currentNode === node) {
                return totalOffset + offset;
            }
            totalOffset += walker.currentNode.textContent.length;
        }
        return totalOffset + offset;
    }

    // ═══════════════════════════════════════
    // Compare Exercise
    // ═══════════════════════════════════════
    renderCompare(container, exercise) {
        const tip = this.createExerciseTip('compare');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">איזה חזק יותר?</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="compare-cards">
                    <div class="compare-card" onclick="game.selectCompare(0)">
                        <div class="compare-label">${exercise.optionA.label}</div>
                        <div class="compare-text">${exercise.optionA.text}</div>
                    </div>
                    <div class="compare-vs">VS</div>
                    <div class="compare-card" onclick="game.selectCompare(1)">
                        <div class="compare-label">${exercise.optionB.label}</div>
                        <div class="compare-text">${exercise.optionB.text}</div>
                    </div>
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;
    }

    selectCompare(index) {
        if (this.exerciseAnswered) return;
        this.sound.play('click');
        this.selectedAnswer = index;
        document.querySelectorAll('.compare-card').forEach((card, i) => {
            card.classList.toggle('selected', i === index);
        });
        this.enableCheckButton();
    }

    showCompareFeedback(isCorrect, exercise) {
        document.querySelectorAll('.compare-card').forEach((card, i) => {
            if (i === exercise.correct) {
                card.classList.add('correct');
            } else if (i === this.selectedAnswer && !isCorrect) {
                card.classList.add('incorrect');
            }
        });
    }

    // ═══════════════════════════════════════
    // Improve Exercise
    // ═══════════════════════════════════════
    renderImprove(container, exercise) {
        const tip = this.createExerciseTip('improve');
        const letters = ['א', 'ב', 'ג', 'ד'];
        const optionsHtml = exercise.options.map((option, index) => `
            <button class="option-btn" onclick="game.selectOption(${index})">
                <span class="option-letter">${letters[index]}</span>
                <span>${option}</span>
            </button>
        `).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">שפר את הסיפור</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="improve-original">
                    <div class="improve-original-label">המשפט המקורי:</div>
                    <div class="improve-original-text">${exercise.original}</div>
                </div>
                <div class="options-list">
                    ${optionsHtml}
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════
    // Match Exercise
    // ═══════════════════════════════════════
    renderMatch(container, exercise) {
        const tip = this.createExerciseTip('match');
        this.matchState = {
            selectedLeft: null,
            selectedRight: null,
            matches: [],
            pairs: exercise.pairs
        };

        const shuffledRight = this.shuffleArray(exercise.pairs.map((p, i) => ({ text: p.right, originalIndex: i })));

        const leftHtml = exercise.pairs.map((p, i) => `
            <div class="match-item match-left" data-index="${i}" onclick="game.selectMatchItem('left', ${i})">${p.left}</div>
        `).join('');

        const rightHtml = shuffledRight.map((item) => `
            <div class="match-item match-right" data-index="${item.originalIndex}" onclick="game.selectMatchItem('right', ${item.originalIndex})">${item.text}</div>
        `).join('');

        container.innerHTML = `
            <button class="back-btn" onclick="game.exitLesson()">✕</button>
            <div class="exercise-container">
                <div class="exercise-type">התאמה</div>
                <div class="exercise-question">${exercise.question}</div>
                <div class="match-instructions">לחצו על פריט משמאל ואז על הפריט המתאים מימין</div>
                <div class="match-container">
                    <div class="match-column">${leftHtml}</div>
                    <div class="match-column">${rightHtml}</div>
                </div>
                <div class="mentor-tip">
                    <img class="mentor-tip-icon" src="mentor-gal.png" alt="גל" />
                    <span class="mentor-tip-text">${tip}</span>
                </div>
            </div>
        `;
    }

    selectMatchItem(side, index) {
        if (this.exerciseAnswered) return;
        // Don't select already matched items
        if (this.matchState.matches.some(m => m[side === 'left' ? 0 : 1] === index)) return;

        this.sound.play('click');

        if (side === 'left') {
            // Deselect previous left
            document.querySelectorAll('.match-left').forEach(el => el.classList.remove('selected'));
            this.matchState.selectedLeft = index;
            document.querySelector(`.match-left[data-index="${index}"]`).classList.add('selected');
        } else {
            // Deselect previous right
            document.querySelectorAll('.match-right').forEach(el => el.classList.remove('selected'));
            this.matchState.selectedRight = index;
            document.querySelector(`.match-right[data-index="${index}"]`).classList.add('selected');
        }

        // If both selected, create a match
        if (this.matchState.selectedLeft !== null && this.matchState.selectedRight !== null) {
            const colors = ['#7c5cfc', '#2dd4bf', '#f472b6', '#fbbf24', '#fb923c'];
            const colorIndex = this.matchState.matches.length % colors.length;
            const color = colors[colorIndex];

            this.matchState.matches.push([this.matchState.selectedLeft, this.matchState.selectedRight]);

            const leftEl = document.querySelector(`.match-left[data-index="${this.matchState.selectedLeft}"]`);
            const rightEl = document.querySelector(`.match-right[data-index="${this.matchState.selectedRight}"]`);
            leftEl.classList.remove('selected');
            rightEl.classList.remove('selected');
            leftEl.classList.add('matched');
            rightEl.classList.add('matched');
            leftEl.style.borderColor = color;
            rightEl.style.borderColor = color;
            leftEl.style.background = color + '15';
            rightEl.style.background = color + '15';

            this.matchState.selectedLeft = null;
            this.matchState.selectedRight = null;

            // Enable check when all pairs matched
            if (this.matchState.matches.length === this.matchState.pairs.length) {
                this.enableCheckButton();
            }
        }
    }

    checkMatchAnswer(exercise) {
        return this.matchState.matches.every(([left, right]) => left === right);
    }

    showMatchFeedback(isCorrect) {
        document.querySelectorAll('.match-item').forEach(item => {
            if (isCorrect) {
                item.style.borderColor = 'var(--accent-green)';
                item.style.background = 'rgba(52, 211, 153, 0.08)';
            } else {
                item.style.borderColor = 'var(--accent-red)';
                item.style.background = 'rgba(251, 113, 133, 0.08)';
            }
        });
    }

    // ═══════════════════════════════════════
    // Answer Checking
    // ═══════════════════════════════════════
    checkAnswer() {
        if (this.exerciseAnswered) return;

        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        let isCorrect = false;

        switch (exercise.type) {
            case 'multiple-choice':
                isCorrect = this.selectedAnswer === exercise.correct;
                this.showMultipleChoiceFeedback(isCorrect, exercise);
                break;
            case 'fill-blank':
                isCorrect = this.selectedAnswer === exercise.correct;
                this.showFillBlankFeedback(isCorrect, exercise);
                break;
            case 'order':
                isCorrect = this.checkOrderAnswer(exercise);
                this.showOrderFeedback(isCorrect);
                break;
            case 'identify':
                isCorrect = this.checkIdentifyAnswer(exercise);
                this.showIdentifyFeedback(isCorrect, exercise);
                break;
            case 'compare':
                isCorrect = this.selectedAnswer === exercise.correct;
                this.showCompareFeedback(isCorrect, exercise);
                break;
            case 'improve':
                isCorrect = this.selectedAnswer === exercise.correct;
                this.showMultipleChoiceFeedback(isCorrect, exercise);
                break;
            case 'match':
                isCorrect = this.checkMatchAnswer(exercise);
                this.showMatchFeedback(isCorrect);
                break;
        }

        this.exerciseAnswered = true;

        if (isCorrect) {
            this.sound.play('correct');
            this.playerData.totalCorrectAnswers = (this.playerData.totalCorrectAnswers || 0) + 1;
            this.addXP(10);
            this.createStarBurst();
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            this.sound.play('wrong');
            this.playerData.totalWrongAnswers = (this.playerData.totalWrongAnswers || 0) + 1;
            this.lessonMistakes++;
            this.loseHeart();
            if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
        }

        // Track stats
        this.updateExerciseStats(isCorrect, this.currentModule.id);

        this.showFeedback(isCorrect, exercise.explanation);
        this.savePlayerData();
    }

    checkOrderAnswer(exercise) {
        const items = document.querySelectorAll('.order-item');
        const currentOrder = [...items].map(item => parseInt(item.dataset.original));
        return JSON.stringify(currentOrder) === JSON.stringify(exercise.correctOrder);
    }

    checkIdentifyAnswer(exercise) {
        if (!this.selectedAnswer) return false;
        const [correctStart, correctEnd] = exercise.correctRange;
        const { start, end } = this.selectedAnswer;
        const overlapStart = Math.max(start, correctStart);
        const overlapEnd = Math.min(end, correctEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        const selectedLength = end - start;
        const correctLength = correctEnd - correctStart;
        return overlap / selectedLength >= 0.6 && overlap / correctLength >= 0.4;
    }

    showMultipleChoiceFeedback(isCorrect, exercise) {
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            if (index === exercise.correct) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
    }

    showFillBlankFeedback(isCorrect, exercise) {
        const blankSlot = document.getElementById('blank-slot');
        if (blankSlot) {
            blankSlot.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        const correctWord = exercise.options[exercise.correct];
        document.querySelectorAll('.word-chip').forEach(chip => {
            if (chip.textContent === correctWord) {
                chip.classList.add('correct');
            } else if (chip.classList.contains('selected') && !isCorrect) {
                chip.classList.add('incorrect');
            }
        });
        // Show correct word in blank if wrong
        if (!isCorrect && blankSlot) {
            setTimeout(() => {
                blankSlot.textContent = correctWord;
                blankSlot.classList.remove('incorrect');
                blankSlot.classList.add('correct');
            }, 800);
        }
    }

    showOrderFeedback(isCorrect) {
        document.querySelectorAll('.order-item').forEach(item => {
            item.style.borderColor = isCorrect ? 'var(--accent-green)' : 'var(--accent-red)';
        });
    }

    showIdentifyFeedback(isCorrect, exercise) {
        const container = document.getElementById('identify-text');
        const [correctStart, correctEnd] = exercise.correctRange;

        if (isCorrect) {
            container.querySelector('.highlight')?.classList.add('correct-highlight');
        } else {
            container.querySelector('.highlight')?.classList.add('incorrect-highlight');
            setTimeout(() => {
                const before = exercise.text.substring(0, correctStart);
                const correct = exercise.text.substring(correctStart, correctEnd);
                const after = exercise.text.substring(correctEnd);
                container.innerHTML = `${before}<span class="highlight correct-highlight">${correct}</span>${after}`;
            }, 500);
        }
    }

    showFeedback(isCorrect, explanation) {
        const panel = document.getElementById('feedback-panel');
        panel.className = `feedback-panel show ${isCorrect ? 'correct' : 'incorrect'}`;

        const mentorMessage = isCorrect
            ? this.getRandomMessage(this.mentorMessages.correctAnswer)
            : this.getRandomMessage(this.mentorMessages.wrongAnswer);

        document.getElementById('feedback-icon').textContent = isCorrect ? '🎉' : '😅';
        document.getElementById('feedback-title').textContent = mentorMessage;

        // Animate mentor avatar
        this.animateMentor(isCorrect ? 'happy' : 'sad');

        // Build enhanced feedback for wrong answers
        const exercise = this.currentLesson.exercises[this.currentExerciseIndex];
        let feedbackHtml = '';

        if (!isCorrect && exercise.wrongExplanations && this.selectedAnswer !== null) {
            const wrongExp = exercise.wrongExplanations[this.selectedAnswer];
            const selectedText = this.getSelectedAnswerText(exercise);
            const correctText = this.getCorrectAnswerText(exercise);

            feedbackHtml += `<div class="wrong-answer-detail">`;
            feedbackHtml += `<div class="feedback-answer-label">❌ בחרת:</div>`;
            feedbackHtml += `<div class="feedback-answer-text">${selectedText}</div>`;
            if (wrongExp) feedbackHtml += `<div class="feedback-answer-reason">${wrongExp}</div>`;
            feedbackHtml += `</div>`;

            feedbackHtml += `<div class="correct-answer-detail">`;
            feedbackHtml += `<div class="feedback-answer-label">✅ התשובה הנכונה:</div>`;
            feedbackHtml += `<div class="feedback-answer-text">${correctText}</div>`;
            feedbackHtml += `</div>`;

            if (explanation) feedbackHtml += `<div style="margin-top:8px">${explanation}</div>`;
        } else {
            feedbackHtml = explanation;
        }

        document.getElementById('feedback-explanation').innerHTML = feedbackHtml;
        document.getElementById('feedback-btn').textContent = 'המשך';

        // Streak fire pulse on correct
        if (isCorrect) {
            const streakEl = document.querySelector('.stat-item.streak');
            if (streakEl) {
                streakEl.classList.add('streak-fire-pulse');
                setTimeout(() => streakEl.classList.remove('streak-fire-pulse'), 500);
            }
        }

        this.hideFooter();
    }

    getSelectedAnswerText(exercise) {
        if (exercise.type === 'compare') {
            return this.selectedAnswer === 0 ? exercise.optionA.text : exercise.optionB.text;
        }
        if (exercise.options) return exercise.options[this.selectedAnswer];
        return '';
    }

    getCorrectAnswerText(exercise) {
        if (exercise.type === 'compare') {
            return exercise.correct === 0 ? exercise.optionA.text : exercise.optionB.text;
        }
        if (exercise.options) return exercise.options[exercise.correct];
        return '';
    }

    continueToNext() {
        document.getElementById('feedback-panel').classList.remove('show');

        if (this.playerData.hearts <= 0) {
            this.showNoHeartsModal();
            return;
        }

        this.currentExerciseIndex++;
        setTimeout(() => this.renderExercise(), 300);
    }

    // ═══════════════════════════════════════
    // Lesson Completion
    // ═══════════════════════════════════════
    completeLesson() {
        const lessonKey = `${this.currentModule.id}-${this.currentLesson.id}`;

        if (!this.playerData.completedLessons[lessonKey]) {
            this.playerData.completedLessons[lessonKey] = true;
            this.addXP(50);

            if (this.lessonMistakes === 0) {
                this.playerData.perfectLessons = (this.playerData.perfectLessons || 0) + 1;
                if (!this.playerData.perfectLessonsList) this.playerData.perfectLessonsList = [];
                if (!this.playerData.perfectLessonsList.includes(lessonKey)) {
                    this.playerData.perfectLessonsList.push(lessonKey);
                }
            }

            this.savePlayerData();
        }

        if (this.isDailyChallenge) {
            this.completeDailyChallenge();
        }

        this.checkAchievements();
        this.showCompletionScreen();
    }

    showCompletionScreen() {
        this.hideProgressBar();
        this.hideFooter();
        this.createConfetti();
        this.sound.play('levelUp');

        const completionMessage = this.getRandomMessage(this.mentorMessages.lessonComplete);

        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="completion-screen">
                <div class="completion-icon">🏆</div>
                <div class="completion-title">כל הכבוד!</div>
                <div class="completion-subtitle">סיימת את השיעור "${this.currentLesson.title}"</div>
                ${this.createMentorHTML(completionMessage, true, 'happy')}
                <div class="completion-stats">
                    <div class="completion-stat">
                        <div class="completion-stat-value">+50</div>
                        <div class="completion-stat-label">XP</div>
                    </div>
                    <div class="completion-stat">
                        <div class="completion-stat-value">${this.playerData.streak}</div>
                        <div class="completion-stat-label">ימים ברצף</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-full" onclick="game.transitionTo(function() { game.openModule(${this.currentModule.id}) })">
                    המשך ללמוד
                </button>
                <button class="btn btn-secondary btn-full" style="margin-top: 10px;" onclick="game.transitionTo(function() { game.renderHomeScreen() })">
                    חזרה לתפריט
                </button>
            </div>
        `;
    }

    // ═══════════════════════════════════════
    // Improved Confetti
    // ═══════════════════════════════════════
    createConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FFC800', '#CE82FF', '#FF86D0', '#FF4B4B', '#7C5CFC'];
        const shapes = ['square', 'circle', 'star'];

        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 6 + Math.random() * 8;

            confetti.style.position = 'absolute';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.background = color;
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            if (shape === 'circle') {
                confetti.className = 'confetti-circle';
            } else if (shape === 'star') {
                confetti.className = 'confetti';
                confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            } else {
                confetti.className = 'confetti';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            }

            confetti.style.animation = `confettiSway ${2 + Math.random() * 2}s ease-out forwards`;
            confetti.style.animationDelay = Math.random() * 1.5 + 's';

            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    }

    // ═══════════════════════════════════════
    // XP & Hearts
    // ═══════════════════════════════════════
    addXP(amount) {
        const oldXP = this.playerData.xp;
        const oldLevel = this.playerData.level;
        this.playerData.xp += amount;
        this.playerData.level = this.calculateLevel();
        this.savePlayerData();
        this.showXPPopup(amount);

        // Animate XP counter
        const xpEl = document.getElementById('xp-value');
        if (xpEl) {
            this.animateCountUp(xpEl, oldXP, this.playerData.xp, 500);
        }
        // Update other stats (streak, hearts)
        document.getElementById('streak-value').textContent = this.playerData.streak;
        this.renderHearts();

        if (this.playerData.level > oldLevel) {
            this.showLevelUpCelebration(this.playerData.level);
        }

        this.checkAchievements();
    }

    showXPPopup(amount) {
        // Floating XP from the XP stat in header
        const xpStat = document.querySelector('.stat-item.xp');
        if (xpStat) {
            const rect = xpStat.getBoundingClientRect();
            const popup = document.createElement('div');
            popup.className = 'xp-float';
            popup.textContent = `+${amount} XP`;
            popup.style.left = rect.left + rect.width / 2 + 'px';
            popup.style.top = rect.bottom + 'px';
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 1200);
        } else {
            // Fallback centered popup
            const popup = document.createElement('div');
            popup.className = 'xp-popup';
            popup.textContent = `+${amount} XP`;
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 1000);
        }
    }

    loseHeart() {
        if (this.playerData.hearts > 0) {
            this.playerData.hearts--;
            // Set the recovery timestamp
            if (!this.playerData.lastHeartLost || this.playerData.hearts === this.playerData.maxHearts - 1) {
                this.playerData.lastHeartLost = new Date().toISOString();
            }
            this.savePlayerData();
            this.updateStatsDisplay();

            const hearts = document.querySelectorAll('.heart:not(.empty)');
            const lastHeart = hearts[hearts.length - 1];
            if (lastHeart) {
                lastHeart.classList.add('losing');
                setTimeout(() => lastHeart.classList.add('empty'), 500);
            }
        }
    }

    // ═══════════════════════════════════════
    // Modals
    // ═══════════════════════════════════════
    showNoHeartsModal() {
        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-icon').textContent = '💔';
        document.getElementById('modal-title').textContent = 'נגמרו הלבבות!';

        const hasTimer = this.playerData.lastHeartLost;
        const timerMsg = hasTimer ? `לב חדש יתחדש בעוד ${HEART_RECOVERY_MINUTES} דקות.` : '';
        document.getElementById('modal-text').textContent = `${timerMsg} חזרו מאוחר יותר או מלאו את הלבבות.`;

        document.getElementById('modal-buttons').innerHTML = `
            <button class="btn btn-secondary" onclick="game.closeModal()">חזרה לתפריט</button>
            <button class="btn btn-primary" onclick="game.refillHearts()">מילוי לבבות</button>
        `;
        modal.classList.add('show');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('show');
        this.transitionTo(() => this.renderHomeScreen());
    }

    refillHearts() {
        this.playerData.hearts = this.playerData.maxHearts;
        this.playerData.lastHeartLost = null;
        this.savePlayerData();
        this.updateStatsDisplay();
        document.getElementById('modal-overlay').classList.remove('show');
    }

    exitLesson() {
        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-icon').textContent = '🚪';
        document.getElementById('modal-title').textContent = 'לצאת מהשיעור?';
        document.getElementById('modal-text').textContent = 'ההתקדמות בשיעור הזה לא תישמר.';
        document.getElementById('modal-buttons').innerHTML = `
            <button class="btn btn-secondary" onclick="game.closeModalAndStay()">להישאר</button>
            <button class="btn btn-danger" onclick="game.confirmExit()">לצאת</button>
        `;
        modal.classList.add('show');
    }

    closeModalAndStay() {
        document.getElementById('modal-overlay').classList.remove('show');
    }

    confirmExit() {
        document.getElementById('modal-overlay').classList.remove('show');
        document.getElementById('feedback-panel').classList.remove('show');
        this.transitionTo(() => this.openModule(this.currentModule.id));
    }

    // ═══════════════════════════════════════
    // Stats Tracking
    // ═══════════════════════════════════════
    updateExerciseStats(isCorrect, moduleId) {
        // Weekly activity
        const today = new Date().toISOString().split('T')[0];
        if (!this.playerData.weeklyActivity) this.playerData.weeklyActivity = {};
        this.playerData.weeklyActivity[today] = (this.playerData.weeklyActivity[today] || 0) + 1;

        // Module accuracy
        if (!this.playerData.moduleAccuracy) this.playerData.moduleAccuracy = {};
        if (!this.playerData.moduleAccuracy[moduleId]) {
            this.playerData.moduleAccuracy[moduleId] = { correct: 0, total: 0 };
        }
        this.playerData.moduleAccuracy[moduleId].total++;
        if (isCorrect) {
            this.playerData.moduleAccuracy[moduleId].correct++;
        }
    }

    // ═══════════════════════════════════════
    // Personal Stats Screen
    // ═══════════════════════════════════════
    showStats() {
        this.hideUserMenu();
        this.transitionTo(() => this.renderStatsScreen());
    }

    hideStats() {
        this.transitionTo(() => this.renderHomeScreen());
    }

    renderStatsScreen() {
        this.currentScreen = 'stats';
        const container = document.getElementById('game-container');
        const pd = this.playerData;

        // Summary cards
        const totalLessons = Object.keys(pd.completedLessons).length;
        const longestStreak = pd.longestStreak || pd.streak || 0;

        // Weekly activity chart (last 7 days)
        const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        const weekData = [];
        let maxActivity = 1;
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const count = (pd.weeklyActivity && pd.weeklyActivity[key]) || 0;
            if (count > maxActivity) maxActivity = count;
            weekData.push({ day: dayNames[d.getDay()], count, key });
        }

        const weeklyBarsHtml = weekData.map(w => {
            const height = Math.max(4, (w.count / maxActivity) * 100);
            const isToday = w.key === new Date().toISOString().split('T')[0];
            return `
                <div class="weekly-bar-wrapper">
                    <div class="weekly-bar ${isToday ? 'today' : ''}" style="height: ${height}%">
                        <span class="weekly-bar-count">${w.count || ''}</span>
                    </div>
                    <div class="weekly-label">${w.day}</div>
                </div>
            `;
        }).join('');

        // Module accuracy
        const moduleAccuracyHtml = MODULES.map(m => {
            const acc = pd.moduleAccuracy && pd.moduleAccuracy[m.id];
            if (!acc || acc.total === 0) {
                return `
                    <div class="accuracy-row">
                        <span class="accuracy-module-name">${m.icon} ${m.title}</span>
                        <div class="accuracy-bar-wrapper">
                            <div class="accuracy-bar" style="width: 0%"></div>
                        </div>
                        <span class="accuracy-percent">--</span>
                    </div>
                `;
            }
            const pct = Math.round((acc.correct / acc.total) * 100);
            const color = pct >= 80 ? 'var(--accent-green)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-red)';
            return `
                <div class="accuracy-row">
                    <span class="accuracy-module-name">${m.icon} ${m.title}</span>
                    <div class="accuracy-bar-wrapper">
                        <div class="accuracy-bar" style="width: ${pct}%; background: ${color}"></div>
                    </div>
                    <span class="accuracy-percent">${pct}%</span>
                </div>
            `;
        }).join('');

        // Perfect lessons
        const perfectList = pd.perfectLessonsList || [];
        let perfectHtml = '';
        if (perfectList.length > 0) {
            perfectHtml = perfectList.map(key => {
                const [modId, lesId] = key.split('-').map(Number);
                const mod = MODULES.find(m => m.id === modId);
                const les = mod && mod.lessons.find(l => l.id === lesId);
                return les ? `<div class="perfect-lesson-item">⭐ ${les.title}</div>` : '';
            }).join('');
        } else {
            perfectHtml = '<div class="perfect-lesson-empty">עדיין אין שיעורים מושלמים — סיימו שיעור בלי טעויות!</div>';
        }

        // Accuracy percentage
        const totalAnswers = (pd.totalCorrectAnswers || 0) + (pd.totalWrongAnswers || 0);
        const accuracyPct = totalAnswers > 0 ? Math.round((pd.totalCorrectAnswers / totalAnswers) * 100) : 0;

        container.innerHTML = `
            <div class="stats-screen">
                <button class="back-btn" onclick="game.hideStats()">→ חזרה</button>
                <h2 class="stats-title">📊 הסטטיסטיקות שלי</h2>

                <div class="stats-cards">
                    <div class="stats-card">
                        <div class="stats-card-value">${pd.xp}</div>
                        <div class="stats-card-label">⭐ סה"כ XP</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-value">${pd.streak}</div>
                        <div class="stats-card-label">🔥 סטריק נוכחי</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-value">${longestStreak}</div>
                        <div class="stats-card-label">🏆 סטריק שיא</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-value">${totalLessons}</div>
                        <div class="stats-card-label">📚 שיעורים</div>
                    </div>
                </div>

                <div class="stats-section">
                    <div class="stats-section-title">📅 פעילות השבוע</div>
                    <div class="weekly-chart">
                        ${weeklyBarsHtml}
                    </div>
                </div>

                <div class="stats-section">
                    <div class="stats-section-title">🎯 דיוק כללי: ${accuracyPct}%</div>
                </div>

                <div class="stats-section">
                    <div class="stats-section-title">📊 דיוק לפי מודול</div>
                    <div class="module-accuracy">
                        ${moduleAccuracyHtml}
                    </div>
                </div>

                <div class="stats-section">
                    <div class="stats-section-title">⭐ שיעורים מושלמים</div>
                    <div class="perfect-lessons">
                        ${perfectHtml}
                    </div>
                </div>
            </div>
        `;

        this.hideProgressBar();
        this.hideFooter();
    }

    // ═══════════════════════════════════════
    // Star Burst Animation (correct answer)
    // ═══════════════════════════════════════
    createStarBurst() {
        const container = document.createElement('div');
        container.className = 'star-burst-container';
        document.body.appendChild(container);

        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.textContent = '⭐';
            const angle = (i / 10) * 360;
            const distance = 60 + Math.random() * 80;
            star.style.setProperty('--angle', angle + 'deg');
            star.style.setProperty('--distance', distance + 'px');
            star.style.animationDelay = (Math.random() * 0.1) + 's';
            container.appendChild(star);
        }

        setTimeout(() => container.remove(), 800);
    }

    // ═══════════════════════════════════════
    // Animated XP Counter
    // ═══════════════════════════════════════
    animateCountUp(el, from, to, duration = 500) {
        const start = performance.now();
        const diff = to - from;
        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(from + diff * eased);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // ═══════════════════════════════════════
    // Level Up Celebration
    // ═══════════════════════════════════════
    showLevelUpCelebration(level) {
        const overlay = document.getElementById('level-up-overlay');
        const text = document.getElementById('level-up-text');
        text.innerHTML = `
            <div class="level-up-icon">🎉</div>
            <div class="level-up-heading">!עלית לרמה ${level}</div>
            <div class="level-up-name">${this.getLevelName(level)}</div>
        `;
        overlay.style.display = 'flex';
        overlay.classList.add('party-mode');

        // Screen shake
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 600);

        // Confetti particles
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        overlay.appendChild(confettiContainer);
        const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#FFC800', '#CE82FF', '#FF86D0', '#FF4B4B', '#7C5CFC'];
        for (let i = 0; i < 100; i++) {
            const c = document.createElement('div');
            c.className = 'confetti-particle';
            c.style.left = Math.random() * 100 + '%';
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDelay = Math.random() * 1.5 + 's';
            c.style.animationDuration = (2 + Math.random() * 2) + 's';
            const size = 6 + Math.random() * 6;
            c.style.width = size + 'px';
            c.style.height = size + 'px';
            if (Math.random() > 0.5) c.style.borderRadius = '50%';
            confettiContainer.appendChild(c);
        }

        // Emoji rain
        const emojis = ['🎉', '🎊', '✨', '🌟', '⭐', '🏆', '💫', '🥳'];
        for (let i = 0; i < 20; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-rain';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDelay = Math.random() * 2 + 's';
            emoji.style.fontSize = (18 + Math.random() * 16) + 'px';
            confettiContainer.appendChild(emoji);
        }

        this.sound.play('levelUp');

        // Click to dismiss
        const dismiss = () => {
            overlay.style.display = 'none';
            overlay.classList.remove('party-mode');
            confettiContainer.remove();
            overlay.removeEventListener('click', dismiss);
        };
        overlay.addEventListener('click', dismiss);

        setTimeout(dismiss, 3500);
    }

    // ═══════════════════════════════════════
    // Utilities
    // ═══════════════════════════════════════
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // ═══════════════════════════════════════
    // UI Helpers
    // ═══════════════════════════════════════
    showProgressBar() {
        document.getElementById('progress-container').style.display = 'block';
    }

    hideProgressBar() {
        document.getElementById('progress-container').style.display = 'none';
    }

    updateProgressBar() {
        const total = this.currentLesson.exercises.length;
        const current = this.currentExerciseIndex;
        const percentage = (current / total) * 100;
        document.getElementById('progress-bar').style.width = percentage + '%';
    }

    showFooter() {
        document.getElementById('footer-actions').style.display = 'block';
        this.disableCheckButton();
    }

    hideFooter() {
        document.getElementById('footer-actions').style.display = 'none';
    }

    enableCheckButton() {
        document.getElementById('check-btn').disabled = false;
    }

    disableCheckButton() {
        document.getElementById('check-btn').disabled = true;
    }
}

// ═══════════════════════════════════════
// Initialize
// ═══════════════════════════════════════
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new StoryGame();
});
