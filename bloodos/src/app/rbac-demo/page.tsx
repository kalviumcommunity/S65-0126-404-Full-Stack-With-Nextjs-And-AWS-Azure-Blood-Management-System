
'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/ui/RoleGuard';
import { Card, Button } from '@/components';
import {
  ROLES, PERMISSIONS, ROLE_PERMISSIONS,
  hasPermission, type Role, type Permission,
} from '@/config/roles';

// ─── Simulated users for demo ──────────────────────────────────────────────────
const DEMO_USERS: Array<{ id: string; name: string; role: Role; email: string }> = [
  { id: '1', name: 'Admin Alice',     role: 'ADMIN',    email: 'admin@bloodos.com' },
  { id: '2', name: 'Donor Bob',       role: 'DONOR',    email: 'bob@bloodos.com' },
  { id: '3', name: 'City Hospital',   role: 'HOSPITAL', email: 'city@hospital.com' },
  { id: '4', name: 'LifeLine NGO',    role: 'NGO',      email: 'info@lifeline.org' },
];

const PERMISSION_LABELS: Record<Permission, string> = {
  create:       '✏️ Create',
  read:         '👁️ Read',
  update:       '🔄 Update',
  delete:       '🗑️ Delete',
  manage_users: '👥 Manage Users',
  view_reports: '📊 View Reports',
};

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  ADMIN:    { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
  DONOR:    { bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
  HOSPITAL: { bg: '#eff6ff', text: '#2563eb', border: '#93c5fd' },
  NGO:      { bg: '#fefce8', text: '#ca8a04', border: '#fde047' },
};

interface AuditLog {
  role: Role;
  action: Permission;
  resource: string;
  result: 'ALLOWED' | 'DENIED';
  ts: string;
}

export default function RbacDemoPage() {
  const [activeUser, setActiveUser] = useState(DEMO_USERS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const simulateAction = (action: Permission, resource: string) => {
    const allowed = hasPermission(activeUser.role, action);
    const log: AuditLog = {
      role: activeUser.role,
      action,
      resource,
      result: allowed ? 'ALLOWED' : 'DENIED',
      ts: new Date().toLocaleTimeString(),
    };

    // Structured console log — matches server log format
    console.info(
      `[RBAC] ${allowed ? '✅' : '🚫'} ` +
      `ROLE=${activeUser.role.padEnd(8)} ` +
      `ACTION=${action.padEnd(12)} ` +
      `RESOURCE=${resource.padEnd(20)} ` +
      `RESULT=${log.result}`
    );

    setAuditLogs((prev) => [log, ...prev].slice(0, 10));
  };

  const colors = ROLE_COLORS[activeUser.role];

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        🔐 RBAC Demo — Assignment 2.35
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        Role-Based Access Control · Permission mapping · UI guards · Audit logs
      </p>

      {/* ── User selector ─────────────────────────────────────────────────── */}
      <Card title="👤 Simulate User Role" subtitle="Switch roles to see permission changes" accentColor="#7c3aed">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          {DEMO_USERS.map((u) => {
            const c = ROLE_COLORS[u.role];
            const isActive = activeUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setActiveUser(u)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${isActive ? c.border : '#e5e7eb'}`,
                  background: isActive ? c.bg : '#f9fafb',
                  color: isActive ? c.text : '#6b7280',
                  fontWeight: isActive ? 700 : 500, fontSize: '13px',
                  transition: 'all 0.15s',
                }}
              >
                {u.name}
              </button>
            );
          })}
        </div>
        <div style={{
          marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
          background: colors.bg, border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: colors.text }}>{activeUser.name}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{activeUser.email}</p>
          </div>
          <span style={{
            marginLeft: 'auto', padding: '3px 12px', borderRadius: '20px',
            background: colors.border, color: colors.text, fontWeight: 700, fontSize: '12px',
          }}>
            {activeUser.role}
          </span>
        </div>
      </Card>

      {/* ── Permission matrix ─────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="📋 Permission Matrix" subtitle="All roles and their permissions" accentColor="#dc2626">
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Role
                  </th>
                  {Object.values(PERMISSIONS).map((p) => (
                    <th key={p} style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                      {PERMISSION_LABELS[p as Permission]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(ROLES).map((role, i) => (
                  <tr
                    key={role}
                    style={{
                      background: role === activeUser.role ? ROLE_COLORS[role as Role].bg : i % 2 === 0 ? '#fff' : '#fafafa',
                      fontWeight: role === activeUser.role ? 700 : 400,
                    }}
                  >
                    <td style={{ padding: '10px 14px', color: ROLE_COLORS[role as Role].text, borderBottom: '1px solid #f3f4f6' }}>
                      {role}
                      {role === activeUser.role && <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>← active</span>}
                    </td>
                    {Object.values(PERMISSIONS).map((p) => {
                      const allowed = hasPermission(role as Role, p as Permission);
                      return (
                        <td key={p} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                          {allowed
                            ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✅</span>
                            : <span style={{ color: '#d1d5db' }}>—</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Action simulator ──────────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card
          title="⚡ Simulate API Actions"
          subtitle="Actions gated by current role — logs appear in console + below"
          accentColor="#16a34a"
        >
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '8px 0 16px', fontFamily: 'monospace' }}>
            Active role: <strong style={{ color: colors.text }}>{activeUser.role}</strong> — permissions:{' '}
            {ROLE_PERMISSIONS[activeUser.role].join(', ')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { action: PERMISSIONS.READ,   resource: 'blood_requests', label: '👁️ Read Requests' },
              { action: PERMISSIONS.CREATE, resource: 'blood_requests', label: '✏️ Create Request' },
              { action: PERMISSIONS.UPDATE, resource: 'blood_requests', label: '🔄 Update Request' },
              { action: PERMISSIONS.DELETE, resource: 'blood_requests', label: '🗑️ Delete Request' },
              { action: PERMISSIONS.MANAGE_USERS, resource: 'users',   label: '👥 Manage Users' },
              { action: PERMISSIONS.VIEW_REPORTS,  resource: 'reports', label: '📊 View Reports' },
            ].map(({ action, resource, label }) => {
              const allowed = hasPermission(activeUser.role, action as Permission);
              return (
                <button
                  key={action}
                  onClick={() => simulateAction(action as Permission, resource)}
                  style={{
                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${allowed ? '#86efac' : '#fca5a5'}`,
                    background: allowed ? '#f0fdf4' : '#fef2f2',
                    color: allowed ? '#15803d' : '#dc2626',
                    fontWeight: 600, fontSize: '13px', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                  <span style={{ display: 'block', fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                    {allowed ? '✅ Allowed' : '🚫 Denied'}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Audit log ────────────────────────────────────────────────────── */}
      {auditLogs.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Card title="📋 Audit Log" subtitle="Last 10 access decisions" accentColor="#374151">
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {auditLogs.map((log, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace',
                  background: log.result === 'ALLOWED' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${log.result === 'ALLOWED' ? '#86efac' : '#fca5a5'}`,
                }}>
                  <span>{log.result === 'ALLOWED' ? '✅' : '🚫'}</span>
                  <span style={{ color: '#6b7280' }}>{log.ts}</span>
                  <span style={{ color: ROLE_COLORS[log.role].text, fontWeight: 700 }}>ROLE={log.role}</span>
                  <span style={{ color: '#374151' }}>ACTION={log.action}</span>
                  <span style={{ color: '#6b7280' }}>RESOURCE={log.resource}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: log.result === 'ALLOWED' ? '#16a34a' : '#dc2626' }}>
                    {log.result}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px' }}>
              ↗ Same format logged to server console on real API calls
            </p>
          </Card>
        </div>
      )}

      {/* ── UI conditional rendering demo ────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card
          title="🔒 UI-Level RoleGuard (useAuth-based)"
          subtitle="These use the real AuthContext — log in to see dynamic changes"
          accentColor="#2563eb"
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
            <RoleGuard permission={PERMISSIONS.READ}>
              <Button label="👁️ View (all roles)" variant="secondary" size="sm" onClick={() => {}} />
            </RoleGuard>
            <RoleGuard permission={PERMISSIONS.UPDATE}>
              <Button label="🔄 Edit (DONOR+)" variant="secondary" size="sm" onClick={() => {}} />
            </RoleGuard>
            <RoleGuard
              permission={PERMISSIONS.DELETE}
              fallback={<span style={{ fontSize: '12px', color: '#9ca3af', padding: '8px' }}>🚫 Delete (ADMIN only)</span>}
            >
              <Button label="🗑️ Delete (ADMIN)" variant="danger" size="sm" onClick={() => {}} />
            </RoleGuard>
            <RoleGuard
              permission={PERMISSIONS.MANAGE_USERS}
              fallback={<span style={{ fontSize: '12px', color: '#9ca3af', padding: '8px' }}>🚫 Manage Users (ADMIN only)</span>}
            >
              <Button label="👥 Manage Users" variant="primary" size="sm" onClick={() => {}} />
            </RoleGuard>
          </div>
          <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '12px', background: '#fffbeb', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
            ⚠️ UI guards are UX convenience only. The API always enforces permissions server-side regardless of UI state.
          </p>
        </Card>
      </div>
    </div>
  );
}
