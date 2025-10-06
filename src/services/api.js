const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
