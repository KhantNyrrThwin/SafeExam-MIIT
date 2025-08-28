import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';

type Paper = { paper_id: number; filename: string; upload_date: string };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);

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
    if (user.role !== 'admin') {
      navigate(user.role === 'teacher' ? '/teacher' : '/student', { replace: true });
      return;
    }
    load();
  }, [user, navigate]);

  function download(paperId: number) {
    const url = `${import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api'}/papers/download.php?paper_id=${paperId}`;
    const a = document.createElement('a');
    a.href = url;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader right={<>
        <span className="px-2 py-1 rounded bg-white/20">{user?.username} · admin</span>
        <button className="px-3 py-1.5 bg-white text-indigo-700 rounded hover:bg-white/90" onClick={async () => { await logout(); navigate('/'); }}>Logout</button>
      </>} />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Encrypted Papers</h3>
          <ul className="divide-y">
            {papers.map(p => (
              <li key={p.paper_id} className="py-2 flex justify-between items-center">
                <div>
                  <div>{p.filename}</div>
                  <div className="text-sm text-gray-500">{new Date(p.upload_date).toLocaleString()}</div>
                </div>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded" onClick={() => download(p.paper_id)}>Decrypt & Download</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

