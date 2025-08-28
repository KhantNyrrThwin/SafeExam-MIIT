import { useEffect, useState } from 'react';
import { apiJson, apiUpload } from '@/lib/api';

type Paper = { paper_id: number; filename: string; upload_date: string };

export default function TeacherDashboard() {
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
    load();
  }, []);

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
        <h2 className="text-2xl font-semibold mb-4">Teacher Dashboard</h2>
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

