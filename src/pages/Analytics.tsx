import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import FeedbackModal from '../components/FeedbackModal';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [animatedValues, setAnimatedValues] = useState<{[key: string]: number}>({});
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnalyticsData(timeRange);
      console.log('Analytics response:', response);
      const data = response.data; // Extract data from response
      console.log('Analytics data:', data);
      console.log('Total Messages:', data?.totalMessages);
      console.log('Revenue:', data?.revenue);
      console.log('Active Chatbots:', data?.activeChatbots);
      setAnalyticsData(data);
      
      // Animate values
      animateValues(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateValues = (data: any) => {
    const metrics = ['totalMessages', 'activeChatbots', 'responseTime', 'revenue', 'conversions'];
    metrics.forEach(metric => {
      if (data[metric]) {
        let current = 0;
        const target = data[metric];
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedValues(prev => ({ ...prev, [metric]: Math.floor(current) }));
        }, 30);
      }
    });
  };

  const toggleRealTimeUpdates = () => {
    setShowRealTimeUpdates(!showRealTimeUpdates);
    if (!showRealTimeUpdates) {
      // Simulate real-time updates
      const interval = setInterval(() => {
        setAnalyticsData(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
          activeChatbots: prev.activeChatbots + (Math.random() > 0.95 ? 1 : 0),
          revenue: prev.revenue + Math.floor(Math.random() * 50),
          conversions: prev.conversions + (Math.random() > 0.9 ? 1 : 0),
          // Update performance metrics
          avgResponseTime: 1.2 + (Math.random() * 0.5),
          successRate: 95 + (Math.random() * 4),
          uptime: 99.5 + (Math.random() * 0.4),
          userSatisfaction: 4.6 + (Math.random() * 0.3),
          errorRate: 0.5 + (Math.random() * 0.3),
          // Update revenue and user behavior (realistic changes)
          monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 200),
          averageOrderValue: 15 + (Math.random() * 10),
          churnRate: 3 + (Math.random() * 2),
          totalSessions: prev.totalSessions + Math.floor(Math.random() * 5),
          averageSessionDuration: 8 + (Math.random() * 4),
          pagesPerSession: 4 + (Math.random() * 2),
          bounceRate: 35 + (Math.random() * 10),
          // Update growth percentages slightly (realistic small changes)
          revenueGrowth: prev.revenueGrowth + (Math.random() * 0.2 - 0.1), // ±0.1%
          conversionGrowth: prev.conversionGrowth + (Math.random() * 0.1 - 0.05), // ±0.05%
          userGrowth: prev.userGrowth + (Math.random() * 0.1 - 0.05), // ±0.05%
          messageGrowth: prev.messageGrowth + (Math.random() * 0.2 - 0.1) // ±0.1%
        }));
      }, 2000);
      
      setTimeout(() => clearInterval(interval), 30000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📊 AI Performance Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Track and optimize your AI workflows with intelligent insights - smarter than traditional analytics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              📈 Real-time Tracking
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
              🧠 AI Insights
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              ⚡ Performance Optimization
            </span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Time Range</h2>
            <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    timeRange === range
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === '24h' ? '24 Hours' : 
                   range === '7d' ? '7 Days' :
                   range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
              </div>
              <button
                onClick={toggleRealTimeUpdates}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  showRealTimeUpdates
                    ? 'bg-green-600 text-white shadow-lg animate-pulse'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showRealTimeUpdates ? '🟢 Live Updates' : '⚡ Enable Live'}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${animatedValues.revenue || analyticsData?.revenue || 0}
                </p>
                <p className="text-sm text-green-600">+{analyticsData?.revenueGrowth ? analyticsData.revenueGrowth.toFixed(1) : 0}% vs previous period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animatedValues.conversions || analyticsData?.conversions || 0}
                </p>
                <p className="text-sm text-blue-600">+{analyticsData?.conversionGrowth ? analyticsData.conversionGrowth.toFixed(1) : 0}% vs previous period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animatedValues.activeChatbots || analyticsData?.activeChatbots || 0}
                </p>
                <p className="text-sm text-purple-600">+{analyticsData?.userGrowth ? analyticsData.userGrowth.toFixed(1) : 0}% vs previous period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {animatedValues.totalMessages || analyticsData?.totalMessages || 0}
                </p>
                <p className="text-sm text-yellow-600">+{analyticsData?.messageGrowth ? analyticsData.messageGrowth.toFixed(1) : 0}% vs previous period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Analytics */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Revenue Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-sm font-medium">${analyticsData?.monthlyRevenue || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium">${analyticsData?.averageOrderValue ? analyticsData.averageOrderValue.toFixed(0) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className="text-sm font-medium text-green-600">+{analyticsData?.revenueGrowth ? analyticsData.revenueGrowth.toFixed(1) : 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Churn Rate</span>
                <span className="text-sm font-medium text-red-600">{analyticsData?.churnRate ? analyticsData.churnRate.toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          {/* User Behavior */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 User Behavior</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-sm font-medium">{analyticsData?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Session Duration</span>
                <span className="text-sm font-medium">{analyticsData?.averageSessionDuration ? analyticsData.averageSessionDuration.toFixed(1) : 0}m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pages per Session</span>
                <span className="text-sm font-medium">{analyticsData?.pagesPerSession ? analyticsData.pagesPerSession.toFixed(1) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-medium">{analyticsData?.bounceRate ? analyticsData.bounceRate.toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analyticsData?.avgResponseTime ? (analyticsData.avgResponseTime * 1000).toFixed(0) : 0}ms
              </div>
              <div className="text-sm text-gray-600">Average Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analyticsData?.uptime ? analyticsData.uptime.toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData?.successRate ? analyticsData.successRate.toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Predictive Analytics */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔮 Predictive Analytics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Revenue Forecast</span>
                  <span className="text-sm text-blue-600">+18%</span>
                </div>
                <p className="text-sm text-gray-600">Based on current trends, revenue should grow by 18% next month</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Churn Risk</span>
                  <span className="text-sm text-green-600">Low</span>
                </div>
                <p className="text-sm text-gray-600">Churn risk is low for the next 30 days</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Predictive LTV</span>
                  <span className="text-sm text-yellow-600">$2,450</span>
                </div>
                <p className="text-sm text-gray-600">Average customer lifetime value</p>
              </div>
            </div>
          </div>

          {/* A/B Testing Results */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 A/B Testing</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-sm font-medium text-gray-900">Homepage Test</h4>
                <p className="text-sm text-gray-600 mb-2">Variant A vs Variant B</p>
                <div className="flex justify-between text-sm">
                  <span>Variant A: 12.3% conversion</span>
                  <span className="text-green-600">+15%</span>
                </div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-sm font-medium text-gray-900">Test CTA</h4>
                <p className="text-sm text-gray-600 mb-2">"Start Now" vs "Try Free"</p>
                <div className="flex justify-between text-sm">
                  <span>Try Free: 8.7% conversion</span>
                  <span className="text-green-600">+23%</span>
                </div>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-sm font-medium text-gray-900">Price Test</h4>
                <p className="text-sm text-gray-600 mb-2">$29 vs $39</p>
                <div className="flex justify-between text-sm">
                  <span>$39: 6.2% conversion</span>
                  <span className="text-green-600">+34%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Generating Report</h3>
                      <p class="text-gray-600">Comprehensive analytics report</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Performance metrics</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">User engagement data</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Revenue analytics</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Growth trends</span>
                    </div>
                  </div>
                  <div class="bg-blue-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-blue-800">This is a demo - in production you would see detailed event information.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            📊 Generate Report
          </button>
          <button 
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                  <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">📊 Analytics Tutorial</h2>
                    <p class="text-gray-600">Learn how to track and optimize your AI performance</p>
                  </div>
                  
                  <div class="space-y-6 mb-8">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">📈</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 1: Track Performance</h3>
                        <p class="text-gray-600 text-sm">Monitor chatbot interactions, workflow efficiency, and user engagement in real-time.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">🔍</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 2: Analyze Data</h3>
                        <p class="text-gray-600 text-sm">Use AI-powered insights to understand patterns and identify optimization opportunities.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">⚡</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 3: Optimize & Scale</h3>
                        <p class="text-gray-600 text-sm">Make data-driven decisions to improve performance and scale your AI operations.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex space-x-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                      Start Analyzing
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                      Close
                    </button>
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
          >
            🚀 Take a Tour
          </button>
          
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2">💬</span>
            <span className="text-sm sm:text-base">Give Feedback</span>
          </button>
          <button 
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Exporting Data</h3>
                      <p class="text-gray-600">Analytics data export</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">CSV format</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">All time ranges</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Raw data + processed metrics</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Charts and visualizations</span>
                    </div>
                  </div>
                  <div class="bg-green-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-green-800">This is a demo - in production you would see detailed event information.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
          >
            📧 Export Data
          </button>
          <button 
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 7m-5 5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Configuring Alerts</h3>
                      <p class="text-gray-600">Smart alert system</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Performance drops</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">Revenue milestones</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">User engagement spikes</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span class="text-sm text-gray-700">System anomalies</span>
                    </div>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-purple-800">This is a demo - in production you would see detailed event information.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                    Continue
          </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105"
          >
            🔧 Configure Alerts
          </button>
        </div>
      </div>


      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => setFeedbackSubmitted(true)}
        />
      )}

      {/* Success Message */}
      {feedbackSubmitted && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-50 max-w-sm">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3">✅</div>
            <div>
              <h4 className="font-semibold text-green-800">Thanks for your feedback!</h4>
              <p className="text-green-700 text-sm">Email client opened! Send the email to complete your feedback submission.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics; 