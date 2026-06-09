/** App version label. Bump APP_VERSION on notable releases. */
export const APP_VERSION = "0.1.0";

/** Short commit id of the running build (set at build time via next.config). */
export const BUILD_COMMIT = process.env.NEXT_PUBLIC_COMMIT ?? "dev";

/** "v0.1.0 · ab12cd3" */
export const VERSION_LABEL = `v${APP_VERSION} · ${BUILD_COMMIT}`;
