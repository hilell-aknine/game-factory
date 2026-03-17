const MODULES = [
    {
        id: 1,
        title: "מבוא ל-Claude Code",
        description: "מה זה Claude Code, התקנה ראשונה ושיחה ראשונה",
        icon: "💻",
        lessons: [
            {
                id: 1,
                title: "מה זה Claude Code ולמה זה משנה הכל",
                summary: "Claude Code הוא CLI (כלי שורת פקודה) רשמי של Anthropic שמאפשר לעבוד עם Claude ישירות מהטרמינל. הוא יכול לקרוא קבצים, לכתוב קוד, להריץ פקודות, ולעבוד על פרויקטים שלמים — לא רק לענות על שאלות.",
                summaryDetail: "בניגוד ל-ChatGPT או Claude.ai שעובדים בחלון צ'אט, Claude Code חי בטרמינל שלך ויכול לגעת בקבצים אמיתיים. הוא רואה את כל הפרויקט, מבין קוד קיים, ויכול לבצע שינויים אמיתיים. זה כמו ההבדל בין לשאול מישהו עצה לבין להביא מומחה שיושב לידך ועובד איתך.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה ההבדל המרכזי בין Claude Code לבין Claude.ai?",
                        options: ["Claude Code עובד בטרמינל ויכול לגעת בקבצים אמיתיים", "Claude Code הוא יותר חכם", "Claude Code עובד רק עם Python", "אין הבדל — שניהם אותו דבר"],
                        correct: 0,
                        explanation: "Claude Code חי בטרמינל ויכול לקרוא, לכתוב ולהריץ קבצים אמיתיים בפרויקט שלך. זה ההבדל המהותי — הוא עובד *עם* הקוד שלך, לא רק מדבר *על* קוד.",
                        wrongExplanations: [null, "שניהם משתמשים באותם מודלים (Claude Opus/Sonnet). ההבדל הוא בממשק ובגישה לקבצים.", "Claude Code עובד עם כל שפת תכנות — Python, JS, Go, Rust ועוד.", "יש הבדל מהותי — Claude Code יכול לבצע פעולות אמיתיות על קבצים."]
                    },
                    {
                        type: "fill-blank",
                        question: "השלימו את המשפט:",
                        template: "Claude Code הוא ___ רשמי של Anthropic לעבודה עם Claude מהטרמינל",
                        options: ["CLI", "IDE", "API", "GUI"],
                        correct: 0,
                        explanation: "CLI = Command Line Interface. Claude Code הוא כלי שורת פקודה שמריצים ישירות בטרמינל."
                    },
                    {
                        type: "compare",
                        question: "איזה תיאור מדויק יותר של Claude Code?",
                        optionA: {
                            label: "תיאור א",
                            text: "בוט צ'אט שעונה על שאלות תכנות"
                        },
                        optionB: {
                            label: "תיאור ב",
                            text: "מפתח AI שיושב בטרמינל, קורא את הקוד שלך, ומבצע שינויים אמיתיים"
                        },
                        correct: 1,
                        explanation: "Claude Code הוא הרבה יותר מבוט צ'אט — הוא agent שיכול לקרוא קבצים, להריץ פקודות, לכתוב קוד, ולבצע שינויים אמיתיים בפרויקט."
                    },
                    {
                        type: "match",
                        question: "התאימו בין הכלי ליכולת שלו:",
                        pairs: [
                            { left: "Claude.ai", right: "צ'אט בדפדפן, מדביקים קוד ידנית" },
                            { left: "Claude Code", right: "CLI בטרמינל, גישה ישירה לקבצים" },
                            { left: "Cursor / VS Code", right: "IDE עם AI משולב בעורך" },
                            { left: "Claude API", right: "גישה תכנותית לבניית אפליקציות" }
                        ],
                        explanation: "כל כלי פותר בעיה אחרת — Claude Code ייחודי ביכולת לעבוד ישירות על הפרויקט מהטרמינל."
                    },
                    {
                        type: "multiple-choice",
                        question: "מה Claude Code יכול לעשות שצ'אט רגיל לא?",
                        options: ["לקרוא ולערוך קבצים אמיתיים בפרויקט", "לכתוב קוד", "להסביר מושגים", "לענות על שאלות"],
                        correct: 0,
                        explanation: "כל AI יכול לכתוב קוד ולהסביר — אבל רק Claude Code יכול לגשת ישירות לקבצים בפרויקט שלך, לקרוא אותם, ולבצע שינויים.",
                        wrongExplanations: [null, "גם צ'אט רגיל יכול לכתוב קוד — ההבדל הוא ביכולת לכתוב ישירות לקבצים.", "גם צ'אט רגיל יכול להסביר מושגים.", "גם צ'אט רגיל עונה על שאלות. הייחוד הוא בגישה לקבצים."]
                    },
                    {
                        type: "order",
                        question: "סדרו את השלבים להתקנת Claude Code:",
                        items: ["להתקין Node.js 18+", "להריץ npm install -g @anthropic-ai/claude-code", "להגדיר ANTHROPIC_API_KEY", "להריץ claude בטרמינל"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קודם מתקינים Node.js (דרישת מינימום), אז מתקינים את Claude Code גלובלית, מגדירים מפתח API, ורק אז מריצים."
                    },
                    {
                        type: "improve",
                        question: "איזו פקודת התקנה נכונה?",
                        original: "npm install claude-code",
                        options: ["npm install -g @anthropic-ai/claude-code", "pip install claude-code", "brew install claude", "apt-get install claude-code"],
                        correct: 0,
                        explanation: "הפקודה הנכונה היא npm install -g @anthropic-ai/claude-code. הדגל -g מתקין גלובלית, והחבילה נמצאת תחת @anthropic-ai.",
                        wrongExplanations: [null, "Claude Code הוא חבילת npm, לא Python.", "אין חבילת brew רשמית.", "זה לא חבילת apt."]
                    }
                ]
            },
            {
                id: 2,
                title: "השיחה הראשונה עם Claude Code",
                summary: "פותחים טרמינל, מקלידים claude, ומתחילים לדבר. Claude Code מבין עברית ואנגלית, ויכול לקבל הוראות פשוטות כמו 'תקן את הבאג בקובץ X' או 'צור קומפוננטה חדשה'.",
                summaryDetail: "כשמריצים claude, הכלי נכנס למצב אינטראקטיבי. אפשר לכתוב לו בשפה טבעית מה שרוצים. הוא ישאל שאלות הבהרה אם צריך, יציע תוכנית, ויבקש אישור לפני שינויים. אפשר גם להריץ פקודה חד-פעמית: claude -p 'מה עושה הקובץ הזה'.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "איך מתחילים שיחה אינטראקטיבית עם Claude Code?",
                        options: ["מקלידים claude בטרמינל", "פותחים אפליקציה", "נכנסים לאתר", "מריצים python claude.py"],
                        correct: 0,
                        explanation: "פשוט מקלידים claude בטרמינל ומתחילים לכתוב. זה הכל!",
                        wrongExplanations: [null, "Claude Code הוא CLI, לא אפליקציה גרפית.", "זה לא שירות ווב — זה כלי טרמינל.", "Claude Code הוא חבילת npm, לא סקריפט Python."]
                    },
                    {
                        type: "fill-blank",
                        question: "השלימו את הפקודה:",
                        template: "claude ___ 'הסבר מה עושה הקובץ server.js'",
                        options: ["-p", "-r", "-f", "-x"],
                        correct: 0,
                        explanation: "הדגל -p (prompt) מאפשר להריץ פקודה חד-פעמית בלי להיכנס למצב אינטראקטיבי."
                    },
                    {
                        type: "compare",
                        question: "איזו הוראה תיתן תוצאה טובה יותר?",
                        optionA: {
                            label: "הוראה א",
                            text: "תתקן את הבאג"
                        },
                        optionB: {
                            label: "הוראה ב",
                            text: "יש שגיאת TypeError בשורה 42 של utils.js — הפונקציה מקבלת null במקום מערך. תתקן"
                        },
                        correct: 1,
                        explanation: "ככל שההוראה ספציפית יותר, Claude Code עובד טוב יותר. ציינו קובץ, שורה, סוג שגיאה — והתוצאה תהיה מדויקת הרבה יותר."
                    },
                    {
                        type: "multiple-choice",
                        question: "מה Claude Code עושה לפני שהוא משנה קובץ?",
                        options: ["מבקש אישור מהמשתמש", "משנה מיד בלי לשאול", "שומר גיבוי אוטומטי", "שולח אימייל"],
                        correct: 0,
                        explanation: "Claude Code תמיד מציג את השינויים המתוכננים ומבקש אישור לפני ביצוע. זה עיקרון בטיחות מרכזי.",
                        wrongExplanations: [null, "Claude Code לא משנה קבצים בלי אישור — זה עיקרון בטיחות.", "הוא לא שומר גיבוי אוטומטי — אתם אחראים על גרסאות (git).", "אין שליחת אימייל כאן."]
                    },
                    {
                        type: "order",
                        question: "סדרו את זרימת העבודה הטיפוסית עם Claude Code:",
                        items: ["נותנים הוראה בשפה טבעית", "Claude Code קורא את הקוד הרלוונטי", "מציג תוכנית שינויים ומבקש אישור", "מבצע את השינויים"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "הזרימה היא: הוראה → קריאת קוד → תוכנית → אישור → ביצוע. Claude Code תמיד מבין את ההקשר לפני שהוא פועל."
                    },
                    {
                        type: "match",
                        question: "התאימו בין הפקודה לפעולה:",
                        pairs: [
                            { left: "claude", right: "כניסה למצב אינטראקטיבי" },
                            { left: "claude -p '...'", right: "פקודה חד-פעמית (one-shot)" },
                            { left: "/help", right: "הצגת עזרה בתוך השיחה" },
                            { left: "/clear", right: "ניקוי היסטוריית השיחה" }
                        ],
                        explanation: "claude לבד = צ'אט אינטראקטיבי. -p = פקודה חד-פעמית. /help ו-/clear הם פקודות פנימיות (slash commands)."
                    }
                ]
            },
            {
                id: 3,
                title: "Slash Commands וניווט בסיסי",
                summary: "Claude Code כולל פקודות מיוחדות שמתחילות ב-/ שמאפשרות לשלוט בשיחה: /help לעזרה, /clear לניקוי, /compact לדחיסה, /model לבחירת מודל, /cost לבדיקת עלות.",
                summaryDetail: "/compact הוא אחד הכלים החשובים ביותר — הוא דוחס את ההיסטוריה ומפנה מקום בחלון ההקשר. /model מאפשר לעבור בין Opus (חזק יותר, יקר) ל-Sonnet (מהיר, זול) ול-Haiku (הכי מהיר, הכי זול). /cost מראה כמה עלתה השיחה עד עכשיו.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה עושה הפקודה /compact?",
                        options: ["דוחסת את ההיסטוריה ומפנה מקום בחלון ההקשר", "סוגרת את Claude Code", "מדפיסה את כל השיחה", "מוחקת את הפרויקט"],
                        correct: 0,
                        explanation: "/compact דוחס את כל ההיסטוריה לסיכום קצר, מה שמפנה מקום ומאפשר לשיחה להמשיך זמן רב יותר.",
                        wrongExplanations: [null, "כדי לצאת מ-Claude Code מקלידים /exit או Ctrl+C.", "אין פקודה כזו — /compact דוחסת, לא מדפיסה.", "Claude Code לא מוחק פרויקטים כברירת מחדל."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין ה-slash command לפעולה:",
                        pairs: [
                            { left: "/help", right: "הצגת כל הפקודות הזמינות" },
                            { left: "/clear", right: "ניקוי מלא של היסטוריית השיחה" },
                            { left: "/compact", right: "דחיסת ההיסטוריה לסיכום קצר" },
                            { left: "/cost", right: "הצגת עלות השיחה הנוכחית" }
                        ],
                        explanation: "כל פקודה מתחילה ב-/ ומבצעת פעולה ספציפית בתוך השיחה."
                    },
                    {
                        type: "fill-blank",
                        question: "כדי לעבור ממודל Sonnet ל-Opus, מקלידים:",
                        template: "/model ___",
                        options: ["opus", "gpt-4", "gemini", "claude-3"],
                        correct: 0,
                        explanation: "/model opus (או /model sonnet, /model haiku) מאפשר לעבור בין מודלים תוך כדי שיחה."
                    },
                    {
                        type: "compare",
                        question: "מתי עדיף להשתמש ב-/compact במקום /clear?",
                        optionA: {
                            label: "אפשרות א",
                            text: "כשרוצים לשמור את ההקשר הכללי אבל לפנות מקום בזיכרון"
                        },
                        optionB: {
                            label: "אפשרות ב",
                            text: "כשרוצים להתחיל נושא חדש לגמרי מאפס"
                        },
                        correct: 0,
                        explanation: "/compact שומר סיכום של מה שהיה — מושלם כשממשיכים באותו נושא. /clear מוחק הכל — מתאים כשמתחילים נושא חדש לגמרי."
                    },
                    {
                        type: "order",
                        question: "סדרו את המודלים מהמהיר ביותר ליקר ביותר:",
                        items: ["Haiku — הכי מהיר וזול", "Sonnet — איזון בין מהירות ויכולת", "Opus — הכי חזק ויקר"],
                        correctOrder: [0, 1, 2],
                        explanation: "Haiku < Sonnet < Opus מבחינת מחיר ויכולת. Haiku מצוין לסריקות פשוטות, Sonnet לרוב העבודה, Opus למשימות מורכבות."
                    },
                    {
                        type: "improve",
                        question: "מה הדרך הנכונה לבדוק כמה עלתה השיחה?",
                        original: "כמה זה עולה?",
                        options: ["/cost", "/price", "/money", "/billing"],
                        correct: 0,
                        explanation: "/cost מציג את עלות השיחה הנוכחית — כולל טוקנים של קלט ופלט."
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "עבודה עם קבצים ופרויקטים",
        description: "קריאה, כתיבה, עריכה וחיפוש בקוד",
        icon: "📁",
        lessons: [
            {
                id: 4,
                title: "הכלים של Claude Code — Read, Edit, Write",
                summary: "Claude Code משתמש בכלים (Tools) לביצוע פעולות: Read לקריאת קבצים, Edit לעריכה, Write ליצירת קבצים חדשים, Bash להרצת פקודות, Glob לחיפוש קבצים, Grep לחיפוש תוכן.",
                summaryDetail: "כל כלי עושה דבר אחד טוב: Read קורא קובץ ומציג עם מספרי שורות. Edit מחליף טקסט ספציפי (לא כותב מחדש את כל הקובץ). Write יוצר קובץ חדש או כותב מחדש קובץ שלם. Bash מריץ פקודות של (npm, git, etc). Glob מוצא קבצים לפי תבנית (**//.js). Grep מחפש תוכן בתוך קבצים.",
                exercises: [
                    {
                        type: "match",
                        question: "התאימו בין הכלי לפעולה:",
                        pairs: [
                            { left: "Read", right: "קריאת קובץ קיים" },
                            { left: "Edit", right: "עריכת חלק ספציפי בקובץ" },
                            { left: "Write", right: "יצירת קובץ חדש או כתיבה מחדש" },
                            { left: "Bash", right: "הרצת פקודות בטרמינל" }
                        ],
                        explanation: "כל כלי מתמחה בפעולה אחת — Read קורא, Edit עורך טקסט ספציפי, Write כותב קובץ שלם, Bash מריץ פקודות."
                    },
                    {
                        type: "multiple-choice",
                        question: "מה ההבדל בין Edit ל-Write?",
                        options: ["Edit מחליף טקסט ספציפי, Write כותב קובץ שלם", "אין הבדל", "Edit יותר מהיר", "Write לא יכול לערוך קבצים קיימים"],
                        correct: 0,
                        explanation: "Edit מחליף קטע טקסט מסוים בקובץ (כמו Search & Replace). Write כותב את כל הקובץ מחדש או יוצר חדש.",
                        wrongExplanations: [null, "יש הבדל מהותי בדרך הפעולה!", "שניהם פועלים באותה מהירות — ההבדל הוא בגישה.", "Write דווקא כן יכול לכתוב מחדש קבצים קיימים."]
                    },
                    {
                        type: "compare",
                        question: "מה עדיף לשימוש כשרוצים לשנות שורה אחת בקובץ?",
                        optionA: {
                            label: "Edit",
                            text: "מחליף רק את הטקסט הספציפי בלי לגעת בשאר הקובץ"
                        },
                        optionB: {
                            label: "Write",
                            text: "כותב את כל הקובץ מחדש כולל השינוי"
                        },
                        correct: 0,
                        explanation: "Edit הוא בחירה טובה יותר — הוא שולח רק את השינוי (diff), מה שחוסך טוקנים ומפחית סיכוי לשגיאות."
                    },
                    {
                        type: "fill-blank",
                        question: "כדי לחפש קבצי JavaScript בפרויקט, Claude Code ישתמש בכלי:",
                        template: "___",
                        options: ["Glob", "Read", "Bash", "Write"],
                        correct: 0,
                        explanation: "Glob מוצא קבצים לפי תבנית — לדוגמה **/*.js ימצא את כל קבצי ה-JavaScript בפרויקט."
                    },
                    {
                        type: "order",
                        question: "סדרו את הזרימה הנכונה לתיקון באג:",
                        items: ["Glob — מציאת הקובץ הרלוונטי", "Read — קריאת הקוד", "Edit — תיקון השגיאה", "Bash — הרצת טסטים לוודא שהתיקון עובד"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קודם מוצאים, אז קוראים, מתקנים, ולבסוף מוודאים. זו זרימה טבעית של debugging."
                    },
                    {
                        type: "multiple-choice",
                        question: "מה ההבדל בין Glob ל-Grep?",
                        options: ["Glob מחפש שמות קבצים, Grep מחפש תוכן בתוך קבצים", "Glob יותר מהיר", "Grep עובד רק עם Python", "אין הבדל"],
                        correct: 0,
                        explanation: "Glob מוצא קבצים לפי תבנית שם (*.js, **/*.css). Grep מחפש טקסט בתוך תוכן הקבצים (כמו 'function handleClick').",
                        wrongExplanations: [null, "שניהם מהירים — ההבדל הוא במה שהם מחפשים.", "Grep עובד עם כל סוג קובץ.", "יש הבדל ברור — שם קובץ vs תוכן."]
                    }
                ]
            },
            {
                id: 5,
                title: "CLAUDE.md — החוקה של הפרויקט",
                summary: "CLAUDE.md הוא קובץ מיוחד שנטען אוטומטית בתחילת כל שיחה. הוא מגדיר לClaude Code את החוקים, הסגנון, הארכיטקטורה והעדפות של הפרויקט. זה כמו README — אבל עבור Claude.",
                summaryDetail: "כל פרויקט רציני צריך CLAUDE.md. זה המקום לכתוב: סטאק טכנולוגי, מבנה תיקיות, קונבנציות קוד, פקודות build/test, ומה Claude לא צריך לעשות. ככל שה-CLAUDE.md מדויק יותר, Claude Code עובד טוב יותר.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מתי CLAUDE.md נטען?",
                        options: ["אוטומטית בתחילת כל שיחה", "רק כשמבקשים", "פעם ביום", "רק בפעם הראשונה"],
                        correct: 0,
                        explanation: "CLAUDE.md נטען אוטומטית בכל פעם ש-Claude Code נפתח בתיקיית הפרויקט. לא צריך לבקש — הוא תמיד שם.",
                        wrongExplanations: [null, "הוא נטען אוטומטית, בלי צורך לבקש.", "הוא נטען בכל שיחה, לא פעם ביום.", "הוא נטען בכל שיחה, לא רק בראשונה."]
                    },
                    {
                        type: "order",
                        question: "מה כדאי לכלול ב-CLAUDE.md? סדרו לפי חשיבות:",
                        items: ["סטאק טכנולוגי ופקודות build", "קונבנציות קוד ומבנה פרויקט", "מה Claude לא צריך לעשות", "סגנון קומיטים והעדפות"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "הכי חשוב: מה הסטאק ואיך בונים. אח\"כ: קונבנציות. אח\"כ: מגבלות. ולבסוף: סגנון."
                    },
                    {
                        type: "compare",
                        question: "איזה CLAUDE.md טוב יותר?",
                        optionA: {
                            label: "גרסה א",
                            text: "זה פרויקט React. תכתוב קוד טוב."
                        },
                        optionB: {
                            label: "גרסה ב",
                            text: "Stack: React 19 + Vite + Tailwind 4. Commands: npm run dev (port 3000), npm test. Style: functional components, Hebrew comments, RTL-first."
                        },
                        correct: 1,
                        explanation: "ככל שה-CLAUDE.md ספציפי ומפורט יותר, Claude Code נותן תוצאות טובות יותר. גרסה ב מגדירה סטאק, פקודות, וסגנון במדויק."
                    },
                    {
                        type: "fill-blank",
                        question: "CLAUDE.md ממוקם ב:",
                        template: "___ של הפרויקט",
                        options: ["שורש (root)", "תיקיית src", "תיקיית .git", "תיקיית node_modules"],
                        correct: 0,
                        explanation: "CLAUDE.md נמצא בשורש הפרויקט (root directory) — באותה רמה כמו package.json או README.md."
                    },
                    {
                        type: "improve",
                        question: "איך לשפר את ה-CLAUDE.md הזה?",
                        original: "פרויקט וובסייט",
                        options: ["Stack: Next.js 15, TypeScript, Tailwind. Build: npm run build. Test: npm test. Style: RTL Hebrew, components in src/components/", "תכתוב קוד טוב", "אל תעשה שגיאות", "השתמש ב-React"],
                        correct: 0,
                        explanation: "CLAUDE.md טוב מפרט: סטאק מדויק, פקודות build/test, מבנה תיקיות, וסגנון. לא הוראות כלליות.",
                        wrongExplanations: [null, "זה כללי מדי — Claude Code צריך פרטים ספציפיים.", "זו הוראה שלילית וכללית — עדיף לומר מה כן לעשות.", "זה לא מספיק — צריך גרסה, כלים, ומבנה."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג ההוראה למיקום הנכון:",
                        pairs: [
                            { left: "CLAUDE.md בשורש", right: "הוראות כלליות לפרויקט" },
                            { left: "CLAUDE.md בתיקיית משנה", right: "הוראות ספציפיות לחלק מסוים" },
                            { left: "~/.claude/CLAUDE.md", right: "העדפות אישיות גלובליות" },
                            { left: ".claude/settings.json", right: "הגדרות הרשאות ו-hooks" }
                        ],
                        explanation: "יש היררכיה: גלובלי → שורש פרויקט → תיקיות משנה. כל אחד מוסיף שכבה של הוראות."
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "הרשאות ובטיחות",
        description: "מערכת ההרשאות, מצבים, ומה Claude Code לא יעשה בלי אישור",
        icon: "🛡️",
        lessons: [
            {
                id: 6,
                title: "מערכת ההרשאות — Permission Modes",
                summary: "Claude Code עובד ב-3 מצבי הרשאות: Default (מבקש אישור על כל פעולה), Auto-edit (מאשר קריאה וכתיבה אוטומטית), ו-YOLO (מאשר הכל כולל bash). Default הוא המומלץ למתחילים.",
                summaryDetail: "במצב Default, Claude Code שואל לפני כל כתיבה לקובץ והרצת פקודה. במצב Auto-edit, הוא יכול לקרוא ולכתוב קבצים בלי לשאול, אבל עדיין שואל לפני bash. במצב YOLO — הכל מותר, כולל bash. זה מצב מסוכן ומומלץ רק למשתמשים מנוסים.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מהו מצב ההרשאות המומלץ למתחילים?",
                        options: ["Default — מבקש אישור על כל פעולה", "Auto-edit — מאשר קריאה/כתיבה אוטומטית", "YOLO — מאשר הכל", "Admin — מצב מנהל"],
                        correct: 0,
                        explanation: "Default הוא הבטוח ביותר — Claude Code מבקש אישור לפני כל שינוי. כך אתם תמיד בשליטה.",
                        wrongExplanations: [null, "Auto-edit מתאים למשתמשים שכבר מכירים את הכלי.", "YOLO מסוכן — Claude Code יכול להריץ כל פקודה בלי אישור!", "אין מצב Admin ב-Claude Code."]
                    },
                    {
                        type: "order",
                        question: "סדרו את מצבי ההרשאות מהבטוח ביותר למסוכן:",
                        items: ["Default — אישור על הכל", "Auto-edit — קריאה/כתיבה אוטומטית", "YOLO — הכל מותר כולל bash"],
                        correctOrder: [0, 1, 2],
                        explanation: "Default הכי בטוח (אישור על הכל) → Auto-edit (אישור אוטומטי על קבצים) → YOLO (אין בקרה כלל)."
                    },
                    {
                        type: "compare",
                        question: "מתי כדאי לעבור ממצב Default למצב Auto-edit?",
                        optionA: {
                            label: "מצב א",
                            text: "כשמבצעים refactoring נרחב שדורש הרבה שינויים בקבצים ואתם בוטחים ב-Claude Code"
                        },
                        optionB: {
                            label: "מצב ב",
                            text: "כשעובדים על פרויקט חדש בפעם הראשונה"
                        },
                        correct: 0,
                        explanation: "Auto-edit חוסך אישורים חוזרים כש-Claude Code מבצע הרבה שינויים. בפרויקט חדש, עדיף Default כדי להבין מה קורה."
                    },
                    {
                        type: "match",
                        question: "התאימו בין המצב להתנהגות:",
                        pairs: [
                            { left: "Default", right: "שואל לפני כל Write, Edit ו-Bash" },
                            { left: "Auto-edit", right: "כותב קבצים בחופשיות, שואל רק על Bash" },
                            { left: "YOLO", right: "מבצע הכל בלי לשאול" },
                            { left: "settings.json", right: "מגדיר הרשאות ספציפיות לפי פקודה" }
                        ],
                        explanation: "כל מצב מגדיר רמת אוטונומיה שונה. settings.json מאפשר התאמה אישית מעבר ל-3 המצבים."
                    },
                    {
                        type: "fill-blank",
                        question: "כדי לאפשר ל-Claude Code להריץ npm test בלי אישור, מגדירים את זה ב:",
                        template: "___",
                        options: ["settings.json", "CLAUDE.md", "package.json", ".gitignore"],
                        correct: 0,
                        explanation: "settings.json (ב-.claude/) מאפשר להגדיר הרשאות ספציפיות — כמו 'npm test מותר בלי אישור'."
                    },
                    {
                        type: "multiple-choice",
                        question: "מה קורה כשמסרבים לאישור פעולה?",
                        options: ["Claude Code מחפש דרך אחרת או שואל מה לעשות", "Claude Code נסגר", "Claude Code מבצע בכל זאת", "הפקודה נשמרת להרצה אחר כך"],
                        correct: 0,
                        explanation: "כשמסרבים, Claude Code מכבד את ההחלטה ומחפש גישה חלופית או שואל כיצד להמשיך.",
                        wrongExplanations: [null, "הוא לא נסגר — ממשיך את השיחה.", "הוא אף פעם לא מבצע פעולה שסורבה!", "אין תור של פעולות — הוא פשוט מתאים את הגישה."]
                    }
                ]
            },
            {
                id: 7,
                title: "Git ובטיחות — מה Claude Code לא יעשה",
                summary: "Claude Code מתנהג בזהירות עם Git: יוצר commits חדשים (לא amend), לא עושה force push, לא מוחק branches, ולא מדלג על hooks. הוא מבין שפעולות הרסניות הן בלתי הפיכות.",
                summaryDetail: "עקרון מפתח: 'מדוד פעמיים, חתוך פעם אחת'. Claude Code לא יעשה git push --force, git reset --hard, או rm -rf בלי אישור מפורש. הוא גם לא יוסיף קבצים רגישים (.env, credentials) ל-git. כשיש קונפליקט — הוא ינסה לפתור, לא למחוק.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה Claude Code עושה כש-pre-commit hook נכשל?",
                        options: ["מתקן את הבעיה ויוצר commit חדש", "מדלג על ה-hook עם --no-verify", "מוחק את ה-hook", "מפסיק לעבוד"],
                        correct: 0,
                        explanation: "Claude Code לא מדלג על hooks! הוא מתקן את הבעיה (lint, format) ויוצר commit חדש — לא amend.",
                        wrongExplanations: [null, "Claude Code לא ידלג על hooks — זה עיקרון בטיחות.", "הוא לא ימחק hooks — הם שם מסיבה!", "הוא לא מפסיק — הוא מתקן ומנסה שוב."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין הפעולה להתנהגות של Claude Code:",
                        pairs: [
                            { left: "git push --force", right: "לא יבצע בלי אישור מפורש" },
                            { left: "git commit", right: "תמיד commit חדש, לא amend" },
                            { left: "קבצי .env", right: "לא יוסיף ל-git, יזהיר" },
                            { left: "merge conflict", right: "ינסה לפתור, לא למחוק" }
                        ],
                        explanation: "Claude Code תמיד בוחר את הגישה הבטוחה: commit חדש, לא force push, לא לגעת בסודות, לפתור קונפליקטים."
                    },
                    {
                        type: "compare",
                        question: "מה עדיף כש-Claude Code צריך לעדכן commit אחרון?",
                        optionA: {
                            label: "git commit --amend",
                            text: "משנה את ה-commit האחרון, עלול לגרום לבעיות אם כבר נדחף"
                        },
                        optionB: {
                            label: "git commit חדש",
                            text: "יוצר commit חדש עם התיקון, תמיד בטוח"
                        },
                        correct: 1,
                        explanation: "Claude Code תמיד מעדיף commit חדש — זה בטוח יותר ולא משנה היסטוריה שכבר נדחפה."
                    },
                    {
                        type: "fill-blank",
                        question: "העיקרון של Claude Code עם פעולות מסוכנות:",
                        template: "מדוד ___, חתוך פעם אחת",
                        options: ["פעמיים", "שלוש פעמים", "עשר פעמים", "פעם אחת"],
                        correct: 0,
                        explanation: "'מדוד פעמיים, חתוך פעם אחת' — Claude Code בודק פעמיים לפני פעולות בלתי הפיכות."
                    },
                    {
                        type: "order",
                        question: "סדרו את הפעולות מבטוחה למסוכנת:",
                        items: ["קריאת קובץ (Read)", "עריכת קובץ (Edit)", "הרצת npm test (Bash)", "git push --force (Bash)"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קריאה בטוחה לגמרי. עריכה הפיכה עם git. npm test בטוח בדרך כלל. force push — מסוכן ובלתי הפיך."
                    },
                    {
                        type: "identify",
                        question: "סמנו את הפקודה המסוכנת שClaude Code לא יריץ בלי אישור:",
                        text: "git add . && git commit -m 'fix' && git push --force origin main && echo 'done'",
                        correctRange: [40, 71],
                        explanation: "git push --force origin main היא הפקודה המסוכנת — היא דורסת היסטוריה בשרת ויכולה למחוק עבודה של אחרים."
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "טכניקות עבודה יעילות",
        description: "איך לתת הוראות טובות, לחסוך טוקנים, ולעבוד חכם",
        icon: "⚡",
        lessons: [
            {
                id: 8,
                title: "Prompt Engineering ל-Claude Code",
                summary: "הוראות טובות = תוצאות טובות. שלושה עקרונות: ספציפיות (מה בדיוק לעשות, באיזה קובץ, איזה סגנון), הקשר (מה הבעיה, מה ניסינו), ומגבלות (מה לא לשנות, מה לא לגעת בו).",
                summaryDetail: "הוראה טובה ל-Claude Code כוללת: מה לעשות (פועל ברור), איפה (קובץ/תיקייה), איך (סגנון, קונבנציות), ומה לא (מגבלות). דוגמה: 'הוסף ולידציה של אימייל לטופס ב-ContactForm.tsx, השתמש ב-zod, אל תשנה את הסטיילינג'.",
                exercises: [
                    {
                        type: "compare",
                        question: "איזו הוראה טובה יותר?",
                        optionA: {
                            label: "הוראה א",
                            text: "תתקן את הבאג"
                        },
                        optionB: {
                            label: "הוראה ב",
                            text: "ב-UserForm.tsx שורה 87 יש TypeError: cannot read 'name' of undefined. הסיבה: formData יכול להיות null. תוסיף null check"
                        },
                        correct: 1,
                        explanation: "הוראה ב ספציפית: קובץ, שורה, סוג שגיאה, סיבה, ופתרון רצוי. Claude Code יטפל בזה מיד בלי חיפושים מיותרים."
                    },
                    {
                        type: "improve",
                        question: "שפרו את ההוראה הזו:",
                        original: "תעשה כפתור",
                        options: ["צור כפתור 'שלח' בטופס ContactForm.tsx, כחול עם hover effect, disabled כשהטופס לא תקין, בסגנון shadcn/ui", "תכתוב קוד של כפתור", "צור button component", "הוסף כפתור לאתר"],
                        correct: 0,
                        explanation: "הוראה טובה מפרטת: מה (כפתור שלח), איפה (ContactForm.tsx), איך (כחול, hover, disabled), סגנון (shadcn/ui).",
                        wrongExplanations: [null, "כללי מדי — אין קובץ, סגנון, או התנהגות.", "קצת יותר טוב, אבל עדיין חסר מיקום, סגנון, והתנהגות.", "מאוד כללי — Claude Code לא ידע לאיזה דף, איזה סגנון, מה הכפתור עושה."]
                    },
                    {
                        type: "multiple-choice",
                        question: "למה חשוב לציין מה Claude Code לא צריך לשנות?",
                        options: ["כדי שלא ישנה קוד שעובד טוב", "כי הוא תמיד משנה הכל", "כדי לחסוך זמן", "זה לא חשוב"],
                        correct: 0,
                        explanation: "מגבלות מונעות שינויים לא רצויים. 'אל תשנה את הסטיילינג' או 'אל תגע בקובץ X' שומרים על קוד שעובד.",
                        wrongExplanations: [null, "הוא לא משנה הכל, אבל מגבלות עוזרות לו להתמקד.", "זה יותר מחיסכון זמן — זה שמירה על קוד תקין.", "זה מאוד חשוב לתוצאות טובות!"]
                    },
                    {
                        type: "order",
                        question: "סדרו את מרכיבי ההוראה הטובה:",
                        items: ["מה לעשות (פועל ברור)", "איפה (קובץ/מיקום)", "איך (סגנון/קונבנציות)", "מה לא לשנות (מגבלות)"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קודם מה, אז איפה, אז איך, ולבסוף מגבלות. ככל שמפרטים יותר — התוצאה טובה יותר."
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג ההוראה לדוגמה:",
                        pairs: [
                            { left: "ספציפית", right: "תקן TypeError בשורה 42 של utils.js" },
                            { left: "עם הקשר", right: "אחרי שינוי X, הטסט Y נכשל" },
                            { left: "עם מגבלות", right: "שנה רק את הפונקציה Z, אל תגע בשאר" },
                            { left: "כללית (רע)", right: "תתקן את הקוד" }
                        ],
                        explanation: "הוראות ספציפיות, עם הקשר ומגבלות נותנות תוצאות הכי טובות. הוראות כלליות גורמות לניחושים."
                    },
                    {
                        type: "fill-blank",
                        question: "שלושת עקרונות ההוראה הטובה:",
                        template: "ספציפיות, הקשר, ___",
                        options: ["מגבלות", "אורך", "פורמליות", "תכיפות"],
                        correct: 0,
                        explanation: "ספציפיות (מה בדיוק), הקשר (למה, מה הבעיה), מגבלות (מה לא לשנות) — שלושת המפתחות."
                    }
                ]
            },
            {
                id: 9,
                title: "חיסכון בטוקנים ויעילות",
                summary: "טוקנים עולים כסף. עקרונות חיסכון: /compact בין נושאים, /clear כשמחליפים נושא, משימה אחת לשיחה, טוענים רק קבצים רלוונטיים, משתמשים ב-Haiku למשימות פשוטות.",
                summaryDetail: "כל מילה שClaude Code קורא או כותב = טוקנים = כסף. אסטרטגיות: 1) /compact כשההיסטוריה גדלה. 2) /clear כשמתחילים נושא חדש. 3) משימה אטומית — דבר אחד בכל שיחה. 4) לא טוענים כל הפרויקט — רק מה שצריך. 5) /model haiku לסריקות פשוטות.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה הדרך הכי טובה לחסוך טוקנים כשמחליפים נושא?",
                        options: ["/clear — ניקוי מלא של ההיסטוריה", "להמשיך באותה שיחה", "לסגור ולפתוח מחדש", "לשלוח הודעה ריקה"],
                        correct: 0,
                        explanation: "/clear מנקה את כל ההיסטוריה ומתחיל חדש. ככה לא גוררים הקשר לא רלוונטי שעולה טוקנים.",
                        wrongExplanations: [null, "להמשיך באותה שיחה בזבוז טוקנים — Claude Code קורא את כל ההיסטוריה כל פעם.", "לסגור ולפתוח עובד, אבל /clear יותר מהיר.", "הודעה ריקה לא עוזרת."]
                    },
                    {
                        type: "compare",
                        question: "איזו גישה חוסכת יותר טוקנים?",
                        optionA: {
                            label: "גישה א",
                            text: "שיחה ארוכה אחת שמטפלת ב-5 באגים שונים"
                        },
                        optionB: {
                            label: "גישה ב",
                            text: "5 שיחות קצרות — באג אחד לכל שיחה עם /clear ביניהן"
                        },
                        correct: 1,
                        explanation: "שיחות קצרות וממוקדות חוסכות טוקנים. בשיחה ארוכה, Claude Code קורא את כל ההיסטוריה בכל תשובה — כולל באגים שכבר תוקנו."
                    },
                    {
                        type: "order",
                        question: "סדרו את האסטרטגיות מהכי חוסכת להכי בזבזנית:",
                        items: ["/model haiku + משימה ממוקדת", "/model sonnet + /compact תכוף", "/model opus + שיחה ארוכה בלי compact", "/model opus + טעינת כל הפרויקט"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "Haiku + מיקוד = הכי חסכוני. Opus + שיחה ארוכה + הכל טעון = הכי יקר."
                    },
                    {
                        type: "fill-blank",
                        question: "עיקרון העבודה היעילה: משימה ___ לכל שיחה",
                        template: "משימה ___ לכל שיחה",
                        options: ["אחת", "אינסופית", "גדולה", "מורכבת"],
                        correct: 0,
                        explanation: "משימה אטומית — דבר אחד לכל שיחה. ככה ההקשר ממוקד והטוקנים לא מתבזבזים."
                    },
                    {
                        type: "match",
                        question: "התאימו בין המודל לשימוש האידיאלי:",
                        pairs: [
                            { left: "Haiku", right: "סריקות פשוטות, שאלות מהירות" },
                            { left: "Sonnet", right: "רוב העבודה היומיומית" },
                            { left: "Opus", right: "משימות מורכבות, ארכיטקטורה" },
                            { left: "/compact", right: "כשההיסטוריה תופסת יותר מדי מקום" }
                        ],
                        explanation: "כל מודל מתאים למשהו אחר. חכם = להתאים את המודל למשימה."
                    },
                    {
                        type: "improve",
                        question: "איך לשפר את צורת העבודה הזו?",
                        original: "פותח שיחה אחת ארוכה, שואל 10 שאלות על 10 נושאים שונים, לא עושה compact",
                        options: ["שיחה קצרה לכל נושא, /clear בין נושאים, /compact כשההיסטוריה גדלה", "ממשיך באותה שיחה כי כבר יש הקשר", "שולח הודעות יותר קצרות", "משתמש רק ב-Opus"],
                        correct: 0,
                        explanation: "שיחות ממוקדות + /clear + /compact = חיסכון משמעותי בטוקנים ותוצאות טובות יותר.",
                        wrongExplanations: [null, "הקשר מנושאים אחרים מבזבז טוקנים ומבלבל.", "אורך ההודעה פחות חשוב מאורך ההיסטוריה.", "Opus הוא הכי יקר — לא תמיד צריך אותו."]
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Hooks, MCP וכלים מתקדמים",
        description: "אוטומציות, שרתי MCP, ועבודה עם סוכנים",
        icon: "🔧",
        lessons: [
            {
                id: 10,
                title: "Hooks — אוטומציות בClaude Code",
                summary: "Hooks הם פקודות shell שרצות אוטומטית בתגובה לאירועים. לדוגמה: hook שמריץ lint אחרי כל Edit, או hook שמוסיף תוכן לפני כל שיחה. מוגדרים ב-settings.json.",
                summaryDetail: "יש 4 סוגי hooks: PreToolUse (לפני שכלי רץ), PostToolUse (אחרי), Notification (כשClaude Code שולח הודעה), Stop (כשClaude Code מסיים). כל hook מקבל JSON עם פרטי האירוע ויכול לחסום, לאשר, או להוסיף תוכן. דוגמה: PostToolUse על Write → מריץ eslint --fix.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה הם Hooks ב-Claude Code?",
                        options: ["פקודות shell שרצות אוטומטית בתגובה לאירועים", "תוספים גרפיים", "פונקציות JavaScript", "סוג של API"],
                        correct: 0,
                        explanation: "Hooks הם shell commands שמוגדרים ב-settings.json ורצים אוטומטית כשמתרחש אירוע מסוים (כמו Edit או Write).",
                        wrongExplanations: [null, "Hooks הם CLI-based, לא גרפיים.", "הם פקודות shell, לא פונקציות JS.", "הם לא API — הם אוטומציות מקומיות."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג ה-Hook לתזמון:",
                        pairs: [
                            { left: "PreToolUse", right: "לפני שכלי רץ — יכול לחסום" },
                            { left: "PostToolUse", right: "אחרי שכלי סיים — יכול להוסיף" },
                            { left: "Notification", right: "כש-Claude Code שולח הודעה" },
                            { left: "Stop", right: "כש-Claude Code מסיים את התשובה" }
                        ],
                        explanation: "כל hook רץ בזמן אחר — Pre לפני, Post אחרי, Notification על הודעות, Stop בסיום."
                    },
                    {
                        type: "compare",
                        question: "איזה שימוש ב-Hook יעיל יותר?",
                        optionA: {
                            label: "Hook א",
                            text: "PostToolUse על Write → מריץ eslint --fix אוטומטית"
                        },
                        optionB: {
                            label: "Hook ב",
                            text: "לזכור להריץ eslint ידנית אחרי כל שינוי"
                        },
                        correct: 0,
                        explanation: "Hook אוטומטי מבטיח ש-linting תמיד רץ — בלי לסמוך על הזיכרון. זה חוסך זמן ושגיאות."
                    },
                    {
                        type: "fill-blank",
                        question: "Hooks מוגדרים בקובץ:",
                        template: "___",
                        options: ["settings.json", "CLAUDE.md", "package.json", "hooks.js"],
                        correct: 0,
                        explanation: "כל ה-hooks מוגדרים ב-.claude/settings.json — שם מגדירים גם הרשאות והגדרות אחרות."
                    },
                    {
                        type: "order",
                        question: "סדרו את שלבי הגדרת Hook:",
                        items: ["בוחרים אירוע (PreToolUse/PostToolUse/...)", "מגדירים matcher — על אילו כלים", "כותבים את פקודת ה-shell", "מוסיפים ל-settings.json"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קודם בוחרים אירוע, אז מגדירים על מה הוא רץ, כותבים את הפקודה, ומוסיפים לקובץ ההגדרות."
                    }
                ]
            },
            {
                id: 11,
                title: "MCP — הרחבת היכולות",
                summary: "MCP (Model Context Protocol) מאפשר ל-Claude Code להתחבר לשרתים חיצוניים ולהרחיב את היכולות שלו. לדוגמה: שרת MCP ל-Chrome DevTools, Figma, Slack, GitHub, או כל API אחר.",
                summaryDetail: "שרת MCP רץ כתהליך נפרד ומספק 'כלים' נוספים ל-Claude Code. לדוגמה, שרת chrome-devtools נותן יכולת לצלם screenshot, ללחוץ על אלמנטים, ולנווט בדפדפן. שרתי MCP מוגדרים ב-settings.json ונטענים אוטומטית.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה MCP מאפשר?",
                        options: ["חיבור Claude Code לשירותים חיצוניים", "התקנת Claude Code", "שינוי ממשק", "שמירת קבצים"],
                        correct: 0,
                        explanation: "MCP = Model Context Protocol. הוא מרחיב את Claude Code עם כלים חדשים — כמו גישה לדפדפן, APIs, ושירותים.",
                        wrongExplanations: [null, "MCP לא קשור להתקנה.", "MCP לא משנה ממשק.", "Claude Code כבר יודע לשמור קבצים בלי MCP."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין שרת MCP ליכולת:",
                        pairs: [
                            { left: "chrome-devtools", right: "שליטה בדפדפן, screenshots, ניווט" },
                            { left: "GitHub MCP", right: "יצירת PR, issues, code review" },
                            { left: "Slack MCP", right: "שליחת הודעות, קריאת ערוצים" },
                            { left: "Filesystem MCP", right: "גישה לקבצים מחוץ לפרויקט" }
                        ],
                        explanation: "כל שרת MCP מוסיף יכולות ספציפיות — Chrome DevTools לדפדפן, GitHub ל-Git, Slack להודעות."
                    },
                    {
                        type: "fill-blank",
                        question: "שרתי MCP מוגדרים ב:",
                        template: "___",
                        options: ["settings.json", "CLAUDE.md", "mcp.config", "server.js"],
                        correct: 0,
                        explanation: "שרתי MCP מוגדרים ב-.claude/settings.json, באותו קובץ כמו hooks והרשאות."
                    },
                    {
                        type: "compare",
                        question: "מה היתרון של MCP על API ישיר?",
                        optionA: {
                            label: "MCP",
                            text: "Claude Code יודע להשתמש בכלי אוטומטית — מגלה, מבין, ומפעיל בלי קוד"
                        },
                        optionB: {
                            label: "API ישיר",
                            text: "צריך לכתוב קוד שמתחבר ל-API, לטפל בauth, ולפרסר תשובות"
                        },
                        correct: 0,
                        explanation: "MCP חושף כלים ש-Claude Code יכול להשתמש בהם ישירות — בלי לכתוב קוד אינטגרציה. זה כמו לתת לו כלי עבודה מוכנים."
                    },
                    {
                        type: "order",
                        question: "סדרו את השלבים להוספת שרת MCP:",
                        items: ["התקנת חבילת MCP (npm install)", "הוספת הגדרה ל-settings.json", "הפעלה מחדש של Claude Code", "שימוש בכלים החדשים בשיחה"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "מתקינים, מגדירים, מפעילים מחדש — ואז הכלים זמינים אוטומטית."
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "עבודה עם Sub-Agents",
        description: "אורקסטרציה, delegation, ועבודה במקביל",
        icon: "🤖",
        lessons: [
            {
                id: 12,
                title: "Sub-Agents — האצלת משימות",
                summary: "Claude Code יכול להפעיל sub-agents — סוכנים קטנים שמבצעים משימות ספציפיות. Agent של Explore לחקירת קוד, Plan לתכנון, ו-general-purpose למשימות מורכבות. הם רצים במקביל וחוזרים עם תוצאות.",
                summaryDetail: "Sub-agents הם כמו עובדים שClaude Code שולח לבצע משימות. Agent explore סורק את הקוד. Agent plan מתכנן אסטרטגיה. כל agent מקבל הקשר ומחזיר תוצאה. היתרון: עבודה במקביל (כמה agents בו-זמנית) והגנה על חלון ההקשר הראשי.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "למה משתמשים ב-sub-agents?",
                        options: ["להאציל משימות ולהגן על חלון ההקשר", "כי Claude Code לא יכול לקרוא קבצים", "כדי לשנות שפת תכנות", "כדי לחסוך כסף"],
                        correct: 0,
                        explanation: "Sub-agents מגנים על ההקשר הראשי — תוצאות גולמיות נשארות אצלם, ורק הסיכום חוזר.",
                        wrongExplanations: [null, "Claude Code קורא קבצים מצוין — agents עוזרים בפרלליזם.", "שפת התכנות לא קשורה ל-agents.", "Sub-agents לא בהכרח חוסכים כסף — הם חוסכים הקשר."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג Agent למתי להשתמש בו:",
                        pairs: [
                            { left: "Explore", right: "חיפוש קוד, סריקת פרויקט" },
                            { left: "Plan", right: "תכנון ארכיטקטורה, אסטרטגיה" },
                            { left: "general-purpose", right: "משימות מורכבות רב-שלביות" },
                            { left: "הפעלה במקביל", right: "כשיש משימות בלתי תלויות" }
                        ],
                        explanation: "כל agent מתמחה במשהו — Explore לסריקה, Plan לתכנון, general-purpose לבשר."
                    },
                    {
                        type: "compare",
                        question: "מתי עדיף להשתמש ב-sub-agent במקום לעשות ישירות?",
                        optionA: {
                            label: "Sub-agent",
                            text: "כשצריך לסרוק 50 קבצים, לחפש pattern בכל הפרויקט, או להריץ מחקר"
                        },
                        optionB: {
                            label: "ישירות",
                            text: "כשצריך לקרוא קובץ אחד ספציפי"
                        },
                        correct: 0,
                        explanation: "Sub-agent עדיף כשיש הרבה עבודת סריקה — הוא מגן על ההקשר. לקובץ אחד, ישירות עדיף."
                    },
                    {
                        type: "fill-blank",
                        question: "sub-agents יכולים לרוץ ___ כדי לחסוך זמן",
                        template: "sub-agents יכולים לרוץ ___ כדי לחסוך זמן",
                        options: ["במקביל", "בהמתנה", "בלילה", "פעם בשבוע"],
                        correct: 0,
                        explanation: "כשיש משימות בלתי תלויות, Claude Code יכול להפעיל כמה agents בו-זמנית ולחכות לתוצאות."
                    },
                    {
                        type: "order",
                        question: "סדרו את זרימת העבודה עם sub-agent:",
                        items: ["Claude Code מזהה צורך במשימה", "מפעיל sub-agent עם הוראות ברורות", "Agent מבצע את המשימה באופן עצמאי", "Agent מחזיר תוצאה ל-Claude Code"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "זיהוי צורך → הפעלה → ביצוע עצמאי → החזרת תוצאה. Agent הוא עצמאי אבל מוגבל למשימה."
                    },
                    {
                        type: "improve",
                        question: "מתי לא כדאי להשתמש ב-sub-agent?",
                        original: "כל פעם שצריך לקרוא קובץ",
                        options: ["כשצריך לקרוא קובץ אחד ספציפי — פשוט לקרוא ישירות", "תמיד כדאי להשתמש ב-agent", "רק בפרויקטים גדולים", "רק עם Opus"],
                        correct: 0,
                        explanation: "לקריאת קובץ אחד, Read ישיר מהיר ויעיל יותר. Sub-agents הם overhead — משתמשים בהם רק כשיש תועלת ברורה.",
                        wrongExplanations: [null, "יש overhead ל-agents — לפעמים ישירות עדיף.", "גודל הפרויקט לא הקובע — סוג המשימה.", "agents עובדים עם כל המודלים."]
                    }
                ]
            },
            {
                id: 13,
                title: "Agent SDK — בניית סוכנים מותאמים",
                summary: "Claude Agent SDK מאפשר לבנות agents מותאמים אישית שמשתמשים ב-Claude API. אפשר ליצור agent שעושה code review, מנהל deployment, או כל תהליך אוטומטי. ב-Python וב-TypeScript.",
                summaryDetail: "Agent SDK נותן שלד מוכן לבניית agents: הגדרת כלים (tools), system prompt, ולוגיקת orchestration. Agent יכול לקרוא למודלים שונים, להשתמש בכלים, ולקבל החלטות. זה שימושי כשרוצים לבנות פתרון חוזר — לא רק לשאול Claude שאלה חד-פעמית.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה ההבדל בין Claude Code ל-Agent SDK?",
                        options: ["Claude Code הוא כלי מוכן, Agent SDK הוא ספרייה לבניית כלים מותאמים", "אין הבדל", "Agent SDK יותר חזק", "Claude Code הוא ישן יותר"],
                        correct: 0,
                        explanation: "Claude Code = כלי מוכן לשימוש. Agent SDK = ספרייה שמאפשרת לבנות agents מותאמים אישית לצרכים שלך.",
                        wrongExplanations: [null, "יש הבדל מהותי — אחד מוכן, השני בונים.", "שניהם חזקים — לשימושים שונים.", "שניהם עדכניים."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין הרכיב לתפקיד ב-Agent SDK:",
                        pairs: [
                            { left: "Tools", right: "פעולות שה-agent יכול לבצע" },
                            { left: "System Prompt", right: "ההנחיות וההתנהגות של ה-agent" },
                            { left: "Orchestration", right: "לוגיקת קבלת ההחלטות" },
                            { left: "Model", right: "ה-LLM שמפעיל את ה-agent" }
                        ],
                        explanation: "Agent = Model + Prompt + Tools + Orchestration. כל רכיב קובע חלק מההתנהגות."
                    },
                    {
                        type: "compare",
                        question: "מתי עדיף Agent SDK על Claude Code רגיל?",
                        optionA: {
                            label: "Agent SDK",
                            text: "כשצריך תהליך אוטומטי חוזר שרץ בלי התערבות — כמו CI/CD, monitoring, או bot"
                        },
                        optionB: {
                            label: "Claude Code",
                            text: "כשעובדים אינטראקטיבית על פרויקט ורוצים עזרה מיידית"
                        },
                        correct: 0,
                        explanation: "Agent SDK מתאים לאוטומציה חוזרת. Claude Code מתאים לעבודה אינטראקטיבית. שניהם חזקים — לשימושים שונים."
                    },
                    {
                        type: "fill-blank",
                        question: "Agent SDK זמין ב:",
                        template: "Python ו-___",
                        options: ["TypeScript", "Java", "Go", "Rust"],
                        correct: 0,
                        explanation: "Agent SDK של Anthropic זמין ב-Python (claude_agent_sdk) וב-TypeScript (@anthropic-ai/sdk)."
                    },
                    {
                        type: "order",
                        question: "סדרו את שלבי בניית Agent:",
                        items: ["הגדרת tools (פעולות שה-agent יכול לעשות)", "כתיבת system prompt (התנהגות)", "חיבור למודל (Claude)", "orchestration — לוגיקת זרימה"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "קודם מגדירים מה ה-agent יכול לעשות, אז איך הוא מתנהג, מחברים ל-AI, ומגדירים זרימה."
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        title: "מאסטר — עבודה מתקדמת",
        description: "Extended Thinking, Worktrees, Memory ואסטרטגיות מתקדמות",
        icon: "🏆",
        lessons: [
            {
                id: 14,
                title: "Extended Thinking ותכנון מורכב",
                summary: "Extended Thinking (חשיבה מורחבת) הוא מצב שבו Claude חושב לפני שעונה. ב-Opus, זה מאפשר תכנון עמוק יותר, ניתוח מורכב, ופתרון בעיות קשות. אפשר להפעיל עם --thinking.",
                summaryDetail: "Extended thinking = Claude 'חושב בקול רם' לפני שמגיב. זה שימושי במיוחד ל: ארכיטקטורה מורכבת, debugging קשה, refactoring גדול, או קבלת החלטות. העלות גבוהה יותר אבל האיכות משתפרת משמעותית למשימות מורכבות.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה Extended Thinking עושה?",
                        options: ["מאפשר ל-Claude לחשוב לפני שעונה — תכנון עמוק יותר", "מאיץ את התשובה", "מקטין עלויות", "משנה שפה"],
                        correct: 0,
                        explanation: "Extended Thinking = חשיבה מורחבת. Claude עוצר, חושב, מתכנן, ורק אז מגיב. התוצאות טובות יותר למשימות מורכבות.",
                        wrongExplanations: [null, "זה דווקא לוקח יותר זמן — אבל התוצאה טובה יותר.", "זה עולה יותר — יותר טוקנים.", "שפה לא קשורה ל-thinking mode."]
                    },
                    {
                        type: "compare",
                        question: "מתי כדאי להפעיל Extended Thinking?",
                        optionA: {
                            label: "כדאי",
                            text: "ארכיטקטורה של מערכת חדשה, debugging מורכב, או refactoring גדול"
                        },
                        optionB: {
                            label: "לא כדאי",
                            text: "שינוי טקסט בכפתור, הוספת import, או שאלה פשוטה"
                        },
                        correct: 0,
                        explanation: "Extended Thinking שווה את העלות למשימות מורכבות שדורשות תכנון. למשימות פשוטות — זה בזבוז."
                    },
                    {
                        type: "fill-blank",
                        question: "מצב חשיבה מורחבת מתאים במיוחד למודל:",
                        template: "___",
                        options: ["Opus", "Haiku", "Sonnet", "GPT-4"],
                        correct: 0,
                        explanation: "Opus הוא המודל החזק ביותר — Extended Thinking מנצל את מלוא היכולת שלו לחשיבה עמוקה."
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג המשימה למצב העבודה:",
                        pairs: [
                            { left: "שאלה מהירה", right: "Haiku, בלי thinking" },
                            { left: "קידוד יומיומי", right: "Sonnet, בלי thinking" },
                            { left: "ארכיטקטורה מורכבת", right: "Opus + Extended Thinking" },
                            { left: "Code review", right: "Sonnet/Opus, לפי מורכבות" }
                        ],
                        explanation: "התאמת מודל + thinking mode למשימה = יעילות מקסימלית. לא כל משימה צריכה Opus + thinking."
                    }
                ]
            },
            {
                id: 15,
                title: "Memory, Worktrees ו-Best Practices",
                summary: "Memory מאפשרת ל-Claude Code לזכור דברים בין שיחות. Worktrees מאפשרים עבודה על branches מבודדים. Best practices: atomic tasks, good prompts, right model, CLAUDE.md עדכני.",
                summaryDetail: "Memory נשמרת ב-~/.claude/projects/ וכוללת: מידע על המשתמש (user), פידבק (feedback), פרויקט (project), והפניות (reference). Worktrees הם git worktrees — עותק מבודד של הריפו שclaude code עובד עליו בלי לגעת ב-branch הראשי. Best practices: CLAUDE.md תמיד עדכני, /clear בין נושאים, משימה אטומית, ובחירת מודל נכון.",
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "מה Memory מאפשרת?",
                        options: ["לזכור מידע בין שיחות — העדפות, פידבק, מידע על הפרויקט", "לשמור קבצים", "לגבות את הפרויקט", "להריץ קוד"],
                        correct: 0,
                        explanation: "Memory = זיכרון מתמשך. Claude Code זוכר מי אתם, מה אתם מעדיפים, ומה קרה בשיחות קודמות.",
                        wrongExplanations: [null, "שמירת קבצים זה Write/Edit, לא Memory.", "גיבוי זה git, לא Memory.", "הרצת קוד זה Bash, לא Memory."]
                    },
                    {
                        type: "match",
                        question: "התאימו בין סוג Memory לדוגמה:",
                        pairs: [
                            { left: "user", right: "מפתח senior, מעדיף TypeScript" },
                            { left: "feedback", right: "אל תוסיף comments מיותרים" },
                            { left: "project", right: "merge freeze מתחיל ביום חמישי" },
                            { left: "reference", right: "באגים מתועדים ב-Linear project X" }
                        ],
                        explanation: "4 סוגי זיכרון: user (מי אתה), feedback (מה לשפר), project (מה קורה), reference (איפה למצוא מידע)."
                    },
                    {
                        type: "compare",
                        question: "מתי להשתמש ב-Worktree?",
                        optionA: {
                            label: "Worktree",
                            text: "כשרוצים לבדוק רעיון בלי להשפיע על ה-branch הנוכחי"
                        },
                        optionB: {
                            label: "Branch רגיל",
                            text: "כשרוצים לעבוד על feature חדש בצורה רגילה"
                        },
                        correct: 0,
                        explanation: "Worktree = עותק מבודד. מושלם לניסויים, POCs, או כש-agent צריך לעבוד בלי להפריע. Branch רגיל לעבודה יומיומית."
                    },
                    {
                        type: "order",
                        question: "סדרו את ה-Best Practices לפי חשיבות:",
                        items: ["CLAUDE.md עדכני ומפורט", "משימה אטומית לכל שיחה", "בחירת מודל מתאים למשימה", "/clear בין נושאים"],
                        correctOrder: [0, 1, 2, 3],
                        explanation: "CLAUDE.md הוא הבסיס — בלעדיו Claude Code לא יודע את הכללים. אח\"כ: מיקוד, מודל, וניהול הקשר."
                    },
                    {
                        type: "improve",
                        question: "איך לשפר את זרימת העבודה הזו?",
                        original: "פותחים Claude Code, לא כותבים CLAUDE.md, שואלים שאלות כלליות, ולא עושים clear",
                        options: ["כותבים CLAUDE.md מפורט, נותנים הוראות ספציפיות, /clear בין נושאים, ובוחרים מודל מתאים", "מוסיפים עוד שאלות", "משתמשים רק ב-Opus", "עובדים רק באנגלית"],
                        correct: 0,
                        explanation: "CLAUDE.md + הוראות ספציפיות + /clear + מודל נכון = עבודה יעילה ואיכותית.",
                        wrongExplanations: [null, "כמות שאלות לא משנה — האיכות שלהן כן.", "Opus לא תמיד הבחירה הנכונה — תלוי במשימה.", "Claude Code עובד מצוין בעברית!"]
                    },
                    {
                        type: "fill-blank",
                        question: "Memory נשמרת בתיקייה:",
                        template: "___",
                        options: ["~/.claude/projects/", "~/Documents/", ".git/", "node_modules/"],
                        correct: 0,
                        explanation: "כל הזיכרון נשמר ב-~/.claude/projects/ — תיקייה לכל פרויקט עם קובצי markdown."
                    },
                    {
                        type: "identify",
                        question: "סמנו את הטעות בזרימת העבודה הזו:",
                        text: "פתחתי Claude Code, כתבתי CLAUDE.md, נתתי הוראה ספציפית, עבדתי 3 שעות בלי compact, ואז תהיתי למה זה איטי.",
                        correctRange: [60, 85],
                        explanation: "'עבדתי 3 שעות בלי compact' — ההיסטוריה גדלה וכל תשובה דורשת לקרוא את הכל. /compact מפנה מקום ומשפר מהירות."
                    }
                ]
            }
        ]
    }
];
