import React, { useState } from 'react';
import {
  X,
  Wallet,
  CreditCard,
  Key,
  UserCog,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { apiService } from '../services/api';

const UserDetailsModal = ({
  user,
  onClose,
  onUpdate,
  onDelete,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fundAmount, setFundAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(user.subscriptionPlan || '');
  const [newPassword, setNewPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(user.role);

  const subscriptionPlans = ['free', 'scholar-life', 'edu-pro'];
  const roles = ['student', 'tutor', 'admin'];
  const [tutorFee, setTutorFee] = useState(user.tutorFee || '');

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return '#2563eb';
      case 'tutor':
        return '#d97706';
      case 'admin':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) {
      return '₦0';
    }
    return `₦${Number(amount).toLocaleString()}`;
  };

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (user.role !== 'student') {
      setError('Wallet funding is only available for students');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.fundWallet(
        user._id,
        parseFloat(fundAmount)
      );
      if (response.data) {
        onUpdate(response.data);
        setSuccess(
          `Wallet funded successfully with ${formatCurrency(
            parseFloat(fundAmount)
          )}`
        );
        setFundAmount('');
      }
    } catch (err) {
      setError('Failed to fund wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSubscription = async () => {
    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }

    if (user.role !== 'student') {
      setError('Subscription change is only available for students');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.changeSubscription(
        user._id,
        selectedPlan
      );
      if (response.data) {
        onUpdate(response.data);
        setSuccess(`Subscription changed to ${selectedPlan} successfully`);
      }
    } catch (err) {
      setError('Failed to change subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (
      !window.confirm("Are you sure you want to reset this user's password?")
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiService.resetPassword(user._id, newPassword);
      setSuccess('Password reset successfully');
      setNewPassword('');
    } catch (err) {
      setError('Failed to reset password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (selectedRole === user.role) {
      setError('User already has this role');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${selectedRole}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.changeRole(user._id, selectedRole);
      if (response.data) {
        onUpdate(response.data);
        setSuccess(`Role changed to ${selectedRole} successfully`);
      }
    } catch (err) {
      setError('Failed to change role');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTutorFee = async () => {
    // console.log(tutorFee);
    if (user.role !== 'tutor') {
      setError('Tutor fee can only be updated for tutor accounts');
      return;
    }

    if (!tutorFee || isNaN(tutorFee) || parseFloat(tutorFee) <= 0) {
      setError('Please enter a valid tutor fee amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await apiService.updateTutorFee(user._id, tutorFee);
      if (response.data) {
        onUpdate(response.data);
        setSuccess(
          `Tutor fee updated successfully to ₦${parseFloat(
            tutorFee
          ).toLocaleString()}`
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update tutor fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <div className='modal-header-info'>
            <div
              className='user-avatar'
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <div className='user-badges'>
                <span
                  className='role-badge'
                  style={{
                    backgroundColor: getRoleColor(user.role) + '20',
                    color: getRoleColor(user.role),
                  }}
                >
                  {user.role}
                </span>
                <span
                  className={`status-badge ${
                    user.isActive ? 'active' : 'inactive'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </div>
          <button className='close-btn' onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className='modal-tabs'>
          <button
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </div>

        {error && (
          <div className='alert alert-error'>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className='alert alert-success'>
            <AlertCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <div className='modal-body'>
          {activeTab === 'details' && (
            <div className='details-section'>
              <div className='detail-group'>
                <h3>Personal Information</h3>
                <div className='detail-item'>
                  <Mail size={18} />
                  <div>
                    <span className='label'>Email</span>
                    <span className='value'>{user.email}</span>
                  </div>
                </div>
                <div className='detail-item'>
                  <Calendar size={18} />
                  <div>
                    <span className='label'>Joined</span>
                    <span className='value'>{user.joinedAt}</span>
                  </div>
                </div>
                <div className='detail-item'>
                  <Calendar size={18} />
                  <div>
                    <span className='label'>Last Active</span>
                    <span className='value'>{user.lastActive}</span>
                  </div>
                </div>
              </div>

              {user.role === 'student' && (
                <>
                  <div className='detail-group'>
                    <h3>Academic Information</h3>
                    <div className='detail-item'>
                      <span className='label'>Institution</span>
                      <span className='value'>{user.institution || 'N/A'}</span>
                    </div>
                    <div className='detail-item'>
                      <span className='label'>Course</span>
                      <span className='value'>{user.course || 'N/A'}</span>
                    </div>
                  </div>

                  <div className='detail-group'>
                    <h3>Financial Information</h3>
                    <div className='detail-item'>
                      <Wallet size={18} />
                      <div>
                        <span className='label'>Wallet Balance</span>
                        <span className='value earnings'>
                          {formatCurrency(user.walletBalance)}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <DollarSign size={18} />
                      <div>
                        <span className='label'>Total Spent</span>
                        <span className='value'>
                          {formatCurrency(user.totalSpent)}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <CreditCard size={18} />
                      <div>
                        <span className='label'>Subscription Plan</span>
                        <span className='value'>
                          {user.subscriptionPlan || 'Free'}
                        </span>
                      </div>
                    </div>
                    <div className='detail-item'>
                      <span className='label'>Total Sessions</span>
                      <span className='value'>{user.totalSessions || 0}</span>
                    </div>
                  </div>
                </>
              )}

              {user.role === 'tutor' && (
                <div className='detail-group'>
                  <h3>Tutor Information</h3>
                  <div className='detail-item'>
                    <span className='label'>Rating</span>
                    <span className='value rating'>
                      ⭐{' '}
                      {user.rating && user.rating > 0
                        ? user.rating
                        : 'No ratings'}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <DollarSign size={18} />
                    <div>
                      <span className='label'>Total Earnings</span>
                      <span className='value earnings'>
                        {formatCurrency(user.totalEarnings)}
                      </span>
                    </div>
                  </div>
                  <div className='detail-item'>
                    <span className='label'>Total Sessions</span>
                    <span className='value'>{user.totalSessions || 0}</span>
                  </div>
                  <div className='detail-item'>
                    <span className='label'>Subjects</span>
                    <span className='value'>
                      {user.subjects?.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='label'>Approval Status</span>
                    <span className='value'>
                      {user.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className='actions-section'>
              {user.role === 'student' && (
                <>
                  <div className='action-card'>
                    <div className='action-header'>
                      <Wallet size={24} />
                      <h3>Fund Wallet</h3>
                    </div>
                    <p>Add funds to the student's wallet</p>
                    <div className='action-form'>
                      <input
                        type='number'
                        placeholder='Enter amount'
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        className='input'
                        min='0'
                        step='100'
                      />
                      <button
                        className='btn btn-primary'
                        onClick={handleFundWallet}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Fund Wallet'}
                      </button>
                    </div>
                  </div>

                  <div className='action-card'>
                    <div className='action-header'>
                      <CreditCard size={24} />
                      <h3>Change Subscription</h3>
                    </div>
                    <p>Update the student's subscription plan</p>
                    <div className='action-form'>
                      <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className='input'
                      >
                        <option value=''>Select a plan</option>
                        {subscriptionPlans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                      <button
                        className='btn btn-primary'
                        onClick={handleChangeSubscription}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Change Subscription'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* {user.role === 'tutor' && (
                <div className='action-info'>
                  <AlertCircle size={24} />
                  <p>
                    Wallet funding and subscription management are only
                    available for student users.
                  </p>
                </div>
              )} */}
              {/* {user.role === 'tutor' && (
                <div className='action-card'>
                  <div className='action-header'>
                    <DollarSign size={24} />
                    <h3>Set Tutor Fee</h3>
                  </div>
                  <p>Set or update this tutor’s fee per session</p>
                  <div className='action-form'>
                    <input
                      type='number'
                      placeholder='Enter fee (₦)'
                      value={tutorFee}
                      onChange={(e) => setTutorFee(e.target.value)}
                      className='input'
                      min='0'
                      step='100'
                    />
                    <button
                      className='btn btn-primary'
                      onClick={handleUpdateTutorFee}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Fee'}
                    </button>
                  </div>
                </div>
              )} */}

              <div className='action-card'>
                <div className='action-header'>
                  <Key size={24} />
                  <h3>Reset Password</h3>
                </div>
                <p>Set a new password for this user</p>
                <div className='action-form'>
                  <input
                    type='password'
                    placeholder='Enter new password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='input'
                    minLength={6}
                  />
                  <button
                    className='btn btn-warning'
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Change Password'}
                  </button>
                </div>
              </div>

              <div className='action-card'>
                <div className='action-header'>
                  <UserCog size={24} />
                  <h3>Change Role</h3>
                </div>
                <p>Update user role</p>
                <div className='action-form'>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className='input'
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-primary'
                    onClick={handleChangeRole}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Change Role'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='modal-footer'>
          <button
            className='btn btn-ghost'
            onClick={() => onToggleStatus(user._id, user.isActive)}
          >
            {user.isActive ? 'Suspend User' : 'Activate User'}
          </button>
          <button
            className='btn btn-danger'
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this user?')
              ) {
                onDelete(user._id);
              }
            }}
          >
            Delete User
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
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

        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
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

        .modal-header {
          padding: 32px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }

        .modal-header-info {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .user-avatar {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .modal-header p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .user-badges {
          display: flex;
          gap: 8px;
        }

        .role-badge,
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .status-badge.inactive {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }

        .close-btn {
          background: rgba(107, 114, 128, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 12px;
          color: #6b7280;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(107, 114, 128, 0.2);
          color: #374151;
          transform: rotate(90deg);
        }

        .modal-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 0 32px;
        }

        .tab {
          padding: 16px 24px;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab:hover {
          color: #ff6b35;
        }

        .tab.active {
          color: #ff6b35;
          border-bottom-color: #ff6b35;
        }

        .alert {
          padding: 12px 16px;
          margin: 16px 32px 0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .details-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-group {
          background: #f9fafb;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .detail-group h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .detail-item > div {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-item .label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-item .value {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .value.rating {
          color: #f59e0b;
        }

        .value.earnings {
          color: #10b981;
        }

        .actions-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .action-info {
          background: #fef3c7;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #92400e;
        }

        .action-card {
          background: #f9fafb;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .action-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .action-header svg {
          color: #ff6b35;
        }

        .action-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .action-card > p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .action-form {
          display: flex;
          gap: 12px;
        }

        .action-form .input {
          flex: 1;
        }

        .action-form .btn {
          white-space: nowrap;
        }

        .modal-footer {
          padding: 20px 32px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f9fafb;
        }

        @media (max-width: 640px) {
          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 20px;
          }

          .modal-tabs {
            padding: 0 20px;
          }

          .tab {
            padding: 12px 16px;
            font-size: 14px;
          }

          .action-form {
            flex-direction: column;
          }

          .modal-footer {
            flex-direction: column;
          }

          .modal-footer .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDetailsModal;
