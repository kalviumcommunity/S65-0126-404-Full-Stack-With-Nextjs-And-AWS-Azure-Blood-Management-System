
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components';

const AWS_STEPS = [
  {
    n: 1, title: 'Navigate to RDS',
    cmd: 'AWS Console → RDS → Create Database',
    detail: 'Choose "Standard Create" for full control over configuration.',
  },
  {
    n: 2, title: 'Engine & Version',
    cmd: 'PostgreSQL 16.x (latest stable)',
    detail: 'PostgreSQL is the recommended engine for Prisma and Next.js apps.',
  },
  {
    n: 3, title: 'Template & Tier',
    cmd: 'Free tier (dev) or Production (burstable db.t3.micro)',
    detail: 'Free tier: 20GB storage, 750hrs/month. Cost ≈ $0/month for dev.',
  },
  {
    n: 4, title: 'Instance Config',
    cmd: 'Instance ID: bloodos-prod-db | Username: bloodos_admin',
    detail: 'Password: generate 32+ char random string — store in AWS Secrets Manager.',
  },
  {
    n: 5, title: 'VPC & Networking',
    cmd: 'Default VPC | New security group | Public access: No (prod) / Yes (dev only)',
    detail: 'Production: private subnet only. Dev: temporary public access for pgAdmin setup.',
  },
  {
    n: 6, title: 'Security Group — Inbound Rule',
    cmd: 'Type: PostgreSQL | Port: 5432 | Source: My IP (dev) or App SG (prod)',
    detail: 'Never use 0.0.0.0/0 in production. Scope to your app server\'s security group.',
  },
  {
    n: 7, title: 'Backup & Maintenance',
    cmd: 'Automated backups: 7 days | Backup window: 02:00–03:00 UTC',
    detail: 'Enable Performance Insights. Set maintenance window to low-traffic hours.',
  },
  {
    n: 8, title: 'Create & Copy Endpoint',
    cmd: 'bloodos-prod-db.abc123.us-east-1.rds.amazonaws.com:5432',
    detail: 'Copy endpoint — this becomes the host in your DATABASE_URL.',
  },
];

const AZURE_STEPS = [
  {
    n: 1, title: 'Create Resource',
    cmd: 'Azure Portal → Create Resource → Azure Database for PostgreSQL',
    detail: 'Choose "Flexible Server" — more control vs Single Server (deprecated).',
  },
  {
    n: 2, title: 'Server Configuration',
    cmd: 'Server name: bloodos-pg | Region: East US | PostgreSQL 15',
    detail: 'Choose region closest to your app hosting (same region = low latency).',
  },
  {
    n: 3, title: 'Compute Tier',
    cmd: 'Burstable: Standard_B1ms (1 vCore, 2GB RAM) — dev/test',
    detail: 'Cost ≈ $12/month. Upgrade to General Purpose for production load.',
  },
  {
    n: 4, title: 'Admin Credentials',
    cmd: 'Admin login: bloodos_admin | Password: 32+ char random',
    detail: 'Store in Azure Key Vault — never in environment files committed to git.',
  },
  {
    n: 5, title: 'Networking',
    cmd: 'Connectivity: Public access | Add client IP to firewall rules',
    detail: 'For production: use Private Endpoint within Azure VNet.',
  },
  {
    n: 6, title: 'SSL Configuration',
    cmd: 'SSL enforcement: Enabled | Minimum TLS: 1.2',
    detail: 'Azure enforces SSL by default. Add ?sslmode=require to your DATABASE_URL.',
  },
  {
    n: 7, title: 'Backup Settings',
    cmd: 'Backup retention: 7 days | Geo-redundant backup: Enabled (prod)',
    detail: 'Geo-redundant backup protects against regional outages.',
  },
  {
    n: 8, title: 'Get Connection String',
    cmd: 'bloodos-pg.postgres.database.azure.com:5432/bloodos',
    detail: 'Username format for Azure: admin@servername',
  },
];

