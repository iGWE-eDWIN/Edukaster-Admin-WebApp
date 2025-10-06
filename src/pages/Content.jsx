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
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { apiService } from '../services/api';

const Content = () => {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal viewer state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedFilter]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllQuestions({
        page: 1,
        limit: 100,
        // includeUnapproved: true, // Get all questions including unapproved
      });

      console.log('API Response:', response);

      const transformedContent = response.questions.map((q) => ({
        id: q._id,
        title: q.courseTitle,
        subject: q.courseCode,
        institution: q.institution,
        year: q.year || new Date(q.createdAt).getFullYear(),
        uploader: q.uploadedBy?.name || q.uploadedBy?.email || 'Anonymous',
        fileSize: formatFileSize(
          q.images?.reduce((sum, img) => sum + (img.fileSize || 0), 0) || 0
        ),
        type: 'past-question',
        isApproved: q.isApproved,
        downloads: q.downloads || 0,
        uploadedAt: q.createdAt,
        // Build file URLs - adjust this based on your backend endpoint
        files:
          q.images?.map((img) => ({
            id: img.fileId,
            name: img.fileName,
            size: img.fileSize,
            type: img.mimeType,
            // This URL format depends on your backend - adjust accordingly
            url: img.url,
            // Alternative if you have a different endpoint structure:
            // url: `${apiService.baseURL}/questions/${q._id}/files/${img.fileId}`,
          })) || [],
        details: q.courseDetails,
        tags: q.tags || [],
      }));

      setContent(transformedContent);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filterContent = () => {
    let filtered = content;

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending') {
        filtered = filtered.filter((item) => !item.isApproved);
      } else if (selectedFilter === 'approved') {
        filtered = filtered.filter((item) => item.isApproved);
      } else {
        filtered = filtered.filter((item) => item.type === selectedFilter);
      }
    }

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
      await apiService.approveQuestion(contentId);
      setContent(
        content.map((item) =>
          item.id === contentId ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.error('Failed to approve content:', error);
      alert('Failed to approve content');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await apiService.deleteQuestion(contentId);
        setContent(content.filter((item) => item.id !== contentId));
      } catch (error) {
        console.error('Failed to delete content:', error);
        alert('Failed to delete content');
      }
    }
  };

  // Open preview modal
  const openPreview = (item) => {
    if (item.files && item.files.length > 0) {
      setPreviewFiles(item.files);
      setPreviewIndex(0);
      setPreviewTitle(item.title);
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFiles([]);
    setPreviewIndex(0);
  };

  const nextFile = () => {
    setPreviewIndex((prev) => (prev + 1) % previewFiles.length);
  };

  const prevFile = () => {
    setPreviewIndex(
      (prev) => (prev - 1 + previewFiles.length) % previewFiles.length
    );
  };

  // Check if file is PDF
  const isPDF = (file) => {
    return (
      file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf')
    );
  };

  // Check if file is image
  const isImage = (file) => {
    return (
      file.type?.startsWith('image/') ||
      /\.(jpg|jpeg|png|gif|bmp|webp|heic|heif)$/i.test(file.name)
    );
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
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Loading content...</p>
      </div>
    );
  }

  const pendingCount = content.filter((item) => !item.isApproved).length;
  const approvedCount = content.filter((item) => item.isApproved).length;
  const currentFile = previewFiles[previewIndex];

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
            /* 'past-question',
            'assignment',
            'quiz', */
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
                <button
                  className='action-btn preview-btn'
                  title='Preview'
                  onClick={() => openPreview(item)}
                  disabled={!item.files || item.files.length === 0}
                >
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

            {/* File Thumbnails */}
            {item.files && item.files.length > 0 && (
              <div className='content-images'>
                {item.files.slice(0, 4).map((file, idx) => (
                  <div
                    key={idx}
                    className='content-image-preview'
                    onClick={() => openPreview(item)}
                  >
                    {isPDF(file) ? (
                      <div className='pdf-thumbnail'>
                        <FileText size={32} />
                        <span>PDF</span>
                      </div>
                    ) : (
                      <img
                        src={file.url}
                        alt={file.name}
                        crossOrigin='anonymous' // ✅ Add this for CORS
                        onError={(e) => {
                          console.error('Failed to load image:', file.url); // ✅ Debug log
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">No Preview</text></svg>';
                        }}
                      />
                    )}
                  </div>
                ))}
                {item.files.length > 4 && (
                  <div
                    className='more-images'
                    onClick={() => openPreview(item)}
                  >
                    +{item.files.length - 4} more
                  </div>
                )}
              </div>
            )}

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

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className='preview-modal' onClick={closePreview}>
          <div className='preview-content' onClick={(e) => e.stopPropagation()}>
            <div className='preview-header'>
              <div className='preview-info'>
                <h3>{previewTitle}</h3>
                <p>
                  {currentFile?.name} ({formatFileSize(currentFile?.size)}) -
                  File {previewIndex + 1} of {previewFiles.length}
                </p>
              </div>
              <button className='close-btn' onClick={closePreview}>
                <X size={24} />
              </button>
            </div>

            <div className='preview-body'>
              {currentFile && isPDF(currentFile) ? (
                <iframe
                  src={currentFile.url}
                  className='pdf-viewer'
                  title={currentFile.name}
                />
              ) : currentFile && isImage(currentFile) ? (
                <img
                  src={currentFile.url}
                  alt={currentFile.name}
                  className='image-viewer'
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = `<div class="error-message"><FileText size={48} /><p>Unable to load image</p><small>${currentFile.name}</small></div>`;
                  }}
                />
              ) : (
                <div className='error-message'>
                  <FileText size={48} />
                  <p>Preview not available</p>
                  <a
                    href={currentFile?.url}
                    download
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn btn-primary'
                  >
                    <Download size={16} />
                    Download File
                  </a>
                </div>
              )}
            </div>

            {previewFiles.length > 1 && (
              <div className='preview-controls'>
                <button className='nav-btn' onClick={prevFile}>
                  <ChevronLeft size={24} />
                </button>
                <div className='preview-dots'>
                  {previewFiles.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === previewIndex ? 'active' : ''}`}
                      onClick={() => setPreviewIndex(idx)}
                    />
                  ))}
                </div>
                <button className='nav-btn' onClick={nextFile}>
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .content-page {
          animation: fadeInUp 0.6s ease-out;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 107, 53, 0.2);
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .content-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .content-image-preview {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          border: 2px solid rgba(229, 231, 235, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          background: #f9fafb;
        }

        .content-image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content-image-preview:hover {
          transform: scale(1.05);
          border-color: #ff6b35;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
        }

        .pdf-thumbnail {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #ef4444;
          font-size: 10px;
          font-weight: 600;
        }

        .more-images {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          background: rgba(107, 114, 128, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border: 2px solid rgba(229, 231, 235, 0.5);
          transition: all 0.2s;
        }

        .more-images:hover {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          border-color: #ff6b35;
        }

        /* Preview Modal */
        .preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .preview-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .preview-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-info h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .preview-info p {
          font-size: 14px;
          color: #6b7280;
        }

        .close-btn {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .preview-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f9fafb;
          padding: 20px;
        }

        .image-viewer {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .pdf-viewer {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
        }

        .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: #6b7280;
          text-align: center;
        }

        .error-message p {
          font-size: 16px;
          font-weight: 600;
        }

        .error-message small {
          font-size: 12px;
          color: #9ca3af;
        }

        .preview-controls {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav-btn {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
        }

        .preview-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dot.active {
          background: #ff6b35;
          width: 24px;
          border-radius: 4px;
        }

        .dot:hover {
          background: #ff6b35;
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

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .preview-btn:hover:not(:disabled) {
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

          .preview-content {
            max-height: 95vh;
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

          .preview-modal {
            padding: 0;
          }

          .preview-content {
            border-radius: 0;
            max-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Content;
