import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import SiteHeader from './components/SiteHeader';
import { apiJson, API_BASE } from '@/lib/api';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<{ action: string; status: number; ok: boolean; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<{ paper_id: number; filename: string; upload_date: string }[]>([]);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'student') {
      navigate(user.role === 'teacher' ? '/teacher' : '/admin', { replace: true });
    }
  }, [user, navigate]);

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
    <div className="min-h-screen bg-gray-50">
      <SiteHeader right={<>
        <span className="px-2 py-1 rounded bg-white/20">{user?.username} · student</span>
        <button className="px-3 py-1.5 bg-white text-indigo-700 rounded hover:bg-white/90" onClick={async () => { await logout(); navigate('/'); }}>Logout</button>
      </>} />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Student Dashboard</h2>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Available Encrypted Papers</h3>
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded" onClick={async () => {
              try {
                const data = await apiJson<{ papers: { paper_id: number; filename: string; upload_date: string }[] }>(`/papers/list.php`);
                // @ts-ignore
                setPapers(data.papers);
              } catch {}
            }}>Refresh</button>
          </div>
          <ul className="divide-y">
            {papers?.map((p: any) => (
              <li key={p.paper_id} className="py-2 flex items-center justify-between">
                <div>
                  <div>{p.filename}</div>
                  <div className="text-sm text-gray-500">{new Date(p.upload_date).toLocaleString()}</div>
                </div>
                <button disabled className="px-3 py-1.5 rounded bg-gray-200 text-gray-500 cursor-not-allowed" title="Students cannot decrypt">Decrypt & Download</button>
              </li>
            ))}
            {(!papers || papers.length === 0) && <li className="py-2 text-gray-500">No papers loaded. Click Refresh.</li>}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <p className="text-gray-700 mb-3">You are signed in as a student. You cannot list, upload, or download exam papers. Try the actions below to see the server protections.</p>
          <div className="grid md:grid-cols-2 gap-3">
            <button disabled={loading} className="px-4 py-2 bg-gray-800 text-white rounded" onClick={() => tryAction('List papers (student)', async () => {
              const res = await fetch(`${API_BASE}/papers/list.php`, { credentials: 'include' });
              return res;
            })}>Try list papers</button>
            <button disabled={loading} className="px-4 py-2 bg-purple-700 text-white rounded" onClick={() => tryAction('Download paper (id=1)', async () => {
              const res = await fetch(`${API_BASE}/papers/download.php?paper_id=1`, { credentials: 'include' });
              return res;
            })}>Try download paper</button>
            <button disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded" onClick={() => tryAction('Upload fake paper', async () => {
              const form = new FormData();
              form.append('file', new Blob(['test'], { type: 'text/plain' }), 'fake.txt');
              const res = await fetch(`${API_BASE}/papers/upload.php`, { method: 'POST', credentials: 'include', body: form });
              return res;
            })}>Try upload paper</button>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Available Encrypted Papers</h3>
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded" onClick={async () => {
              try {
                const data = await apiJson<{ papers: { paper_id: number; filename: string; upload_date: string }[] }>(`/papers/list.php`);
                setPapers(data.papers);
              } catch {}
            }}>Refresh</button>
          </div>
          {decryptError && (
            <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              {decryptError}
            </div>
          )}
          <ul className="divide-y">
            {papers.map(p => (
              <li key={p.paper_id} className="py-2 flex items-center justify-between">
                <div>
                  <div>{p.filename}</div>
                  <div className="text-sm text-gray-500">{new Date(p.upload_date).toLocaleString()}</div>
                </div>
                <button
                  className="px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={async () => {
                    setDecryptError(null);
                    try {
                      const res = await fetch(`${API_BASE}/papers/download.php?paper_id=${p.paper_id}`, { credentials: 'include' });
                      if (res.status === 403) {
                        setDecryptError('Cannot decrypt: your role does not have the private key required to decrypt exam papers.');
                        return;
                      }
                      if (!res.ok) {
                        setDecryptError(`Download failed (status ${res.status}).`);
                        return;
                      }
                      // If server ever allowed, it would stream a file. We do nothing here for student.
                    } catch (e: any) {
                      setDecryptError(e?.message || 'Network error while attempting decryption.');
                    }
                  }}
                >
                  Decrypt & Download
                </button>
              </li>
            ))}
            {papers.length === 0 && <li className="py-2 text-gray-500">No papers loaded. Click Refresh.</li>}
          </ul>
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


