// Y Combinator Demo: Use Mock API Service
import MockApiService from './mockApiService';

// For YC Demo, we use mock data instead of real API calls
const DEMO_MODE = true;

// Helper function for API requests (fallback to real API if needed)
const request = async (endpoint: string, options: RequestInit = {}) => {
  if (DEMO_MODE) {
    // Use mock data for demo
    console.log('🎯 YC Demo: Using mock data for', endpoint);
    return MockApiService.healthCheck();
  }

  const API_BASE_URL = 'http://localhost:4000';
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const apiService = {
  // Dashboard - YC Demo Mock
  getDashboardStats: (timeRange?: string) => MockApiService.getDashboardStats(timeRange),
  getRecentActivity: () => MockApiService.getActivities(),
  getRecentEvents: () => MockApiService.getEvents(),

  // Chatbot - YC Demo Mock
  getChatbots: () => MockApiService.getChatbots(),
  createChatbot: (data: any) => MockApiService.createChatbot(data),
  updateChatbot: (id: string, data: any) => MockApiService.updateChatbot(id, data),
  deleteChatbot: (id: string) => MockApiService.deleteChatbot(id),

  // Workflows - YC Demo Mock
  getWorkflows: () => MockApiService.getWorkflows(),
  createWorkflow: (data: any) => MockApiService.createWorkflow(data),
  updateWorkflow: (id: string, data: any) => MockApiService.updateWorkflow(id, data),
  deleteWorkflow: (id: string) => MockApiService.deleteWorkflow(id),

  // Analytics - YC Demo Mock
  getAnalyticsData: (timeRange: string = '7d') => MockApiService.getAnalyticsData(timeRange),
  getAnalyticsMetrics: () => MockApiService.getAnalytics(),
  getAnalyticsCharts: () => MockApiService.getAnalytics(),

  // Revenue Optimization - YC Demo Mock
  getRevenueData: () => MockApiService.getAnalytics(),
  getRevenueMetrics: () => MockApiService.getAnalytics(),
  getRevenueCharts: () => MockApiService.getAnalytics(),

  // User Management - YC Demo Mock
  getUsers: () => MockApiService.getUser(),
  getUser: (id: string) => MockApiService.getUser(),
  createUser: (data: any) => MockApiService.register(data),
  updateUser: (id: string, data: any) => MockApiService.getUser(),
  deleteUser: (id: string) => MockApiService.getUser(),

  // Audit Log
  getAuditLogs: () => request('/api/audit-logs'),
  getAuditLog: (id: string) => request(`/api/audit-logs/${id}`),
  exportAuditLogs: (format: string = 'csv') => request(`/api/audit-logs/export?format=${format}`),

  // Notifications
  getNotifications: () => request('/api/notifications'),
  getNotification: (id: string) => request(`/api/notifications/${id}`),
  createNotification: (data: any) => request('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateNotification: (id: string, data: any) => request(`/api/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteNotification: (id: string) => request(`/api/notifications/${id}`, {
    method: 'DELETE',
  }),
  sendNotification: (id: string) => request(`/api/notifications/${id}/send`, {
    method: 'POST',
  }),

  // FAQ Management - YC Demo Mock
  getFaqs: () => MockApiService.getFAQs(),
  getFaq: (id: string) => MockApiService.getFAQs(),
  createFaq: (data: any) => MockApiService.createFAQ(data),
  updateFaq: (id: string, data: any) => MockApiService.updateFAQ(id, data),
  deleteFaq: (id: string) => MockApiService.deleteFAQ(id),

  // Payments - YC Demo Mock
  getPayments: () => MockApiService.getPayments(),
  getPayment: (id: string) => MockApiService.getPayments(),
  createPayment: (data: any) => MockApiService.createPaymentIntent(data.amount),
  updatePayment: (id: string, data: any) => MockApiService.getPayments(),
  deletePayment: (id: string) => MockApiService.getPayments(),

  // Support
  getSupportTickets: () => request('/api/support/tickets'),
  getSupportTicket: (id: string) => request(`/api/support/tickets/${id}`),
  createSupportTicket: (data: any) => request('/api/support/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSupportTicket: (id: string, data: any) => request(`/api/support/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSupportTicket: (id: string) => request(`/api/support/tickets/${id}`, {
    method: 'DELETE',
  }),

  // Settings - YC Demo Mock
  getSettings: () => MockApiService.getSettings(),
  updateSettings: (data: any) => MockApiService.getSettings(),

  // Authentication
  login: (credentials: any) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => request('/api/auth/logout', {
    method: 'POST',
  }),
  refreshToken: () => request('/api/auth/refresh', {
    method: 'POST',
  }),

  // Security
  enableMFA: (data: any) => request('/api/security/mfa/enable', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  disableMFA: () => request('/api/security/mfa/disable', {
    method: 'POST',
  }),
  verifyMFA: (data: any) => request('/api/security/mfa/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Performance
  getPerformanceMetrics: () => request('/api/performance/metrics'),
  getPerformanceCharts: () => request('/api/performance/charts'),
  getPerformanceData: (params: any) => request(`/api/performance/data?${new URLSearchParams(params)}`),

  // Health Check
  healthCheck: () => request('/health'),

  // File Upload
  uploadFile: (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return request('/api/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  // Export Data
  exportData: (type: string, format: string = 'csv') => 
    request(`/api/export/${type}?format=${format}`),

  // Import Data
  importData: (type: string, data: any) => request(`/api/import/${type}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Webhooks
  getWebhooks: () => request('/api/webhooks'),
  createWebhook: (data: any) => request('/api/webhooks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateWebhook: (id: string, data: any) => request(`/api/webhooks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteWebhook: (id: string) => request(`/api/webhooks/${id}`, {
    method: 'DELETE',
  }),

  // API Keys
  getApiKeys: () => request('/api/api-keys'),
  createApiKey: (data: any) => request('/api/api-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  revokeApiKey: (id: string) => request(`/api/api-keys/${id}/revoke`, {
    method: 'POST',
  }),

  // Integrations
  getIntegrations: () => request('/api/integrations'),
  connectIntegration: (type: string, data: any) => request(`/api/integrations/${type}/connect`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  disconnectIntegration: (type: string) => request(`/api/integrations/${type}/disconnect`, {
    method: 'POST',
  }),

  // Reports
  getReports: () => request('/api/reports'),
  generateReport: (type: string, params: any) => request(`/api/reports/${type}`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),
  downloadReport: (id: string) => request(`/api/reports/${id}/download`),

  // Backup & Restore
  createBackup: () => request('/api/backup', {
    method: 'POST',
  }),
  restoreBackup: (backupId: string) => request(`/api/backup/${backupId}/restore`, {
    method: 'POST',
  }),
  getBackups: () => request('/api/backup'),

  // Monitoring
  getSystemStatus: () => request('/api/monitoring/status'),
  getSystemMetrics: () => request('/api/monitoring/metrics'),
  getAlerts: () => request('/api/monitoring/alerts'),
  acknowledgeAlert: (id: string) => request(`/api/monitoring/alerts/${id}/acknowledge`, {
    method: 'POST',
  }),

  // Compliance
  getComplianceReport: () => request('/api/compliance/report'),
  getComplianceStatus: () => request('/api/compliance/status'),
  getComplianceData: () => request('/api/compliance/data'),
  updateComplianceSettings: (data: any) => request('/api/compliance/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Security
  getSecurityData: (params?: any) => request(`/api/security/data${params ? `?${new URLSearchParams(params)}` : ''}`),
  blockIP: (ip: string) => request('/api/security/block-ip', {
    method: 'POST',
    body: JSON.stringify({ ip }),
  }),

  // Localization
  getLanguages: () => request('/api/localization/languages'),
  getTranslations: (language: string) => request(`/api/localization/translations/${language}`),
  updateTranslations: (language: string, data: any) => request(`/api/localization/translations/${language}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Search
  search: (query: string, type: string = 'all') => 
    request(`/api/search?q=${encodeURIComponent(query)}&type=${type}`),

  // Suggestions
  getSuggestions: (type: string) => request(`/api/suggestions/${type}`),
};

export default apiService; 