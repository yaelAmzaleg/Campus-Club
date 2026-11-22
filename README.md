# תרגיל 13 - Campus Club Dashboard (React + Vite)

אתן מנהלות את מועדון הקוד של הקמפוס. צריך דף אחד שבו אפשר:

- לראות את כל החברות במועדון (עם תפקיד, אווטאר וסטטוס).
- לסנן כך שיוצגו רק חברות פעילות.
- להחליף תצוגה (רשימה או גריד).
- לבחור חברה ולראות את המשימות שלה.
- לראות הודעות כשמשהו לא בסדר.

**מה מתרגלים:**

- בניית קומפוננטות ועיצוב שלהן עם CSS Modules
- לולאות (`map`) כדי להציג רשימות
- ניהול מידע עם `useState`
- רינדור מותנה: הודעות, תגיות וכפתורים מושבתים

**זמן משוער:** 4 שעות

## איך זה צריך להיראות

🎬 **[צפו בסרטון הדגמה של האתר המוכן](https://cdn.jsdelivr.net/gh/Lior3796/react-13-club-dashboard@main/demo.mp4)** - כך האתר צריך להתנהג כשמסיימים את כל השלבים.

## איך מתחילים

1. לוחצות למעלה על **Use this template** ← **Create a new repository**, ויוצרות ריפו משלכן.
2. עושות `git clone` לריפו החדש ופותחות אותו ב-VS Code.
3. בטרמינל מריצות פעם אחת: `npm install` (צריך Node בגרסה 20.19 ומעלה. בודקות עם `node -v`).
4. מריצות `npm run dev` ופותחות את הכתובת שמופיעה בטרמינל (בדרך כלל `http://localhost:5173`). הדף מתעדכן לבד בכל שמירה.
5. VS Code יציע להתקין את התוסף **Prettier** - מתקינות אותו. מעכשיו כל שמירה (`Ctrl+S`) מסדרת את הקוד: הזחות, רווחים ושורות.

> הפרויקט נוצר עם `npm create vite@latest` (תבנית React), כמו שעבדנו בכיתה. התיקיות והקבצים כבר מוכנים - צריך רק למלא אותם.

## פקודות

| פקודה                | מה היא עושה                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | מריצה את האתר במצב פיתוח                  |
| `npm test`           | מריצה את הטסטים (Vitest) ומראה מה עוד חסר |
| `npm run test:watch` | מריצה את הטסטים שוב בכל שמירה             |
| `npm run format`     | מסדרת עם Prettier את כל הקבצים בבת אחת    |
| `npm run lint`       | בודקת את הקוד עם oxlint                   |

## איך בודקים

```bash
npm test
```

- בהתחלה כל הטסטים אדומים (✘). כל טסט מתחיל בשם הקומפוננטה שהוא בודק.
- מתחת לכל טסט שנכשל כתוב מה לא עבד.
- הטסטים בודקים כל קומפוננטה לבד (מה היא מציגה ומה קורה כשלוחצים), ואחר כך את `App` כולו: כל state, וכל לחיצה, סימון ומעבר בין מצבים.
- כשכל הטסטים ירוקים (✔) מופיעה ההודעה **✅ המשימה אושרה** ואפשר לעבור למשימה הבאה.
- טסטי הבונוס מסומנים בכוכב (☆ / ★). הם לא חובה, והמשימה מאושרת גם בלעדיהם.
- אחרי `git push` הטסטים רצים גם ב-GitHub (לשונית Actions). וי ירוק ליד ה-commit = המשימה אושרה.

> אל תשנו את התיקייה `tests/`, את `vite.config.js` ואת `src/data.js`.

## מבנה הפרויקט

```
index.html
vite.config.js                 הגדרות Vite + Vitest
.prettierrc                    הגדרות Prettier
.vscode/                       Prettier מסדר את הקוד בכל שמירה
src/
  main.jsx                     מרנדר את App - מוכן, לא משנים
  index.css                    עיצוב כללי לכל הדף
  data.js                      החברות והמשימות ההתחלתיות - מוכן, לא משנים
  App.jsx                      <- כאן ה-state וכל הדף
  App.module.css               <- העיצוב של הדף
  components/
    Header/       Header.jsx       Header.module.css
    Footer/       Footer.jsx       Footer.module.css
    FilterBar/    FilterBar.jsx    FilterBar.module.css
    MemberCard/   MemberCard.jsx   MemberCard.module.css
    MembersList/  MembersList.jsx  MembersList.module.css
    TasksPanel/   TasksPanel.jsx   TasksPanel.module.css
    Notice/       Notice.jsx       Notice.module.css
tests/                         הטסטים - לא משנים
```

- כל קומפוננטה נמצאת בתיקייה בשם שלה, עם קובץ `.jsx` וקובץ `.module.css`.
- בראש כל קובץ `.jsx` יש הערה עם ה-props שהקומפוננטה מקבלת. **השמות של הקבצים וה-props קבועים**, כי הטסטים בודקים כל קומפוננטה לבד דרכם.
- ייבוא של קומפוננטה מתיקייה אחרת: `import MemberCard from '../MemberCard/MemberCard.jsx'`.

## העיצוב: CSS Modules

כל קובץ `.jsx` כבר מייבא את קובץ העיצוב שלו:

```jsx
import styles from './MemberCard.module.css'
```

ובקובץ ה-`.module.css` כבר מוגדרים שמות ה-classes, בלי עיצוב. **אתן כותבות את העיצוב** בתוך ה-classes (ואפשר להוסיף classes משלכן):

```css
.card {
  border: 1px solid #e5e7eb;
  padding: 14px;
}
```

משתמשות ב-class דרך `styles`:

```jsx
<div className={styles.card}>...</div>

// שני classes ביחד:
<div className={`${styles.card} ${styles.selected}`}>...</div>

// class לפי משתנה (למשל styles.leader / styles.grid):
<button className={styles[role]}>...</button>
```

> ה-classes שמסומנים בקובץ **REQUIRED BY THE TESTS** - אל תמחקו אותם. הטסטים בודקים אותם (למשל שכרטיס של חברה לא פעילה מקבל `styles.inactive`).

## ה-State (ב-`App` עם `useState`)

| state              | מה זה                               | ערך התחלתי                   |
| ------------------ | ----------------------------------- | ---------------------------- |
| `members`          | `[{ id, name, role, isActive }]`    | `initialMembers` מ-`data.js` |
| `tasks`            | `[{ id, title, done, assignedTo }]` | `initialTasks` מ-`data.js`   |
| `selectedMemberId` | ה-id של החברה שנבחרה                | `null`                       |
| `showOnlyActive`   | האם להציג רק חברות פעילות           | `false`                      |
| `layout`           | `"list"` או `"grid"`                | `"list"`                     |

כל ה-state נמצא ב-`App`. הקומפוננטות מקבלות אותו (ואת הפונקציות שמשנות אותו) דרך props.

## מבנה הדף

- **Header**: הכותרת `Campus Club Dashboard`
- **Filter Bar**: תיבת סימון `Show only active members`, ושני כפתורים `List` / `Grid`
- **Members Area**: כרטיס לכל חברה (שם, תפקיד, אווטאר עם ראשי תיבות, כפתור בצבע של התפקיד)
- **Tasks Panel**: המשימות של החברה שנבחרה. הודעות כשלא נבחרה חברה או כשאין לה משימות
- **Notice Area**: אזהרה כשצריך (למשל, נבחרה חברה לא פעילה)
- **Footer**: `© 2025 Campus Coding Club`

## הקומפוננטות

### Header

טקסט גדול, ממורכז ומודגש בתוך `<h1>`: `Campus Club Dashboard`.

### Footer

טקסט קטן, ממורכז ואפור בתוך `<footer>`: `© 2025 Campus Coding Club`.

### FilterBar - props: `showOnlyActive`, `onToggleActive`, `layout`, `onLayoutChange`

- תיבת סימון (`<input type="checkbox">`) בתוך `<label>` עם הטקסט `Show only active members`. היא מסומנת לפי `showOnlyActive`, ולחיצה עליה קוראת ל-`onToggleActive`.
- שני כפתורים: `List` ו-`Grid`. לחיצה קוראת ל-`onLayoutChange('list')` או `onLayoutChange('grid')`.
- הכפתור של התצוגה הנוכחית מקבל את `styles.active`.

### MemberCard - props: `member`, `isSelected`, `onSelect`

- אווטאר עגול עם ראשי התיבות של השם (`Noa Levi` ← `NL`), שם, ותגית עם התפקיד.
- כפתור קטן בצבע לפי התפקיד: Leader = כחול, Member = ירוק, Guest = סגול. הכפתור מקבל את ה-class של התפקיד: `styles.leader` / `styles.member` / `styles.guest` (רמז: `styles[member.role.toLowerCase()]`). בינתיים הכפתור לא עושה כלום.
- חברה לא פעילה (`isActive: false`): הכרטיס מקבל גם `styles.inactive` (נראה דהוי), והכפתור מושבת (`disabled`).
- לחיצה על הכרטיס קוראת ל-`onSelect(member.id)`.
- כשהחברה נבחרה (`isSelected`) הכרטיס מקבל גם `styles.selected`.

### MembersList - props: `members`, `layout`, `selectedMemberId`, `onSelect`

- עוטפת את כל הכרטיסים באלמנט עם `styles.membersList` ועוד ה-class של התצוגה: `styles.list` או `styles.grid` (רמז: `styles[layout]`).
- לולאה: `MemberCard` לכל חברה ב-`members` (את הסינון עושים ב-`App`, והרשימה מגיעה כבר מסוננת).
- אם אין חברות להציג: ההודעה `No members to show`.

### TasksPanel - props: `member`, `tasks`, `onToggleTask`

- `member` הוא החברה שנבחרה (או `null`), ו-`tasks` הן המשימות שלה בלבד.
- לא נבחרה חברה: `Select a member to see their tasks`.
- לחברה אין משימות: `No tasks yet`.
- אחרת: השם של החברה, ולולאה על המשימות. לכל משימה `<input type="checkbox">` שמסומן כשהמשימה בוצעה, והכותרת שלה, שניהם בתוך `<label>`. לחיצה על התיבה קוראת ל-`onToggleTask(task.id)`.

### Notice - props: `type`, `children`

- קופסה צבעונית עם `styles.notice` ועוד ה-class של הסוג: `styles.warning` (רקע צהוב) או `styles.info` (רקע כחול).
- הטקסט מגיע כ-children: `<Notice type="warning">...</Notice>`.

## הלוגיקה

**לולאות:**

- מרנדרות את החברות ← `MemberCard`
- מרנדרות את המשימות ← רק של החברה שנבחרה

**רינדור מותנה:**

- `No members to show` - כשהסינון מסתיר את כולן
- `Select a member…` - כשלא נבחרה חברה
- `No tasks yet` - כשלחברה אין משימות
- `Notice` מסוג `warning` מופיע כשהחברה שנבחרה לא פעילה, למשל: `Dana Mizrahi is inactive`. כשבוחרים חברה פעילה ההודעה נעלמת.

**אינטראקציות:**

- לחיצה על כרטיס ← בחירת החברה
- `Show only active members` ← סינון החברות
- `List` / `Grid` ← החלפת התצוגה
- סימון משימה כבוצעה / לא בוצעה ב-TasksPanel (מעדכנות את ה-state של `tasks` ב-`App`, כדי שהסימון יישאר גם אחרי שעוברים לחברה אחרת וחוזרים)
- כפתור התפקיד: בינתיים לא עושה כלום, ומושבת לחברה לא פעילה

## כללי עיצוב

- פונט ומרווחים נקיים ואחידים
- MemberCard: מסגרת, ריפוד וצל
- אווטאר: עיגול, באותו גודל לכולן
- כפתור מושבת: דהוי, בלי אפקט hover
- Notice: רקע צבעוני
- הדף נראה טוב גם במסך קטן וגם בגדול

## חלוקת זמן מומלצת

- תכנון UI ו-state ← 15 דקות
- בניית קומפוננטות ועיצוב בסיסי ← 60-90 דקות
- הוספת state ← 30-45 דקות
- לולאות ובחירה ← 30-45 דקות
- רינדור מותנה ← 30-45 דקות
- ליטוש (החלפת תצוגה, מרווחים, hover) ← 30-45 דקות

## בונוס (לא חובה)

- **מונה משימות** (בוצעו/סך הכול) לחברה שנבחרה, למשל `1/2`.
- **הוספה מהירה:** שדה טקסט וכפתור `Add` ב-TasksPanel שמוסיפים משימה חדשה (לא בוצעה) לחברה שנבחרה.
- **חיפוש:** שדה חיפוש (`type="search"` או placeholder עם המילה `Search`) שמסנן את החברות לפי השם, בלי הבדל בין אותיות גדולות וקטנות.

ל-classes של הבונוס כבר יש מקום בקבצי העיצוב (`styles.search`, `styles.counter`, `styles.quickAdd`).

## בדיקה עצמית ✅

- כל הקומפוננטות מוצגות.
- החברות והמשימות מוצגות בלולאות.
- הסינון והתצוגות מעדכנים את המסך.
- בחירת חברה מעדכנת את פאנל המשימות.
- אפשר לסמן משימות כבוצעות ולבטל את הסימון.
- חברות לא פעילות נראות דהויות, והכפתור שלהן מושבת.
- צבע הכפתור מתאים לתפקיד.
- הודעה מופיעה כשנבחרת חברה לא פעילה.
- החלפת התצוגה עובדת.
- הדף נראה נקי במסך קטן ובמסך גדול.
- הקוד מסודר (Prettier) - אפשר לבדוק עם `npm run format:check`.
