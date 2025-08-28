import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-6">SafeExam@MIIT</h1>
        <p className="mb-8">Web-Based Exam Paper Security with RSA</p>
        <div className="space-x-4">
          <Link className="px-4 py-2 bg-blue-600 text-white rounded" to="/login">Login</Link>
          <Link className="px-4 py-2 bg-green-600 text-white rounded" to="/teacher">Teacher Dashboard</Link>
          <Link className="px-4 py-2 bg-purple-600 text-white rounded" to="/admin">Admin Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