const ENV_CONFIGS = [
  {
    label: 'AWS RDS (Development)',
    url: 'postgresql://bloodos_admin:YOUR_PASSWORD@bloodos-prod-db.abc123.us-east-1.rds.amazonaws.com:5432/bloodos',
    note: 'Temporary public access for dev — disable public access in prod',
  },
  {
    label: 'AWS RDS (Production)',
    url: 'postgresql://bloodos_admin:YOUR_PASSWORD@bloodos-prod-db.abc123.us-east-1.rds.amazonaws.com:5432/bloodos?sslmode=require&connection_limit=10',
    note: 'Private VPC only + SSL required + connection pool limit',
  },
  {
    label: 'Azure PostgreSQL',
    url: 'postgresql://bloodos_admin@bloodos-pg:YOUR_PASSWORD@bloodos-pg.postgres.database.azure.com:5432/bloodos?sslmode=require',
    note: 'Note: Azure username format is user@servername',
  },
  {
    label: 'Local Development (docker-compose)',
    url: 'postgresql://postgres:postgres@localhost:5432/bloodos',
    note: 'docker run -e POSTGRES_DB=bloodos -p 5432:5432 postgres:16',
  },
];

const PROVIDER_TABLE = [
  { provider: 'AWS RDS', service: 'Relational Database Service', advantages: 'Deep AWS integration, IAM auth, Multi-AZ, Read Replicas', monitoring: 'CloudWatch + Performance Insights' },
  { provider: 'Azure DB', service: 'Azure Database for PostgreSQL', advantages: 'Deep Azure integration, built-in HA, geo-redundancy', monitoring: 'Azure Monitor + Query Performance Insight' },
  { provider: 'Supabase', service: 'Managed Postgres + API', advantages: 'Free tier, built-in REST/GraphQL, realtime', monitoring: 'Supabase Dashboard' },
  { provider: 'Neon', service: 'Serverless Postgres', advantages: 'Branch per PR, scale-to-zero, free tier', monitoring: 'Neon Console' },
];

