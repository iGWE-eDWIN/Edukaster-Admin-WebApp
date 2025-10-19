// import React, { useState, useEffect } from 'react';
// import {
//   DollarSign,
//   Clock,
//   CheckCircle,
//   Send,
//   Filter,
//   Calendar,
//   User,
//   CreditCard,
// } from 'lucide-react';
// import { apiService } from '../services/api';

// const Payments = () => {
//   const [payments, setPayments] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('pending');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadPayments();
//   }, [selectedTab]);

//   const loadPayments = async () => {
//     try {
//       setIsLoading(true);

//       // ✅ Mock data (replace with actual API later)
//       const allPayments = [
//         {
//           id: 1,
//           student: 'John Doe',
//           tutor: 'Dr. Sarah Johnson',
//           subject: 'Mathematics',
//           amount: 5000,
//           platformCommission: 500,
//           tutorAmount: 4500,
//           sessionDate: '2025-01-15',
//           paymentDate: '2025-01-14',
//           paystackReference: 'EDU_1705234567_abc123',
//           status: 'pending',
//           sessionCompleted: true,
//         },
//         {
//           id: 2,
//           student: 'Jane Smith',
//           tutor: 'Prof. Michael Chen',
//           subject: 'Physics',
//           amount: 6000,
//           platformCommission: 600,
//           tutorAmount: 5400,
//           sessionDate: '2025-01-16',
//           paymentDate: '2025-01-15',
//           paystackReference: 'EDU_1705234890_def456',
//           status: 'pending',
//           sessionCompleted: false,
//         },
//         {
//           id: 3,
//           student: 'Mike Johnson',
//           tutor: 'Dr. Aisha Okafor',
//           subject: 'Chemistry',
//           amount: 4500,
//           platformCommission: 450,
//           tutorAmount: 4050,
//           sessionDate: '2025-01-10',
//           paymentDate: '2025-01-09',
//           releaseDate: '2025-01-11',
//           status: 'released',
//         },
//       ];

//       // ✅ Filter payments based on selectedTab
//       const filteredPayments =
//         selectedTab === 'all'
//           ? allPayments
//           : allPayments.filter((p) => p.status === selectedTab);

//       setPayments(filteredPayments);
//     } catch (error) {
//       console.error('Failed to load payments:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleConfirmPayment = async (paymentId) => {
//     try {
//       await apiService.confirmPayment(paymentId);
//       loadPayments(); // Reload data
//     } catch (error) {
//       console.error('Failed to confirm payment:', error);
//     }
//   };

//   const handleReleasePayment = async (paymentId) => {
//     try {
//       await apiService.releasePayment(paymentId);
//       loadPayments(); // Reload data
//     } catch (error) {
//       console.error('Failed to release payment:', error);
//     }
//   };

//   // ✅ Safe formatCurrency
//   const formatCurrency = (amount) => {
//     if (amount == null || isNaN(amount)) return '₦0';
//     return `₦${Number(amount).toLocaleString()}`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     });
//   };

//   if (isLoading) {
//     return <div className='loading'>Loading payments...</div>;
//   }

//   // ✅ Fix pendingCount (check p.status)
//   const pendingCount = payments.filter((p) => p.status === 'pending').length;

//   // ✅ Total revenue is safe
//   const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

//   return (
//     <div className='payments-page'>
//       {/* Header Section */}
//       <div className='page-header glass-card fade-in-up'>
//         <div className='header-content'>
//           <div className='header-info'>
//             <h2>Payment Management</h2>
//             <p>Monitor and manage platform payments and payouts</p>
//           </div>
//           <div className='header-stats'>
//             <div className='header-stat'>
//               <span className='stat-number'>{pendingCount}</span>
//               <span className='stat-label'>Pending</span>
//             </div>
//             <div className='header-stat'>
//               <span className='stat-number'>
//                 {formatCurrency(totalRevenue)}
//               </span>
//               <span className='stat-label'>Total Value</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tab Selector */}
//       <div className='tab-section glass-card slide-in-right'>
//         <div className='tab-selector'>
//           <button
//             className={`tab ${selectedTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setSelectedTab('pending')}
//           >
//             <Clock size={18} />
//             Pending Payments
//             <span className='tab-count'>{payments.length}</span>
//           </button>
//           <button
//             className={`tab ${selectedTab === 'history' ? 'active' : ''}`}
//             onClick={() => setSelectedTab('history')}
//           >
//             <CheckCircle size={18} />
//             Payment History
//           </button>
//         </div>
//       </div>

