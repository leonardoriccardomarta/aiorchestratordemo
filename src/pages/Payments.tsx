import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate invoices data
  const generateInvoices = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      number: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      customer: `Customer ${i + 1}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      status: ['paid', 'pending', 'overdue'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
  };

  const [invoices, setInvoices] = useState(generateInvoices());
  const [subscriptions, setSubscriptions] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      customer: `Customer ${i + 1}`,
      plan: ['Starter', 'Professional', 'Enterprise'][Math.floor(Math.random() * 3)],
      amount: [29, 49, 99][Math.floor(Math.random() * 3)],
      status: ['active', 'trial', 'past_due'][Math.floor(Math.random() * 3)],
      nextBilling: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    }))
  );
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  // Filter invoices based on status and search term
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = invoiceFilter === 'all' || invoice.status === invoiceFilter;
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Add new invoice function
  const addNewInvoice = () => {
    const newInvoice = {
      id: invoices.length + 1,
      number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: `Customer ${invoices.length + 1}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      status: 'pending',
      date: new Date()
    };
    setInvoices(prev => [newInvoice, ...prev]);
    
    // Show success notification
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    successModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Invoice Created!</h3>
            <p class="text-gray-600">New invoice ${newInvoice.number} has been added to the list.</p>
          </div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          Continue
        </button>
      </div>
    `;
    document.body.appendChild(successModal);
    setTimeout(() => successModal.remove(), 3000);
  };

  // Manage subscription function
  const manageSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
  };

  // Apply subscription action
  const applySubscriptionAction = (action: string) => {
    if (!selectedSubscription) return;

    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === selectedSubscription.id) {
        switch (action) {
          case 'pause':
            return { ...sub, status: 'paused' };
          case 'resume':
            return { ...sub, status: 'active' };
          case 'upgrade':
            return { ...sub, plan: 'Enterprise', amount: 99 };
          case 'downgrade':
            return { ...sub, plan: 'Starter', amount: 29 };
          case 'cancel':
            return { ...sub, status: 'cancelled' };
          default:
            return sub;
        }
      }
      return sub;
    }));

    // Show success notification
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    successModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Subscription Updated!</h3>
            <p class="text-gray-600">Action "${action}" has been applied successfully.</p>
          </div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          Continue
        </button>
      </div>
    `;
    document.body.appendChild(successModal);
    setTimeout(() => successModal.remove(), 3000);

    setSelectedSubscription(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💳 Revenue Dashboard</h1>
              <p className="text-gray-600 mt-2">Owner view - Monthly revenue, subscriptions and business metrics</p>
            </div>
            <div className="text-right">
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-bold">
                👑 FOUNDER VIEW
              </div>
              <p className="text-xs text-gray-500 mt-1">Not visible to customers</p>
            </div>
          </div>
        </div>

        {/* Founder Notice */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👑</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-orange-800">FOUNDER DASHBOARD</h3>
              <p className="text-sm text-orange-700">This revenue dashboard is only visible to founders and investors. Customers see a different payment interface.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$24,567</p>
                <p className="text-sm text-green-600">+12% vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-blue-600">+8% vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-yellow-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$3,421</p>
                <p className="text-sm text-yellow-600">12 pending payments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-purple-600">+15% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Business Analytics</h2>
              <div className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                👑 FOUNDER ONLY
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Revenue Overview', icon: '📊' },
                { id: 'invoices', name: 'Customer Payments', icon: '📄' },
                { id: 'subscriptions', name: 'Subscriptions', icon: '🔄' },
                { id: 'refunds', name: 'Refunds', icon: '↩️' },
                { id: 'analytics', name: 'Business Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">📊 Revenue Overview</h3>
                
                {/* Recent Payments */}
                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <h4 className="font-medium text-gray-900 mb-4">💳 Recent Payments</h4>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600">✓</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{payment.description}</p>
                            <p className="text-sm text-gray-600">{payment.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${payment.amount}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">💳 Payment Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Credit Cards</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">PayPal</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bank Transfer</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">📈 Payment Trends</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">January</span>
                        <span className="font-medium">$18,234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">February</span>
                        <span className="font-medium">$21,567</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">March</span>
                        <span className="font-medium">$24,567</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">April</span>
                        <span className="font-medium text-green-600">$28,901</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">📄 Customer Payments</h3>
                
                {/* Invoice Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex space-x-4">
                    <select 
                      value={invoiceFilter}
                      onChange={(e) => setInvoiceFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:scale-105"
                    >
                      <option value="all">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:scale-105"
                    />
                  </div>
                  <button 
                    onClick={addNewInvoice}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-6 py-2 rounded-lg"
                  >
                    ➕ New Invoice
                  </button>
                </div>

                {/* Invoices List */}
                <div className="bg-white border rounded-lg hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Recent Invoices</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">{invoice.number}</p>
                              <p className="text-sm text-gray-600">{invoice.customer}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${invoice.amount}</p>
                              <p className="text-sm text-gray-600">{invoice.date.toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Paid' :
                               invoice.status === 'pending' ? 'Pending' : 'Overdue'}
                            </span>
                            <button
                              onClick={() => setSelectedPayment(invoice)}
                              className="text-blue-600 hover:text-blue-800 text-sm transition-all duration-300 hover:scale-105"
                            >
                              👁️ View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">🔄 Subscription Management</h3>
                
                {/* Subscription Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">✅ Active Subscriptions</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">67</div>
                    <p className="text-sm text-gray-600">+12% vs last month</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">⚠️ Expiring Soon</h4>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
                    <p className="text-sm text-gray-600">In the next 30 days</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">❌ Cancelled</h4>
                    <div className="text-3xl font-bold text-red-600 mb-2">3</div>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </div>

                {/* Subscriptions List */}
                <div className="bg-white border rounded-lg hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Active Subscriptions</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="p-6 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{subscription.customer}</p>
                            <p className="text-sm text-gray-600">Plan: {subscription.plan}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${subscription.amount}/month</p>
                              <p className="text-sm text-gray-600">
                                Next: {subscription.nextBilling.toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                              subscription.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                              subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {subscription.status === 'active' ? 'Active' :
                               subscription.status === 'trial' ? 'Trial' :
                               subscription.status === 'paused' ? 'Paused' :
                               subscription.status === 'cancelled' ? 'Cancelled' : 'Expired'}
                            </span>
                            <button 
                              onClick={() => manageSubscription(subscription)}
                              className="text-blue-600 hover:text-blue-800 text-sm transition-all duration-300 hover:scale-105"
                            >
                              ⚙️ Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refunds' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">↩️ Refund Management</h3>
                
                {/* Refund Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">💰 Total Refunds</h4>
                    <div className="text-3xl font-bold text-red-600 mb-2">$2,847</div>
                    <p className="text-sm text-gray-600">23 refunds this month</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">📊 Refund Rate</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">2.3%</div>
                    <p className="text-sm text-gray-600">-0.5% vs last month</p>
                  </div>
                </div>

                {/* Refunds List */}
                <div className="bg-white border rounded-lg hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Recent Refunds</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {Array.from({ length: 5 }, (_, i) => ({
                      id: i + 1,
                      customer: `Customer ${i + 1}`,
                      amount: Math.floor(Math.random() * 200) + 50,
                      reason: ['Duplicate', 'Error', 'Unsatisfied', 'Cancellation'][Math.floor(Math.random() * 4)],
                      status: ['completed', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
                      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
                    })).map((refund) => (
                      <div key={refund.id} className="p-6 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{refund.customer}</p>
                            <p className="text-sm text-gray-600">Reason: {refund.reason}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${refund.amount}</p>
                              <p className="text-sm text-gray-600">{refund.date.toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              refund.status === 'completed' ? 'bg-green-100 text-green-800' :
                              refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {refund.status === 'completed' ? 'Completed' :
                               refund.status === 'pending' ? 'Pending' : 'Rejected'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">📈 Business Analytics</h3>
                
                {/* Payment Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">📊 Payment Distribution</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Credit Cards</span>
                        <span className="font-medium">$16,234</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">PayPal</span>
                        <span className="font-medium">$5,567</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bank Transfer</span>
                        <span className="font-medium">$2,766</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-4">📈 Monthly Trends</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-all duration-300 hover:scale-105">
                        <span className="text-sm text-gray-600">January</span>
                        <span className="font-medium">$18,234</span>
                      </div>
                      <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-all duration-300 hover:scale-105">
                        <span className="text-sm text-gray-600">February</span>
                        <span className="font-medium">$21,567</span>
                      </div>
                      <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-all duration-300 hover:scale-105">
                        <span className="text-sm text-gray-600">March</span>
                        <span className="font-medium">$24,567</span>
                      </div>
                      <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-all duration-300 hover:scale-105">
                        <span className="text-sm text-gray-600">April</span>
                        <span className="font-medium text-green-600">$28,901</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <h4 className="font-medium text-gray-900 mb-4">⚡ Business Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-blue-600 mb-2">98.7%</div>
                      <div className="text-sm text-gray-600">Payment Success</div>
                    </div>
                    <div className="text-center hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-green-600 mb-2">2.3s</div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                    <div className="text-center hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">1.2%</div>
                      <div className="text-sm text-gray-600">Payment Failures</div>
                    </div>
                    <div className="text-center hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-purple-600 mb-2">$156</div>
                      <div className="text-sm text-gray-600">Avg Transaction</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Management Modal */}
        {selectedSubscription && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Subscription</h3>
                  <button
                    onClick={() => setSelectedSubscription(null)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Subscription Details</h4>
                  <p><strong>Customer:</strong> {selectedSubscription.customer}</p>
                  <p><strong>Plan:</strong> {selectedSubscription.plan}</p>
                  <p><strong>Amount:</strong> ${selectedSubscription.amount}/month</p>
                  <p><strong>Status:</strong> {selectedSubscription.status}</p>
                  <p><strong>Next Billing:</strong> {selectedSubscription.nextBilling.toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => applySubscriptionAction('pause')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300 hover:scale-105"
                  >
                    ⏸️ Pause
                  </button>
                  <button
                    onClick={() => applySubscriptionAction('resume')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105"
                  >
                    ▶️ Resume
                  </button>
                  <button
                    onClick={() => applySubscriptionAction('upgrade')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    ⬆️ Upgrade
                  </button>
                  <button
                    onClick={() => applySubscriptionAction('downgrade')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105"
                  >
                    ⬇️ Downgrade
                  </button>
                  <button
                    onClick={() => applySubscriptionAction('cancel')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 col-span-2"
                  >
                    ❌ Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                      <p className="text-gray-900">{selectedPayment.number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer</label>
                      <p className="text-gray-900">{selectedPayment.customer}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-gray-900">${selectedPayment.amount}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <p className="text-gray-900">{selectedPayment.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedPayment(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                        modal.innerHTML = `
                          <div class="bg-white rounded-xl max-w-md w-full p-6">
                            <div class="flex items-center space-x-3 mb-4">
                              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <h3 class="text-lg font-semibold text-gray-900">Sending Invoice</h3>
                                <p class="text-gray-600">${selectedPayment.number}</p>
                              </div>
                            </div>
                            <div class="space-y-3 mb-4">
                              <div class="flex justify-between">
                                <span class="text-sm font-medium text-gray-700">Customer:</span>
                                <span class="text-sm text-gray-900">${selectedPayment.customer}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-sm font-medium text-gray-700">Amount:</span>
                                <span class="text-sm text-gray-900">$${selectedPayment.amount}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-sm font-medium text-gray-700">Status:</span>
                                <span class="text-sm text-gray-900">${selectedPayment.status}</span>
                              </div>
                            </div>
                            <div class="bg-blue-50 rounded-lg p-3 mb-4">
                              <p class="text-sm text-blue-800">Email sent to customer with PDF attachment, payment link, and due date reminder.</p>
                            </div>
                            <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                              Continue
                    </button>
                          </div>
                        `;
                        document.body.appendChild(modal);
                        setTimeout(() => modal.remove(), 5000);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-4 py-2 rounded-lg"
                    >
                      📧 Send Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Notice */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="font-bold">👑 Founder View:</span> Revenue dashboard for business owners and investors
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Customers see a simplified payment interface focused on their subscriptions and billing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments; 