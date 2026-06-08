# Tal Travel - Design Guide

## פילוסופיית עיצוב

Tal Travel הוא **app-first** עם תצוגה רספונסיבית מצוינת לדסקטופ. ההשראה היא **TripIt** - אפליקציית נסיעות עם כרטיסים נקיים, אווירה אוורירית, וצבעי פסטל מזמינים.

עקרונות מרכזיים:
- **נקי לפני מקושט** - שדות לבנים, צללים עדינים, רווחים נדיבים
- **כרטיסי תוכן** - כל פריט (טיסה, מלון, אטרקציה) הוא כרטיס מובחן
- **צבעי קטגוריה** - כל סוג מידע מקבל צבע משלו
- **טיפוגרפיה ברורה** - sans-serif, קריא במובייל
- **מעט אנימציה** - אנימציות עדינות בלבד, לא מסחיתות

## צבעים (Color Palette)

### Brand Color: Lavender 💜

הצבע המוביל הוא לבנדר - בהשראת שדות הלבנדר של פורנו (Farm Tomita) שהמשפחה תבקר ביולי. צבע יוצא דופן בשוק (רוב אפליקציות הנסיעות כחולות), נשי-משפחתי-חם.

```css
/* Primary Lavender */
--lavender-50:  #f6f3fb;   /* רקע בהיר מאוד */
--lavender-100: #ece5f6;   /* רקע בהיר */
--lavender-200: #d5c4ec;   /* גבולות */
--lavender-300: #bca0df;   /* הוברים, hint */
--lavender-400: #a07ecf;   /* טקסט משני */
--lavender-500: #8b6fb8;   /* PRIMARY - כפתורים, accent */
--lavender-600: #7556a3;   /* hover מצב primary */
--lavender-700: #5d4585;   /* טקסט primary */
--lavender-800: #45316a;   /* כותרות בהירות */
--lavender-900: #2e2049;   /* טקסט כהה במיוחד */
```

### Neutrals (Slate-warm)

```css
--neutral-50:  #fafafa;
--neutral-100: #f5f5f4;
--neutral-200: #e7e5e4;
--neutral-300: #d6d3d1;
--neutral-400: #a8a29e;
--neutral-500: #78716c;
--neutral-600: #57534e;
--neutral-700: #44403c;
--neutral-800: #292524;
--neutral-900: #1c1917;
```

### Category Colors

לכל סוג של ישות יש צבע יעודי שמסייע לזיהוי מהיר:

```css
--category-flight:      #3b82f6;   /* כחול - טיסות */
--category-hotel:       #8b6fb8;   /* לבנדר - מלונות (Brand) */
--category-activity:    #f59e0b;   /* כתום - אטרקציות */
--category-restaurant:  #ef4444;   /* אדום - מסעדות */
--category-transport:   #14b8a6;   /* טורקיז - תחבורה */
--category-document:    #6366f1;   /* אינדיגו - מסמכים */
--category-task:        #10b981;   /* ירוק - משימות */
```

### Status Colors

```css
--status-success:  #10b981;   /* ירוק */
--status-warning:  #f59e0b;   /* כתום */
--status-error:    #ef4444;   /* אדום */
--status-info:     #3b82f6;   /* כחול */

/* Pastel versions for backgrounds */
--status-success-bg: #d1fae5;
--status-warning-bg: #fef3c7;
--status-error-bg:   #fee2e2;
--status-info-bg:    #dbeafe;
```

### Trip Status Badges

```css
--trip-planning:    #f59e0b;   /* כתום - בתכנון */
--trip-upcoming:    #8b6fb8;   /* לבנדר - קרוב */
--trip-active:      #10b981;   /* ירוק - בטיול עכשיו */
--trip-completed:   #78716c;   /* אפור - הסתיים */
--trip-archived:    #d6d3d1;   /* אפור בהיר - בארכיון */
```

### Dark Mode (V2)

