import { useState } from 'react';
import { apiJson } from '@/lib/api';

type Attempt = { action: string; status: number; ok: boolean; message: string };

export default function HackerPOV() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);

  async function tryAction(label: string, fn: () => Promise<Response | { status: number }>) {
    setLoading(true);
    try {
      const res = await fn();
      const status = 'status' in res ? res.status : 0;
      setAttempts(prev => [{ action: label, status, ok: status >= 200 && status < 300, message: status === 401 ? 'Unauthorized (no session)' : status === 403 ? 'Forbidden (insufficient role)' : `Status ${status}` }, ...prev]);
    } catch (e: any) {
      setAttempts(prev => [{ action: label, status: 0, ok: false, message: e?.message || 'Network error' }, ...prev]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Hacker POV</h2>
        <p className="text-gray-600 mb-4">Simulate unauthorized attempts. You should see 401/403 responses.</p>
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          <button disabled={loading} className="px-4 py-2 bg-gray-800 text-white rounded" onClick={() => tryAction('List papers (unauthenticated)', async () => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api'}/papers/list.php`, { credentials: 'include' });
            return res;
          })}>Try list without login</button>
          <button disabled={loading} className="px-4 py-2 bg-purple-700 text-white rounded" onClick={() => tryAction('Download paper (force id=1)', async () => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api'}/papers/download.php?paper_id=1`, { credentials: 'include' });
            return res;
          })}>Try download without admin</button>
          <button disabled={loading} className="px-4 py-2 bg-blue-700 text-white rounded" onClick={() => tryAction('Upload (fake file)', async () => {
            const form = new FormData();
            form.append('file', new Blob(['test'], { type: 'text/plain' }), 'fake.txt');
            const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api'}/papers/upload.php`, { method: 'POST', credentials: 'include', body: form });
            return res;
          })}>Try upload without teacher role</button>
        </div>
        <div className="bg-white rounded shadow divide-y">
          {attempts.length === 0 && <div className="p-4 text-gray-500">No attempts yet.</div>}
          {attempts.map((a, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.action}</div>
                <div className={`text-sm ${a.ok ? 'text-green-700' : 'text-red-700'}`}>{a.message}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${a.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{a.status || 'ERR'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


