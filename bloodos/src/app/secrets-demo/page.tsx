
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components';
import { useAuth } from '@/hooks/useAuth';

const AWS_STEPS = [
  { step: '1. Store Secret', desc: 'AWS Secrets Manager → "Other type of secret" → Store as JSON key-value pairs (e.g., {"DATABASE_URL": "...", "JWT_SECRET": "..."})' },
  { step: '2. Enable KMS', desc: 'AWS KMS encrypts the JSON string at rest. The key is managed automatically by AWS.' },
  { step: '3. IAM Policy', desc: 'Create generic role. Add an inline policy granting specifically only "secretsmanager:GetSecretValue"' },
  { step: '4. Restrict ARN', desc: 'In the IAM Policy, lock the resource to the precise Secret ARN, ensuring no other secrets can be read.' },
];

const AZURE_STEPS = [
  { step: '1. Create Vault', desc: 'Create an Azure Key Vault resource in your VNet region for low-latency retrieval.' },
  { step: '2. Add Secrets', desc: 'Add individual variables as secrets inside the Key Vault using the Azure portal.' },
  { step: '3. Identity', desc: 'Attach a Managed Identity to your App Service, eliminating the need for any stored credentials.' },
  { step: '4. RBAC Assign', desc: 'Assign "Key Vault Secrets User" role to your Managed Identity specifically for that Vault.' },
];

export default function SecretsDemoPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [testing, setTesting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const fetchSecrets = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Must be logged in as an admin for this exact route to succeed
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin/secrets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: String(error) });
    } finally {
      setTesting(false);
    }
  };

  if (isLoading) return <div>Auth loading...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🔑 Secret Management in the Cloud — Assignment 2.40
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        AWS Secrets Manager · Azure Key Vault · Encryption at Rest · Least-Privilege IAM Retrieval
      </p>

      {/* ── Why Not .env? ──────────────────────────────────────────────────────── */}
      <Card title="🚨 Why .env Files Are Risky" subtitle="Local vs Production Security Models" accentColor="#dc2626">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ color: '#991b1b', margin: '0 0 8px', fontSize: '15px' }}>Traditional .env File</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#b91c1c' }}>
              <li>❌ Plaintext files sitting on a disk.</li>
              <li>❌ Accidental Git commits leak production keys.</li>
              <li>❌ Anyone with server shell access can read them.</li>
              <li>❌ Updating a secret requires a full deployment/restart.</li>
              <li>❌ High likelihood of stale keys not being rotated.</li>
            </ul>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 8px', fontSize: '15px' }}>AWS / Azure Cloud Secrets</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1e3a8a' }}>
              <li>✅ Encrypted at rest (KMS key envelope encryption).</li>
              <li>✅ Stored strictly off-server, never touching the physical disk.</li>
              <li>✅ Only accessible by the app's specific IAM runtime execution role.</li>
              <li>✅ Auditable — you can track every time a secret is fetched.</li>
              <li>✅ Supports automated, zero-touch credential rotation.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ── Cloud Implementation Steps ─────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <Card title="☁️ Cloud Provisioning Steps" subtitle="AWS Secrets Manager & Azure Vault" accentColor="#7c3aed">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '6px 6px 0 0', fontWeight: 600, fontSize: '13px' }}>AWS Setup</div>
              <div style={{ border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '16px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AWS_STEPS.map(s => <li key={s.step}><strong>{s.step}:</strong> {s.desc}</li>)}
                </ul>
              </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ background: '#2563eb', color: '#fff', padding: '8px 12px', borderRadius: '6px 6px 0 0', fontWeight: 600, fontSize: '13px' }}>Azure Setup</div>
              <div style={{ border: '1px solid #bfdbfe', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '16px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1e40af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AZURE_STEPS.map(s => <li key={s.step}><strong>{s.step}:</strong> {s.desc}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Interactive Test ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <Card title="🧪 Runtime Injection Validation" subtitle="Fetch securely from AWS using the Node SDK" accentColor="#16a34a">
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Button
              label={testing ? 'Fetching...' : 'Verify Secret Runtime Access'}
              onClick={fetchSecrets}
              variant="primary"
              size="md"
              disabled={!isAuthenticated || !isAdmin || testing}
            />
            {(!isAuthenticated || !isAdmin) && (
              <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>
                🔒 You must log in as an ADMIN first to query secrets.
              </span>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px 8px 0 0', color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>
              Testing Endpoint: GET /api/admin/secrets
            </div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0 0 8px 8px', padding: '16px', overflowX: 'auto', minHeight: '100px' }}>
              {!testResult ? (
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Hit verify to trigger runtime retrieval...</p>
              ) : (
                <pre style={{ margin: 0, color: testResult.success ? '#86efac' : '#fca5a5', fontSize: '12px' }}>
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </div>
          </div>
          <div style={{ marginTop: '12px', background: '#fefce8', border: '1px solid #fef08a', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#854d0e' }}>
            ⚠️ <strong>Secure Audit Logic:</strong> Notice how the API explicitly refuses to return the actual payload values (such as the database password). It returns an array of keys just to securely prove the runtime injection succeeded.
          </div>
        </Card>
      </div>
    </div>
  );
}