```css
--bg-primary:       #0f0c14;   /* רקע כהה עם נגיעת לבנדר */
--bg-secondary:     #1a1620;
--bg-card:          #221d2a;
--border:           #332940;
--text-primary:     #f5f3ff;
--text-secondary:   #c4b8d8;
```

## טיפוגרפיה

### Font Stack

```css
/* Body & UI - Modern Sans Serif */
--font-body: 'Inter', 'Heebo', system-ui, -apple-system, sans-serif;

/* Display - Slightly distinctive */
--font-display: 'Manrope', 'Heebo', sans-serif;

/* Mono for numbers, codes, times */
--font-mono: 'JetBrains Mono', 'Geist Mono', monospace;
```

**הסבר:**
- **Inter** - הסטנדרט המודרני לאפליקציות. תומך RTL מעולה. קריא במובייל.
- **Heebo** - עברית מעולה, משלים את Inter בצורה הרמונית.
- **Manrope** - לכותרות, גיאומטרי-מודרני, אופציונלי.
- **JetBrains Mono** - לזמני טיסות, אישורים, מספרים. מבדל מהשאר.

### Type Scale

```css
/* Mobile-first scales */
--text-xs:    12px / 16px;   /* labels, captions */
--text-sm:    14px / 20px;   /* body text קטן, secondary */
--text-base:  16px / 24px;   /* body text */
--text-lg:    18px / 28px;   /* highlighted body */
--text-xl:    20px / 28px;   /* sub-headings */
--text-2xl:   24px / 32px;   /* section headings */
--text-3xl:   30px / 36px;   /* page titles */
--text-4xl:   36px / 40px;   /* hero numbers */
--text-5xl:   48px / 1;      /* KPI displays */

/* Weights */
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
```

### Type Usage

```
Trip Card Title:     text-xl font-semibold
Section Header:      text-2xl font-bold
Page Title:          text-3xl font-bold
KPI Number:          text-5xl font-bold
Card Body:           text-base
Caption / Label:     text-xs uppercase tracking-wider
Time / Date:         text-sm font-mono
Status Badge:        text-xs font-medium uppercase
```

## Spacing System

Tailwind defaults (multiples of 4):

```
0.5  = 2px
1    = 4px
2    = 8px
3    = 12px
4    = 16px  ← בסיסי
6    = 24px  ← בין סקציות
8    = 32px  ← בין groups
12   = 48px  ← page padding
16   = 64px  ← hero spacing
```

**כלל אצבע:** padding/margin בכפולות של 4. השתמש ב-spacing scale של Tailwind.

## Border Radius

```css
--radius-sm:    6px;   /* badges, small inputs */
--radius-md:    8px;   /* buttons */
--radius-lg:    12px;  /* cards */
--radius-xl:    16px;  /* hero cards, modals */
--radius-2xl:   24px;  /* trip cards (TripIt style) */
--radius-full:  9999px; /* avatars, FAB buttons */
```

## Shadows

עדינים, לא דרמטיים:

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.03);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.03);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04);

/* Lavender glow for primary buttons */
--shadow-lavender: 0 4px 12px -2px rgb(139 111 184 / 0.3);
```

## Iconography

### Library: Lucide React

```bash
npm install lucide-react
```

**יתרונות:**
- 1,400+ אייקונים יפים ועקביים
- Tree-shakeable
- Stroke-based, מתאים למובייל
- חינמי, MIT

### שימוש

```tsx
import { Plane, Hotel, MapPin, Calendar, Camera, FileText } from 'lucide-react';

