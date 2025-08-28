import { useEffect, useState } from 'react';
import { apiJson, apiUpload } from '@/lib/api';
import { useAuth } from './auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

type Paper = { paper_id: number; filename: string; upload_date: string };

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      const data = await apiJson<{ papers: Paper[] }>('/papers/list.php');
      setPapers(data.papers);
    } catch {}
  }

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'teacher') {
      navigate('/admin', { replace: true });
      return;
    }
    load();
  }, [user, navigate]);

  async function onUpload() {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      await apiUpload('/papers/upload.php', form);
      setMessage('Uploaded');
      setFile(null);
      await load();
    } catch {
      setMessage('Upload failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 rounded bg-white shadow-sm">{user?.username} · teacher</span>
            <button className="px-3 py-1.5 bg-gray-800 text-white rounded" onClick={async () => { await logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-3">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onUpload}>Encrypt & Upload</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Your Encrypted Papers</h3>
          <ul className="divide-y">
            {papers.map(p => (
              <li key={p.paper_id} className="py-2 flex justify-between">
                <span>{p.filename}</span>
                <span className="text-sm text-gray-500">{new Date(p.upload_date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

