import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
// import { apiService } from '../services/api';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: { value: 2450, change: '+12%', trend: 'up' },
    activeUsers: { value: 1850, change: '+8%', trend: 'up' },
    totalRevenue: { value: 850000, change: '+23%', trend: 'up' },
    totalSessions: { value: 340, change: '+15%', trend: 'up' },
    questionsUploaded: { value: 1200, change: '+18%', trend: 'up' },
    averageRating: { value: 4.8, change: '+0.2', trend: 'up' },
  });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      // Mock chart data - replace with actual API call
      const mockChartData = [
        { name: 'Jan', users: 400, revenue: 240000, sessions: 24 },
        { name: 'Feb', users: 300, revenue: 139000, sessions: 13 },
        { name: 'Mar', users: 200, revenue: 98000, sessions: 98 },
        { name: 'Apr', users: 278, revenue: 390000, sessions: 39 },
        { name: 'May', users: 189, revenue: 480000, sessions: 48 },
        { name: 'Jun', users: 239, revenue: 380000, sessions: 38 },
        { name: 'Jul', users: 349, revenue: 430000, sessions: 43 },
      ];
      setChartData(mockChartData);
      //   setAnalyticsData(mockChartData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getChangeColor = (change) => {
    return change.startsWith('+') ? '#10b981' : '#ef4444';
  };

  if (isLoading) {
    return <div className='loading'>Loading analytics...</div>;
  }

  return (
    <div className='analytics-page'>
      {/* Header Section */}
      <div className='page-header glass-card fade-in-up'>
        <div className='header-content'>
          <div className='header-info'>
            <h2>Analytics & Reports</h2>
            <p>Comprehensive platform insights and performance metrics</p>
          </div>
          <div className='period-selector'>
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                className={`period-btn ${
                  selectedPeriod === period ? 'active' : ''
                }`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className='analytics-grid'>
        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.1s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon users'>
              <Users size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{ color: getChangeColor(analyticsData.totalUsers.change) }}
            >
              {analyticsData.totalUsers.change}
            </span>
          </div>
          <div className='analytics-value'>
            {analyticsData.totalUsers.value.toLocaleString()}
          </div>
          <div className='analytics-label'>Total Users</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>Growing steadily</span>
          </div>
        </div>

        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.2s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon active'>
              <Activity size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{
                color: getChangeColor(analyticsData.activeUsers.change),
              }}
            >
              {analyticsData.activeUsers.change}
            </span>
          </div>
          <div className='analytics-value'>
            {analyticsData.activeUsers.value.toLocaleString()}
          </div>
          <div className='analytics-label'>Active Users</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>High engagement</span>
          </div>
        </div>

        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.3s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon revenue'>
              <DollarSign size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{
                color: getChangeColor(analyticsData.totalRevenue.change),
              }}
            >
              {analyticsData.totalRevenue.change}
            </span>
          </div>
          <div className='analytics-value'>
            {formatCurrency(analyticsData.totalRevenue.value)}
          </div>
          <div className='analytics-label'>Total Revenue</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>Strong growth</span>
          </div>
        </div>

        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.4s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon sessions'>
              <Calendar size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{
                color: getChangeColor(analyticsData.totalSessions.change),
              }}
            >
              {analyticsData.totalSessions.change}
            </span>
          </div>
          <div className='analytics-value'>
            {analyticsData.totalSessions.value}
          </div>
          <div className='analytics-label'>Sessions Completed</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>Increasing demand</span>
          </div>
        </div>

        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.5s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon content'>
              <FileText size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{
                color: getChangeColor(analyticsData.questionsUploaded.change),
              }}
            >
              {analyticsData.questionsUploaded.change}
            </span>
          </div>
          <div className='analytics-value'>
            {analyticsData.questionsUploaded.value}
          </div>
          <div className='analytics-label'>Questions Uploaded</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>Content rich</span>
          </div>
        </div>

        <div
          className='analytics-card glass-card fade-in-up'
          style={{ animationDelay: '0.6s' }}
        >
          <div className='analytics-header'>
            <div className='analytics-icon rating'>
              <BarChart3 size={24} color='white' />
            </div>
            <span
              className='change-indicator'
              style={{
                color: getChangeColor(analyticsData.averageRating.change),
              }}
            >
              {analyticsData.averageRating.change}
            </span>
          </div>
          <div className='analytics-value'>
            {analyticsData.averageRating.value}
          </div>
          <div className='analytics-label'>Average Rating</div>
          <div className='analytics-trend'>
            <TrendingUp size={14} />
            <span>Excellent quality</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='charts-section'>
        <div className='chart-card glass-card slide-in-right'>
          <div className='chart-header'>
            <div className='chart-title'>
              <BarChart3 size={20} />
              <h3>User Growth Trend</h3>
            </div>
            <div className='chart-controls'>
              <button className='chart-btn active'>Users</button>
              <button className='chart-btn'>Revenue</button>
            </div>
          </div>
          <div className='chart-container'>
            <div className='chart-bars'>
              {chartData.map((data, index) => (
                <div key={index} className='chart-bar-group'>
                  <div
                    className='chart-bar'
                    style={{
                      height: `${(data.users / 400) * 100}%`,
                      background:
                        'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    }}
                  />
                  <span className='chart-label'>{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className='chart-card glass-card slide-in-right'
          style={{ animationDelay: '0.2s' }}
        >
          <div className='chart-header'>
            <div className='chart-title'>
              <PieChart size={20} />
              <h3>Revenue Distribution</h3>
            </div>
          </div>
          <div className='chart-container'>
            <div className='pie-chart-placeholder'>
              <div
                className='pie-segment'
                style={{
                  background:
                    'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                }}
              >
                <span>65%</span>
                <label>Tutoring Sessions</label>
              </div>
              <div
                className='pie-segment'
                style={{
                  background:
                    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                }}
              >
                <span>25%</span>
                <label>Content Sales</label>
              </div>
              <div
                className='pie-segment'
                style={{
                  background:
                    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                }}
              >
                <span>10%</span>
                <label>Premium Features</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='summary-section'>
        <div
          className='summary-card glass-card slide-in-right'
          style={{ animationDelay: '0.4s' }}
        >
          <div className='summary-header'>
            <h3>Top Performing Subjects</h3>
            <TrendingUp size={18} color='#10B981' />
          </div>
          <div className='summary-list'>
            <div className='summary-item'>
              <div className='subject-info'>
                <span className='subject-name'>Mathematics</span>
                <span className='subject-stats'>
                  245 questions • 89 sessions
                </span>
              </div>
              <div className='subject-revenue'>{formatCurrency(125000)}</div>
            </div>
            <div className='summary-item'>
              <div className='subject-info'>
                <span className='subject-name'>Physics</span>
                <span className='subject-stats'>
                  189 questions • 67 sessions
                </span>
              </div>
              <div className='subject-revenue'>{formatCurrency(98000)}</div>
            </div>
            <div className='summary-item'>
              <div className='subject-info'>
                <span className='subject-name'>Chemistry</span>
                <span className='subject-stats'>
                  156 questions • 54 sessions
                </span>
              </div>
              <div className='subject-revenue'>{formatCurrency(76000)}</div>
            </div>
          </div>
        </div>

        <div
          className='summary-card glass-card slide-in-right'
          style={{ animationDelay: '0.5s' }}
        >
          <div className='summary-header'>
            <h3>Platform Health</h3>
            <Activity size={18} color='#10B981' />
          </div>
          <div className='health-metrics'>
            <div className='health-item'>
              <div className='health-info'>
                <span className='health-label'>System Uptime</span>
                <span className='health-description'>Last 30 days</span>
              </div>
              <span className='health-value good'>99.9%</span>
            </div>
            <div className='health-item'>
              <div className='health-info'>
                <span className='health-label'>Response Time</span>
                <span className='health-description'>Average API response</span>
              </div>
              <span className='health-value good'>245ms</span>
            </div>
            <div className='health-item'>
              <div className='health-info'>
                <span className='health-label'>Error Rate</span>
                <span className='health-description'>System errors</span>
              </div>
              <span className='health-value good'>0.1%</span>
            </div>
            <div className='health-item'>
              <div className='health-info'>
                <span className='health-label'>User Satisfaction</span>
                <span className='health-description'>Based on ratings</span>
              </div>
              <span className='health-value excellent'>94.5%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          animation: fadeInUp 0.6s ease-out;
        }

        .page-header {
          padding: 32px;
          margin-bottom: 32px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .header-info p {
          color: #6b7280;
          font-size: 16px;
          font-weight: 500;
        }

        .period-selector {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .period-btn {
          padding: 12px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .period-btn:hover {
          color: #ff6b35;
        }

        .period-btn.active {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .analytics-card {
          padding: 32px;
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.3);
          position: relative;
          overflow: hidden;
        }

        .analytics-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
        }

        .analytics-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .analytics-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .analytics-icon.users {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }

        .analytics-icon.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .analytics-icon.revenue {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .analytics-icon.sessions {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .analytics-icon.content {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .analytics-icon.rating {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        }

        .change-indicator {
          font-size: 14px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
        }

        .analytics-value {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .analytics-label {
          font-size: 16px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .analytics-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 14px;
          font-weight: 500;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          padding: 32px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .chart-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chart-title h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .chart-controls {
          display: flex;
          gap: 8px;
        }

        .chart-btn {
          padding: 8px 16px;
          border: 2px solid rgba(229, 231, 235, 0.5);
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
          font-size: 12px;
        }

        .chart-btn:hover {
          border-color: #ff6b35;
          color: #ff6b35;
        }

        .chart-btn.active {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          border-color: #ff6b35;
        }

        .chart-container {
          height: 300px;
          display: flex;
          align-items: end;
          justify-content: center;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          gap: 16px;
          height: 100%;
          width: 100%;
          justify-content: space-around;
          padding: 20px 0;
        }

        .chart-bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .chart-bar {
          width: 32px;
          min-height: 20px;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .chart-bar:hover {
          transform: scaleY(1.1);
        }

        .chart-label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 12px;
          font-weight: 600;
        }

        .pie-chart-placeholder {
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: center;
          height: 100%;
        }

        .pie-segment {
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          color: white;
          font-weight: 600;
        }

        .pie-segment span {
          display: block;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .pie-segment label {
          font-size: 14px;
          opacity: 0.9;
        }

        .summary-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .summary-card {
          padding: 32px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .summary-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
          transition: all 0.3s ease;
        }

        .summary-item:hover {
          background: rgba(248, 250, 252, 0.8);
          transform: translateX(4px);
        }

        .subject-info {
        }

        .subject-name {
          display: block;
          font-weight: 600;
          color: #1a1a1a;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .subject-stats {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .subject-revenue {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
        }

        .health-metrics {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .health-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .health-info {
        }

        .health-label {
          display: block;
          color: #1a1a1a;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .health-description {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .health-value {
          font-weight: 700;
          font-size: 18px;
        }

        .health-value.good {
          color: #10b981;
        }

        .health-value.excellent {
          color: #ff6b35;
        }

        @media (max-width: 1024px) {
          .charts-section,
          .summary-section {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .page-header,
          .chart-card,
          .summary-card {
            padding: 20px;
          }

          .analytics-card {
            padding: 24px;
          }

          .analytics-value {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};
export default Analytics;
