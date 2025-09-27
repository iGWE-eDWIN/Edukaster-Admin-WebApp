import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from './contexts/hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Content from './pages/Content';
import Approvals from './pages/Approvals';
import Payments from './pages/Payments';
import Disputes from './pages/Disputes';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className='loading'>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path='/login'
        element={user ? <Navigate to='/' replace /> : <Login />}
      />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/approvals'
        element={
          <ProtectedRoute>
            <Layout>
              <Approvals />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/content'
        element={
          <ProtectedRoute>
            <Layout>
              <Content />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/payments'
        element={
          <ProtectedRoute>
            <Layout>
              <Payments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/disputes'
        element={
          <ProtectedRoute>
            <Layout>
              <Disputes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/analytics'
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
