
import type { NextConfig } from 'next';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BloodOS — next.config.ts
 * Security Headers: HSTS · CSP · X-Frame · CORS preflight hints
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * All headers are applied globally (matcher: '/:path*').
 * CORS origin enforcement is handled in src/lib/cors.ts for API routes
 * because it requires runtime environment variable access.
 */

const isProd = process.env.NODE_ENV === 'production';

// ─── Allowed origins for CSP connect-src ──────────────────────────────────────
const ALLOWED_API_ORIGINS = [
  "'self'",
  'https://api.bloodos.com',
  isProd ? '' : 'http://localhost:3000',
].filter(Boolean).join(' ');

// ─── Content Security Policy ───────────────────────────────────────────────────
//
// Directive-by-directive explanation:
//
// default-src 'self'       — Fallback: only load resources from own origin
// script-src 'self'        — No inline scripts, no eval; prevents XSS code execution
// style-src 'self' 'unsafe-inline' — unsafe-inline needed for Next.js SSR CSS-in-JS;
//                            upgrade to nonce-based CSP in full production
// img-src 'self' data: blob: https: — Allow data URIs and HTTPS images (S3, CDN)
// font-src 'self' data:    — Self-hosted fonts + data URIs
// connect-src              — Restricts fetch/XHR to own API + AWS S3 + Redis proxy
// frame-ancestors 'none'   — Equivalent to X-Frame-Options: DENY (clickjacking)
// object-src 'none'        — Disables Flash/Java plugins (legacy attack vector)
// base-uri 'self'          — Prevents <base> tag injection
// form-action 'self'       — Forms can only POST to own origin
// upgrade-insecure-requests — Force HTTP subresource requests to HTTPS
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",   // TODO: replace with nonce in full prod
  `img-src 'self' data: blob: https:`,
  "font-src 'self' data:",
  `connect-src ${ALLOWED_API_ORIGINS} https://*.amazonaws.com`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join('; ');

// ─── Security Headers ──────────────────────────────────────────────────────────
const SECURITY_HEADERS = [
  // ── HSTS (HTTP Strict Transport Security) ────────────────────────────────────
  // max-age=63072000      = 2 years (recommended minimum for preload)
  // includeSubDomains     = Enforce HTTPS on ALL subdomains (*.bloodos.com)
  // preload               = Request inclusion in browser HSTS preload list
  //
  // Effect: Browser NEVER sends HTTP requests to this domain again.
  // Prevents: MITM attacks, SSL stripping, protocol downgrade attacks.
  // ⚠️  Only enable preload once you are 100% certain all subdomains support HTTPS.
  {
    key: 'Strict-Transport-Security',
    value: isProd
      ? 'max-age=63072000; includeSubDomains; preload'
      : 'max-age=0', // No HSTS in development (no HTTPS)
  },

  // ── Content Security Policy ───────────────────────────────────────────────────
  // Tells the browser which resource origins to trust.
  // Any script not in script-src is BLOCKED — even if injected via XSS.
  {
    key: 'Content-Security-Policy',
    value: CSP_DIRECTIVES,
  },

  // ── X-Content-Type-Options ────────────────────────────────────────────────────
  // Prevents MIME-sniffing: browser must honour Content-Type header.
  // Prevents: polyglot file attacks, drive-by downloads.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },

  // ── X-Frame-Options ───────────────────────────────────────────────────────────
  // Prevents this page being embedded in an <iframe>.
  // Prevents: clickjacking attacks.
  // Note: CSP frame-ancestors is the modern equivalent — both provided for compat.
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },

  // ── Referrer-Policy ───────────────────────────────────────────────────────────
  // Controls what URL is sent in the Referer header.
  // strict-origin-when-cross-origin: send origin only cross-origin (no path/query leaks).
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },

  // ── Permissions-Policy ────────────────────────────────────────────────────────
  // Disable browser features not needed by this app.
  // Prevents: malicious scripts enabling camera/mic/location without consent.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },

  // ── X-XSS-Protection (legacy) ─────────────────────────────────────────────────
  // Enables browser's built-in XSS filter (older browsers).
  // Modern browsers rely on CSP instead — included for backward compatibility.
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

const nextConfig: NextConfig = {
  output: 'standalone',

  // ── Global Security Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to ALL routes — pages and API
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
      {
        // Extra headers for API routes
        source: '/api/:path*',
        headers: [
          // Prevent API responses from being cached by intermediary proxies
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ];
  },

  // ── HTTPS redirect (handled by Vercel/hosting automatically) ──────────────
  // On custom servers, add nginx redirect: return 301 https://$host$request_uri;
};

export default nextConfig;
