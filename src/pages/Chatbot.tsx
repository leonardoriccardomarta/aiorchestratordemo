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
    // Show custom confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    confirmModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Delete Chatbot</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this chatbot? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
    
    const cancelBtn = confirmModal.querySelector('#cancelDelete');
    const confirmBtn = confirmModal.querySelector('#confirmDelete');
    
    cancelBtn?.addEventListener('click', () => {
      document.body.removeChild(confirmModal);
    });
    
    confirmBtn?.addEventListener('click', async () => {
      document.body.removeChild(confirmModal);
      try {
        const response = await apiService.deleteChatbot(id);
        if (response.success) {
          setChatbots(chatbots.filter(c => c.id !== id));
          
          // Show success modal
          const successModal = document.createElement('div');
          successModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">Chatbot Deleted</h3>
                <p style="color: #6b7280; margin-bottom: 24px;">The chatbot has been successfully deleted.</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">OK</button>
              </div>
            </div>
          `;
          document.body.appendChild(successModal);
        } else {
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
    });
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

  const handleSaveEdit = () => {
    if (selectedChatbot) {
      handleUpdateChatbot(selectedChatbot.id, editFormData);
      setShowEditModal(false);
    }
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
            {chatbots.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots created</h3>
                <p className="text-gray-600 mb-4">Create your first AI assistant to get started</p>
                <button
                  onClick={() => setShowCustomization(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create First Chatbot
                </button>
              </div>
            ) : (
              chatbots.map((chatbot) => (
                <div key={chatbot.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{chatbot.name}</h3>
                        <p className="text-gray-600">{chatbot.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                              chatbot.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {chatbot.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {chatbot.metrics && (
                              <>
                                <span className="text-sm text-gray-500">
                                  💬 {chatbot.metrics.todayMessages || 0} messages today
                                </span>
                                <span className="text-sm text-gray-500">
                                  ⚡ {chatbot.metrics.avgResponseTime || 0}ms avg response
                                </span>
                              </>
                            )}
                          </div>
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
                        className="text-purple-600 hover:text-purple-800 transition-all duration-300 hover:scale-105"
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Chatbot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

                   {/* Customization Modal */}
             {showCustomization && (
               <ChatbotCustomization />
             )}
    </div>
  );
};

export default Chatbot;