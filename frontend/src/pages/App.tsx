import { Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="font-bold">SafeExam@MIIT</div>
          <nav className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="px-2 py-1 rounded bg-gray-100">{user.username} · {user.role}</span>
                <Link className="hover:underline" to={user.role === 'teacher' ? '/teacher' : '/admin'}>Dashboard</Link>
              </>
            ) : (
              <Link className="px-3 py-1.5 bg-blue-600 text-white rounded" to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Web-Based Exam Paper Security</h1>
            <p className="mb-6 text-gray-600">Encrypt, store, and manage exam papers securely with RSA hybrid encryption.</p>
            {user ? (
              <Link className="px-4 py-2 bg-blue-600 text-white rounded" to={user.role === 'teacher' ? '/teacher' : '/admin'}>
                Go to your dashboard
              </Link>
            ) : (
              <Link className="px-4 py-2 bg-blue-600 text-white rounded" to="/login">Get started</Link>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded border">
                <div className="font-semibold mb-1">End-to-End Encryption</div>
                <div className="text-gray-600">AES-GCM with RSA-wrapped keys.</div>
              </div>
              <div className="p-4 rounded border">
                <div className="font-semibold mb-1">Role-based Access</div>
                <div className="text-gray-600">Teachers upload; Admins audit and decrypt.</div>
              </div>
              <div className="p-4 rounded border">
                <div className="font-semibold mb-1">Audit-friendly</div>
                <div className="text-gray-600">Timestamps and immutable storage.</div>
              </div>
              <div className="p-4 rounded border">
                <div className="font-semibold mb-1">Simple UX</div>
                <div className="text-gray-600">Clear flows and quick actions.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

