// import React, { useState, useEffect } from 'react';
// import {
//   Search,
//   Filter,
//   MoreVertical,
//   Shield,
//   ShieldOff,
//   Trash2,
//   Eye,
//   UserCheck,
//   UserX,
//   Mail,
//   Clock,
// } from 'lucide-react';
// import { apiService } from '../services/api';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   // const [users, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       loadUsers();
//     }, 400); // debounce search
//     return () => clearTimeout(timeout);
//   }, [searchQuery, selectedFilter]);

//   const loadUsers = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // build params safely
//       const params = {};
//       if (selectedFilter !== 'all') params.role = selectedFilter;
//       if (searchQuery.trim()) params.search = searchQuery.trim();

//       const response = await apiService.getAllUsers(params);
//       setUsers(response.users || []);
//     } catch (error) {
//       console.error('Failed to load users:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleToggleUserStatus = async (userId, currentStatus) => {
//     try {
//       await apiService.updateUserStatus(userId, !currentStatus);
//       setUsers(
//         users.map((user) =>
//           user._id === userId ? { ...user, isActive: !currentStatus } : user
//         )
//       );
//     } catch (error) {
//       console.error('Failed to update user status:', error);
//       setError('Could not update user status.');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await apiService.deleteUser(userId);
//         setUsers(users.filter((user) => user._id !== userId));
//       } catch (error) {
//         console.error('Failed to delete user:', error);
//         setError('Could not delete user.');
//       }
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'student':
//         return '#2563eb';
//       case 'tutor':
//         return '#d97706';
//       case 'admin':
//         return '#7c3aed';
//       default:
//         return '#6b7280';
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (amount == null || isNaN(amount)) {
//       return '₦0';
//     }
//     return `₦${Number(amount).toLocaleString()}`;
//   };

//   if (isLoading) {
//     return <div className='loading'>Loading users...</div>;
//   }

//   if (error)
//     return (
//       <div className='error'>
//         <p>{error}</p>
//         <button onClick={loadUsers}>Retry</button>
//       </div>
//     );

//   return (
//     <div className='users-page'>
//       {/* Header Section */}
//       <div className='page-header glass-card fade-in-up'>
//         <div className='header-content'>
//           <div className='header-info'>
//             <h2>User Management</h2>
//             <p>Manage students, tutors, and their account status</p>
//           </div>
//           <div className='header-stats'>
//             <div className='header-stat'>
//               <span className='stat-number'>
//                 {users.filter((u) => u.role === 'student').length}
//               </span>
//               <span className='stat-label'>Students</span>
//             </div>
//             <div className='header-stat'>
//               <span className='stat-number'>
//                 {users.filter((u) => u.role === 'tutor').length}
//               </span>
//               <span className='stat-label'>Tutors</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className='filters-section glass-card slide-in-right'>
//         <div className='search-box'>
//           <Search size={20} />
//           <input
//             type='text'
//             placeholder='Search users by name or email...'
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className='input'
//           />
//         </div>
//         <div className='filter-tabs'>
//           {['all', 'student', 'tutor'].map((filter) => (
//             <button
//               key={filter}
//               className={`filter-tab ${
//                 selectedFilter === filter ? 'active' : ''
//               }`}
//               onClick={() => setSelectedFilter(filter)}
//             >
//               {filter.charAt(0).toUpperCase() + filter.slice(1)}
//               {filter !== 'all' && 's'}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Users Grid */}
//       <div className='users-grid'>
//         {users.map((user, index) => (
//           <div
//             key={user._id}
//             className='user-card glass-card fade-in-up'
//             style={{ animationDelay: `${index * 0.1}s` }}
//           >
//             <div className='user-header'>
//               <div className='user-info'>
//                 <div
//                   className='user-avatar'
//                   style={{ backgroundColor: getRoleColor(user.role) }}
//                 >
//                   {user.name
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')}
//                 </div>
//                 <div className='user-details'>
//                   <h3 className='user-name'>{user.name}</h3>
//                   <p className='user-email'>{user.email}</p>
//                   <div className='user-meta'>
//                     <span
//                       className='role-badge'
//                       style={{
//                         backgroundColor: getRoleColor(user.role) + '20',
//                         color: getRoleColor(user.role),
//                       }}
//                     >
//                       {user.role}
//                     </span>
//                     <span
//                       className={`status-badge ${
//                         user.isActive ? 'active' : 'inactive'
//                       }`}
//                     >
//                       {user.isActive ? 'Active' : 'Suspended'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className='user-actions'>
//                 <button className='action-btn'>
//                   <MoreVertical size={16} />
//                 </button>
//               </div>
//             </div>

//             <div className='user-stats'>
//               {user.role === 'tutor' && (
//                 <>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Rating:</span>
//                     <span className='stat-value rating'>
//                       ⭐ {user.rating > 0 ? user.rating : 'No ratings'}
//                     </span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Earnings:</span>
//                     <span className='stat-value earnings'>
//                       {formatCurrency(user.totalEarnings)}
//                     </span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Sessions:</span>
//                     <span className='stat-value'>{user.totalSessions}</span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Subjects:</span>
//                     <span className='stat-value'>
//                       {user.subjects?.join(', ')}
//                     </span>
//                   </div>
//                   {!user.isApproved && (
//                     <div className='approval-notice'>
//                       <Clock size={14} />
//                       <span>Pending Approval</span>
//                     </div>
//                   )}
//                 </>
//               )}
//               {user.role === 'student' && (
//                 <>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Institution:</span>
//                     <span className='stat-value'>{user.institution}</span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Course:</span>
//                     <span className='stat-value'>{user.course}</span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Sessions:</span>
//                     <span className='stat-value'>{user.totalSessions}</span>
//                   </div>
//                   <div className='stat-row'>
//                     <span className='stat-label'>Total Spent:</span>
//                     <span className='stat-value earnings'>
//                       {formatCurrency(user.totalSpent)}
//                     </span>
//                   </div>
//                 </>
//               )}
//               <div className='stat-row'>
//                 <span className='stat-label'>Joined:</span>
//                 <span className='stat-value'>{user.joinedAt}</span>
//               </div>
//               <div className='stat-row'>
//                 <span className='stat-label'>Last active:</span>
//                 <span className='stat-value'>{user.lastActive}</span>
//               </div>
//             </div>

//             <div className='user-actions-row'>
//               <button
//                 className={`btn ${
//                   user.isActive ? 'btn-danger' : 'btn-success'
//                 }`}
//                 onClick={() => handleToggleUserStatus(user._id, user.isActive)}
//               >
//                 {user.isActive ? (
//                   <>
//                     <UserX size={16} />
//                     Suspend
//                   </>
//                 ) : (
//                   <>
//                     <UserCheck size={16} />
//                     Activate
//                   </>
//                 )}
//               </button>
//               <button className='btn btn-ghost'>
//                 <Mail size={16} />
//                 Contact
//               </button>
//               <button
//                 className='btn btn-ghost delete-btn'
//                 onClick={() => handleDeleteUser(user._id)}
//               >
//                 <Trash2 size={16} />
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {users.length === 0 && (
//         <div className='empty-state glass-card'>
//           <div className='empty-icon'>
//             <Users size={48} color='#9CA3AF' />
//           </div>
//           <h3>No users found</h3>
//           <p>Try adjusting your search criteria or filters</p>
//         </div>
//       )}

//       <style jsx>{`
//         .users-page {
//           animation: fadeInUp 0.6s ease-out;
//         }

//         .page-header {
//           padding: 32px;
//           margin-bottom: 24px;
//         }

//         .header-content {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .header-info h2 {
//           font-size: 28px;
//           font-weight: 700;
//           color: #1a1a1a;
//           margin-bottom: 8px;
//           letter-spacing: -0.5px;
//         }

//         .header-info p {
//           color: #6b7280;
//           font-size: 16px;
//           font-weight: 500;
//         }

//         .header-stats {
//           display: flex;
//           gap: 32px;
//         }

//         .header-stat {
//           text-align: center;
//         }

//         .stat-number {
//           display: block;
//           font-size: 32px;
//           font-weight: 700;
//           color: #ff6b35;
//           margin-bottom: 4px;
//         }

//         .stat-label {
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 500;
//         }

//         .filters-section {
//           padding: 24px 32px;
//           margin-bottom: 24px;
//           display: flex;
//           gap: 20px;
//           align-items: center;
//         }

//         .search-box {
//           flex: 1;
//           position: relative;
//           display: flex;
//           align-items: center;
//           max-width: 400px;
//         }

//         .search-box svg {
//           position: absolute;
//           left: 16px;
//           color: #9ca3af;
//           z-index: 1;
//         }

//         .search-box input {
//           padding-left: 48px;
//         }

//         .filter-tabs {
//           display: flex;
//           gap: 8px;
//         }

//         .filter-tab {
//           padding: 12px 20px;
//           border: 2px solid rgba(229, 231, 235, 0.5);
//           background: rgba(255, 255, 255, 0.8);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           font-weight: 600;
//           color: #6b7280;
//         }

//         .filter-tab:hover {
//           border-color: #ff6b35;
//           color: #ff6b35;
//           transform: translateY(-2px);
//         }

//         .filter-tab.active {
//           background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
//           color: white;
//           border-color: #ff6b35;
//           box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
//         }

//         .users-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
//           gap: 24px;
//         }

//         .user-card {
//           padding: 28px;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .user-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//         }

//         .user-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 20px;
//         }

//         .user-info {
//           display: flex;
//           gap: 16px;
//           flex: 1;
//         }

//         .user-avatar {
//           width: 56px;
//           height: 56px;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: bold;
//           font-size: 20px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//         }

//         .user-details {
//           flex: 1;
//         }

//         .user-name {
//           font-size: 20px;
//           font-weight: 700;
//           color: #1a1a1a;
//           margin-bottom: 4px;
//           letter-spacing: -0.3px;
//         }

//         .user-email {
//           color: #6b7280;
//           margin-bottom: 12px;
//           font-size: 14px;
//           font-weight: 500;
//         }

//         .user-meta {
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .status-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .status-badge.active {
//           background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
//           color: #065f46;
//         }

//         .status-badge.inactive {
//           background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
//           color: #991b1b;
//         }

//         .action-btn {
//           background: rgba(107, 114, 128, 0.1);
//           border: none;
//           cursor: pointer;
//           padding: 12px;
//           border-radius: 12px;
//           color: #6b7280;
//           transition: all 0.3s ease;
//         }

//         .action-btn:hover {
//           background: rgba(107, 114, 128, 0.2);
//           color: #374151;
//           transform: rotate(90deg);
//         }

//         .user-stats {
//           background: rgba(248, 250, 252, 0.6);
//           backdrop-filter: blur(10px);
//           padding: 20px;
//           border-radius: 16px;
//           margin-bottom: 20px;
//           border: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .stat-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 12px;
//         }

//         .stat-row:last-child {
//           margin-bottom: 0;
//         }

//         .stat-label {
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 500;
//         }

//         .stat-value {
//           font-size: 14px;
//           color: #1a1a1a;
//           font-weight: 600;
//         }

//         .stat-value.rating {
//           color: #f59e0b;
//         }

//         .stat-value.earnings {
//           color: #10b981;
//         }

//         .approval-notice {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           background: rgba(245, 158, 11, 0.1);
//           color: #d97706;
//           padding: 8px 12px;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           margin-top: 12px;
//         }

//         .user-actions-row {
//           display: flex;
//           gap: 8px;
//         }

//         .user-actions-row .btn {
//           flex: 1;
//           font-size: 13px;
//           padding: 10px 12px;
//         }

//         .delete-btn:hover {
//           background: rgba(239, 68, 68, 0.1);
//           color: #ef4444;
//           border-color: rgba(239, 68, 68, 0.2);
//         }

//         .empty-state {
//           text-align: center;
//           padding: 64px 32px;
//           margin-top: 32px;
//         }

//         .empty-icon {
//           margin-bottom: 20px;
//           opacity: 0.5;
//         }

//         .empty-state h3 {
//           font-size: 20px;
//           font-weight: 600;
//           color: #374151;
//           margin-bottom: 8px;
//         }

//         .empty-state p {
//           color: #6b7280;
//           font-size: 16px;
//         }

//         @media (max-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 1fr;
//           }

//           .header-content {
//             flex-direction: column;
//             gap: 20px;
//             text-align: center;
//           }

//           .filters-section {
//             flex-direction: column;
//             gap: 16px;
//           }

//           .search-box {
//             max-width: none;
//           }
//         }

//         @media (max-width: 640px) {
//           .user-actions-row {
//             flex-direction: column;
//           }

//           .page-header,
//           .filters-section,
//           .user-card {
//             padding: 20px;
//           }

//           .header-stats {
//             gap: 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };
// export default Users;

import React, { useState, useEffect } from 'react';
import {
  Search,
  MoreVertical,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Clock,
  X,
  Wallet,
  CreditCard,
  Key,
  UserCog,
} from 'lucide-react';
import { apiService } from '../services/api';
import UserDetailsModal from '../components/userDetailsModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (selectedFilter !== 'all') params.role = selectedFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await apiService.getAllUsers(params);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await apiService.updateUserStatus(userId, !currentStatus);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
      if (selectedUser?._id === userId) {
        setSelectedUser({ ...selectedUser, isActive: !currentStatus });
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('Could not update user status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        if (selectedUser?._id === userId) {
          setShowModal(false);
          setSelectedUser(null);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError('Could not delete user.');
      }
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    setSelectedUser(updatedUser);
  };

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

  if (isLoading) {
    return <div className='loading'>Loading users...</div>;
  }

  if (error)
    return (
      <div className='error'>
        <p>{error}</p>
        <button onClick={loadUsers}>Retry</button>
      </div>
    );

  return (
    <div className='users-page'>
      <div className='page-header glass-card fade-in-up'>
        <div className='header-content'>
          <div className='header-info'>
            <h2>User Management</h2>
            <p>Manage students, tutors, and their account status</p>
          </div>
          <div className='header-stats'>
            <div className='header-stat'>
              <span className='stat-number'>
                {users.filter((u) => u.role === 'student').length}
              </span>
              <span className='stat-label'>Students</span>
            </div>
            <div className='header-stat'>
              <span className='stat-number'>
                {users.filter((u) => u.role === 'tutor').length}
              </span>
              <span className='stat-label'>Tutors</span>
            </div>
          </div>
        </div>
      </div>

      <div className='filters-section glass-card slide-in-right'>
        <div className='search-box'>
          <Search size={20} />
          <input
            type='text'
            placeholder='Search users by name or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='input'
          />
        </div>
        <div className='filter-tabs'>
          {['all', 'student', 'tutor'].map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${
                selectedFilter === filter ? 'active' : ''
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter !== 'all' && 's'}
            </button>
          ))}
        </div>
      </div>

      <div className='users-grid'>
        {users.map((user, index) => (
          <div
            key={user._id}
            className='user-card glass-card fade-in-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='user-header'>
              <div className='user-info'>
                <div
                  className='user-avatar'
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className='user-details'>
                  <h3 className='user-name'>{user.name}</h3>
                  <p className='user-email'>{user.email}</p>
                  <div className='user-meta'>
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
            </div>

            <div className='user-stats'>
              {user.role === 'tutor' && (
                <>
                  <div className='stat-row'>
                    <span className='stat-label'>Rating:</span>
                    <span className='stat-value rating'>
                      ⭐{' '}
                      {user.rating && user.rating > 0
                        ? user.rating
                        : 'No ratings'}
                    </span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Earnings:</span>
                    <span className='stat-value earnings'>
                      {formatCurrency(user.totalEarnings)}
                    </span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Sessions:</span>
                    <span className='stat-value'>{user.totalSessions}</span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Subjects:</span>
                    <span className='stat-value'>
                      {user.subjects?.join(', ')}
                    </span>
                  </div>
                  {!user.isApproved && (
                    <div className='approval-notice'>
                      <Clock size={14} />
                      <span>Pending Approval</span>
                    </div>
                  )}
                </>
              )}
              {user.role === 'student' && (
                <>
                  <div className='stat-row'>
                    <span className='stat-label'>Institution:</span>
                    <span className='stat-value'>{user.institution}</span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Course:</span>
                    <span className='stat-value'>{user.course}</span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Sessions:</span>
                    <span className='stat-value'>{user.totalSessions}</span>
                  </div>
                  <div className='stat-row'>
                    <span className='stat-label'>Total Spent:</span>
                    <span className='stat-value earnings'>
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </div>
                </>
              )}
              <div className='stat-row'>
                <span className='stat-label'>Joined:</span>
                <span className='stat-value'>{user.joinedAt}</span>
              </div>
              <div className='stat-row'>
                <span className='stat-label'>Last active:</span>
                <span className='stat-value'>{user.lastActive}</span>
              </div>
            </div>

            <div className='user-actions-row'>
              <button
                className='btn btn-primary'
                onClick={() => handleViewDetails(user)}
              >
                <Eye size={16} />
                View Details
              </button>
              <button
                className={`btn ${
                  user.isActive ? 'btn-danger' : 'btn-success'
                }`}
                onClick={() => handleToggleUserStatus(user._id, user.isActive)}
              >
                {user.isActive ? (
                  <>
                    <UserX size={16} />
                    Suspend
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Activate
                  </>
                )}
              </button>
              <button
                className='btn btn-ghost delete-btn'
                onClick={() => handleDeleteUser(user._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className='empty-state glass-card'>
          <div className='empty-icon'>
            <UserCheck size={48} color='#9CA3AF' />
          </div>
          <h3>No users found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      )}

      {showModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUserUpdate}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleUserStatus}
        />
      )}

      <style jsx>{`
        .users-page {
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
        }

        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          max-width: 400px;
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

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .user-card {
          padding: 28px;
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .user-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .user-info {
          display: flex;
          gap: 16px;
          flex: 1;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }

        .user-email {
          color: #6b7280;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .user-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
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

        .user-stats {
          background: rgba(248, 250, 252, 0.6);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 20px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stat-row:last-child {
          margin-bottom: 0;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 600;
        }

        .stat-value.rating {
          color: #f59e0b;
        }

        .stat-value.earnings {
          color: #10b981;
        }

        .approval-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
        }

        .user-actions-row {
          display: flex;
          gap: 8px;
        }

        .user-actions-row .btn {
          flex: 1;
          font-size: 13px;
          padding: 10px 12px;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
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
          .users-grid {
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
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .user-actions-row {
            flex-direction: column;
          }

          .page-header,
          .filters-section,
          .user-card {
            padding: 20px;
          }

          .header-stats {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Users;
