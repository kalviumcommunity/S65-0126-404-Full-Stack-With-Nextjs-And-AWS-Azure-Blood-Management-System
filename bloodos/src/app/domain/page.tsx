
'use client';

import { Card } from '@/components';
import { useState } from 'react';

const AWS_STEPS = [
  { step: '1. Route 53 Hosted Zone', desc: 'Create a Public Hosted Zone for your domain. Copy the 4 NS (Name Server) records provided by AWS.' },
  { step: '2. Update Registrar', desc: 'Go to your domain registrar (e.g., GoDaddy, Namecheap) and replace their default nameservers with the 4 AWS NS records.' },
  { step: '3. Request ACM Certificate', desc: 'In AWS Certificate Manager, request a public cert for `example.com` and `*.example.com`. Choose DNS Validation.' },
  { step: '4. CNAME Validation', desc: 'ACM provides a CNAME record. Add this string to your Route 53 zone to prove you own the domain. AWS issues the cert.' },
  { step: '5. Attach to ALB', desc: 'Edit the Application Load Balancer listeners. Map HTTPS (443) to the target group using the new ACM certificate.' },
  { step: '6. Route 53 Alias Record', desc: 'Create an "A" record in Route 53. Toggle "Alias" to ON, and point it directly at the ALB. Create a CNAME for www pointing to the root.' },
];

const AZURE_STEPS = [
  { step: '1. Custom Domain Config', desc: 'In App Service -> Custom Domains, add `www.example.com`. Azure provides a TXT record for ownership verification.' },
  { step: '2. DNS Provider Update', desc: 'Add the TXT and CNAME/A records to your DNS provider (or Azure DNS) to map the domain to the App Service IP.' },
  { step: '3. Create Managed Cert', desc: 'In App Service -> TLS/SSL settings, select "Create App Service Managed Certificate". Azure provisions this for free.' },
  { step: '4. Bind Certificate', desc: 'Add a TLS/SSL binding linking your custom domain to the newly created managed certificate.' },
];

const BEST_PRACTICES = [
  { title: 'Automatic Renewal', desc: 'AWS ACM and Azure Managed Certs automatically renew before expiry. Never use manual certs in production.' },
  { title: 'Wildcard Certificates', desc: 'Request `*.myapp.com` to secure unlimited subdomains (api., app., staging.) with a single certificate.' },
  { title: 'HTTP → HTTPS 301 Redirect', desc: 'Configure the Load Balancer (AWS) or App Service (Azure) to intercept port 80 traffic and return a 301 Permanent Redirect to port 443.' },
  { title: 'DNS Propagation', desc: 'NS changes can take up to 48 hours globally. Always verify using `dig yourdomain.com +short` before debugging.' },
];

export default function DomainSetupPage() {
  const [activeTab, setActiveTab] = useState<'aws' | 'azure' | 'security'>('aws');

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🌍 Custom Domain & SSL Configuration — Assignment 2.43
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        Route 53 · Azure DNS · ACM · HTTPS Enforcement
      </p>

      {/* ── DNS Theory ───────────────────────────────────────────────────────── */}
      <Card title="📚 Understanding DNS & SSL" subtitle="The critical infrastructure of the public web" accentColor="#4f46e5">
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#374151' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
            <strong>DNS (Domain Name System):</strong> The phonebook of the internet. Translates human-readable names (bloodos.com) into machine IP addresses.
          </div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
            <strong>A Record vs CNAME:</strong> An <strong>A Record</strong> maps a domain to an IPv4 address. A <strong>CNAME</strong> maps a domain to another domain string. The root apex (`example.com`) CANNOT be a CNAME. (AWS solves this with special Alias A records).
          </div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <strong>SSL/TLS Certificate:</strong> Cryptographically verifies the server identity and encrypts all transit payload data. A browser padlock 🔒 guarantees to the user that no ISP or network node is intercepting the traffic.
          </div>
        </div>
      </Card>

      {/* ── Cloud Implementation Navigation ──────────────────────────────────── */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('aws')}
          style={{
            padding: '8px 16px', background: activeTab === 'aws' ? '#ea580c' : '#fff',
            color: activeTab === 'aws' ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          🟠 AWS Route 53 + ACM
        </button>
        <button
          onClick={() => setActiveTab('azure')}
          style={{
            padding: '8px 16px', background: activeTab === 'azure' ? '#2563eb' : '#fff',
            color: activeTab === 'azure' ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          🔵 Azure Native
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '8px 16px', background: activeTab === 'security' ? '#0f172a' : '#fff',
            color: activeTab === 'security' ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          🔒 Production Verification
        </button>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        
        {/* AWS View */}
        {activeTab === 'aws' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>AWS Custom Domain Architecture</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)', gap: '10px', alignItems: 'center', textAlign: 'center', fontSize: '12px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '16px', background: '#fff7ed', border: '2px solid #fdba74', borderRadius: '8px' }}>
                <strong style={{ color: '#c2410c' }}>Route 53 (DNS)</strong><br/>
                A Record ALIAS: bloodos.com<br/>
                → mapped to Load Balancer ARN
              </div>
              <div style={{ fontSize: '20px', color: '#94a3b8' }}>→</div>
              <div style={{ padding: '16px', background: '#eff6ff', border: '2px solid #93c5fd', borderRadius: '8px' }}>
                <strong style={{ color: '#1d4ed8' }}>Application Load Balancer</strong><br/>
                Listens: 443 (HTTPS)<br/>
                Terminates SSL via ACM Cert
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 16px', color: '#334155' }}>Step-by-Step Execution</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                {AWS_STEPS.map((s, i) => (
                  <li key={i}>
                    <strong style={{ color: '#0f172a' }}>{s.step}</strong> <br/>
                    {s.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Azure View */}
        {activeTab === 'azure' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Azure Domain & SSL Binding</h3>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                {AZURE_STEPS.map((s, i) => (
                  <li key={i}>
                    <strong style={{ color: '#1e40af' }}>{s.step}</strong> <br/>
                    {s.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Security & Best Practices View */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '16px' }}>
              {BEST_PRACTICES.map((practice, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                  <h4 style={{ margin: '0 0 8px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {practice.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{practice.desc}</p>
                </div>
              ))}
            </div>

            <Card title="🧪 Live Production Verification Steps" subtitle="How to prove the configuration is bulletproof" accentColor="#10b981">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', fontSize: '13px', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <code style={{ background: '#e2e8f0', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>curl -I http://bloodos.com</code>
                  <span>Ensure Response is <b>HTTP/1.1 301 Moved Permanently</b> pointing to <b>Location: https://...</b></span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <code style={{ background: '#e2e8f0', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>Browser DevTools</code>
                  <span>Open Security Tab -&gt; View Certificate. Ensure Issuer is Amazon / Microsoft.</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                  <strong style={{ color: '#166534' }}>SSL Labs Test:</strong>
                  <span><a href="https://www.ssllabs.com/ssltest/" target="_blank" style={{ color: '#2563eb' }}>Run an SSLLabs benchmark</a> to guarantee an "A" rating, proving TLS 1.0/1.1 are disabled and cipher suites are secure.</span>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
