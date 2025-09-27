import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Filter,
  User,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { apiService } from '../services/api';

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [resolution, setResolution] = useState('');
  const [resolutionType, setResolutionType] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockDisputes = [
        {
          id: 1,
          type: 'payment',
          student: { name: 'John Doe', email: 'john@example.com' },
          tutor: { name: 'Dr. Sarah Johnson', email: 'sarah@example.com' },
          subject: 'Mathematics',
          amount: 5000,
          status: 'open',
          priority: 'high',
          title: 'Payment Issue',
          description: 'Student claims session was not completed properly',
          createdAt: '2025-01-15T10:00:00Z',
          adminNotes: [],
        },
        {
          id: 2,
          type: 'content',
          student: { name: 'Jane Smith', email: 'jane@example.com' },
          tutor: { name: 'Prof. Michael Chen', email: 'michael@example.com' },
          subject: 'Physics',
          status: 'investigating',
          priority: 'medium',
          title: 'Inappropriate Content',
          description: 'Inappropriate content reported in uploaded material',
          createdAt: '2025-01-14T15:30:00Z',
          assignedAdminId: 'admin1',
          adminNotes: [
            {
              note: 'Reviewing the uploaded content for violations',
              adminId: 'admin1',
              createdAt: '2025-01-14T16:00:00Z',
            },
          ],
        },
      ];
      setDisputes(mockDisputes);
    } catch (error) {
      console.error('Failed to load disputes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignDispute = async (disputeId) => {
    try {
      await apiService.assignDispute(disputeId);
      loadDisputes();
    } catch (error) {
      console.error('Failed to assign dispute:', error);
    }
  };

  const handleAddNote = async (disputeId) => {
    if (!newNote.trim()) return;

    try {
      await apiService.addDisputeNote(disputeId, newNote);
      setNewNote('');
      loadDisputes();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleResolveDispute = async (disputeId) => {
    if (!resolution.trim() || !resolutionType) return;

    try {
      await apiService.resolveDispute(disputeId, resolution, resolutionType);
      setResolution('');
      setResolutionType('');
      setSelectedDispute(null);
      loadDisputes();
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#ef4444';
      case 'investigating':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return <div className='loading'>Loading disputes...</div>;
  }

  const openDisputes = disputes.filter((d) => d.status === 'open').length;
  const resolvedDisputes = disputes.filter(
    (d) => d.status === 'resolved'
  ).length;

  return (
    <div className='disputes-page'>
      {/* Header Section */}
      <div className='page-header glass-card fade-in-up'>
        <div className='header-content'>
          <div className='header-info'>
            <h2>Dispute Management</h2>
            <p>Investigate and resolve disputes between students and tutors</p>
          </div>
          <div className='header-stats'>
            <div className='header-stat'>
              <span className='stat-number urgent'>{openDisputes}</span>
              <span className='stat-label'>Open</span>
            </div>
            <div className='header-stat'>
              <span className='stat-number resolved'>{resolvedDisputes}</span>
              <span className='stat-label'>Resolved</span>
            </div>
          </div>
        </div>
      </div>

      <div className='disputes-layout'>
        {/* Disputes List */}
        <div className='disputes-list glass-card slide-in-right'>
          <div className='list-header'>
            <h3>All Disputes</h3>
            <span className='dispute-count'>{disputes.length} total</span>
          </div>

          <div className='disputes-scroll'>
            {disputes.map((dispute, index) => (
              <div
                key={dispute.id}
                className={`dispute-card ${
                  selectedDispute?.id === dispute.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedDispute(dispute)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='dispute-header'>
                  <div className='dispute-info'>
                    <AlertTriangle
                      size={16}
                      color={getStatusColor(dispute.status)}
                    />
                    <span className='dispute-type'>
                      {dispute.type.toUpperCase()}
                    </span>
                  </div>
                  <div className='dispute-badges'>
                    <span
                      className='priority-badge'
                      style={{
                        backgroundColor:
                          getPriorityColor(dispute.priority) + '20',
                        color: getPriorityColor(dispute.priority),
                      }}
                    >
                      {dispute.priority}
                    </span>
                    <span
                      className='status-badge'
                      style={{
                        backgroundColor: getStatusColor(dispute.status) + '20',
                        color: getStatusColor(dispute.status),
                      }}
                    >
                      {dispute.status}
                    </span>
                  </div>
                </div>

                <h4 className='dispute-title'>{dispute.title}</h4>
                <p className='dispute-description'>{dispute.description}</p>

                <div className='dispute-parties'>
                  <div className='party'>
                    <User size={12} />
                    <span>Student: {dispute.student.name}</span>
                  </div>
                  <div className='party'>
                    <User size={12} />
                    <span>Tutor: {dispute.tutor.name}</span>
                  </div>
                  {dispute.subject && (
                    <div className='party'>
                      <span>Subject: {dispute.subject}</span>
                    </div>
                  )}
                  {dispute.amount && (
                    <div className='party'>
                      <DollarSign size={12} />
                      <span>{formatCurrency(dispute.amount)}</span>
                    </div>
                  )}
                </div>

                <div className='dispute-footer'>
                  <span className='dispute-date'>
                    {formatDate(dispute.createdAt)}
                  </span>
                  {dispute.status === 'open' && (
                    <button
                      className='btn btn-primary btn-sm'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignDispute(dispute.id);
                      }}
                    >
                      Assign to Me
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Details */}
        {selectedDispute && (
          <div
            className='dispute-details glass-card slide-in-right'
            style={{ animationDelay: '0.3s' }}
          >
            <div className='details-header'>
              <div className='details-title'>
                <h2>{selectedDispute.title}</h2>
                <span
                  className='status-badge large'
                  style={{
                    backgroundColor:
                      getStatusColor(selectedDispute.status) + '20',
                    color: getStatusColor(selectedDispute.status),
                  }}
                >
                  {selectedDispute.status}
                </span>
              </div>
              <div className='dispute-meta'>
                <div className='meta-item'>
                  <Calendar size={14} />
                  <span>Created {formatDate(selectedDispute.createdAt)}</span>
                </div>
                {selectedDispute.resolvedAt && (
                  <div className='meta-item'>
                    <CheckCircle size={14} />
                    <span>
                      Resolved {formatDate(selectedDispute.resolvedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='details-content'>
              <div className='section'>
                <h3>Description</h3>
                <div className='description-box'>
                  <p>{selectedDispute.description}</p>
                </div>
              </div>

              <div className='section'>
                <h3>Parties Involved</h3>
                <div className='parties-grid'>
                  <div className='party-card'>
                    <div className='party-header'>
                      <User size={16} />
                      <h4>Student</h4>
                    </div>
                    <p className='party-name'>{selectedDispute.student.name}</p>
                    <p className='party-email'>
                      {selectedDispute.student.email}
                    </p>
                  </div>
                  <div className='party-card'>
                    <div className='party-header'>
                      <User size={16} />
                      <h4>Tutor</h4>
                    </div>
                    <p className='party-name'>{selectedDispute.tutor.name}</p>
                    <p className='party-email'>{selectedDispute.tutor.email}</p>
                  </div>
                </div>
              </div>

              {selectedDispute.adminNotes &&
                selectedDispute.adminNotes.length > 0 && (
                  <div className='section'>
                    <h3>Investigation Notes</h3>
                    <div className='notes-list'>
                      {selectedDispute.adminNotes.map((note, index) => (
                        <div key={index} className='note'>
                          <div className='note-header'>
                            <MessageSquare size={14} />
                            <span className='note-date'>
                              {formatDate(note.createdAt)}
                            </span>
                          </div>
                          <p className='note-content'>{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedDispute.status === 'resolved' && (
                <div className='section'>
                  <h3>Resolution</h3>
                  <div className='resolution-box'>
                    <div className='resolution-type'>
                      <span className='resolution-label'>Resolution Type:</span>
                      <span className='resolution-value'>
                        {selectedDispute.resolutionType?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className='resolution-text'>
                      {selectedDispute.resolution}
                    </p>
                  </div>
                </div>
              )}

              {selectedDispute.status !== 'resolved' && (
                <>
                  <div className='section'>
                    <h3>Add Investigation Note</h3>
                    <div className='note-form'>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder='Add your investigation notes here...'
                        className='input note-textarea'
                        rows={3}
                      />
                      <button
                        className='btn btn-secondary'
                        onClick={() => handleAddNote(selectedDispute.id)}
                        disabled={!newNote.trim()}
                      >
                        <MessageSquare size={16} />
                        Add Note
                      </button>
                    </div>
                  </div>

                  <div className='section'>
                    <h3>Resolve Dispute</h3>
                    <div className='resolution-form'>
                      <select
                        value={resolutionType}
                        onChange={(e) => setResolutionType(e.target.value)}
                        className='input'
                      >
                        <option value=''>Select resolution type</option>
                        <option value='refund'>Issue Refund</option>
                        <option value='warning'>Send Warning</option>
                        <option value='suspension'>Account Suspension</option>
                        <option value='content_removal'>Remove Content</option>
                        <option value='no_action'>No Action Required</option>
                      </select>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder='Explain your resolution decision and any actions taken...'
                        className='input resolution-textarea'
                        rows={4}
                      />
                      <button
                        className='btn btn-success resolution-btn'
                        onClick={() => handleResolveDispute(selectedDispute.id)}
                        disabled={!resolution.trim() || !resolutionType}
                      >
                        <CheckCircle size={18} />
                        Resolve Dispute
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {disputes.length === 0 && (
        <div className='empty-state glass-card'>
          <div className='empty-icon'>
            <AlertTriangle size={48} color='#9CA3AF' />
          </div>
          <h3>No disputes found</h3>
          <p>Great! No active disputes to resolve</p>
        </div>
      )}

      <style jsx>{`
        .disputes-page {
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
          margin-bottom: 4px;
        }

        .stat-number.urgent {
          color: #ef4444;
        }

        .stat-number.resolved {
          color: #10b981;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .disputes-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 24px;
          height: calc(100vh - 300px);
        }

        .disputes-list {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .list-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .dispute-count {
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .disputes-scroll {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .dispute-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          animation: fadeInUp 0.6s ease-out;
        }

        .dispute-card:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }

        .dispute-card.selected {
          border-color: #ff6b35;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
        }

        .dispute-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .dispute-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dispute-type {
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 1px;
          background: rgba(107, 114, 128, 0.1);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .dispute-badges {
          display: flex;
          gap: 8px;
        }

        .priority-badge,
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .status-badge.large {
          padding: 8px 16px;
          font-size: 13px;
        }

        .dispute-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .dispute-description {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dispute-parties {
          margin-bottom: 16px;
        }

        .party {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .dispute-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dispute-date {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .dispute-details {
          padding: 32px;
          overflow-y: auto;
        }

        .details-header {
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .details-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .details-title h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          flex: 1;
          margin-right: 16px;
        }

        .dispute-meta {
          display: flex;
          gap: 20px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }

        .description-box {
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .description-box p {
          color: #374151;
          line-height: 1.6;
          font-size: 15px;
        }

        .parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .party-card {
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .party-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #6b7280;
        }

        .party-header h4 {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
        }

        .party-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .party-email {
          color: #6b7280;
          font-size: 14px;
        }

        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .note {
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .note-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #6b7280;
        }

        .note-date {
          font-size: 12px;
          font-weight: 500;
        }

        .note-content {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
        }

        .note-form,
        .resolution-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .note-textarea,
        .resolution-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .resolution-btn {
          font-size: 16px;
          padding: 16px 24px;
          font-weight: 700;
        }

        .resolution-box {
          background: rgba(16, 185, 129, 0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .resolution-type {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .resolution-label {
          font-size: 14px;
          font-weight: 600;
          color: #065f46;
        }

        .resolution-value {
          background: rgba(16, 185, 129, 0.2);
          color: #065f46;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .resolution-text {
          color: #065f46;
          line-height: 1.6;
          font-size: 15px;
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
          .disputes-layout {
            grid-template-columns: 1fr;
            height: auto;
          }

          .parties-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .page-header,
          .disputes-list,
          .dispute-details {
            padding: 20px;
          }

          .details-title {
            flex-direction: column;
            gap: 12px;
          }

          .dispute-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};
export default Disputes;
