import { Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import SiteHeader from './components/SiteHeader';

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <SiteHeader right={user ? (
        <>
          <span className="px-2 py-1 rounded bg-white/20">{user.username} · {user.role}</span>
          <Link className="px-3 py-1.5 bg-white text-indigo-700 rounded hover:bg-white/90" to={user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student'}>Dashboard</Link>
        </>
      ) : (
        <Link className="px-3 py-1.5 bg-white text-indigo-700 rounded hover:bg-white/90" to="/login">Login</Link>
      )} />
      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Web-Based Exam Paper Security</h1>
            <p className="mb-6 text-gray-600">Encrypt, store, and manage exam papers securely with RSA hybrid encryption.</p>
            {user ? (
              <Link className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded" to={user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student'}>
                Go to your dashboard
              </Link>
            ) : (
              <Link className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded" to="/login">Get started</Link>
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
            <div className="mt-4 text-right text-sm">
              <Link className="text-gray-600 hover:underline" to="/hacker">See Hacker POV →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

