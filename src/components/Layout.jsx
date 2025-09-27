import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  UserCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Approvals', href: '/approvals', icon: UserCheck },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Disputes', href: '/disputes', icon: AlertTriangle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const currentPage = navigation.find(
    (item) => item.href === location.pathname
  );

  return (
    <div className='layout'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='sidebar-overlay'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className='sidebar-header'>
          <div className='logo'>
            <div className='logo-icon'>E</div>
            <span className='logo-text'>dukaster</span>
          </div>
          <button
            className='sidebar-close'
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className='sidebar-nav'>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className='sidebar-footer'>
          {/* <div className='user-info'>
            <div className='user-avatar'>{user?.name?.charAt(0) || 'A'}</div>
            <div className='user-details'>
              <div className='user-name'>{user?.name || 'Admin'}</div>
              <div className='user-role'>Administrator</div>
            </div>
          </div> */}
          <button className='logout-btn' onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='main-content'>
        <header className='header'>
          <div className='header-left'>
            <button className='menu-btn' onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className='page-info'>
              <h1 className='page-title'>{currentPage?.name || 'Dashboard'}</h1>
              <p className='page-subtitle'>Manage your platform efficiently</p>
            </div>
          </div>

          <div className='header-right'>
            {/* <div className='search-container'>
              <Search size={18} />
              <input
                type='text'
                placeholder='Search...'
                className='header-search'
              />
            </div> */}
            <button className='header-btn'>
              <Bell size={18} />
            </button>
            <button className='header-btn'>
              <Settings size={18} />
            </button>
          </div>
        </header>

        <main className='content'>
          <div className='content-wrapper'>{children}</div>
        </main>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 40;
          backdrop-filter: blur(4px);
        }

        .sidebar {
          width: 280px;
          background: rgba(26, 27, 92, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 95vh;
          left: -280px;
          transition: left 0.3s ease;
          z-index: 50;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }

        .sidebar-open {
          left: 0;
        }

        .sidebar-header {
          padding: 32px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .sidebar-close {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
        }

        .sidebar-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          margin: 0 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(4px);
        }

        .nav-item-active {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .nav-item-active:hover {
          background: linear-gradient(135deg, #e55a2b 0%, #e8851a 100%);
          transform: translateX(0);
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: white;
          font-size: 16px;
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #fca5a5;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fee2e2;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-left: 0;
        }

        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .menu-btn:hover {
          background-color: rgba(107, 114, 128, 0.1);
          color: #374151;
        }

        .page-info {
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #6b7280;
          font-weight: 500;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-container svg {
          position: absolute;
          left: 16px;
          color: #9ca3af;
          z-index: 1;
        }

        .header-search {
          padding: 12px 16px 12px 48px;
          border: 2px solid rgba(229, 231, 235, 0.5);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          font-size: 14px;
          width: 300px;
          transition: all 0.3s ease;
        }

        .header-search:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .header-btn {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(229, 231, 235, 0.3);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: #ff6b35;
          color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
        }

        .content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1024px) {
          .sidebar {
            position: static;
            left: 0;
          }

          .sidebar-overlay {
            display: none;
          }

          .main-content {
            margin-left: 0;
          }
        }

        @media (max-width: 1023px) {
          .menu-btn {
            display: block;
          }

          .sidebar-close {
            display: block;
          }

          .content {
            padding: 20px;
          }

          .header {
            padding: 16px 20px;
          }

          .page-title {
            font-size: 24px;
          }

          .header-search {
            width: 200px;
          }
        }

        @media (max-width: 640px) {
          .header-right {
            gap: 8px;
          }

          .search-container {
            display: none;
          }

          .page-title {
            font-size: 20px;
          }

          .page-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};
export default Layout;
