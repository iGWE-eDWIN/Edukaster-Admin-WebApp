import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  X,
  Clock,
  Star,
  FileText,
  User,
  Mail,
  Calendar,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { apiService } from '../services/api';

const Approvals = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadPendingTutors();
  }, []);

  const loadPendingTutors = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPendingTutors();
      setPendingTutors(response.tutors || []);

      // Fallback mock data if API fails
      if (!response.tutors) {
        const mockTutors = [
          {
            _id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@tutor.com',
            qualifications: ['PhD Mathematics', 'MSc Statistics'],
            hourlyRate: 5000,
            bio: 'Experienced mathematics tutor with 10+ years of teaching experience in universities across Nigeria.',
            subjects: ['Mathematics', 'Statistics', 'Calculus'],
            createdAt: '2024-12-01T10:00:00Z',
            isApproved: false,
            isActive: true,
          },
          {
            _id: 2,
            name: 'Prof. Michael Chen',
            email: 'michael.chen@tutor.com',
            qualifications: ['PhD Physics', 'MSc Engineering'],
            hourlyRate: 6000,
            bio: 'Physics professor specializing in quantum mechanics and thermodynamics with research publications.',
            subjects: ['Physics', 'Engineering', 'Mathematics'],
            createdAt: '2024-12-02T14:30:00Z',
            isApproved: false,
            isActive: true,
          },
          {
            _id: 3,
            name: 'Dr. Aisha Okafor',
            email: 'aisha.okafor@tutor.com',
            qualifications: ['PhD Chemistry', 'MSc Biochemistry'],
            hourlyRate: 5500,
            bio: 'Chemistry expert with extensive experience in organic and inorganic chemistry teaching.',
            subjects: ['Chemistry', 'Biochemistry', 'Organic Chemistry'],
            createdAt: '2024-12-03T09:15:00Z',
            isApproved: false,
            isActive: true,
          },
        ];
        setPendingTutors(mockTutors);
      }
    } catch (error) {
      console.error('Failed to load pending tutors:', error);
      // Use mock data as fallback
      const mockTutors = [
        {
          _id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@tutor.com',
          qualifications: ['PhD Mathematics', 'MSc Statistics'],
          hourlyRate: 5000,
          bio: 'Experienced mathematics tutor with 10+ years of teaching experience.',
          subjects: ['Mathematics', 'Statistics', 'Calculus'],
          createdAt: '2024-12-01T10:00:00Z',
          isApproved: false,
          isActive: true,
        },
      ];
      setPendingTutors(mockTutors);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTutor = async (tutorId) => {
    try {
      await apiService.approveTutor(tutorId);
      setPendingTutors(pendingTutors.filter((tutor) => tutor._id !== tutorId));
      alert('Tutor approved successfully!');
    } catch (error) {
      console.error('Failed to approve tutor:', error);
      alert('Failed to approve tutor. Please try again.');
    }
  };

  const handleRejectTutor = async () => {
    if (!selectedTutor || !rejectionReason.trim()) return;

    try {
      await apiService.rejectTutor(selectedTutor._id, rejectionReason);
      setPendingTutors(
        pendingTutors.filter((tutor) => tutor._id !== selectedTutor._id)
      );
      setShowRejectModal(false);
      setSelectedTutor(null);
      setRejectionReason('');
      alert('Tutor application rejected.');
    } catch (error) {
      console.error('Failed to reject tutor:', error);
      alert('Failed to reject tutor. Please try again.');
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
    if (amount == null || isNaN(amount)) {
      return '₦0';
    }
    return `₦${Number(amount).toLocaleString()}`;
  };

  if (isLoading) {
    return <div className='loading'>Loading pending approvals...</div>;
  }

  return (
    <div className='approvals-page'>
      {/* Header Section */}
      <div className='page-header glass-card fade-in-up'>
        <div className='header-content'>
          <div className='header-info'>
            <h2>Tutor Approvals</h2>
            <p>Review and approve tutor applications to join the platform</p>
          </div>
          <div className='header-stats'>
            <div className='header-stat'>
              <span className='stat-number'>{pendingTutors.length}</span>
              <span className='stat-label'>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tutors Grid */}
      <div className='tutors-grid'>
        {pendingTutors.map((tutor, index) => (
          <div
            key={tutor._id}
            className='tutor-card glass-card fade-in-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='tutor-header'>
              <div className='tutor-info'>
                <div className='tutor-avatar'>
                  {tutor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className='tutor-details'>
                  <h3 className='tutor-name'>{tutor.name}</h3>
                  <div className='tutor-contact'>
                    <Mail size={14} />
                    <span>{tutor.email}</span>
                  </div>
                  <div className='tutor-rate'>
                    <DollarSign size={14} />
                    <span>{formatCurrency(tutor.hourlyRate)}/hour</span>
                  </div>
                </div>
              </div>
              <div className='application-date'>
                <Calendar size={14} />
                <span>{formatDate(tutor.createdAt)}</span>
              </div>
            </div>

            <div className='tutor-qualifications'>
              <h4>Qualifications</h4>
              <div className='qualifications-list'>
                {tutor.qualifications?.map((qual, index) => (
                  <div key={index} className='qualification-item'>
                    <BookOpen size={12} />
                    <span>{qual}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='tutor-subjects'>
              <h4>Subjects</h4>
              <div className='subjects-tags'>
                {tutor.subjects?.map((subject, index) => (
                  <span key={index} className='subject-tag'>
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className='tutor-bio'>
              <h4>Bio</h4>
              <p>{tutor.bio}</p>
            </div>

            <div className='approval-actions'>
              <button
                className='btn btn-danger'
                onClick={() => {
                  setSelectedTutor(tutor);
                  setShowRejectModal(true);
                }}
              >
                <X size={16} />
                Reject
              </button>
              <button
                className='btn btn-success'
                onClick={() => handleApproveTutor(tutor._id)}
              >
                <CheckCircle size={16} />
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingTutors.length === 0 && (
        <div className='empty-state glass-card'>
          <div className='empty-icon'>
            <User size={48} color='#9CA3AF' />
          </div>
          <h3>No pending approvals</h3>
          <p>All tutor applications have been reviewed</p>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className='modal glass-card'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='modal-header'>
              <h3>Reject Tutor Application</h3>
              <button
                className='modal-close'
                onClick={() => setShowRejectModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className='modal-content'>
              <p>
                You are about to reject <strong>{selectedTutor?.name}</strong>'s
                application.
              </p>
              <div className='form-group'>
                <label>Reason for rejection:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder='Please provide a reason for rejection...'
                  className='input rejection-textarea'
                  rows={4}
                />
              </div>
            </div>
            <div className='modal-actions'>
              <button
                className='btn btn-secondary'
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className='btn btn-danger'
                onClick={handleRejectTutor}
                disabled={!rejectionReason.trim()}
              >
                <X size={16} />
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .approvals-page {
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
          color: #f59e0b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .tutors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 24px;
        }

        .tutor-card {
          padding: 28px;
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .tutor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .tutor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .tutor-info {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .tutor-avatar {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .tutor-details {
          flex: 1;
        }

        .tutor-name {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .tutor-contact,
        .tutor-rate {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .tutor-rate {
          color: #10b981;
          font-weight: 600;
        }

        .application-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 12px;
          font-weight: 500;
        }

        .tutor-qualifications,
        .tutor-subjects,
        .tutor-bio {
          margin-bottom: 20px;
        }

        .tutor-qualifications h4,
        .tutor-subjects h4,
        .tutor-bio h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .qualifications-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .qualification-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 12px;
          background: rgba(248, 250, 252, 0.6);
          border-radius: 8px;
        }

        .subjects-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .subject-tag {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }

        .tutor-bio p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 14px;
          background: rgba(248, 250, 252, 0.6);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
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
          padding: 14px 20px;
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

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 500px;
          margin: 20px;
          animation: fadeInUp 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(229, 231, 235, 0.3);
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: rgba(107, 114, 128, 0.1);
          color: #374151;
        }

        .modal-content {
          margin-bottom: 24px;
        }

        .modal-content p {
          color: #6b7280;
          margin-bottom: 16px;
          font-size: 15px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }

        .rejection-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-actions .btn {
          padding: 12px 24px;
        }

        @media (max-width: 1024px) {
          .tutors-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .tutor-header {
            flex-direction: column;
            gap: 12px;
          }

          .approval-actions {
            flex-direction: column;
          }

          .page-header,
          .tutor-card {
            padding: 20px;
          }

          .modal {
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Approvals;
