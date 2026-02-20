
'use client';

import { useState } from 'react';
import { Card } from '@/components';

const HEADERS = [
  {
    name: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
    category: 'HSTS',
    color: { bg: '#eff6ff', border: '#93c5fd', tag: '#2563eb' },
    attack: 'MITM / SSL Stripping',
    directives: [
      { d: 'max-age=63072000', desc: '2 years — browser caches this rule, never tries HTTP again' },
      { d: 'includeSubDomains', desc: 'Applies to ALL subdomains (api., www., app.)' },
      { d: 'preload',          desc: 'Eligible for browser preload lists — protection before first visit' },
    ],
  },
  {
    name: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; img-src 'self' data: https:; frame-ancestors 'none'; object-src 'none'",
    category: 'CSP',
    color: { bg: '#fef2f2', border: '#fca5a5', tag: '#dc2626' },
    attack: 'XSS / Data Injection',
    directives: [
      { d: "default-src 'self'", desc: 'Load all resources from own origin only — fallback for all directives' },
      { d: "script-src 'self'",  desc: 'Block inline scripts and eval() — eliminates most XSS vectors' },
      { d: "img-src 'self' data: https:", desc: 'Allow self + data URIs + HTTPS images (S3, CDN)' },
      { d: "frame-ancestors 'none'", desc: 'Block iframing — prevents clickjacking' },
      { d: "object-src 'none'",  desc: 'Disable Flash/plugins — legacy attack surface eliminated' },
    ],
  },
  {
    name: 'Access-Control-Allow-Origin',
    value: 'https://bloodos.com',
    category: 'CORS',
    color: { bg: '#f0fdf4', border: '#86efac', tag: '#16a34a' },
    attack: 'Cross-Origin Data Theft',
    directives: [
      { d: 'Specific origin', desc: 'Only bloodos.com can cross-origin request this API — not *.com' },
      { d: 'No wildcard (*)', desc: 'Wildcard would allow malicious.com to AJAX the API on behalf of users' },
      { d: 'Vary: Origin',    desc: 'Tells CDN/proxy to cache separately per Origin header' },
    ],
  },
  {
    name: 'X-Frame-Options',
    value: 'DENY',
    category: 'Clickjacking',
    color: { bg: '#fff7ed', border: '#fed7aa', tag: '#ea580c' },
    attack: 'Clickjacking',
    directives: [
      { d: 'DENY',      desc: 'Page cannot be embedded in ANY iframe, anywhere' },
      { d: 'SAMEORIGIN', desc: 'Alternative: only allow own origin to iframe the page' },
    ],
  },
  {
    name: 'X-Content-Type-Options',
    value: 'nosniff',
    category: 'MIME',
    color: { bg: '#fefce8', border: '#fde047', tag: '#ca8a04' },
    attack: 'MIME Sniffing',
    directives: [
      { d: 'nosniff', desc: 'Browser must honour Content-Type — cannot re-interpret a .txt as JS' },
    ],
  },
  {
    name: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
    category: 'Privacy',
    color: { bg: '#fdf4ff', border: '#e9d5ff', tag: '#7c3aed' },
    attack: 'Sensitive URL Leakage',
    directives: [
      { d: 'strict-origin-when-cross-origin', desc: 'Same-origin: full URL. Cross-origin: origin only. HTTPS→HTTP: nothing.' },
    ],
  },
];

const CORS_DEMO = [
  { origin: 'https://bloodos.com',    result: '✅ ALLOWED', color: '#16a34a', bg: '#f0fdf4' },
  { origin: 'https://app.bloodos.com', result: '✅ ALLOWED', color: '#16a34a', bg: '#f0fdf4' },
  { origin: 'https://evil.com',       result: '🚫 BLOCKED (403)', color: '#dc2626', bg: '#fef2f2' },
  { origin: 'http://localhost:3000',  result: '✅ ALLOWED (dev)', color: '#2563eb', bg: '#eff6ff' },
  { origin: 'https://anything.com',  result: '🚫 BLOCKED (403)', color: '#dc2626', bg: '#fef2f2' },
];

