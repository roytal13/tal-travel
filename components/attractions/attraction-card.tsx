import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  attractionCategoryLabel,
  attractionPriorityLabel,
  attractionPriorityVariant,
  attractionStatusLabel,
  attractionStatusVariant,
} from "@/lib/labels";
import { mapsDirectionsUrl } from "@/lib/maps";
import type { Attraction, Base } from "@/lib/types";

export function AttractionCard({
  attraction,
  base,
  countryName,
}: {
  attraction: Attraction;
  base?: Base;
  countryName?: string;
}) {
  const navUrl = mapsDirectionsUrl([attraction.name, base?.name, countryName]);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold">{attraction.name}</h3>
            {attraction.nameLocal && (
              <span className="text-xs text-muted-foreground">{attraction.nameLocal}</span>
            )}
          </div>
          {base && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {base.name}
            </span>
          )}
        </div>
        {attraction.priority && (
          <Badge variant={attractionPriorityVariant[attraction.priority]} className="shrink-0">
            {attractionPriorityLabel[attraction.priority]}
          </Badge>
        )}
      </div>

      {attraction.description && (
        <p className="mt-2 text-sm text-muted-foreground">{attraction.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={attractionStatusVariant[attraction.status]}>
            {attractionStatusLabel[attraction.status]}
          </Badge>
          {attraction.category && (
            <span className="text-xs text-muted-foreground">
              {attractionCategoryLabel[attraction.category]}
            </span>
          )}
        </div>
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Navigation className="size-4" />
          ניווט
        </a>
      </div>
    </Card>
  );
}
