// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://edukaster-server-8b325837bf8a.herokuapp.com';

// 'https://edukasterserver.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/me');
  }

  // User management
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getPendingTutors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/pending-tutors?${queryString}`);
  }

  async approveTutor(tutorId) {
    return this.request(`/users/${tutorId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectTutor(tutorId, reason) {
    return this.request(`/users/${tutorId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }
  async updateUserStatus(userId, isActive) {
    return this.request(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
  async fundWallet(userId, amount) {
    return this.request(`/wallet/admin-fund/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async changeSubscription(userId, plan) {
    return this.request(`/admin-subscribe/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ plan }),
    });
  }

  async resetPassword(userId, newPassword) {
    return this.request(`/users/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  }

  async changeRole(userId, role) {
    return this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async updateTutorFee(userId, adminFee) {
    return this.request(`/users/${userId}/fee`, {
      method: 'PUT',
      body: JSON.stringify({ adminFee }),
    });
  }

  // Content management
  async getAllQuestions(params = {}) {
    return this.request(
      `/questions/all-questions?${new URLSearchParams(params)}`
    );
  }

  async approveQuestion(questionId) {
    return this.request(`/questions/${questionId}/approve`, {
      method: 'PATCH',
    });
  }

  async deleteQuestion(questionId) {
    return this.request(`/questions/${questionId}/delete`, {
      method: 'DELETE',
    });
  }

  // Booking management

  async getPendingBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings/pending?${queryString}`);
  }

  async approveBooking(bookingId, meetingLink) {
    return this.request(`/bookings/${bookingId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ meetingLink }),
    });
  }

  // Payment management
  async getPaymentHistory(params = {}) {
    return this.request(`/payments/history?${new URLSearchParams(params)}`);
  }

  async confirmPayment(paymentId) {
    return this.request(`/payments/confirm/${paymentId}`, {
      method: 'POST',
    });
  }

  async releasePayment(paymentId) {
    return this.request(`/payments/release/${paymentId}`, {
      method: 'POST',
    });
  }

  // Dispute management
  async getAllDisputes(params = {}) {
    return this.request(`/disputes/all?${new URLSearchParams(params)}`);
  }

  async assignDispute(disputeId) {
    return this.request(`/disputes/${disputeId}/assign`, {
      method: 'PATCH',
    });
  }

  async addDisputeNote(disputeId, note) {
    return this.request(`/disputes/${disputeId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  async resolveDispute(disputeId, resolution, resolutionType) {
    return this.request(`/disputes/${disputeId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution, resolutionType }),
    });
  }

  // Analytics
  async getDisputeAnalytics(period = 'month') {
    return this.request(`/disputes/analytics?period=${period}`);
  }

  async getPlatformStats() {
    return this.request('/analytics/platform');
  }
}

export const apiService = new ApiService();
