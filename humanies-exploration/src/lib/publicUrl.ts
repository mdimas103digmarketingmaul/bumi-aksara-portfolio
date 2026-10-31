/**
 * Resolves a file from /public against the app's base path:
 * "/" in dev, "/humanies-exploration/" in the production build (see vite.config.ts).
 * "/images/x.jpg" → "/humanies-exploration/images/x.jpg"
 */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