<Plane className="w-5 h-5 text-blue-500" />
```

### גדלים סטנדרטיים

```
w-4 h-4 (16px) - inline עם טקסט קטן
w-5 h-5 (20px) - bottom nav, buttons רגילים
w-6 h-6 (24px) - section headers, card icons
w-8 h-8 (32px) - hero icons, empty states
w-12 h-12 (48px) - illustrations
```

### אייקונים מומלצים לכל מודול

```
Trips:        Plane / Globe / Map
Today:        Calendar / Sun / Clock
Hotels:       Hotel / Bed / Building
Flights:      Plane / PlaneTakeoff / PlaneLanding
Attractions:  Camera / MapPin / Star
Tasks:        CheckCircle / ListTodo
Documents:    FileText / Folder / Shield
Expenses:     Wallet / DollarSign / Receipt
Journal:      BookOpen / PenTool
Weather:      Sun / Cloud / Umbrella
Profile:      User / Settings / Bell
```

## ניווט (Navigation)

### Mobile Navigation: Bottom Tab Bar

לפי TripIt screenshots:

```
┌─────────────────────────────────────┐
│                                     │
│         מסך התוכן הנוכחי           │
│                                     │
├─────────────────────────────────────┤
│  🧳        ☀️        📁         👤  │
│ Trips     Today    Docs      Me     │
└─────────────────────────────────────┘
```

**4 לשוניות מקסימום בלשונית התחתונה:**
1. **Trips** (טיולים) - רשימת כל הטיולים
2. **Today** (היום) - מסך פעיל בזמן טיול (הצג רק אם יש טיול פעיל)
3. **Documents** (מסמכים) - גישה מהירה לכל המסמכים
4. **Profile** (פרופיל) - הגדרות, הזמנות, יציאה

**אופציה:** בלשונית פעילה הצג גם label, באחרות רק אייקון (כמו iOS).

### Desktop Navigation: Sidebar שמאלי

```
┌───────────────────────────────────────────────────────┐
│ Tal Travel                          🔍   🔔   👤     │
├─────────┬─────────────────────────────────────────────┤
│         │                                             │
│  🧳     │                                             │
│  Trips  │            Main Content Area                │
│         │                                             │
│  ☀️     │                                             │
│  Today  │         (Master-Detail Layout)              │
│         │                                             │
│  📁     │                                             │
│  Docs   │                                             │
│         │                                             │
│  👤     │                                             │
│  Profile│                                             │
│         │                                             │
├─────────┴─────────────────────────────────────────────┤
```

### בתוך טיול - Tabs/Pills

ניווט אופקי בין מודולים פעילים של הטיול:

```
┌──────────────────────────────────────────────────────┐
│  היום   לוח זמנים   מלונות   טיסות   אטרקציות   ...  │
└──────────────────────────────────────────────────────┘
```

## FAB - Floating Action Button

כפתור עגול בולט לפעולה ראשית בכל מסך:

```
┌────────────────────────────┐
│                            │
│      content here          │
│                            │
│                       (+)  │ ← lavender FAB
│                            │
└────────────────────────────┘
```

```tsx
<button className="
  fixed bottom-24 right-6 
  w-14 h-14 rounded-full
  bg-lavender-500 text-white
  shadow-lavender
  flex items-center justify-center
  hover:bg-lavender-600 active:scale-95
  transition-all
">
  <Plus className="w-6 h-6" />
</button>
```

**מיקום:**
- Mobile: bottom-24 (מעל ה-tab bar)
- Desktop: ב-Detail Pane בפינה הימנית-תחתונה

**פעולה ראשית:**
- במסך Trips: צור טיול חדש
- במסך טיול: הוסף פריט (מודאל בחירת סוג)
- במסך מודול: הוסף פריט מהסוג הזה

## Layouts מרכזיים

### 1. Trip Card (in Trips list)

מבוסס על TripIt:

```
┌─────────────────────────────────────────────┐
│ [תמונת קאבר של היעד]            [Status]   │
│                                             │
│ יפן 2026                                    │
│ ב' 20.7 → ה' 6.8 · 16 לילות               │
│ 5 משתתפים · רוי + לאהי + 3                 │
│                                             │
│ 📍 טוקיו · הוקאידו · 5 בסיסים              │
└─────────────────────────────────────────────┘
```

**Code structure:**
```tsx
<Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
  <div className="aspect-[2/1] relative">
    <Image src={coverUrl} alt={tripName} />
    <Badge className="absolute top-4 right-4">בתכנון</Badge>
  </div>
  <div className="p-5 space-y-2">
    <h3 className="text-xl font-semibold">{tripName}</h3>
    <p className="text-sm text-neutral-600">
      {checkIn} → {checkOut} · {nights} לילות
    </p>
    <div className="flex items-center gap-2 text-sm">
      <Users className="w-4 h-4" />
      {members.length} משתתפים
    </div>
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <MapPin className="w-4 h-4" />
      {destinations}
    </div>
  </div>