//       {/* Payments List */}
//       <div className='payments-list'>
//         {payments.map((payment, index) => (
//           <div
//             key={payment.id}
//             className='payment-card glass-card fade-in-up'
//             style={{ animationDelay: `${index * 0.1}s` }}
//           >
//             <div className='payment-header'>
//               <div className='payment-info'>
//                 <h3 className='session-subject'>{payment.subject}</h3>
//                 <div className='session-parties'>
//                   <User size={14} />
//                   <span>
//                     {payment.student} → {payment.tutor}
//                   </span>
//                 </div>
//               </div>
//               <div className='amount-container'>
//                 <span className='payment-amount'>
//                   {formatCurrency(payment.amount)}
//                 </span>
//                 {payment.status === 'released' && (
//                   <span className='status-badge released'>
//                     <CheckCircle size={12} />
//                     RELEASED
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className='payment-details'>
//               <div className='details-grid'>
//                 <div className='detail-item'>
//                   <Calendar size={14} />
//                   <div>
//                     <span className='detail-label'>Session Date</span>
//                     <span className='detail-value'>
//                       {formatDate(payment.sessionDate)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className='detail-item'>
//                   <CreditCard size={14} />
//                   <div>
//                     <span className='detail-label'>Payment Date</span>
//                     <span className='detail-value'>
//                       {formatDate(payment.paymentDate)}
//                     </span>
//                   </div>
//                 </div>
//                 {payment.releaseDate && (
//                   <div className='detail-item'>
//                     <Send size={14} />
//                     <div>
//                       <span className='detail-label'>Released</span>
//                       <span className='detail-value'>
//                         {formatDate(payment.releaseDate)}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//                 <div className='detail-item'>
//                   <span className='reference-label'>Reference</span>
//                   <code className='reference-code'>
//                     {payment.paystackReference}
//                   </code>
//                 </div>
//               </div>

