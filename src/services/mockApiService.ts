// Mock API Service for Y Combinator Demo
import { MOCK_DATA, MOCK_API_RESPONSES } from '../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  // Dashboard API
  static async getDashboardData() {
    await delay(500); // Simulate network delay
    return {
      success: true,
      data: MOCK_DATA.dashboard
    };
  }

  static async getDashboardStats(timeRange: string = '24h') {
    await delay(300);
    
    const baseData = {
      totalMessages: 1200,
      totalChatbots: 8,
      activeUsers: 120,
      responseTime: 1.2,
      revenue: 2400,
      conversions: 45
    };
    
    let multiplier = 1;
    switch (timeRange) {
      case '24h': multiplier = 1; break;
      case '7d': multiplier = 7; break;
      case '30d': multiplier = 30; break;
      case '90d': multiplier = 90; break;
      default: multiplier = 1;
    }
    
    // Calculate active users based on time range (realistic numbers)
    let activeUsers = baseData.activeUsers;
    switch (timeRange) {
      case '24h': activeUsers = 120 + Math.floor(Math.random() * 30); break; // 120-149 users
      case '7d': activeUsers = 800 + Math.floor(Math.random() * 200); break; // 800-999 users
      case '30d': activeUsers = 3500 + Math.floor(Math.random() * 500); break; // 3500-3999 users
      case '90d': activeUsers = 12000 + Math.floor(Math.random() * 2000); break; // 12000-13999 users
    }
    
    const adjustedData = {
      totalMessages: Math.floor(baseData.totalMessages * multiplier),
      totalChatbots: baseData.totalChatbots,
      activeUsers: activeUsers,
      responseTime: baseData.responseTime,
      revenue: Math.floor(baseData.revenue * multiplier),
      conversions: Math.floor(baseData.conversions * multiplier)
    };
    
    return {
      success: true,
      data: adjustedData
    };
  }

  // Chatbots API
  static async getChatbots() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.chatbots
    };
  }

  static async createChatbot(chatbotData: any) {
    await delay(800);
    const newChatbot = {
      id: Date.now().toString(),
      ...chatbotData,
      messagesToday: 0,
      totalMessages: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.chatbots.push(newChatbot);
    return {
      success: true,
      data: newChatbot
    };
  }

  static async updateChatbot(id: string, updates: any) {
    await delay(400);
    const index = MOCK_DATA.chatbots.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_DATA.chatbots[index] = { ...MOCK_DATA.chatbots[index], ...updates };
      return {
        success: true,
        data: MOCK_DATA.chatbots[index]
      };
    }
    return { success: false, error: 'Chatbot not found' };
  }

  static async deleteChatbot(id: string) {
    await delay(300);
    const index = MOCK_DATA.chatbots.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_DATA.chatbots.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Chatbot not found' };
  }

  // FAQs API
  static async getFAQs() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.faqs
    };
  }

  static async createFAQ(faqData: any) {
    await delay(500);
    const newFAQ = {
      id: Date.now().toString(),
      ...faqData,
      views: 0,
      helpful: 0,
      searches: 0,
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.faqs.push(newFAQ);
    return {
      success: true,
      data: newFAQ
    };
  }

  static async updateFAQ(id: string, updates: any) {
    await delay(400);
    const index = MOCK_DATA.faqs.findIndex(f => f.id === id);
    if (index !== -1) {
      MOCK_DATA.faqs[index] = { ...MOCK_DATA.faqs[index], ...updates };
      return {
        success: true,
        data: MOCK_DATA.faqs[index]
      };
    }
    return { success: false, error: 'FAQ not found' };
  }

  static async deleteFAQ(id: string) {
    await delay(300);
    const index = MOCK_DATA.faqs.findIndex(f => f.id === id);
    if (index !== -1) {
      MOCK_DATA.faqs.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'FAQ not found' };
  }

  // Analytics API
  static async getAnalytics() {
    await delay(600);
    return {
      success: true,
      data: MOCK_DATA.analytics
    };
  }

  static async getAnalyticsData(timeRange: string = '24h') {
    await delay(300);
    
    // Generate realistic data based on time range and 8 users
    const baseData = {
      totalMessages: 1200, // More realistic for 8 users
      activeChatbots: 8,
      responseTime: 1.2,
      revenue: 2400, // More realistic revenue
      conversions: 45 // More realistic conversions
    };
    
    // Adjust data based on time range
    let multiplier = 1;
    switch (timeRange) {
      case '1h':
        multiplier = 0.04; // 1/24 of daily data
        break;
      case '24h':
        multiplier = 1;
        break;
      case '7d':
        multiplier = 7;
        break;
      case '30d':
        multiplier = 30;
        break;
      case '90d':
        multiplier = 90;
        break;
      default:
        multiplier = 1;
    }
    
    // Calculate growth percentages based on time range (realistic SaaS growth)
    let revenueGrowth, conversionGrowth, userGrowth, messageGrowth;
    switch (timeRange) {
      case '1h':
        revenueGrowth = 0.5 + (Math.random() * 1); // 0.5-1.5%
        conversionGrowth = 0.2 + (Math.random() * 0.5); // 0.2-0.7%
        userGrowth = 0.3 + (Math.random() * 0.7); // 0.3-1.0%
        messageGrowth = 1 + (Math.random() * 2); // 1-3%
        break;
      case '24h':
        revenueGrowth = 2 + (Math.random() * 3); // 2-5%
        conversionGrowth = 0.8 + (Math.random() * 1.2); // 0.8-2.0%
        userGrowth = 1.5 + (Math.random() * 2.5); // 1.5-4.0%
        messageGrowth = 3 + (Math.random() * 4); // 3-7%
        break;
      case '7d':
        revenueGrowth = 5 + (Math.random() * 5); // 5-10%
        conversionGrowth = 2 + (Math.random() * 3); // 2-5%
        userGrowth = 4 + (Math.random() * 4); // 4-8%
        messageGrowth = 8 + (Math.random() * 7); // 8-15%
        break;
      case '30d':
        revenueGrowth = 12 + (Math.random() * 8); // 12-20%
        conversionGrowth = 5 + (Math.random() * 5); // 5-10%
        userGrowth = 8 + (Math.random() * 7); // 8-15%
        messageGrowth = 18 + (Math.random() * 12); // 18-30%
        break;
      case '90d':
        revenueGrowth = 25 + (Math.random() * 15); // 25-40%
        conversionGrowth = 12 + (Math.random() * 8); // 12-20%
        userGrowth = 18 + (Math.random() * 12); // 18-30%
        messageGrowth = 35 + (Math.random() * 20); // 35-55%
        break;
      default:
        revenueGrowth = 2 + (Math.random() * 3);
        conversionGrowth = 0.8 + (Math.random() * 1.2);
        userGrowth = 1.5 + (Math.random() * 2.5);
        messageGrowth = 3 + (Math.random() * 4);
    }

    // Calculate active users based on time range (realistic numbers for revenue)
    let activeUsers = baseData.activeChatbots;
    switch (timeRange) {
      case '1h':
        activeUsers = 15 + Math.floor(Math.random() * 10); // 15-24 users
        break;
      case '24h':
        activeUsers = 120 + Math.floor(Math.random() * 30); // 120-149 users
        break;
      case '7d':
        activeUsers = 800 + Math.floor(Math.random() * 200); // 800-999 users
        break;
      case '30d':
        activeUsers = 3500 + Math.floor(Math.random() * 500); // 3500-3999 users
        break;
      case '90d':
        activeUsers = 12000 + Math.floor(Math.random() * 2000); // 12000-13999 users
        break;
    }

    const adjustedData = {
      totalMessages: Math.floor(baseData.totalMessages * multiplier),
      activeChatbots: activeUsers, // Use calculated active users
      responseTime: baseData.responseTime,
      revenue: Math.floor(baseData.revenue * multiplier),
      conversions: Math.floor(baseData.conversions * multiplier),
      // Growth percentages
      revenueGrowth: revenueGrowth,
      conversionGrowth: conversionGrowth,
      userGrowth: userGrowth,
      messageGrowth: messageGrowth,
      // Performance metrics
      avgResponseTime: 1.2 + (Math.random() * 0.5), // 1.2-1.7 seconds
      successRate: 95 + (Math.random() * 4), // 95-99%
      uptime: 99.5 + (Math.random() * 0.4), // 99.5-99.9%
      userSatisfaction: 4.6 + (Math.random() * 0.3), // 4.6-4.9
      errorRate: 0.5 + (Math.random() * 0.3), // 0.5-0.8%
      // Revenue Analysis (realistic for user count)
      monthlyRevenue: Math.floor(baseData.revenue * multiplier * 30), // Monthly projection
      averageOrderValue: 15 + (Math.random() * 10), // $15-25 (realistic for SaaS)
      churnRate: 3 + (Math.random() * 2), // 3-5% (realistic SaaS churn)
      // User Behavior (realistic for user count)
      totalSessions: Math.floor(activeUsers * (2 + Math.random() * 3)), // 2-5 sessions per user
      averageSessionDuration: 8 + (Math.random() * 4), // 8-12 minutes (realistic)
      pagesPerSession: 4 + (Math.random() * 2), // 4-6 pages (realistic)
      bounceRate: 35 + (Math.random() * 10) // 35-45% (realistic SaaS)
    };
    
    return {
      success: true,
      data: adjustedData
    };
  }

  // User API
  static async getUser() {
    await delay(200);
    return {
      success: true,
      data: MOCK_DATA.user
    };
  }

  // Activities API
  static async getActivities() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.activities
    };
  }

  // Events API (alias for activities)
  static async getEvents() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.activities
    };
  }

  // Workflows API
  static async getWorkflows() {
    await delay(400);
    return {
      success: true,
      data: MOCK_DATA.workflows
    };
  }

  static async createWorkflow(workflowData: any) {
    await delay(600);
    const newWorkflow = {
      id: Date.now().toString(),
      ...workflowData,
      lastRun: null,
      totalRuns: 0,
      successRate: 0
    };
    MOCK_DATA.workflows.push(newWorkflow);
    return {
      success: true,
      data: newWorkflow
    };
  }

  static async updateWorkflow(id: string, updates: any) {
    await delay(400);
    const index = MOCK_DATA.workflows.findIndex(w => w.id === id);
    if (index !== -1) {
      MOCK_DATA.workflows[index] = { ...MOCK_DATA.workflows[index], ...updates };
      return {
        success: true,
        data: MOCK_DATA.workflows[index]
      };
    }
    return { success: false, error: 'Workflow not found' };
  }

  static async deleteWorkflow(id: string) {
    await delay(300);
    const index = MOCK_DATA.workflows.findIndex(w => w.id === id);
    if (index !== -1) {
      MOCK_DATA.workflows.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Workflow not found' };
  }

  // Stripe API
  static async getStripeData() {
    await delay(400);
    return {
      success: true,
      data: MOCK_DATA.stripe
    };
  }

  static async createPaymentIntent(amount: number) {
    await delay(800);
    return {
      success: true,
      data: {
        clientSecret: 'pi_demo_client_secret_123',
        amount: amount,
        currency: 'usd'
      }
    };
  }

  // Shopify API
  static async getShopifyData() {
    await delay(500);
    return {
      success: true,
      data: MOCK_DATA.shopify
    };
  }

  static async getShopifyProducts() {
    await delay(400);
    return {
      success: true,
      data: MOCK_DATA.shopify.products
    };
  }

  static async getShopifyOrders() {
    await delay(500);
    return {
      success: true,
      data: MOCK_DATA.shopify.orders
    };
  }

  // Payments API - YC Demo Mock
  static async getPayments() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.payments
    };
  }

  // Settings API - YC Demo Mock
  static async getSettings() {
    await delay(300);
    return {
      success: true,
      data: MOCK_DATA.settings
    };
  }

  // Auth API (Mock)
  static async login(email: string, password: string) {
    await delay(1000);
    if (email === 'alice@example.com' && password === 'TestPassword123!') {
      return {
        success: true,
        data: {
          token: 'mock_jwt_token_123',
          user: MOCK_DATA.user
        }
      };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  static async register(userData: any) {
    await delay(1200);
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_456',
        user: {
          id: Date.now().toString(),
          ...userData,
          role: 'user',
          createdAt: new Date().toISOString()
        }
      }
    };
  }

  // Health check
  static async healthCheck() {
    await delay(100);
    return {
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'AI Orchestrator Mock API is running for Y Combinator demo'
      }
    };
  }
}

// Export for easy use
export default MockApiService;
