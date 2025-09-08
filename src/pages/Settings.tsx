import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome - Windows 10', lastAccess: '2 hours ago', isActive: true },
    { id: 2, device: 'Safari - iPhone', lastAccess: '1 day ago', isActive: false }
  ]);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', number: '****1234', expiry: '12/25', isDefault: true }
  ]);
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Enterprise',
    price: 999,
    features: ['Unlimited Chatbots', 'Unlimited Messages', '24/7 Support', 'Enterprise Analytics', 'Full API Access', 'Custom Integrations']
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSettings();
      setSettings(response.data);
      setMfaEnabled(response.data?.mfa?.enabled || false);
      
      // Initialize profile data
      setProfileData({
        firstName: response.data?.profile?.firstName || 'Y Combinator',
        lastName: response.data?.profile?.lastName || 'Accelerator',
        email: response.data?.profile?.email || 'yc@accelerator.com',
        phone: response.data?.profile?.phone || '+1 (555) 123-4567'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Save profile changes
  const saveProfileChanges = () => {
    // Simulate API call
    setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        profile: { ...prev?.profile, ...profileData }
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
              <h3 class="text-lg font-semibold text-gray-900">Profile Updated!</h3>
              <p class="text-gray-600">Your profile information has been saved successfully.</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      setTimeout(() => successModal.remove(), 3000);
    }, 1000);
  };

  // Handle notification changes
  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  // Handle MFA toggle
  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled);
    setShowMfaSetup(!mfaEnabled);
  };

  // Handle MFA verification
  const handleMfaVerification = () => {
    setMfaEnabled(true);
    setShowMfaSetup(false);
    
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
            <h3 class="text-lg font-semibold text-gray-900">MFA Activated!</h3>
            <p class="text-gray-600">Multi-factor authentication has been successfully enabled.</p>
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

  // Handle password change
  const handlePasswordChange = () => {
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
            <h3 class="text-lg font-semibold text-gray-900">Password Changed!</h3>
            <p class="text-gray-600">Your password has been updated successfully.</p>
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

  // Handle disconnect all sessions
  const handleDisconnectAllSessions = () => {
    setSessions([]);
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
            <h3 class="text-lg font-semibold text-gray-900">Sessions Disconnected!</h3>
            <p class="text-gray-600">All active sessions have been terminated successfully.</p>
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

  // Handle billing actions
  const handleBillingAction = (action: string) => {
    if (action === 'download') {
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      successModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Download Started!</h3>
              <p class="text-gray-600">All invoices are being prepared for download...</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      setTimeout(() => successModal.remove(), 3000);
    } else if (action === 'plan change') {
      setShowPlanModal(true);
    } else if (action === 'add payment method') {
      setShowPaymentModal(true);
    } else {
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
              <h3 class="text-lg font-semibold text-gray-900">Action Completed!</h3>
              <p class="text-gray-600">Your billing ${action} has been processed successfully.</p>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      setTimeout(() => successModal.remove(), 3000);
    }
  };

  // Handle plan selection
  const handlePlanSelection = (plan: string) => {
    // Update current plan based on selection
    const planData = {
      'Starter': {
        name: 'Starter',
        price: 199,
        features: ['10 Active Chatbots', '5,000 Messages/Month', 'Basic Support', 'Standard Analytics']
      },
      'Professional': {
        name: 'Professional',
        price: 499,
        features: ['50 Active Chatbots', '25,000 Messages/Month', 'Priority Support', 'Advanced Analytics', 'API Access']
      },
      'Enterprise': {
        name: 'Enterprise',
        price: 999,
        features: ['Unlimited Chatbots', 'Unlimited Messages', '24/7 Support', 'Enterprise Analytics', 'Full API Access', 'Custom Integrations']
      }
    };
    
    setCurrentPlan(planData[plan as keyof typeof planData]);
    setShowPlanModal(false);
    
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
            <h3 class="text-lg font-semibold text-gray-900">Plan Changed!</h3>
            <p class="text-gray-600">Successfully switched to ${plan} plan for $${planData[plan as keyof typeof planData].price}/month.</p>
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

  // Handle payment method addition
  const handlePaymentMethodAdd = () => {
    // Add new payment method to the list
    const newPaymentMethod = {
      id: paymentMethods.length + 1,
      type: 'Mastercard',
      number: '****5678',
      expiry: '06/26',
      isDefault: false
    };
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    
    setShowPaymentModal(false);
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
            <h3 class="text-lg font-semibold text-gray-900">Payment Method Added!</h3>
            <p class="text-gray-600">New payment method has been added successfully.</p>
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

  // Handle session disconnect
  const handleSessionDisconnect = (sessionId: number) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  // Handle payment method removal
  const handlePaymentMethodRemove = (methodId: number) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    
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
            <h3 class="text-lg font-semibold text-gray-900">Payment Method Removed!</h3>
            <p class="text-gray-600">Payment method has been successfully removed.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">⚙️ Advanced Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your account, security and preferences</p>
          <div className="mt-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-xs sm:text-sm inline-block">
            🚀 Y Combinator Demo Account
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 sm:mb-8 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
              {[
                { id: 'profile', name: 'Profile', icon: '👤' },
                { id: 'security', name: 'Security', icon: '🔒' },
                { id: 'notifications', name: 'Notifications', icon: '🔔' },
                { id: 'billing', name: 'Billing', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.charAt(0)}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === 'profile' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">👤 User Profile</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>


                <button 
                  onClick={saveProfileChanges}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-6 py-2 rounded-lg"
                >
                  💾 Save Changes
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">🔒 Advanced Security</h3>
                
                {/* MFA Section */}
                <div className="bg-blue-50 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">🔐 Multi-Factor Authentication (MFA)</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mfaEnabled ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={handleMfaToggle}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ${
                          mfaEnabled 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                      >
                        {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
                      </button>
                    </div>
                  </div>

                  {showMfaSetup && !mfaEnabled && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-900 mb-3">📱 Configure MFA with Google Authenticator</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">📱</span>
                          </div>
                          <p className="text-sm text-gray-600">Scan the QR code with Google Authenticator</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Verification Code
                            </label>
                            <input
                              type="text"
                              placeholder="000000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <button 
                            onClick={handleMfaVerification}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white py-2 rounded-lg"
                          >
                            ✅ Verify and Activate
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Section */}
                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">🔑 Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 12 characters, uppercase, lowercase, numbers and symbols
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button 
                      onClick={handlePasswordChange}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-6 py-2 rounded-lg"
                    >
                      🔄 Change Password
                    </button>
                  </div>
                </div>

                {/* Session Management */}
                <div className="bg-yellow-50 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-4">🖥️ Session Management</h4>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                          <p className="font-medium text-gray-900">{session.device}</p>
                          <p className="text-sm text-gray-600">Last access: {session.lastAccess}</p>
                      </div>
                        {session.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                      </span>
                        ) : (
                          <button 
                            onClick={() => handleSessionDisconnect(session.id)}
                            className="text-red-600 hover:text-red-800 text-sm transition-all duration-300 hover:scale-105"
                          >
                            Disconnect
                      </button>
                        )}
                    </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleDisconnectAllSessions}
                    className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-4 py-2 rounded-lg"
                  >
                    🚪 Disconnect All Sessions
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">🔔 Notification Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive real-time push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.push}
                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.sms}
                        onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-4">📧 Notification Templates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Security Notifications</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Always Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">System Notifications</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notifications.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notifications.email ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Push Notifications</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notifications.push ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notifications.push ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SMS Notifications</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notifications.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notifications.sms ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">💳 Billing and Payments</h3>
                
                {/* Current Plan */}
                <div className="bg-green-50 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Current Plan: {currentPlan.name}</h4>
                      <p className="text-sm text-gray-600">${currentPlan.price}/month - Next renewal: January 15, 2025</p>
                    </div>
                    <button 
                      onClick={() => handleBillingAction('plan change')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white px-4 py-2 rounded-lg"
                    >
                      🔄 Change Plan
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${currentPlan.price}</div>
                      <div className="text-sm text-gray-600">Monthly Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentPlan.name === 'Starter' ? '10' : currentPlan.name === 'Professional' ? '50' : 'Unlimited'}
                      </div>
                      <div className="text-sm text-gray-600">Active Chatbots</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {currentPlan.name === 'Starter' ? '5K' : currentPlan.name === 'Professional' ? '25K' : 'Unlimited'}
                      </div>
                      <div className="text-sm text-gray-600">Messages/Month</div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white border rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">💳 Payment Methods</h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600">💳</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{method.type} {method.number}</p>
                            <p className="text-sm text-gray-600">Expires: {method.expiry}</p>
                        </div>
                      </div>
                        {method.isDefault ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Default
                      </span>
                        ) : (
                          <button 
                            onClick={() => handlePaymentMethodRemove(method.id)}
                            className="text-red-600 hover:text-red-800 text-sm transition-all duration-300 hover:scale-105"
                          >
                            Remove
                          </button>
                        )}
                    </div>
                    ))}
                    <button 
                      onClick={() => handleBillingAction('add payment method')}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                    >
                      ➕ Add Payment Method
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="bg-white border rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">📄 Billing History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Invoice #INV-2024-001</p>
                        <p className="text-sm text-gray-600">December 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$999.00</p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Invoice #INV-2023-012</p>
                        <p className="text-sm text-gray-600">November 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$999.00</p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBillingAction('download')}
                    className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 text-white py-2 rounded-lg"
                  >
                    📥 Download All Invoices
                  </button>
                </div>
              </div>
            )}

                    </div>
                  </div>

        {/* Plan Selection Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Choose Your Plan</h3>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                  >
                    ✕
                  </button>
                          </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-2">Starter</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">$199/month</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 10 Active Chatbots</li>
                      <li>• 5,000 Messages/Month</li>
                      <li>• Basic Support</li>
                      <li>• Standard Analytics</li>
                    </ul>
                    <button
                      onClick={() => handlePlanSelection('Starter')}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      Select Starter
                        </button>
                      </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-gray-900 mb-2">Professional</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">$499/month</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 50 Active Chatbots</li>
                      <li>• 25,000 Messages/Month</li>
                      <li>• Priority Support</li>
                      <li>• Advanced Analytics</li>
                      <li>• API Access</li>
                    </ul>
                    <button
                      onClick={() => handlePlanSelection('Professional')}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      Select Professional
                        </button>
                      </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h4 className="font-medium text-gray-900 mb-2">Enterprise</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">$999/month</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Unlimited Chatbots</li>
                      <li>• Unlimited Messages</li>
                      <li>• 24/7 Support</li>
                      <li>• Enterprise Analytics</li>
                      <li>• Full API Access</li>
                      <li>• Custom Integrations</li>
                    </ul>
                    <button
                      onClick={() => handlePlanSelection('Enterprise')}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      Select Enterprise
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Payment Method</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                  >
                    ✕
                  </button>
                </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                      </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                      </div>
                  
                  <button
                    onClick={handlePaymentMethodAdd}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    Add Payment Method
                  </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default Settings; 