import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'teacher' ? '/teacher' : '/admin', { replace: true });
    }
  }, [user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setMessage(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate( '/');
    } catch (err) {
      setMessage('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="text-sm text-gray-600">Sign in to continue</p>
        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={`w-full bg-blue-600 text-white py-2 rounded-md ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`} type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        {message && <p className="text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}

