import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ChatbotCustomization from '../components/chatbot/ChatbotCustomization';

const Chatbot: React.FC = () => {
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatbot, setSelectedChatbot] = useState<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    welcomeMessage: '',
    responseTemplate: '',
    responseTime: 500,
    maxMessages: 50
  });

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      setLoading(true);
      const response = await apiService.getChatbots();
      // Extract data from mock API response
      setChatbots(response.data || []);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      setChatbots([]);
    } finally {
      setLoading(false);
    }
  };



  const handleUpdateChatbot = async (id: string, updates: any) => {
    try {
      const response = await apiService.updateChatbot(id, updates);
      if (response.success) {
        setChatbots(chatbots.map(c => c.id === id ? response.data : c));
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Chatbot Updated!</h3>
                <p class="text-gray-600">Changes saved successfully</p>
              </div>
            </div>
            <div class="bg-green-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-green-800">Your chatbot has been updated with the latest changes.</p>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 3000);
      }
    } catch (error) {
      console.error('Error updating chatbot:', error);
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Update Failed</h3>
              <p class="text-gray-600">Unable to save changes</p>
            </div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">There was an error updating your chatbot. Please try again.</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => modal.remove(), 3000);
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    if (confirm('Are you sure you want to delete this chatbot?')) {
      try {
        const response = await apiService.deleteChatbot(id);
        if (response.success) {
          setChatbots(chatbots.filter(c => c.id !== id));
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
          modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Chatbot Deleted!</h3>
                  <p class="text-gray-600">Removed successfully</p>
                </div>
              </div>
              <div class="bg-green-50 rounded-lg p-3 mb-4">
                <p class="text-sm text-green-800">The chatbot has been permanently deleted from your account.</p>
              </div>
              <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Continue
              </button>
            </div>
          `;
          document.body.appendChild(modal);
          setTimeout(() => modal.remove(), 3000);
        }
      } catch (error) {
        console.error('Error deleting chatbot:', error);
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Delete Failed</h3>
                <p class="text-gray-600">Unable to remove chatbot</p>
              </div>
            </div>
            <div class="bg-red-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-red-800">There was an error deleting your chatbot. Please try again.</p>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 3000);
      }
    }
  };

  const handleEditChatbot = (chatbot: any) => {
    setSelectedChatbot(chatbot);
    setEditFormData({
      name: chatbot.name,
      description: chatbot.description,
      status: chatbot.isActive ? 'active' : 'inactive',
      welcomeMessage: 'Hi! How can I help you today?',
      responseTemplate: 'I understand your question about {topic}. Let me help you with that...',
      responseTime: chatbot.metrics?.avgResponseTime || 500,
      maxMessages: 50
    });
    setShowEditModal(true);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chatbots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
                 <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900">🤖 Chatbot Management</h1>
           <p className="text-gray-600 mt-2">Create and manage your advanced AI assistants</p>
         </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                                 <p className="text-sm font-medium text-gray-600">Total Chatbots</p>
                <p className="text-2xl font-bold text-gray-900">{chatbots.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                                 <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {chatbots.filter(bot => bot.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-4">
                                 <p className="text-sm font-medium text-gray-600">Messages Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {chatbots.reduce((sum, bot) => sum + (bot.metrics?.todayMessages || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                                 <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center mb-6">
          <button 
            onClick={() => setShowCustomization(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            <span className="mr-2">🎨</span>
            Create & Customize Chatbot
          </button>
        </div>

        {/* Chatbots List */}
        <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Chatbots</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {chatbots.map((chatbot) => (
              <div key={chatbot.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{chatbot.name}</h3>
                      <p className="text-gray-600">{chatbot.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chatbot.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {chatbot.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          💬 {chatbot.metrics?.totalMessages || 0} messages
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          ⚡ {chatbot.metrics?.avgResponseTime ? `${chatbot.metrics.avgResponseTime}ms` : '0ms'}
                        </span>
                        {chatbot.isActive && (
                          <>
                            <span className="text-sm text-gray-600 font-medium">
                              ⭐ {chatbot.metrics?.satisfaction || 0}/5
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              📊 {chatbot.metrics?.uptime || 0}%
                            </span>
                          </>
                        )}
                        {!chatbot.isActive && (
                          <span className="text-xs text-gray-400 italic">
                            (Inactive - No activity)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditChatbot(chatbot)}
                      className="text-blue-600 hover:text-blue-800 transition-all duration-300 hover:scale-105"
                    >
                      ✏️ Edit
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedChatbot(chatbot);
                        setShowCustomization(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 transition-all duration-300 hover:scale-105"
                    >
                      🎨 Customize
                    </button>
                    <button 
                      onClick={() => handleDeleteChatbot(chatbot.id)}
                      className="text-red-600 hover:text-red-800 transition-all duration-300 hover:scale-105"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

                {/* Removed Advanced Features section - not needed for YC demo */}
      </div>



      {/* Chatbot Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {selectedChatbot ? `Customize ${selectedChatbot.name}` : 'Chatbot Customization'}
              </h3>
              <button
                onClick={() => {
                  setShowCustomization(false);
                  setSelectedChatbot(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <ChatbotCustomization />
            </div>
          </div>
        </div>
      )}

      {/* Edit Chatbot Modal */}
      {showEditModal && selectedChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                ✏️ Edit Chatbot: {selectedChatbot.name}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Response Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Response Settings</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                  <textarea
                    value={editFormData.welcomeMessage}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                  <textarea
                    value={editFormData.responseTemplate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, responseTemplate: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Performance Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Performance Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response Time (ms)</label>
                    <input
                      type="number"
                      value={editFormData.responseTime}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, responseTime: parseInt(e.target.value) || 500 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Messages per Session</label>
                    <input
                      type="number"
                      value={editFormData.maxMessages}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, maxMessages: parseInt(e.target.value) || 50 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Update the chatbot with new data
                  setChatbots(prev => prev.map(chatbot => 
                    chatbot.id === selectedChatbot.id 
                      ? {
                          ...chatbot,
                          name: editFormData.name,
                          description: editFormData.description,
                          isActive: editFormData.status === 'active',
                          metrics: {
                            ...chatbot.metrics,
                            avgResponseTime: editFormData.responseTime
                          }
                        }
                      : chatbot
                  ));
                  
                  setShowEditModal(false);
                  
                  // Show success message
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                  modal.innerHTML = `
                    <div class="bg-white rounded-xl max-w-md w-full p-6">
                      <div class="flex items-center space-x-3 mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">Chatbot Updated!</h3>
                          <p class="text-gray-600">Changes saved successfully</p>
                        </div>
                      </div>
                      <div class="space-y-2 mb-4">
                        <div class="flex justify-between">
                          <span class="text-sm font-medium text-gray-700">Name:</span>
                          <span class="text-sm text-gray-900">${editFormData.name}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm font-medium text-gray-700">Status:</span>
                          <span class="text-sm text-gray-900">${editFormData.status === 'active' ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm font-medium text-gray-700">Response Time:</span>
                          <span class="text-sm text-gray-900">${editFormData.responseTime}ms</span>
                        </div>
                      </div>
                      <div class="bg-green-50 rounded-lg p-3 mb-4">
                        <p class="text-sm text-green-800">Your chatbot settings have been updated and are now active.</p>
                      </div>
                      <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                        Continue
                      </button>
                    </div>
                  `;
                  document.body.appendChild(modal);
                  setTimeout(() => modal.remove(), 3000);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 