import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api';

type Paper = { paper_id: number; filename: string; upload_date: string };

export default function AdminDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);

  async function load() {
    try {
      const data = await apiJson<{ papers: Paper[] }>('/papers/list.php');
      setPapers(data.papers);
    } catch {}
  }

  useEffect(() => {
    load();
  }, []);

  function download(paperId: number) {
    const url = `${import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api'}/papers/download.php?paper_id=${paperId}`;
    const a = document.createElement('a');
    a.href = url;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
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

