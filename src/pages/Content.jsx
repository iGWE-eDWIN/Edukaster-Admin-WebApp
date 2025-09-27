import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Calendar,
  User,
} from 'lucide-react';
// import { apiService } from '../services/api';

const Content = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedFilter]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockContent = [
        {
          id: 1,
          title: 'Mathematics Past Questions 2023',
          uploader: 'Dr. Sarah Johnson',
          type: 'past-question',
          subject: 'Mathematics',
          institution: 'University of Lagos',
          year: 2023,
          downloads: 245,
          uploadedAt: '2024-12-15',
          fileSize: '2.5 MB',
          isApproved: true,
        },
        {
          id: 2,
          title: 'Physics Laboratory Manual',
          uploader: 'Prof. Michael Chen',
          type: 'assignment',
          subject: 'Physics',
          institution: 'Covenant University',
          year: 2023,
          downloads: 120,
          uploadedAt: '2024-12-10',
          fileSize: '5.2 MB',
          isApproved: true,
        },
        {
          id: 3,
          title: 'Chemistry Quiz Solutions',
          uploader: 'Dr. Aisha Okafor',
          type: 'quiz',
          subject: 'Chemistry',
          institution: 'UNILAG',
          year: 2023,
          downloads: 89,
          uploadedAt: '2024-12-08',
          fileSize: '1.8 MB',
          isApproved: false,
        },
      ];
      setContent(mockContent);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Filter by type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending') {
        filtered = filtered.filter((item) => !item.isApproved);
      } else if (selectedFilter === 'approved') {
        filtered = filtered.filter((item) => item.isApproved);
      } else {
        filtered = filtered.filter((item) => item.type === selectedFilter);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.uploader.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  };

  const handleApproveContent = async (contentId) => {
    try {
      //   await apiService.approveQuestion(contentId);
      setContent(
        content.map((item) =>
          item.id === contentId ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        // await apiService.deleteQuestion(contentId);
        setContent(content.filter((item) => item.id !== contentId));
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'past-question':
        return '#2563eb';
      case 'assignment':
        return '#d97706';
      case 'quiz':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return <div className='loading'>Loading content...</div>;
  }

  const pendingCount = content.filter((item) => !item.isApproved).length;
  const approvedCount = content.filter((item) => item.isApproved).length;

  return (
    <div className='content-page'>
      {/* Header Section */}
      <div className='page-header glass-card fade-in-up'>
        <div className='header-content'>
          <div className='header-info'>
            <h2>Content Management</h2>
            <p>Review and moderate uploaded questions and study materials</p>
          </div>
          <div className='header-stats'>
            <div className='header-stat'>
              <span className='stat-number'>{pendingCount}</span>
              <span className='stat-label'>Pending</span>
            </div>
            <div className='header-stat'>
              <span className='stat-number'>{approvedCount}</span>
              <span className='stat-label'>Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='filters-section glass-card slide-in-right'>
        <div className='search-box'>
          <Search size={20} />
          <input
            type='text'
            placeholder='Search content by title, subject, or uploader...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='input'
          />
        </div>
        <div className='filter-tabs'>
          {[
            'all',
            'pending',
            'approved',
            'past-question',
            'assignment',
            'quiz',
          ].map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${
                selectedFilter === filter ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === 'all'
                ? 'All Content'
                : filter === 'past-question'
                ? 'Past Questions'
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className='results-info'>
        <p>{filteredContent.length} items found</p>
      </div>

      {/* Content Grid */}
      <div className='content-grid'>
        {filteredContent.map((item, index) => (
          <div
            key={item.id}
            className='content-card glass-card fade-in-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='content-header'>
              <div className='content-info'>
                <h3 className='content-title'>{item.title}</h3>
                <div className='content-uploader'>
                  <User size={14} />
                  <span>by {item.uploader}</span>
                </div>
              </div>
              <div className='content-actions'>
                <button className='action-btn preview-btn' title='Preview'>
                  <Eye size={16} />
                </button>
                <button
                  className='action-btn delete-btn'
                  title='Delete'
                  onClick={() => handleDeleteContent(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className='content-meta'>
              <div className='meta-grid'>
                <div className='meta-item'>
                  <span className='meta-label'>Subject</span>
                  <span className='meta-value'>{item.subject}</span>
                </div>
                <div className='meta-item'>
                  <span className='meta-label'>Institution</span>
                  <span className='meta-value'>{item.institution}</span>
                </div>
                <div className='meta-item'>
                  <span className='meta-label'>Year</span>
                  <span className='meta-value'>{item.year}</span>
                </div>
                <div className='meta-item'>
                  <span className='meta-label'>File Size</span>
                  <span className='meta-value'>{item.fileSize}</span>
                </div>
              </div>
            </div>

            <div className='content-footer'>
              <div className='content-tags'>
                <span
                  className='type-tag'
                  style={{
                    backgroundColor: getTypeColor(item.type) + '20',
                    color: getTypeColor(item.type),
                  }}
                >
                  {item.type.replace('-', ' ')}
                </span>
                <span
                  className={`approval-tag ${
                    item.isApproved ? 'approved' : 'pending'
                  }`}
                >
                  {item.isApproved ? 'Approved' : 'Pending Review'}
                </span>
              </div>

              <div className='download-stats'>
                <Download size={16} />
                <span>{item.downloads} downloads</span>
              </div>
            </div>

            <div className='content-date'>
              <Calendar size={14} />
              <span>Uploaded {formatDate(item.uploadedAt)}</span>
            </div>

            {!item.isApproved && (
              <div className='approval-actions'>
                <button
                  className='btn btn-danger'
                  onClick={() => handleDeleteContent(item.id)}
                >
                  <X size={16} />
                  Reject
                </button>
                <button
                  className='btn btn-success'
                  onClick={() => handleApproveContent(item.id)}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className='empty-state glass-card'>
          <div className='empty-icon'>
            <FileText size={48} color='#9CA3AF' />
          </div>
          <h3>No content found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      )}

      <style jsx>{`
        .content-page {
          animation: fadeInUp 0.6s ease-out;
        }

        .page-header {
          padding: 32px;
          margin-bottom: 24px;
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

        .header-stats {
          display: flex;
          gap: 32px;
        }

        .header-stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #ff6b35;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .filters-section {
          padding: 24px 32px;
          margin-bottom: 24px;
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          min-width: 300px;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          color: #9ca3af;
          z-index: 1;
        }

        .search-box input {
          padding-left: 48px;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 12px 20px;
          border: 2px solid rgba(229, 231, 235, 0.5);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          color: #6b7280;
          white-space: nowrap;
        }

        .filter-tab:hover {
          border-color: #ff6b35;
          color: #ff6b35;
          transform: translateY(-2px);
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          border-color: #ff6b35;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .results-info {
          margin-bottom: 24px;
          padding: 0 8px;
        }

        .results-info p {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .content-card {
          padding: 28px;
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .content-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .content-info {
          flex: 1;
        }

        .content-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .content-uploader {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .content-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .preview-btn:hover {
          background: rgba(45, 93, 204, 0.1);
          color: #2d5dcc;
          transform: scale(1.1);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          transform: scale(1.1);
        }

        .content-meta {
          margin-bottom: 20px;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .content-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .content-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .type-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .approval-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .approval-tag.approved {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .approval-tag.pending {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .download-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .content-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .approval-actions {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(229, 231, 235, 0.3);
        }

        .approval-actions .btn {
          flex: 1;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 64px 32px;
          margin-top: 32px;
        }

        .empty-icon {
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #6b7280;
          font-size: 16px;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .filters-section {
            flex-direction: column;
            gap: 16px;
          }

          .search-box {
            min-width: auto;
          }

          .meta-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .approval-actions {
            flex-direction: column;
          }

          .page-header,
          .filters-section,
          .content-card {
            padding: 20px;
          }

          .filter-tabs {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
export default Content;
