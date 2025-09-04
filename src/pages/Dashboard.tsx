import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ActiveChatbots from '../components/dashboard/ActiveChatbots';
import RecentEvents from '../components/dashboard/RecentEvents';
import { apiService } from '../services/api';
import { CardLoading } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';

interface Event {
  id: string;
  type: 'chatbot_created' | 'workflow_executed' | 'error' | 'warning';
  title: string;
  description: string;
  timestamp: string;
}

interface SystemHealth {
  label: string;
  value: string;
  status: 'green' | 'yellow' | 'red';
}

interface DashboardStats {
  totalMessages: number;
  totalChatbots: number;
  activeUsers: number;
  responseTime: number;
  revenue: number;
  conversions: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsResponse, botsResponse, eventsResponse] = await Promise.all([
          apiService.getDashboardStats(timeRange),
          apiService.getChatbots(),
          apiService.getRecentEvents()
        ]);
        
        // Extract data from mock API responses
        setDashboardStats(statsResponse.data);
        setChatbots(botsResponse.data || []);
        setEvents(eventsResponse.data || []);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Handle loading states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-error-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
             Unable to load dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="primary"
            leftIcon={<Icons.Dashboard />}
             className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
             Retry
          </Button>
        </div>
      </div>
    );
  }

  const statsData = dashboardStats || { 
    totalMessages: 0, 
    totalChatbots: 0, 
    activeUsers: 0, 
    responseTime: 0,
    revenue: 0,
    conversions: 0
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto" data-testid="dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🏠 Dashboard</h1>
        <p className="text-gray-600 mt-2">Complete overview of your AI system performance</p>
        </div>
        
        {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Time Range</h2>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ${
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
        </div>
      </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.totalMessages || 0}
              </p>
              <p className="text-sm text-green-600">+12% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Chatbots</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.totalChatbots || 0}
              </p>
              <p className="text-sm text-green-600">+8% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-purple-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.activeUsers || 0}
              </p>
              <p className="text-sm text-green-600">+15% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-yellow-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.responseTime || 0}ms
              </p>
              <p className="text-sm text-red-600">-5% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(statsData.revenue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600">+23% vs last month</p>
          </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.conversions || 0}%
              </p>
              <p className="text-sm text-green-600">+7% vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Chatbots */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
          <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">🤖 Active Chatbots</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">Chatbots Management</h3>
                        <p class="text-gray-600">Access all chatbot features</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">View all active chatbots</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Create new chatbots</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Manage chatbot settings</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">View chatbot analytics</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Configure integrations</span>
                      </div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-blue-800">This is a demo - in production you would be redirected to the Chatbots page.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }}
              rightIcon={<Icons.ChevronRight />}
               className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              View all
            </Button>
          </div>
          <ActiveChatbots 
            chatbots={chatbots} 
            onChatbotClick={(id) => {
              const chatbot = chatbots.find(c => c.id === id);
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">${chatbot?.name || 'Chatbot'} Details</h3>
                      <p class="text-gray-600">Chatbot information and features</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Name:</span>
                      <span class="text-sm text-gray-900">${chatbot?.name || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Status:</span>
                      <span class="text-sm text-gray-900">${chatbot?.status || 'Active'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Messages Today:</span>
                      <span class="text-sm text-gray-900">${chatbot?.messagesToday || 0}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Total Messages:</span>
                      <span class="text-sm text-gray-900">${chatbot?.totalMessages || 0}</span>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-gray-700"><strong>Description:</strong> ${chatbot?.description || 'No description'}</p>
                  </div>
                  <div class="space-y-2 mb-4">
                    <p class="text-sm font-medium text-gray-700">Features Available:</p>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">View chatbot analytics</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">Edit chatbot settings</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">Test chatbot responses</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-blue-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-blue-800">This is a demo - in production you would be redirected to chatbot details.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
          />
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
          <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">📅 Recent Events</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">Events Log</h3>
                        <p class="text-gray-600">System event management</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">View all system events</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Filter by event type</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Search event history</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Export event logs</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-gray-700">Monitor system activity</span>
                      </div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-purple-800">This is a demo - in production you would be redirected to the Events page.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }}
              rightIcon={<Icons.ChevronRight />}
               className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              View all
            </Button>
          </div>
          <RecentEvents 
            events={events} 
            onEventClick={(event) => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Event Details</h3>
                      <p class="text-gray-600">System event information</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Title:</span>
                      <span class="text-sm text-gray-900">${event.title}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Type:</span>
                      <span class="text-sm text-gray-900">${event.type}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-700">Timestamp:</span>
                      <span class="text-sm text-gray-900">${event.timestamp}</span>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-gray-700"><strong>Description:</strong> ${event.description}</p>
                  </div>
                  <div class="space-y-2 mb-4">
                    <p class="text-sm font-medium text-gray-700">Event Actions:</p>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">View full event details</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">Export event data</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-gray-600">Mark as resolved</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-orange-800">This is a demo - in production you would see detailed event information.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/chatbot')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2 text-xl">🤖</span>
            <span className="font-medium">New Chatbot</span>
          </button>
          <button
            onClick={() => navigate('/workflows')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2 text-xl">⚡</span>
            <span className="font-medium">Create Workflow</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2 text-xl">📊</span>
            <span className="font-medium">View Analytics</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2 text-xl">⚙️</span>
            <span className="font-medium">Settings</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 