
'use client';

import { Card } from '@/components';
import { useState } from 'react';

const DOCKER_STEPS = [
  { step: 'Multi-stage Build', d: 'Uses node:18-alpine, splitting dependencies, builder, and runner out. Final image excludes source files, dropping size from ~1GB to ~100MB.' },
  { step: 'Standalone Output', d: 'Next.js "output: standalone" copies only specifically imported files into the final .next trace output folder, dropping unused node_modules.' },
  { step: 'Prisma Client', d: 'The Prisma native query engine binary and schema file are explicitly copied to the runner stage to ensure it survives the pruned image.' },
  { step: 'Non-Root User', d: 'The runner executes as the "nextjs" user (UID 1001) for strict security isolation, preventing container break-outs.' },
];

const CLOUD_PROVISIONING = [
  {
    opt: 'AWS ECS (Fargate)',
    color: '#ea580c',
    steps: [
      '1. Create ECR (Elastic Container Registry) private repo.',
      '2. Update Task Definition JSON with Image SHA tag.',
      '3. Provision Fargate Task (serverless compute): 0.5 vCPU, 1GB RAM.',
      '4. Attach ALB (Application Load Balancer) mapping 443 → 3000.',
      '5. Set Task Auto-scaling: Min 2, Max 10. Scale out at 70% CPU target.'
    ]
  },
  {
    opt: 'Azure App Service',
    color: '#2563eb',
    steps: [
      '1. Create Azure Container Registry (ACR).',
      '2. Provision Web App (Docker Container) plan.',
      '3. Link Web App to ACR with Admin Credentials/Managed Identity.',
      '4. Add App Setting: WEBSITES_PORT=3000 mapping the container expose.',
      '5. Set Scale-out Rules: Add instance if HTTP Queue Length > 10.'
    ]
  }
];

export default function DeploymentPage() {
  const [activeTab, setActiveTab] = useState<'docker' | 'cloud' | 'ci'>('docker');

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🚀 Containerized Deployment — Assignment 2.41
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        Docker · Multi-Stage Next.js · ECS Fargate · Azure App Service · CI/CD
      </p>

      {/* ── Architecture Overview ──────────────────────────────────────────────── */}
      <Card title="📦 Why Containerization?" subtitle="Docker vs Local Machine" accentColor="#1e293b">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#334155' }}>❌ Traditional EC2 / VPS</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#64748b' }}>
              <li>Node versions mismatch between dev/prod</li>
              <li>"It works on my machine" bugs</li>
              <li>Scaling out means provisioning a whole new OS</li>
              <li>App downtime during "npm ci" deployments</li>
            </ul>
          </div>
          <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#166534' }}>✅ Containerized (Docker)</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#15803d' }}>
              <li>Guaranteed identical OS runtime natively mapped</li>
              <li>Stateless instances load balance effortlessly</li>
              <li>Zero-downtime rolling deploys via Load Balancers</li>
              <li>Cold starts take seconds, not minutes</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ── Deployment Topics Navigation ─────────────────────────────────────────── */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('docker')}
          style={{
            padding: '8px 16px', background: activeTab === 'docker' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'docker' ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Docker Configuration
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          style={{
            padding: '8px 16px', background: activeTab === 'cloud' ? '#ea580c' : '#f1f5f9',
            color: activeTab === 'cloud' ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Cloud Provisioning (ECS/Azure)
        </button>
        <button
          onClick={() => setActiveTab('ci')}
          style={{
            padding: '8px 16px', background: activeTab === 'ci' ? '#059669' : '#f1f5f9',
            color: activeTab === 'ci' ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          CI/CD Automation
        </button>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        
        {/* Docker View */}
        {activeTab === 'docker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Next.js Multi-Stage Build</h3>
            {DOCKER_STEPS.map((step, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '8px', background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>{step.step}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{step.d}</p>
              </div>
            ))}
            <div style={{ marginTop: '8px', padding: '16px', background: '#0f172a', borderRadius: '8px' }}>
              <code style={{ color: '#86efac', fontSize: '13px' }}>
                # Build testing locally<br/>
                docker build -t bloodos-app .<br/><br/>
                # Run mapping port 3000 to local, passing strictly runtime env<br/>
                docker run -p 3000:3000 --env-file .env.local bloodos-app
              </code>
            </div>
          </div>
        )}

        {/* Cloud View */}
        {activeTab === 'cloud' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Cloud Orchestration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '16px' }}>
              {CLOUD_PROVISIONING.map((opt, i) => (
                <div key={i} style={{ padding: '20px', borderRadius: '12px', border: `1px solid ${opt.color}40`, background: '#fff' }}>
                  <h4 style={{ margin: '0 0 16px', color: opt.color, fontSize: '16px' }}>{opt.opt}</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
                    {opt.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            
            <Card title="📡 Load Balancer Health Check" subtitle="GET /api/health" accentColor="#0f172a">
              <p style={{ fontSize: '14px', color: '#475569', margin: '10px 0 0' }}>
                The ECS Application Load Balancer is configured to ping <code>/api/health</code> every 10 seconds.
                If this endpoint fails 3 consecutive times, AWS Fargate marks the container as unhealthy, 
                terminates it, and spins up a brand new fresh container automatically without human intervention.
              </p>
            </Card>
          </div>
        )}

        {/* CI/CD View */}
        {activeTab === 'ci' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>GitHub Actions Deployment Flow</h3>
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📥</span>
                  <div>
                    <h5 style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>1. Developer Pushes to Main</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Triggers webhook to GitHub Actions runner taking control.</p>
                  </div>
                </div>
                <div style={{ height: '20px', borderLeft: '2px solid #cbd5e1', margin: '0 12px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <div>
                    <h5 style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>2. Lint & Typecheck</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Fails the pipeline instantly if tsc or eslint throws errors.</p>
                  </div>
                </div>
                <div style={{ height: '20px', borderLeft: '2px solid #cbd5e1', margin: '0 12px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🐳</span>
                  <div>
                    <h5 style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>3. Docker Multi-Stage Build & Push</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Logs into ECR via IAM, builds the image from source, and tags it with the exact Git SHA.</p>
                  </div>
                </div>
                <div style={{ height: '20px', borderLeft: '2px solid #cbd5e1', margin: '0 12px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🚀</span>
                  <div>
                    <h5 style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>4. Update ECS Task Definition</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Renders a new task JSON referencing the new container tag hash, instructing ECS to deploy the new revision into Fargate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