</Card>
```

### 2. Hotel Card

```
┌─────────────────────────────────────────────┐
│ 🏨 OMO3 Sapporo Susukino       [להזמין]   │
│ ─────────────────────────────────────────── │
│ סאפורו · Hoshino · עירוני                  │
│                                             │
│ צ'ק-אין:  ה' 23.7 · 15:00                  │
│ צ'ק-אאוט: א' 26.7 · 11:00                  │
│ 3 לילות · ¥35,000/לילה                     │
│                                             │
│ 📎 2 מסמכים   🔗 לאתר   ✏️ ערוך            │
└─────────────────────────────────────────────┘
```

### 3. Flight Card (Boarding Pass Style)

```
┌─────────────────────────────────────────────┐
│ אל על · LY091                  [Booked]    │
│ ─────────────────────────────────────────── │
│  TLV ────✈️────► NRT                        │
│  19:45         13:20 (+1)                  │
│  תל אביב       טוקיו (נריטה)               │
│                                             │
│  ב' 20.7.2026 · 11h 35m · ישירה            │
│  Economy · אישור: ABC123                    │
└─────────────────────────────────────────────┘
```

### 4. Today Screen (Mobile, in trip)

```
┌─────────────────────────────────────────────┐
│ היום · ה' 23.7                              │
│ יום 4 מתוך 18                              │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ 🌤️ סאפורו · 23°C / 17°C · בהיר            │
│                                             │
│ 📌 הלילה ב-OMO3 Sapporo Susukino           │
│    צ'ק-אין מ-15:00                         │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ ⏰ מה צפוי היום                              │
│                                             │
│ 08:00  ─●  טיסה HND → CTS                  │
│            ANA 0061 · אישור ABC123          │
│            📎 כרטיס עלייה                   │
│                                             │
│ 10:30  ─●  איסוף רכב שכור                  │
│            Times Car Rental · CTS Airport   │
│                                             │
│ 14:00  ─●  צ'ק-אין במלון                   │
│            OMO3 Sapporo Susukino            │
│                                             │
│ 18:00  ─○  פסטיבל הקיץ של סאפורו           │
│            פארק Odori                       │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ [→ ראה את כל לוח הזמנים]                   │
└─────────────────────────────────────────────┘
```

## Components Library (shadcn/ui)

קומפוננטים שצריך להתקין:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label
npx shadcn-ui@latest add badge avatar dialog
npx shadcn-ui@latest add tabs select dropdown-menu
npx shadcn-ui@latest add toast progress
npx shadcn-ui@latest add sheet accordion
npx shadcn-ui@latest add calendar date-picker
```

## אנימציות

עדינות, פונקציונליות, לא מסחיתות:

```css
/* Transitions standard */
.transition-default {
  transition: all 0.15s ease-out;
}

/* Card hover */
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Button press */
.button-press:active {
  transform: scale(0.97);
}

/* Page transitions */
.page-enter {
  animation: fadeInUp 0.2s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* FAB rotate on click */
.fab-rotate {
  transition: transform 0.3s ease;
}
.fab-rotate:active {
  transform: rotate(45deg);
}
```

## RTL Considerations

עברית כברירת מחדל:

```tsx
// In root layout
<html dir="rtl" lang="he">
```