//               <div className='payment-breakdown'>
//                 <div className='breakdown-item'>
//                   <span className='breakdown-label'>Total Amount</span>
//                   <span className='breakdown-value total'>
//                     {formatCurrency(payment.amount)}
//                   </span>
//                 </div>
//                 <div className='breakdown-item'>
//                   <span className='breakdown-label'>Platform Fee (10%)</span>
//                   <span className='breakdown-value fee'>
//                     {formatCurrency(payment.platformCommission)}
//                   </span>
//                 </div>
//                 <div className='breakdown-item'>
//                   <span className='breakdown-label'>Tutor Amount</span>
//                   <span className='breakdown-value tutor'>
//                     {formatCurrency(payment.tutorAmount)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {selectedTab === 'pending' && (
//               <>
//                 <div className='session-status'>
//                   <div className='status-indicator'>
//                     {payment.sessionCompleted ? (
//                       <CheckCircle size={18} color='#10B981' />
//                     ) : (
//                       <Clock size={18} color='#F59E0B' />
//                     )}
//                     <span
//                       className={`status-text ${
//                         payment.sessionCompleted ? 'completed' : 'pending'
//                       }`}
//                     >
//                       Session{' '}
//                       {payment.sessionCompleted
//                         ? 'Completed'
//                         : 'Pending Completion'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className='payment-actions'>
//                   {!payment.sessionCompleted ? (
//                     <button
//                       className='btn btn-primary action-btn-full'
//                       onClick={() => handleConfirmPayment(payment.id)}
//                     >
//                       <CheckCircle size={18} />
//                       Confirm Session Booking
//                     </button>
//                   ) : (
//                     <button
//                       className='btn btn-success action-btn-full'
//                       onClick={() => handleReleasePayment(payment.id)}
//                     >
//                       <Send size={18} />
//                       Release Payment to Tutor
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {payments.length === 0 && (
//         <div className='empty-state glass-card'>
//           <div className='empty-icon'>
//             <DollarSign size={48} color='#9CA3AF' />
//           </div>
//           <h3>No payments found</h3>
//           <p>No payments available for this category</p>
//         </div>
//       )}

//       <style jsx>{`
//         .payments-page {
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
//           font-size: 24px;
//           font-weight: 700;
//           color: #ff6b35;
//           margin-bottom: 4px;
//         }

//         .stat-label {
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 500;
//         }

//         .tab-section {
//           padding: 24px 32px;
//           margin-bottom: 24px;
//         }

//         .tab-selector {
//           display: flex;
//           gap: 8px;
//         }

//         .tab {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 16px 24px;
//           border: 2px solid rgba(229, 231, 235, 0.5);
//           background: rgba(255, 255, 255, 0.8);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           cursor: pointer;
//           font-weight: 600;
//           color: #6b7280;
//           transition: all 0.3s ease;
//         }

//         .tab:hover {
//           border-color: #ff6b35;
//           color: #ff6b35;
//           transform: translateY(-2px);
//         }

//         .tab.active {
//           background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
//           color: white;
//           border-color: #ff6b35;
//           box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
//         }

//         .tab-count {
//           background: rgba(255, 255, 255, 0.2);
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .tab.active .tab-count {
//           background: rgba(255, 255, 255, 0.3);
//         }

//         .payments-list {
//           display: grid;
//           gap: 24px;
//         }

//         .payment-card {
//           padding: 32px;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .payment-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
//         }

//         .payment-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 24px;
//         }

//         .payment-info {
//           flex: 1;
//         }

//         .session-subject {
//           font-size: 22px;
//           font-weight: 700;
//           color: #1a1b5c;
//           margin-bottom: 8px;
//           letter-spacing: -0.3px;
//         }

//         .session-parties {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: #6b7280;
//           font-size: 15px;
//           font-weight: 500;
//         }

//         .amount-container {
//           text-align: right;
//         }

//         .payment-amount {
//           font-size: 28px;
//           font-weight: 700;
//           color: #10b981;
//           display: block;
//           margin-bottom: 8px;
//           letter-spacing: -0.5px;
//         }

//         .status-badge {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 11px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .status-badge.released {
//           background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
//           color: #065f46;
//         }

//         .payment-details {
//           background: rgba(248, 250, 252, 0.6);
//           backdrop-filter: blur(10px);
//           padding: 24px;
//           border-radius: 16px;
//           margin-bottom: 24px;
//           border: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .details-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 16px;
//           margin-bottom: 20px;
//         }

//         .detail-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: #6b7280;
//         }

//         .detail-item div {
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//         }

//         .detail-label {
//           font-size: 12px;
//           color: #9ca3af;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .detail-value {
//           font-size: 14px;
//           color: #1a1a1a;
//           font-weight: 600;
//         }

//         .reference-label {
//           font-size: 12px;
//           color: #9ca3af;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 4px;
//         }

//         .reference-code {
//           background: rgba(255, 107, 53, 0.1);
//           color: #ff6b35;
//           padding: 6px 10px;
//           border-radius: 8px;
//           font-family: 'Monaco', 'Menlo', monospace;
//           font-size: 12px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//         }

//         .payment-breakdown {
//           border-top: 1px solid rgba(229, 231, 235, 0.3);
//           padding-top: 16px;
//         }

//         .breakdown-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 8px;
//         }

//         .breakdown-item:last-child {
//           margin-bottom: 0;
//           padding-top: 8px;
//           border-top: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .breakdown-label {
//           font-size: 14px;
//           color: #6b7280;
//           font-weight: 500;
//         }

//         .breakdown-value {
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .breakdown-value.total {
//           color: #1a1a1a;
//           font-size: 16px;
//         }

//         .breakdown-value.fee {
//           color: #f59e0b;
//         }

//         .breakdown-value.tutor {
//           color: #10b981;
//           font-size: 16px;
//         }

//         .session-status {
//           margin-bottom: 20px;
//         }

//         .status-indicator {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 16px 20px;
//           background: rgba(248, 250, 252, 0.6);
//           backdrop-filter: blur(10px);
//           border-radius: 12px;
//           border: 1px solid rgba(229, 231, 235, 0.3);
//         }

//         .status-text {
//           font-size: 15px;
//           font-weight: 600;
//         }

//         .status-text.completed {
//           color: #10b981;
//         }

//         .status-text.pending {
//           color: #f59e0b;
//         }

//         .payment-actions {
//           display: flex;
//         }

//         .action-btn-full {
//           width: 100%;
//           padding: 16px 24px;
//           font-size: 16px;
//           font-weight: 700;
//           letter-spacing: 0.3px;
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
//           .header-content {
//             flex-direction: column;
//             gap: 20px;
//             text-align: center;
//           }

//           .details-grid {
//             grid-template-columns: 1fr;
//           }
//         }

//         @media (max-width: 640px) {
//           .payment-header {
//             flex-direction: column;
//             gap: 16px;
//           }

//           .amount-container {
//             text-align: left;
//           }

//           .tab-selector {
//             flex-direction: column;
//             gap: 8px;
//           }

//           .page-header,
//           .tab-section,
//           .payment-card {
//             padding: 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };
// export default Payments;

///// 2ND
// import React, { useState, useEffect } from 'react';
// import { CheckCircle, Link, Clock, User, Calendar } from 'lucide-react';
// import { apiService } from '../services/api';

// const AdminBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [meetingLink, setMeetingLink] = useState('');
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       setIsLoading(true);
//       const res = await apiService.getPendingBookings(); // make sure you have this backend endpoint
//       console.log('Pending bookings:', res);
//       setBookings(res.bookings || []);
//     } catch (err) {
//       console.error('Failed to load bookings:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleApprove = async () => {
//     if (!meetingLink.trim()) {
//       alert('Please enter a valid meeting link.');
//       return;
//     }

//     try {
//       await apiService.approveBooking(selectedBooking._id, meetingLink);
//       alert('Booking approved successfully!');
//       setShowModal(false);
//       setMeetingLink('');
//       loadBookings();
//     } catch (err) {
//       alert(err.message || 'Failed to approve booking');
//       console.error(err);
//     }
//   };

//   if (isLoading) return <div className='loading'>Loading bookings...</div>;

//   return (
//     <div className='bookings-page fade-in-up'>
//       <h2>Pending Bookings</h2>

//       {bookings.length === 0 && (
//         <div className='empty-state'>
//           <p>No pending bookings found.</p>
//         </div>
//       )}

//       <div className='bookings-list'>
//         {bookings.map((b, i) => (
//           <div
//             key={b._id}
//             className='booking-card glass-card'
//             style={{ animationDelay: `${i * 0.1}s` }}
//           >
//             <div className='booking-header'>
//               <h3>{b.subject || 'Session'}</h3>
//               <span className='status-badge pending'>
//                 <Clock size={14} /> Pending
//               </span>
//             </div>

//             <div className='booking-info'>
//               <div>
//                 <User size={14} /> Student: {b.studentId?.firstName}{' '}
//                 {b.studentId?.lastName}
//               </div>
//               <div>
//                 <User size={14} /> Tutor: {b.tutorId?.firstName}{' '}
//                 {b.tutorId?.lastName}
//               </div>
//               <div>
//                 <Calendar size={14} /> Date: {new Date(b.date).toLocaleString()}
//               </div>
//               <div>Amount: ₦{b.amount?.toLocaleString()}</div>
//             </div>

//             <div className='actions'>
//               <button
//                 className='btn btn-primary'
//                 onClick={() => {
//                   setSelectedBooking(b);
//                   setShowModal(true);
//                 }}
//               >
//                 <CheckCircle size={16} />
//                 Approve & Send Meeting Link
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className='modal-overlay'>
//           <div className='modal-card'>
//             <h3>Approve Booking</h3>
//             <p>Send a meeting link to confirm this session.</p>
//             <div className='input-group'>
//               <Link size={16} />
//               <input
//                 type='text'
//                 placeholder='https://meet.google.com/xyz'
//                 value={meetingLink}
//                 onChange={(e) => setMeetingLink(e.target.value)}
//               />
//             </div>
//             <div className='modal-actions'>
//               <button className='btn btn-success' onClick={handleApprove}>
//                 Approve & Notify
//               </button>
//               <button
//                 className='btn btn-secondary'
//                 onClick={() => {
//                   setShowModal(false);
//                   setMeetingLink('');
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .bookings-page {
//           padding: 24px;
//         }
//         h2 {
//           font-size: 24px;
//           font-weight: 700;
//           margin-bottom: 20px;
//         }
//         .booking-card {
//           padding: 24px;
//           border-radius: 16px;
//           background: white;
//           margin-bottom: 16px;
//           border: 1px solid #e5e7eb;
//         }
//         .booking-header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 10px;
//         }
//         .booking-info {
//           margin-bottom: 16px;
//           color: #4b5563;
//           line-height: 1.6;
//         }
//         .actions {
//           text-align: right;
//         }
//         .btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 10px 16px;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           border: none;
//         }
//         .btn-primary {
//           background: #ff6b35;
//           color: white;
//         }
//         .btn-success {
//           background: #10b981;
//           color: white;
//         }
//         .btn-secondary {
//           background: #9ca3af;
//           color: white;
//         }
//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0, 0, 0, 0.4);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//         .modal-card {
//           background: white;
//           padding: 24px;
//           border-radius: 16px;
//           width: 90%;
//           max-width: 400px;
//         }
//         .input-group {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           background: #f9fafb;
//           border: 1px solid #e5e7eb;
//           padding: 8px 12px;
//           border-radius: 8px;
//           margin-top: 12px;
//         }
//         .input-group input {
//           flex: 1;
//           border: none;
//           outline: none;
//           background: transparent;
//         }
//         .modal-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 10px;
//           margin-top: 16px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminBookings;

import React, { useState, useEffect } from 'react';
import { CheckCircle, Link, Clock, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const res = await apiService.getPendingBookings();
      // console.log('Pending bookings:', res);
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!meetingLink.trim()) {
      alert('Please enter a valid meeting link.');
      return;
    }

    try {
      await apiService.approveBooking(selectedBooking._id, meetingLink);
      alert('Booking approved successfully!');
      setShowModal(false);
      setMeetingLink('');
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to approve booking');
      // console.error(err);
    }
  };

  if (isLoading) return <div className='loading'>Loading bookings...</div>;

  return (
    <div className='bookings-page fade-in-up'>
      <h2>Pending Bookings</h2>

      {bookings.length === 0 && (
        <div className='empty-state'>
          <p>No pending bookings found.</p>
        </div>
      )}

      <div className='bookings-list'>
        {bookings.map((b, i) => (
          <div
            key={b._id}
            className='booking-card glass-card'
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className='booking-header'>
              <h3>{b.courseTitle || 'Session'}</h3>
              <span className='status-badge pending'>
                <Clock size={14} /> Pending
              </span>
            </div>

            <div className='booking-info'>
              {/* Student */}
              <div className='user-info'>
                <img
                  src={b.student?.avatar || '/default-avatar.png'}
                  alt='Student'
                  className='user-avatar'
                />
                <span>
                  <strong>Student:</strong> {b.student?.name}{' '}
                  {/* {b.student?.lastName} */}
                </span>
              </div>

              {/* Tutor */}
              <div className='user-info'>
                <img
                  src={b.tutor?.avatar || '/default-avatar.png'}
                  alt='Tutor'
                  className='user-avatar'
                />
                <span>
                  <strong>Tutor:</strong> {b.tutor?.name}{' '}
                  {/* {b.tutor?.lastName} */}
                </span>
              </div>

              <div>
                <Calendar size={14} /> Date:{' '}
                {new Date(b.scheduledDate).toLocaleString()}
              </div>
              <div>Amount: ₦{b.amount?.toLocaleString()}</div>
            </div>

            <div className='actions'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setSelectedBooking(b);
                  setShowModal(true);
                }}
              >
                <CheckCircle size={16} />
                Approve & Send Meeting Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-card'>
            <h3>Approve Booking</h3>
            <p>Send a meeting link to confirm this session.</p>
            <div className='input-group'>
              <Link size={16} />
              <input
                type='text'
                placeholder='https://meet.google.com/xyz'
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div className='modal-actions'>
              <button className='btn btn-success' onClick={handleApprove}>
                Approve & Notify
              </button>
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setShowModal(false);
                  setMeetingLink('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bookings-page {
          padding: 24px;
        }
        h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .booking-card {
          padding: 24px;
          border-radius: 16px;
          background: white;
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
        }
        .booking-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .booking-info {
          margin-bottom: 16px;
          color: #4b5563;
          line-height: 1.6;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #ddd;
        }
        .actions {
          text-align: right;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .btn-primary {
          background: #ff6b35;
          color: white;
        }
        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-secondary {
          background: #9ca3af;
          color: white;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
        }
        .input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 12px;
        }
        .input-group input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default AdminBookings;
