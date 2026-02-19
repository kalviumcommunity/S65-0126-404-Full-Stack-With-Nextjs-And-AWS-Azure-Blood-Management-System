
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card } from '@/components';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'BloodOS Dashboard — Overview of blood donations, requests, and inventory.',
};

export default function DashboardPage() {
  const stats = [
    { title: 'My Donations', value: '3', subtitle: 'Last 12 months', color: '#dc2626' },
    { title: 'Active Requests', value: '2', subtitle: 'Pending approval', color: '#2563eb' },
    { title: 'Notifications', value: '5', subtitle: 'Unread messages', color: '#d97706' },
    { title: 'Matched Donors', value: '12', subtitle: 'Near your area', color: '#16a34a' },
  ];

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span aria-hidden="true" style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }} aria-current="page">Dashboard</span>
      </nav>

      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
        Welcome Back 👋
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
        Your BloodOS overview — everything you need at a glance.
      </p>

      {/* Stats Grid using Card component */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {stats.map(({ title, value, subtitle, color }) => (
          <Card key={title} title={title} subtitle={subtitle} accentColor={color}>
            <p style={{ fontSize: '36px', fontWeight: 800, color, margin: '8px 0 0' }}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions using Button component */}
      <Card title="Quick Actions" subtitle="Common tasks">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
          <Button label="View All Users" variant="primary" size="md" />
          <Button label="New Blood Request" variant="secondary" size="md" />
          <Button label="Emergency Alert" variant="danger" size="md" />
          <Button label="Help" variant="ghost" size="md" />
        </div>
      </Card>
    </div>
  );
}
