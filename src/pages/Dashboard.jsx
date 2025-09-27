import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
// import { apiService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalRevenue: 0,
    totalSessions: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Load dashboard statistics
      // This would be replaced with actual API calls
      setStats({
        totalUsers: 2450,
        totalQuestions: 1200,
        totalRevenue: 850000,
        totalSessions: 340,
      });

      setPendingActions([
        { type: 'tutor-approval', count: 5, label: 'Tutors pending approval' },
        { type: 'content-review', count: 12, label: 'Content awaiting review' },
        { type: 'payment-release', count: 8, label: 'Payments to release' },
        { type: 'disputes', count: 2, label: 'Disputes to resolve' },
      ]);

      setRecentActivity([
        {
          type: 'user_registered',
          message: 'New student registered: John Doe',
          time: '2 minutes ago',
        },
        {
          type: 'question_uploaded',
          message: 'Question uploaded by Dr. Sarah',
          time: '15 minutes ago',
        },
        {
          type: 'payment_received',
          message: 'Payment received: ₦5,000',
          time: '1 hour ago',
        },
        {
          type: 'dispute_resolved',
          message: 'Dispute resolved between Mike and Prof. Chen',
          time: '2 hours ago',
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return <div className='loading'>Loading dashboard...</div>;
  }

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#dbeafe' }}>
            <Users size={24} color='white' />
          </div>
          <div className='stat-content'>
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <span className='stat-change positive'>+12% from last month</span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#fef3c7' }}>
            <FileText size={24} color='white' />
          </div>
          <div className='stat-content'>
            <h3>{stats.totalQuestions.toLocaleString()}</h3>
            <p>Questions Uploaded</p>
            <span className='stat-change positive'>+8% from last month</span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#d1fae5' }}>
            <DollarSign size={24} color='white' />
          </div>
          <div className='stat-content'>
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
            <span className='stat-change positive'>+23% from last month</span>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-icon' style={{ backgroundColor: '#e0e7ff' }}>
            <TrendingUp size={24} color='white' />
          </div>
          <div className='stat-content'>
            <h3>{stats.totalSessions}</h3>
            <p>Sessions Completed</p>
            <span className='stat-change positive'>+15% from last month</span>
          </div>
        </div>
      </div>

      <div className='dashboard-grid'>
        {/* Pending Actions */}
        <div className='card'>
          <h2>Pending Actions</h2>
          <div className='pending-actions'>
            {pendingActions.map((action, index) => (
              <div key={index} className='pending-item'>
                <div className='pending-info'>
                  <div className='pending-icon'>
                    {action.type === 'tutor-approval' && (
                      <Users size={16} color='#d97706' />
                    )}
                    {action.type === 'content-review' && (
                      <FileText size={16} color='#d97706' />
                    )}
                    {action.type === 'payment-release' && (
                      <DollarSign size={16} color='#d97706' />
                    )}
                    {action.type === 'disputes' && (
                      <Clock size={16} color='#d97706' />
                    )}
                  </div>
                  <div>
                    <p className='pending-label'>{action.label}</p>
                    <span className='pending-count'>{action.count} items</span>
                  </div>
                </div>
                <div className='pending-badge'>{action.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className='card'>
          <h2>Recent Activity</h2>
          <div className='activity-list'>
            {recentActivity.map((activity, index) => (
              <div key={index} className='activity-item'>
                <div className='activity-icon'>
                  <CheckCircle size={16} color='#059669' />
                </div>
                <div className='activity-content'>
                  <p className='activity-message'>{activity.message}</p>
                  <span className='activity-time'>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: #6b7280;
          font-size: 16px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
        }

        .stat-change.positive {
          color: #059669;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 32px;
        }

        .pending-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pending-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 8px;
        }

        .pending-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pending-icon {
          width: 32px;
          height: 32px;
          background-color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .pending-label {
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .pending-count {
          font-size: 14px;
          color: #6b7280;
        }

        .pending-badge {
          background-color: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          min-width: 24px;
          text-align: center;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 8px;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background-color: #d1fae5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 14px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
export default Dashboard;
