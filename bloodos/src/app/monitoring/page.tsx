
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components';

export default function MonitoringPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper just to display the visual fake terminal output
  const appendLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} » ${msg}`]);
  };

  const simulateRequest = async (simulateSlowQuery: boolean, throwError: boolean) => {
    setLoading(true);
    appendLog(`Issuing POST /api/log-demo (Slow: ${simulateSlowQuery}, Error: ${throwError})`);

    const correlationId = `web-${Math.random().toString(36).substr(2, 9)}`;
    const start = Date.now();

    try {
      const res = await fetch('/api/log-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': correlationId // Injecting ID from client root
        },
        body: JSON.stringify({ simulateSlowQuery, throwError })
      });

      const data = await res.json();
      const elapsed = Date.now() - start;

      if (!res.ok) {
        appendLog(`❌ HTTP ${res.status}: Server captured error. Watch CloudWatch. Trace ID: ${data.requestTraceId}`);
      } else {
        appendLog(`✅ HTTP 200: Successfully fulfilled in ${elapsed}ms. Trace ID: ${data.requestTraceId}`);
      }
    } catch (err: unknown) {
      appendLog(`🚨 Fatal Network Error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        📊 Logging & Cloud Monitoring — Assignment 2.44
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        AWS CloudWatch · Azure Monitor · Structured JSON · Metric Filters · Alerts
      </p>

      {/* ── Theory: Observability ──────────────────────────────────────────────── */}
      <Card title="🔍 The Three Pillars of Observability" subtitle="Logs vs Metrics vs Alerts" accentColor="#3b82f6">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ color: '#0f172a', margin: '0 0 8px', fontSize: '15px' }}>📜 Logs</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Immutable records of discrete events containing rich context (user IDs, stack traces). Essential for RCA (Root Cause Analysis).</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ color: '#166534', margin: '0 0 8px', fontSize: '15px' }}>📈 Metrics</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#15803d' }}>Numbers measured over time (CPU %, Error rates, Latency avg). Used to plot dashboards and spot broader trends.</p>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ color: '#b91c1c', margin: '0 0 8px', fontSize: '15px' }}>🚨 Alerts</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#991b1b' }}>Automated triggers mapped to Slack or PagerDuty when Metrics cross dangerous thresholds (e.g., Error Rate &gt; 5%).</p>
          </div>
        </div>
      </Card>

      {/* ── Correlation IDs ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <Card title="🔗 Structured JSON & Correlation IDs" subtitle="Never lose track of a request" accentColor="#8b5cf6">
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{ flex: '1', background: '#1e293b', color: '#a5b4fc', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`// BAD LOGGING (Standard string mapping)
console.log("Saving user settings for John...");
console.log("Connecting to Database...");
console.error("Timeout thrown processing John");

// ❌ Problem: When 1,000 servers process 50k reqs/sec, 
// these 3 lines interleave with 1 million other logs.`}
            </div>
            <div style={{ flex: '1', background: '#0f172a', color: '#86efac', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`// GOOD: Structured JSON Logger
{
  "timestamp": "2026-02-22T10:00:00Z",
  "level": "error",
  "requestId": "fd2-a9b1-cx9", // correlation ID
  "endpoint": "/api/users/save",
  "message": "Timeout processing John settings",
  "error": "Fake DB Conection Timeout"
}

// ✅ Solution: CloudWatch can query:
// filter @requestId = 'fd2-a9b1-cx9'`}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Interactive Demo ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <Card title="🧪 Generate Cloudwatch Traces" subtitle="Push live metrics into the AWS / Azure backend logger" accentColor="#10b981">
          
          <div style={{ display: 'flex', gap: '16px', margin: '16px 0', flexWrap: 'wrap' }}>
            <Button
              label="1. Happy Path Request"
              onClick={() => simulateRequest(false, false)}
              variant="secondary"
              size="sm"
              disabled={loading}
            />
            <Button
              label="2. Simulate Slow Query (Warn)"
              onClick={() => simulateRequest(true, false)}
              variant="secondary"
              size="sm"
              disabled={loading}
            />
            <Button
              label="3. Trigger Fatal Exception (Error)"
              onClick={() => simulateRequest(false, true)}
              variant="primary"
              size="sm"
              disabled={loading}
              style={{ background: '#dc2626', borderColor: '#b91c1c' }}
            />
          </div>

          <div style={{ background: '#000', color: '#00ff00', padding: '16px', borderRadius: '8px', minHeight: '150px', fontFamily: 'monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.length === 0 ? (
              <span style={{ color: '#4b5563' }}>Terminal awaiting simulated actions... Server metrics will be written standard-out.</span>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </Card>
      </div>
      
    </div>
  );
}
