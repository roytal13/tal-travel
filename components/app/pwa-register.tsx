"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (production only, to avoid interfering with
 * dev HMR). Renders nothing.
 */
export function PWARegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal.
      });
    }
  }, []);

  return null;
}
