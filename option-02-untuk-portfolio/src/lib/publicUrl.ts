/**
 * Resolves a file from /public against the app's base path:
 * "/" in dev, "/option-02-untuk-portfolio/" in the production build (see vite.config.ts).
 * "/images/x.jpg" → "/option-02-untuk-portfolio/images/x.jpg"
 */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
