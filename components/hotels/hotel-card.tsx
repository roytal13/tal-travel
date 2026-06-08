import { Hotel as HotelIcon, Star, ExternalLink, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatHebrewDate, nightsBetween, formatNights } from "@/lib/format";
import { hotelStatusLabel, hotelStatusVariant } from "@/lib/labels";
import { mapsDirectionsUrl } from "@/lib/maps";
import type { Hotel } from "@/lib/types";

function formatPrice(amount: number, currency?: string): string {
  const symbol = currency === "JPY" ? "¥" : currency === "USD" ? "$" : "";
  return `${symbol}${amount.toLocaleString("en-US")}`;
}

export function HotelCard({
  hotel,
  countryName,
}: {
  hotel: Hotel;
  countryName?: string;
}) {
  const nights =
    hotel.checkInDate && hotel.checkOutDate
      ? nightsBetween(hotel.checkInDate, hotel.checkOutDate)
      : null;
  const navUrl = mapsDirectionsUrl([hotel.name, hotel.location, countryName]);

  return (
    <Card className="overflow-hidden">
      {/* Header strip in the hotel category color (lavender) */}
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lavender-100 text-lavender-700">
            <HotelIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-semibold">{hotel.name}</h3>
              {hotel.isRecommended && (
                <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {[hotel.location, hotel.chain].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <Badge variant={hotelStatusVariant[hotel.status]} className="shrink-0">
          {hotelStatusLabel[hotel.status]}
        </Badge>
      </div>

      <div className="space-y-3 p-4">
        {hotel.checkInDate && hotel.checkOutDate && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="block text-xs text-muted-foreground">צ'ק-אין</span>
              <span className="font-mono">{formatHebrewDate(hotel.checkInDate)}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">צ'ק-אאוט</span>
              <span className="font-mono">{formatHebrewDate(hotel.checkOutDate)}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {nights !== null && formatNights(nights)}
          </span>
          {hotel.pricePerNight && (
            <span className="font-mono font-medium">
              {formatPrice(hotel.pricePerNight, hotel.currency)}
              <span className="text-muted-foreground"> / לילה</span>
            </span>
          )}
        </div>

        {hotel.notes && (
          <p className="rounded-lg bg-secondary p-2.5 text-xs text-muted-foreground">
            {hotel.notes}
          </p>
        )}

        <div className="flex items-center gap-4 pt-1">
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Navigation className="size-4" />
            ניווט
          </a>
          {hotel.url && (
            <a
              href={hotel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              לאתר
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