**הוגן מטעמי RTL:**
- שמות אייקונים שמכוונים: השתמש ב-`<ArrowRight />` בעברית במשמעות "אחורה" (חזרה)
- Animations: כל ה-slide-from-right צריך להפוך ל-slide-from-left
- Bottom Nav: סדר הלשוניות זהה, אבל הטקסט בעברית
- Trip Strip: יום ראשון מימין

**Tailwind:**
- השתמש ב-`me-` (margin-end) במקום `mr-`
- השתמש ב-`ms-` (margin-start) במקום `ml-`
- ככה Tailwind מטפל ב-RTL אוטומטית

## Accessibility

- Contrast מינימום 4.5:1 לטקסט רגיל
- Touch targets מינימום 44x44px
- Focus visible לכל interactive element
- Alt text לכל תמונה
- Screen reader friendly labels
- אופציה ל-Reduce Motion

## דוגמאות Screens (Wireframes טקסטואליים)

### Screen 1: Trips List (Mobile)

```
┌─────────────────────────────────────┐
│ 🧳 הטיולים שלי               🔔 (+) │
├─────────────────────────────────────┤
│                                     │
│ [Upcoming]  Past                    │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ [תמונה של פוג'יאמה]   [קרוב]│  │
│ │                               │  │
│ │ יפן 2026                      │  │
│ │ ב' 20.7 → ה' 6.8 · 16 לילות │  │
│ │ 5 משתתפים                    │  │
│ │ ⏱ עוד 42 ימים                │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ [תמונה]              [בתכנון]│  │
│ │                               │  │
│ │ יוון 2027 (טיוטה)            │  │
│ │ תאריכים: לא נקבעו             │  │
│ │ 2 משתתפים                    │  │
│ └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│ 🧳        ☀️        📁         👤  │
└─────────────────────────────────────┘
```

### Screen 2: Trip Overview (Mobile)

```
┌─────────────────────────────────────┐
│ ← יפן 2026               ⋯          │
├─────────────────────────────────────┤
│                                     │
│ [תמונת קאבר רקע]                   │
│                                     │
│ יפן 2026                            │
│ ב' 20.7 → ה' 6.8 · 16 לילות        │
│ 👥 5 משתתפים                        │
│                                     │
│ ⏱ עוד 42 ימים                       │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ┌─────┬─────┬─────┬─────┬─────┐   │
│ │ 🛂  │ 🏨  │ ✈️  │ ✓   │ 📸  │   │
│ │ 12  │ 6   │ 4   │ 8/24│ 0   │   │
│ │ מסמ │מלונ │טיסות│משימ │תמונ │   │
│ └─────┴─────┴─────┴─────┴─────┘   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 🚨 פעולות דחופות (5)                │
│                                     │
│ • להזמין OMO3 Sapporo               │
│ • להזמין OMO7 Asahikawa             │
│ • להזמין RISONARE Tomamu            │
│ • להזמין KAI Poroto                 │
│ • להתחיל רישיון נהיגה בינלאומי     │
│                                     │
│ [→ ראה את כל המשימות]              │
│                                     │
├─────────────────────────────────────┤
│ 🧳        ☀️        📁         👤  │
└─────────────────────────────────────┘
```

### Screen 3: Documents Module (Mobile)

```
┌─────────────────────────────────────┐
│ ← מסמכים                    🔍 (+) │
├─────────────────────────────────────┤
│                                     │
│ [Filter Pills]                      │
│ [הכל] [דרכונים] [טיסות] [מלונות]   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 🛂 דרכונים (5)                      │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ 🛂  דרכון - רוי טל            │  │
│ │     בתוקף עד 12.2028          │  │
│ │     📅 הועלה: 5.6.2026        │  │
│ └───────────────────────────────┘  │
│ ┌───────────────────────────────┐  │
│ │ 🛂  דרכון - לאהי טל           │  │
│ │     בתוקף עד 3.2027 ⚠️        │  │
│ └───────────────────────────────┘  │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ✈️ אישורי טיסה (2)                 │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ ✈️  אל על LY091 - הלוך       │  │
│ │     20.7.2026 · ABC123        │  │
│ └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│ 🧳        ☀️        📁         👤  │
└─────────────────────────────────────┘
```

