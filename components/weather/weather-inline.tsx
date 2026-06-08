import { Sun, CloudSun, Cloud, CloudRain, type LucideIcon } from "lucide-react";
import type { DayWeather } from "@/lib/types";

function iconFor(conditions: string): LucideIcon {
  if (conditions.includes("גשם")) return CloudRain;
  if (conditions.includes("מעונן")) return CloudSun;
  if (conditions.includes("עננים") || conditions.includes("מעונן לגמרי")) return Cloud;
  return Sun; // בהיר, חם
}

/** Inline weather: icon + "23° / 17° · בהיר". */
export function WeatherInline({
  weather,
  className,
}: {
  weather: DayWeather;
  className?: string;
}) {
  const Icon = iconFor(weather.conditions);
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className ?? ""}`}>
      <Icon className="size-4 text-amber-500" />
      <span className="font-mono">
        {weather.tempMax}° / {weather.tempMin}°
      </span>
      <span className="text-muted-foreground">· {weather.conditions}</span>
    </span>
  );
}
