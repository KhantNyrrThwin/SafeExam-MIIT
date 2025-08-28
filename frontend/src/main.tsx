import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/teacher', element: <TeacherDashboard /> },
  { path: '/admin', element: <AdminDashboard /> },
]);

const root = document.getElementById('root')!;
createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