### Screen 4: Desktop View - Trips (Hybrid)

```
┌──────┬───────────────────────────────────────────────┐
│  💜  │ 🧳 הטיולים שלי                       🔔 (+)  │
│  TT  ├───────────────────────────────────────────────┤
│      │                                               │
│ 🧳   │ [Upcoming (2)]  Past (5)  Drafts (1)        │
│ Trips│                                               │
│ ●    │ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│      │ │ Card 1   │ │ Card 2   │ │ Card 3   │    │
│ ☀️   │ │          │ │          │ │          │    │
│ Today│ │ יפן 2026 │ │ יוון 2027│ │ ...      │    │
│      │ │          │ │          │ │          │    │
│ 📁   │ │          │ │          │ │          │    │
│ Docs │ └──────────┘ └──────────┘ └──────────┘    │
│      │                                               │
│ 👤   │                                               │
│Profile│                                              │
│      │                                               │
│      │                                          (+) │
└──────┴───────────────────────────────────────────────┘
```

### Screen 5: Desktop Trip Detail (Master-Detail)

```
┌──────┬────────────────────┬──────────────────────────┐
│  💜  │ ← יפן 2026         │  פרטים: OMO3 Sapporo    │
│  TT  ├────────────────────┼──────────────────────────┤
│      │ [Cover Image]      │                          │
│ 🧳   │                    │ [תמונת המלון]            │
│ Trips│ יפן 2026           │                          │
│      │ 20.7 → 6.8 · 16 ל' │ OMO3 Sapporo Susukino   │
│ ☀️   │                    │ מלון Hoshino עירוני      │
│ Today│ ─────────────────  │                          │
│      │                    │ צ'ק-אין:  23.7 · 15:00  │
│ 📁   │ ┌─────┬─────┬───┐ │ צ'ק-אאוט: 26.7 · 11:00  │
│ Docs │ │היום │סקירה│חדש│ │ 3 לילות · ¥35,000/לילה  │
│      │ └─────┴─────┴───┘ │                          │
│ 👤   │                    │ [Map]                    │
│Profile│ Hotels (6)        │                          │
│      │ ┌──────────────┐  │ אישורים:                 │
│      │ │ Mimaru Tokyo │  │ • PDF אישור הזמנה        │
│      │ ├──────────────┤  │                          │
│      │ │ OMO3 Sapporo │● │ סטטוס: לבקור            │
│      │ ├──────────────┤  │                          │
│      │ │ OMO7 Asahik..│  │ [ערוך] [מחק]            │
│      │ └──────────────┘  │                          │
│      │                    │                          │
└──────┴────────────────────┴──────────────────────────┘
```

## ערכת השראה לפיתוח

**אפליקציות נוספות ללמוד מהן:**

| אפליקציה | מה ללמוד |
|----------|----------|
| **TripIt** | מבנה כרטיסים, ניווט תחתון, ציר זמן |
| **Wanderlog** | תכנון יומי, מפות, שיתוף קל |
| **Polarsteps** | יומן, תמונות, ביקור-במקום |
| **Linear** | UX מהירות, animations מינימליסטיים |
| **Notion** | block-based content, מודולריות |
| **Things 3** | ניהול משימות, הוספה מהירה |

## הנחיות סופיות לפיתוח

1. **תמיד התחל מהמובייל** - אם זה לא עובד ב-375px, זה לא מוכן
2. **כל color value דרך CSS variable** - תכין dark mode ו-theme switching להמשך
3. **השתמש ב-shadcn/ui** - לא לכתוב כפתורים מאפס
4. **lazy load תמונות** - חשוב לטעינה מהירה
5. **טעינות עדינות** - skeleton loaders, לא ספינרים מסתובבים
6. **טפסים פשוטים** - input אחד בשורה במובייל
7. **טוסטים לא מרגיזים** - מעט, ברורים, חולפים
