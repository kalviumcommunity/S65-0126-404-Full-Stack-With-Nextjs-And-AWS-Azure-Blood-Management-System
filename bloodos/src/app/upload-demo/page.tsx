
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components';
import { useAuth } from '@/hooks/useAuth';

export default function ObjectStorageDemoPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatusText('');
      setPublicUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // ── 1. Client-Side Validation (Improves UX before network call) ─────────
    if (file.size > MAX_FILE_SIZE) {
      setStatusText('🚫 Error: File exceeds 5MB limit.');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setStatusText('🚫 Error: Invalid file type. Need JPEG/PNG/WEBP/PDF.');
      return;
    }

    setUploading(true);
    setStatusText('1/3 Requesting secure presigned URL...');
    setPublicUrl(null);

    try {
      // ── 2. Request Presigned URL from Backend ────────────────────────────
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to get secure URL');
      }

      const { uploadUrl, publicUrl } = data.data;

      setStatusText('2/3 Server granted 60s temporary URL. Uploading file straight to AWS S3...');

      // ── 3. Direct Upload to S3 (Bypass Next.js Backend) ───────────────────
      // The browser sends bytes directly to Amazon S3 via PUT request.
      const s3Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type, // Must strictly match the signedContentType!
        },
        body: file,
      });

      if (!s3Res.ok) {
        throw new Error('S3 upload rejected (Check bucket CORS or IAM policy)');
      }

      setStatusText('3/3 ✅ Upload successful!');
      setPublicUrl(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatusText(`🚫 External Upload Failed: ${msg}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
        ☁️ Secure Object Storage — Assignment 2.39
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
        AWS S3 · Presigned URLs · Direct Browser-to-Cloud Uploads · Least Privilege IAM
      </p>

      {/* ── Security Architecture Explanation ─────────────────────────────── */}
      <Card title="🔐 Upload Architecture: Why Presigned URLs?" subtitle="Best practice for cloud media" accentColor="#f59e0b">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)', gap: '16px', alignItems: 'center', margin: '20px 0', fontSize: '13px' }}>
          <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <span style={{ fontSize: '24px' }}>💻 Client</span>
            <p style={{ margin: '8px 0 0', color: '#6b7280' }}>1. Claims to need upload<br/>4. Secure PUT directly to cloud</p>
          </div>
          <div style={{ color: '#9ca3af', fontSize: '20px' }}>⇌</div>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
            <span style={{ fontSize: '24px' }}>⚙️ Next.js Backend</span>
            <p style={{ margin: '8px 0 0', color: '#2563eb', fontWeight: 600 }}>2. Validates user, caps size<br/>3. Signs URL using IAM keys</p>
          </div>
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', fontSize: '20px', transform: 'rotate(90deg)', margin: '-10px 0' }}>⇌</div>
          <div style={{ gridColumn: '1 / -1', background: '#fff7ed', padding: '16px', borderRadius: '8px', border: '1px solid #fed7aa', textAlign: 'center' }}>
            <span style={{ fontSize: '24px' }}>☁️ AWS S3 / Azure Blob</span>
            <p style={{ margin: '8px 0 0', color: '#ea580c', fontWeight: 700 }}>5. Validates IAM Signature & Temporal Expiry (60 sec). Saves Object.</p>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#374151', background: '#f3f4f6', padding: '12px', borderRadius: '6px' }}>
          <strong>✅ Benefits of Direct Uploads:</strong> Backend never touches the file memory. Bypasses 10-second serverless timeouts. Browser communicates securely with AWS without needing permanent Access Keys.
        </div>
      </Card>

      {/* ── Interactive Demo ────────────────────────────────────────────────── */}
      <div style={{ marginTop: '24px' }}>
        <Card title="📤 Test Direct Upload" subtitle="Requires AWS/Azure credentials configured in .env.local" accentColor="#3b82f6">
          {!isAuthenticated ? (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '8px', fontWeight: 600 }}>
              🔒 You must log in the mock user to use the backend API. Visit the DB dashboard login first.
            </div>
          ) : (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '12px', textAlign: 'center', background: '#f8fafc' }}>
                <input
                  type="file"
                  id="s3-file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept="image/jpeg, image/png, image/webp, application/pdf"
                />
                <label htmlFor="s3-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '32px', marginBottom: '10px' }}>📁</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>
                    {file ? file.name : 'Click to select an image or PDF'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                    Max 5MB • Validated client & server-side
                  </span>
                </label>
              </div>

              {file && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <Button
                    label={uploading ? 'Processing...' : 'Upload Securely to Cloud'}
                    onClick={handleUpload}
                    variant="primary"
                    size="md"
                    isLoading={uploading}
                  />
                  {statusText && (
                    <span style={{
                      fontSize: '13px', fontWeight: 600,
                      color: statusText.includes('Error') || statusText.includes('🚫') ? '#dc2626' : '#16a34a',
                    }}>
                      {statusText}
                    </span>
                  )}
                </div>
              )}

              {publicUrl && (
                <div style={{ marginTop: '16px', background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#15803d', fontSize: '14px' }}>
                    ☁️ File lives in cloud!
                  </p>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', wordBreak: 'break-all', color: '#166534', fontFamily: 'monospace' }}>
                    {publicUrl}
                  </p>
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#16a34a', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                    Open File
                  </a>
                </div>
              )}

            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
