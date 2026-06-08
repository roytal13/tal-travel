import { Card } from "@/components/ui/card";
import { formatHebrewDate } from "@/lib/format";
import { weatherCodeLabel, type Forecast } from "@/lib/weather";
import { weatherCodeIcon } from "@/lib/weather-icons";

export function WeatherCard({
  name,
  nameLocal,
  forecast,
}: {
  name: string;
  nameLocal?: string;
  forecast: Forecast | null;
}) {
  if (!forecast) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">מזג האוויר אינו זמין כרגע</p>
      </Card>
    );
  }

  const CurrentIcon = forecast.current
    ? weatherCodeIcon(forecast.current.code)
    : null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{name}</h3>
          {nameLocal && (
            <span className="text-xs text-muted-foreground">{nameLocal}</span>
          )}
        </div>
        {forecast.current && CurrentIcon && (
          <div className="flex items-center gap-2">
            <CurrentIcon className="size-7 text-amber-500" />
            <div className="text-end">
              <div className="font-mono text-2xl font-bold leading-none">
                {forecast.current.temp}°
              </div>
              <div className="text-xs text-muted-foreground">
                {weatherCodeLabel(forecast.current.code)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-day strip */}
      <div className="mt-4 grid grid-cols-7 gap-1 border-t border-border pt-3" dir="rtl">
        {forecast.daily.map((d) => {
          const Icon = weatherCodeIcon(d.code);
          return (
            <div key={d.date} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] text-muted-foreground">
                {formatHebrewDate(d.date).split(" ")[0]}
              </span>
              <Icon className="size-4 text-lavender-400" />
              <span className="font-mono text-[11px] font-medium">{d.tempMax}°</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {d.tempMin}°
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
