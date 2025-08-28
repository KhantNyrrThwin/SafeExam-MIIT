import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './pages/auth/AuthContext';
import HackerPOV from './pages/HackerPOV';
import StudentDashboard from './pages/StudentDashboard';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/teacher', element: <TeacherDashboard /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/hacker', element: <HackerPOV /> },
  { path: '/student', element: <StudentDashboard /> },
]);

const root = document.getElementById('root')!;
createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