export default function DbSetupPage() {
  const [activeProvider, setActiveProvider] = useState<'aws' | 'azure'>('aws');
  const [healthResult, setHealthResult] = useState<Record<string, unknown> | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const runHealthCheck = async () => {
    setHealthLoading(true);
    setHealthResult(null);
    try {
      const res = await fetch('/api/health/db');
      const data = await res.json();
      setHealthResult(data);
    } catch {
      setHealthResult({ success: false, message: 'Failed to reach health endpoint' });
    } finally {
      setHealthLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const steps = activeProvider === 'aws' ? AWS_STEPS : AZURE_STEPS;

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🗄️ Managed PostgreSQL — Assignment 2.38
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        AWS RDS · Azure Database for PostgreSQL · Secure Connection · Production Hardening
      </p>

      {/* ── Provider Comparison ──────────────────────────────────────────────── */}
      <Card title="☁️ Managed DB Provider Comparison" subtitle="Self-hosted vs Managed vs Serverless" accentColor="#2563eb">
        <div style={{ marginTop: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Provider', 'Service', 'Key Advantages', 'Monitoring'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROVIDER_TABLE.map((row, i) => (
                <tr key={row.provider} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6' }}>{row.provider}</td>
                  <td style={{ padding: '10px 12px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{row.service}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>{row.advantages}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280', borderBottom: '1px solid #f3f4f6', fontSize: '11px' }}>{row.monitoring}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { icon: '🔧', label: 'Patching', self: 'Manual', managed: 'Automatic' },
            { icon: '💾', label: 'Backups', self: 'Manual scripts', managed: 'Automated + retention' },
            { icon: '📈', label: 'Scaling', self: 'Manual migration', managed: 'Console click' },
            { icon: '🔒', label: 'SSL/Encryption', self: 'Configure yourself', managed: 'Enforced by default' },
          ].map((row) => (
            <div key={row.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', fontSize: '12px' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#111827' }}>{row.icon} {row.label}</p>
              <p style={{ margin: 0, color: '#dc2626' }}>Self-hosted: {row.self}</p>
              <p style={{ margin: 0, color: '#16a34a' }}>Managed: {row.managed}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Provisioning Steps ───────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {[
            { key: 'aws',   label: '🟠 AWS RDS',   color: '#ea580c' },
            { key: 'azure', label: '🔵 Azure PostgreSQL', color: '#2563eb' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveProvider(p.key as 'aws' | 'azure')}
              style={{
                padding: '8px 20px', borderRadius: '20px', cursor: 'pointer',
                fontWeight: 700, fontSize: '13px', transition: 'all 0.15s',
                border: `2px solid ${activeProvider === p.key ? p.color : '#e5e7eb'}`,
                background: activeProvider === p.key ? p.color : '#f9fafb',
                color: activeProvider === p.key ? '#fff' : '#6b7280',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <Card
          title={`📋 ${activeProvider === 'aws' ? 'AWS RDS' : 'Azure PostgreSQL'} — Provisioning Steps`}
          subtitle="Step-by-step configuration guide"
          accentColor={activeProvider === 'aws' ? '#ea580c' : '#2563eb'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '16px' }}>
            {steps.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: activeProvider === 'aws' ? '#ea580c' : '#2563eb',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {step.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: '2px', flex: 1, background: '#e5e7eb', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: '20px', flex: 1 }}>
                  <p style={{ margin: '4px 0 2px', fontWeight: 700, fontSize: '14px', color: '#111827' }}>{step.title}</p>
                  <code style={{ display: 'block', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', color: '#374151', margin: '4px 0' }}>
                    {step.cmd}
                  </code>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── DATABASE_URL Reference ───────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🔗 DATABASE_URL Formats" subtitle="Copy the correct format for your environment" accentColor="#7c3aed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            {ENV_CONFIGS.map((cfg, i) => (
              <div key={i} style={{ background: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 14px', background: '#1e293b',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{cfg.label}</span>
                  <button
                    onClick={() => copyToClipboard(cfg.url, i)}
                    style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                      background: copiedIdx === i ? '#16a34a' : '#334155',
                      color: '#fff', border: 'none', fontWeight: 600,
                    }}
                  >
                    {copiedIdx === i ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <pre style={{
                  padding: '12px 14px', margin: 0, fontSize: '11px',
                  color: '#86efac', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>
                  DATABASE_URL="{cfg.url}"
                </pre>
                <div style={{ padding: '6px 14px 10px', fontSize: '11px', color: '#64748b' }}>
                  ⚠️ {cfg.note}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Live DB Health Check ─────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🩺 Live Database Health Check" subtitle="Tests connection from this Next.js app → PostgreSQL" accentColor="#16a34a">
          <div style={{ marginTop: '14px' }}>
            <Button
              label={healthLoading ? '⏳ Checking...' : '▶ Run Health Check (GET /api/health/db)'}
              variant="primary"
              size="md"
              isLoading={healthLoading}
              onClick={runHealthCheck}
            />
            {healthResult && (
              <div style={{
                marginTop: '16px', background: '#0f172a', borderRadius: '10px',
                padding: '16px', overflowX: 'auto',
              }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                  {(healthResult as { success?: boolean }).success ? '✅ Connected' : '🚫 Connection Failed'} — Response:
                </p>
                <pre style={{ margin: 0, fontSize: '12px', color: '#86efac' }}>
                  {JSON.stringify(healthResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Production Hardening ─────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="🔐 Production Hardening Checklist" subtitle="Before going live — verify all items" accentColor="#dc2626">
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { item: 'Disable public access', detail: 'Move to private subnet — app connects via VPC/private endpoint', critical: true },
              { item: 'SSL enforced', detail: 'Add ?sslmode=require to DATABASE_URL — verify with psql --sslmode=require', critical: true },
              { item: 'No wildcard inbound rules', detail: 'Security Group source = App server SG only, not 0.0.0.0/0', critical: true },
              { item: 'Credentials in Secrets Manager', detail: 'AWS Secrets Manager / Azure Key Vault — not in .env files in git', critical: true },
              { item: 'Automated backups enabled', detail: 'Min 7-day retention — test restore procedure quarterly', critical: false },
              { item: 'Connection pooling configured', detail: 'Add ?connection_limit=10 to DATABASE_URL — prevents "too many connections"', critical: false },
              { item: 'Read replica for analytics', detail: 'Route heavy read queries to replica — protects write performance', critical: false },
              { item: 'CloudWatch / Azure Monitor alerts', detail: 'Alert on: CPU > 80%, connections > 90%, free storage < 20%', critical: false },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 14px', borderRadius: '8px',
                background: row.critical ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${row.critical ? '#fca5a5' : '#86efac'}`,
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{row.critical ? '🔴' : '🟢'}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#111827' }}>{row.item}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{row.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