export default function SecurityHeadersPage() {
  const [expandedHeader, setExpandedHeader] = useState<string | null>('Strict-Transport-Security');
  const [corsExpanded, setCorsExpanded] = useState(false);

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🔒 HTTPS & Security Headers — Assignment 2.37
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        HSTS · CSP · CORS · X-Frame · MIME · Referrer-Policy
      </p>

      {/* ── Security Headers Reference ─────────────────────────────────────────── */}
      <Card
        title="📋 Security Headers — Live Configuration"
        subtitle="As configured in next.config.ts — click any header to expand"
        accentColor="#111827"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {HEADERS.map((h) => {
            const isExpanded = expandedHeader === h.name;
            return (
              <div key={h.name} style={{ border: `1px solid ${h.color.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                {/* Header row */}
                <button
                  onClick={() => setExpandedHeader(isExpanded ? null : h.name)}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: isExpanded ? h.color.bg : '#fafafa',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{
                    background: h.color.tag, color: '#fff',
                    padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {h.category}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827', flex: 1 }}>{h.name}</span>
                  <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.value}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af' }}>{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: '14px 16px', background: h.color.bg, borderTop: `1px solid ${h.color.border}` }}>
                    <div style={{
                      background: '#111827', color: '#86efac',
                      padding: '10px 14px', borderRadius: '8px',
                      fontFamily: 'monospace', fontSize: '12px', marginBottom: '14px',
                      overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>
                      {h.name}: {h.value}
                    </div>
                    <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 10px' }}>
                      <strong>Attack prevented:</strong>{' '}
                      <span style={{ background: '#fef2f2', color: '#dc2626', padding: '1px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {h.attack}
                      </span>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {h.directives.map((dir, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                          <code style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#374151', flexShrink: 0, fontWeight: 600 }}>
                            {dir.d}
                          </code>
                          <span style={{ color: '#6b7280' }}>{dir.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── CORS Origin Demo ─────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🌐 CORS Origin Allowlist Demo" subtitle="Which origins are permitted to call the API?" accentColor="#16a34a">
          <button
            onClick={() => setCorsExpanded(!corsExpanded)}
            style={{
              marginTop: '12px', padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #e5e7eb', background: '#f9fafb',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {corsExpanded ? '▲ Hide' : '▼ Show'} CORS Origin Test Results
          </button>
          {corsExpanded && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CORS_DEMO.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '8px',
                  background: row.bg, border: `1px solid ${row.color}30`,
                }}>
                  <code style={{ fontSize: '13px', color: '#374151' }}>{row.origin}</code>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: row.color }}>{row.result}</span>
                </div>
              ))}
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0', fontFamily: 'monospace' }}>
                Wildcard (*) would allow ALL of the above — including evil.com
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── HTTPS Flow ───────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🔄 HTTPS Enforcement Flow" subtitle="How HSTS + redirect work together" accentColor="#2563eb">
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { step: '1', label: 'First visit', detail: 'Browser → http://bloodos.com → Middleware 301 redirect → https://bloodos.com', color: '#f59e0b' },
              { step: '2', label: 'HSTS header received', detail: 'Server sends: Strict-Transport-Security: max-age=63072000; includeSubDomains', color: '#2563eb' },
              { step: '3', label: 'Browser caches HSTS rule', detail: 'For 2 years, browser pre-upgrades all requests — never even sends HTTP', color: '#7c3aed' },
              { step: '4', label: 'All future loads', detail: 'Browser → https://bloodos.com directly (HTTP never sent, no redirect needed)', color: '#16a34a' },
              { step: '★', label: 'Preload list', detail: 'Domain in preload list = HSTS protection even on very first visit (before HSTS header seen)', color: '#dc2626' },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: item.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  {i < arr.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e5e7eb', margin: '2px 0' }} />}
                </div>
                <div style={{ paddingBottom: '16px' }}>
                  <p style={{ margin: '4px 0 2px', fontWeight: 700, fontSize: '13px', color: '#111827' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Testing Guide ────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🧪 Testing Security Headers" subtitle="How to verify your headers are set correctly" accentColor="#374151">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '14px' }}>
            {[
              { tool: 'Chrome DevTools', steps: 'F12 → Network → click any request → Response Headers tab', icon: '🔍' },
              { tool: 'securityheaders.com', steps: 'Enter your URL → instant security grade + missing headers', icon: '🌐' },
              { tool: 'observatory.mozilla.org', steps: 'Mozilla Observatory → full security scan with recommendations', icon: '🦊' },
              { tool: 'curl -I', steps: 'curl -I https://your-domain.com | grep -i "strict\\|csp\\|cors"', icon: '💻' },
            ].map((t) => (
              <div key={t.tool} style={{
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: '10px', padding: '14px',
              }}>
                <p style={{ fontSize: '18px', margin: '0 0 6px' }}>{t.icon}</p>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '13px', color: '#111827' }}>{t.tool}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontFamily: t.tool === 'curl -I' ? 'monospace' : 'inherit' }}>{t.steps}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
