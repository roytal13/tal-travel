/**
 * Live weather via Open-Meteo (free, no API key).
 * https://open-meteo.com/en/docs
 */

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  tempMin: number;
  tempMax: number;
  code: number; // WMO weather code
}

export interface Forecast {
  current?: { temp: number; code: number };
  daily: DailyForecast[];
}

/** Hebrew label per WMO weather code group. */
export function weatherCodeLabel(code: number): string {
  if (code === 0) return "בהיר";
  if (code <= 2) return "מעונן חלקית";
  if (code === 3) return "מעונן";
  if (code <= 48) return "ערפל";
  if (code <= 57) return "טפטוף";
  if (code <= 67) return "גשם";
  if (code <= 77) return "שלג";
  if (code <= 82) return "ממטרים";
  if (code <= 86) return "ממטרי שלג";
  return "סופות רעמים";
}

/** Fetch a 7-day forecast for a coordinate. Returns null on failure. */
export async function fetchForecast(
  lat: number,
  lon: number
): Promise<Forecast | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = await res.json();

    const daily: DailyForecast[] = (data.daily?.time ?? []).map(
      (date: string, i: number) => ({
        date,
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        code: data.daily.weather_code[i],
      })
    );

    return {
      current: data.current
        ? {
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          }
        : undefined,
      daily,
    };
  } catch {
    return null;
  }
}
