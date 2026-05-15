import { createBrowserRouter, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';
import Panel from '@/pages/Panel';

import ProtectedRoute from '@/components/ProtectedRoute';
import Educations from '@/pages/Educations';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/panel',
        element: <Panel />,
      },
      {
        path: '/projects',
        element: <div>Página de Projetos em breve</div>,
      },
      {
        path: '/educations',
        element: <Educations />,
      }
    ],
  },
]);