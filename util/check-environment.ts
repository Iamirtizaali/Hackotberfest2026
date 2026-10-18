// Base URL for API calls. In the browser this is the site the app is served from;
// on the server (getInitialProps) it needs an absolute URL.
export default function checkEnvironment(): string {
  if (typeof window !== 'undefined') return window.location.origin;

  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT || 3000}`;
}
