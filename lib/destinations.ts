/**
 * Per-destination configuration, keyed by ISO country code.
 * Keeps the platform generic: phrasebook and currency are looked up by the
 * trip's destination_country_code, never hardcoded to one country.
 */

export interface PhraseEntry {
  he: string; // meaning in Hebrew
  local: string; // local script (e.g. Japanese)
  pron: string; // pronunciation, transliterated to Hebrew
}

export interface PhraseCategory {
  key: string;
  title: string;
  phrases: PhraseEntry[];
}

export interface CurrencyConfig {
  code: string; // "JPY"
  symbol: string; // "¥"
  name: string; // "ין יפני"
  /** Approximate value of 1 local unit in ILS. Editable in the UI. */
  ilsPerUnit: number;
}

export interface DestinationConfig {
  countryCode: string;
  countryNameEn: string; // used for map search queries
  currency: CurrencyConfig;
  phrasebook?: { localeName: string; categories: PhraseCategory[] };
}

const JAPAN: DestinationConfig = {
  countryCode: "JP",
  countryNameEn: "Japan",
  currency: {
    code: "JPY",
    symbol: "¥",
    name: "ין יפני",
    ilsPerUnit: 0.024, // ~1 ILS = 41.7 JPY (approximate, June 2026)
  },
  phrasebook: {
    localeName: "יפנית",
    categories: [
      {
        key: "basics",
        title: "בסיס ונימוס",
        phrases: [
          { he: "שלום (ביום)", local: "こんにちは", pron: "קוֹנִּיצִ'יוָוה" },
          { he: "בוקר טוב", local: "おはようございます", pron: "אוֹהָאיוֹ גוֹזָאימָס" },
          { he: "ערב טוב", local: "こんばんは", pron: "קוֹנְּבָּנְוָוה" },
          { he: "תודה", local: "ありがとうございます", pron: "אָרִיגָאטוֹ גוֹזָאימָס" },
          { he: "בבקשה / סליחה", local: "すみません", pron: "סוּמִימָסֶן" },
          { he: "כן", local: "はい", pron: "האי" },
          { he: "לא", local: "いいえ", pron: "אִייֶה" },
          { he: "להתראות", local: "さようなら", pron: "סָאיוֹנָארָה" },
          { he: "נעים מאוד", local: "はじめまして", pron: "הָאגִ'ימֶמָשְׁטֶה" },
        ],
      },
      {
        key: "help",
        title: "עזרה ותקשורת",
        phrases: [
          { he: "אני לא מבין", local: "わかりません", pron: "ואַקָארִימָסֶן" },
          { he: "אתה מדבר אנגלית?", local: "英語を話せますか", pron: "אֵייגוֹ אוֹ הָאנָאסֶמָס קָה" },
          { he: "אפשר עזרה?", local: "助けてください", pron: "טָסוּקֶטֶה קוּדָסָאי" },
          { he: "איפה השירותים?", local: "トイレはどこですか", pron: "טוֹאִירֶה וָוה דוֹקוֹ דֶס קָה" },
          { he: "קוראים לי...", local: "私は...です", pron: "וָואטָאשִי וָוה ... דֶס" },
        ],
      },
      {
        key: "restaurant",
        title: "מסעדה ואוכל",
        phrases: [
          { he: "תפריט בבקשה", local: "メニューをください", pron: "מֶנְיוּ אוֹ קוּדָסָאי" },
          { he: "החשבון בבקשה", local: "お会計お願いします", pron: "אוֹקָאיקֵיי אוֹנֶגָאישִימָס" },
          { he: "טעים מאוד", local: "おいしいです", pron: "אוֹאִישִי דֶס" },
          { he: "מים בבקשה", local: "お水をください", pron: "אוֹמִיזוּ אוֹ קוּדָסָאי" },
          { he: "בלי בשר", local: "肉なしで", pron: "נִיקוּ נָאשִי דֶה" },
          { he: "מנת ילדים", local: "お子様メニュー", pron: "אוֹקוֹסָמָה מֶנְיוּ" },
        ],
      },
      {
        key: "shopping",
        title: "קניות וכסף",
        phrases: [
          { he: "כמה זה עולה?", local: "いくらですか", pron: "אִיקוּרָה דֶס קָה" },
          { he: "יקר מדי", local: "高いです", pron: "טָאקָאי דֶס" },
          { he: "אפשר בכרטיס?", local: "カードで払えますか", pron: "קָארְדוֹ דֶה הָארָאֶמָס קָה" },
          { he: "אני רק מסתכל", local: "見ているだけです", pron: "מִיטֶה אִירוּ דָאקֶה דֶס" },
        ],
      },
      {
        key: "directions",
        title: "תחבורה וכיוונים",
        phrases: [
          { he: "איפה תחנת הרכבת?", local: "駅はどこですか", pron: "אֶקִי וָוה דוֹקוֹ דֶס קָה" },
          { he: "ימינה", local: "右", pron: "מִיגִי" },
          { he: "שמאלה", local: "左", pron: "הִידָארִי" },
          { he: "ישר", local: "まっすぐ", pron: "מַאסּוּגוּ" },
          { he: "כמה זה רחוק?", local: "どのくらいですか", pron: "דוֹנוֹ קוּרָאי דֶס קָה" },
        ],
      },
      {
        key: "numbers",
        title: "מספרים",
        phrases: [
          { he: "1", local: "一", pron: "אִיצְ'י" },
          { he: "2", local: "二", pron: "נִי" },
          { he: "3", local: "三", pron: "סָאן" },
          { he: "4", local: "四", pron: "יוֹן" },
          { he: "5", local: "五", pron: "גוֹ" },
          { he: "6", local: "六", pron: "רוֹקוּ" },
          { he: "7", local: "七", pron: "נָאנָה" },
          { he: "8", local: "八", pron: "הָאצִ'י" },
          { he: "9", local: "九", pron: "קְיוּ" },
          { he: "10", local: "十", pron: "גִ'וּ" },
          { he: "100", local: "百", pron: "הְיָאקוּ" },
          { he: "1000", local: "千", pron: "סֶן" },
        ],
      },
    ],
  },
};

const DESTINATIONS: Record<string, DestinationConfig> = {
  JP: JAPAN,
};

export function getDestination(countryCode?: string): DestinationConfig | undefined {
  if (!countryCode) return undefined;
  return DESTINATIONS[countryCode.toUpperCase()];
}
