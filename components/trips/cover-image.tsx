"use client";

import { useState } from "react";

/**
 * Cover photo that sits over the gradient placeholder. If the image is missing
 * or fails to load it simply disappears and the gradient shows through.
 */
export function CoverImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className={className}
    />
  );
}
