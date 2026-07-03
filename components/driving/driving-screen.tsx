"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  OctagonX,
  CircleParking,
  CircleOff,
  MoveLeft,
  TrafficCone,
  AlertTriangle,
  PhoneCall,
  CircleAlert,
  Fuel,
  TriangleAlert,
} from "lucide-react";

type TabKey = "signs" | "rules" | "toll" | "parking" | "accident";

const TABS: { key: TabKey; label: string }[] = [
  { key: "signs", label: "תמרורים" },
  { key: "rules", label: "כללי נהיגה" },
  { key: "toll", label: "כביש אגרה" },
  { key: "parking", label: "חניה" },
  { key: "accident", label: "תאונה וחירום" },
];

export function DrivingScreen() {
  const [tab, setTab] = useState<TabKey>("signs");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h2 className="mb-1 text-2xl font-bold">נהיגה ביפן</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Nissan Serena | הזמנה 26070303813 | איסוף 23.7 ב-13:00, החזרה 3.8 ב-13:00
      </p>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── תמרורים ─── */}
      {tab === "signs" && (
        <div className="space-y-3">
          {/* Stop sign */}
          <Card className="flex items-center gap-4 p-4">
            <span
              className="flex size-14 shrink-0 items-center justify-center text-[10px] font-bold text-white"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                background: "red",
              }}
            >
              止まれ
            </span>
            <div>
              <p className="font-semibold">עצור (STOP)</p>
              <p className="text-sm text-muted-foreground">משולש אדום הפוך עם הכיתוב 止まれ</p>
            </div>
          </Card>

          {[
            {
              icon: <CircleParking className="size-7 text-blue-600" />,
              label: "אסור לחנות",
              desc: "עיגול כחול עם קו אדום אלכסוני",
            },
            {
              icon: <CircleOff className="size-7 text-blue-600" />,
              label: "אסור לחנות ולעצור",
              desc: "עיגול כחול עם X אדום",
            },
            {
              icon: <OctagonX className="size-7 text-red-600" />,
              label: "אסור כניסה",
              desc: "עיגול אדום עם פס לבן אופקי",
            },
            {
              icon: (
                <div className="flex size-14 shrink-0 items-center justify-center rounded bg-blue-600">
                  <MoveLeft className="size-7 text-white" />
                </div>
              ),
              label: "כביש חד-סטרי",
              desc: "מלבן כחול עם חץ לבן",
              noWrap: true,
            },
          ].map((s, i) => (
            <Card key={i} className="flex items-center gap-4 p-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                {s.icon}
              </div>
              <div>
                <p className="font-semibold">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Card>
          ))}

          {/* Traffic lights */}
          <Card className="space-y-3 p-4">
            <p className="font-semibold">רמזורים</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="mt-1 size-3 shrink-0 rounded-full bg-red-500" />
                <span>אדום = עצור. אסור לפנות ימינה או שמאלה.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 size-3 shrink-0 rounded-full bg-green-500" />
                <span>חץ ירוק = מותר להתקדם לכיוון החץ, גם אם האור אדום או צהוב.</span>
              </div>
            </div>
          </Card>

          {/* Intersections */}
          <Card className="space-y-3 p-4">
            <p className="font-semibold">צמתים</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-foreground">פנייה ימינה:</span>
                <span>שימו לב לרכבים מגיעים מהכיוון הנגדי ולאופנועים מאחור.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-bold text-foreground">פנייה שמאלה:</span>
                <span>הדליקו בלינקר מוקדם. שימו לב להפרשי הגלגלים הפנימיים - האטו בפנייה. זהירות מאופנועים ואופניים משמאל.</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── כללי נהיגה ─── */}
      {tab === "rules" && (
        <div className="space-y-3">
          <Card className="p-4">
            <p className="mb-2 font-semibold">נוהגים בצד שמאל</p>
            <p className="text-sm text-muted-foreground">
              ביפן נוהגים בצד שמאל של הכביש. ההגה נמצא בצד ימין של הרכב.
            </p>
          </Card>

          {[
            {
              icon: <TrafficCone className="size-5 text-amber-500" />,
              title: "חגורות בטיחות",
              desc: "חובה לכולם בכל המושבים, כולל ילדים בכסאות בטיחות.",
            },
            {
              icon: <AlertTriangle className="size-5 text-amber-500" />,
              title: "הפסקות תכופות",
              desc: 'עצרו ב"Michi-no-Eki" (תחנות דרך) מדי שעתיים לפחות.',
            },
            {
              icon: <CircleAlert className="size-5 text-blue-500" />,
              title: "הורדת מהירות",
              desc: "מהירות מופחתת בכניסה לעיר ובאזורי בתי ספר. שמרו על המגבלות.",
            },
          ].map((item, i) => (
            <Card key={i} className="flex items-start gap-3 p-4">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </Card>
          ))}

          <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="font-semibold text-amber-800 dark:text-amber-400">אלכוהול - אפס סבלנות</p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
              חוקי שכרות בנהיגה ביפן מחמירים מאוד. כל רמה של אלכוהול אסורה.
            </p>
          </Card>

          {/* Fuel */}
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Fuel className="size-5 text-primary" />
              <p className="font-semibold">החזרת הרכב עם מיכל מלא</p>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              מלאו דלק בתחנה המסומנת במפה שתקבלו, והציגו קבלה בעת ההחזרה. אי-מילוי יגרור חיוב גבוה יותר ממחיר הדלק עצמו.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Regular", bg: "bg-red-600", jp: "レギュラー" },
                { label: "Premium", bg: "bg-yellow-500", jp: "ハイオク" },
                { label: "Diesel", bg: "bg-green-600", jp: "軽油" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1">
                  <div className={cn("rounded px-2 py-1 text-xs font-bold text-white", f.bg)}>
                    {f.label}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{f.jp}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              ודאו שאתם ממלאים את הדלק הנכון - דלק שגוי עלול להזיק לרכב ועל חשבונכם.
            </p>
          </Card>
        </div>
      )}

      {/* ─── כביש אגרה / ETC ─── */}
      {tab === "toll" && (
        <div className="space-y-3">
          <Card className="p-4">
            <p className="mb-2 font-semibold">ETC - שערי אגרה אלקטרוניים</p>
            <p className="text-sm text-muted-foreground">
              בכבישי אגרה יש שלושה סוגי שערים. ללא ציוד ETC, עברו רק דרך שערי "一般" (General).
            </p>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted text-center text-xs font-semibold rtl:divide-x-reverse">
              <div className="p-2">ETC בלבד</div>
              <div className="p-2">ETC / כללי</div>
              <div className="p-2">כללי בלבד</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border rtl:divide-x-reverse">
              <div className="p-3 text-center text-xs text-muted-foreground">ETC专用</div>
              <div className="p-3 text-center text-xs text-muted-foreground">ETC / 一般</div>
              <div className="p-3 text-center text-xs font-medium text-green-600">一般</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse">
              <div className="flex items-center justify-center p-3">
                <span className="text-lg text-red-500">✕</span>
              </div>
              <div className="flex items-center justify-center p-3">
                <span className="text-lg text-green-600">○</span>
              </div>
              <div className="flex items-center justify-center p-3">
                <span className="text-lg text-green-600">○</span>
              </div>
            </div>
          </Card>

          <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <p className="font-semibold text-blue-800 dark:text-blue-400">ללא ETC</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-500">
              כיוון שאין ברכב ציוד ETC, עברו תמיד דרך שער "一般" (General) הירוק. שימו לב לשלטים בכניסה (入口) או ביציאה (出口) - התשלום משתנה לפי מיקום.
            </p>
          </Card>
        </div>
      )}

      {/* ─── חניה ─── */}
      {tab === "parking" && (
        <div className="space-y-3">
          <Card className="p-4">
            <p className="mb-2 font-semibold">חניה ביפן</p>
            <p className="text-sm text-muted-foreground">
              אסור לחנות ברחוב. יש להשתמש תמיד בחניון מוסדר (Coin Parking).
            </p>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-border bg-red-50 px-4 py-3 dark:bg-red-950/30">
              <p className="font-semibold text-red-700 dark:text-red-400">קנס חניה אסורה</p>
            </div>
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm">רכב רגיל</span>
                <span className="font-bold">25,000 JPY</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm">רכב בינוני / Serena</span>
                <span className="font-bold">30,000 JPY</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-2 font-semibold">קיבלתם דו"ח?</p>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-bold text-foreground">1.</span>
                שמרו את הדו"ח ואת קבלת התשלום
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">2.</span>
                דווחו לתחנת המשטרה המקומית
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">3.</span>
                שלמו הקנס במוסד פיננסי מורשה
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">4.</span>
                הציגו את הקבלה בעת החזרת הרכב
              </li>
            </ol>
          </Card>

          {/* Damage charges */}
          <Card className="overflow-hidden p-0">
            <div className="border-b border-border bg-orange-50 px-4 py-3 dark:bg-orange-950/30">
              <p className="font-semibold text-orange-700 dark:text-orange-400">
                עלויות נזק לרכב
              </p>
            </div>
            <div className="divide-y divide-border">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">נזק חמור</span>
                  <span className="font-bold text-red-600">עד 100,000 JPY</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">תאונה עם נזק משמעותי לרכב</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">שריטה / שקע קל</span>
                  <span className="font-bold text-amber-600">עד 50,000 JPY</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">Non-operation charge (אובדן שימוש)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── תאונה וחירום ─── */}
      {tab === "accident" && (
        <div className="space-y-3">
          <Card className="border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="font-semibold text-red-700 dark:text-red-400">
              ביטוח לא יכסה אם לא תבצעו את הנהלים הנדרשים
            </p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              מלאו את טופס "What to Do After an Accident" שנמצא בתיק מסמכי הרכב.
            </p>
          </Card>

          {/* Steps */}
          {[
            {
              step: "1",
              color: "bg-red-500",
              title: "119 - אמבולנס",
              desc: "עזרו לפצועים. הזיזו את הרכב לאזור בטוח.",
            },
            {
              step: "2",
              color: "bg-blue-600",
              title: "110 - משטרה",
              desc: 'התקשרו מהמקום. גם אם אתם אשמים. שמרו "תעודת תאונה".',
            },
            {
              step: "3",
              color: "bg-green-600",
              title: "0123-27-4123 - ניסאן CTS",
              desc: "התקשרו לסניף האיסוף (New Chitose Airport).",
            },
          ].map((item) => (
            <Card key={item.step} className="flex items-start gap-4 p-4">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                  item.color
                )}
              >
                {item.step}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </Card>
          ))}

          {/* Emergency contacts */}
          <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            מספרי חירום
          </p>

          {[
            {
              label: "ביטוח Sompo Japan (מרכז תאונות)",
              number: "0120-256-110",
              sub: "24 שעות / 365 ימים | חינם",
              color: "text-teal-600",
            },
            {
              label: "Sompo (חלופי)",
              number: "0422-35-4219",
              sub: "אם הקו הראשי לא זמין",
              color: "text-teal-600",
            },
            {
              label: "JAF - שירות דרכים",
              number: "0570-00-8139",
              sub: "גרירה, פנצ'ר, קילומטר 0 | חיוג קצר: #8139",
              color: "text-blue-600",
            },
          ].map((c) => (
            <Card key={c.number} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
              <div className={cn("shrink-0 font-mono text-lg font-bold", c.color)}>
                {c.number}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
