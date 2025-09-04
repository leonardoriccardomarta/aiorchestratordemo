(function() {
  'use strict';

  // Initialize the chatbot widget
  function initChatbotWidget() {
    const config = window.aiOrchestratorConfig || {};
    
    // Default configuration
    const defaultConfig = {
      chatbotId: 'default',
      name: 'AI Assistant',
      primaryColor: '#4F46E5',
      gradient: { from: '#4F46E5', to: '#2563EB' },
      theme: 'light',
      welcomeMessage: 'Hi! How can I help you today?',
      language: 'English',
      fontFamily: 'Inter',
      fontSize: 'md',
      bubbleShape: 'rounded-xl',
      position: 'bottom-right'
    };

    const chatbotConfig = { ...defaultConfig, ...config };

    // Create chatbot HTML structure
    const createChatbotHTML = () => {
      const chatbotContainer = document.createElement('div');
      chatbotContainer.id = 'ai-orchestrator-chatbot';
      chatbotContainer.innerHTML = `
        <style>
          #ai-orchestrator-chatbot {
            position: fixed;
            ${chatbotConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${chatbotConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            z-index: 10000;
            font-family: ${chatbotConfig.fontFamily}, sans-serif;
          }
          
          .chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to});
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            color: white;
          }
          
          .chatbot-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }
          
          .chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
          }
          
          .chatbot-header {
            background: linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to});
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .chatbot-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
          
          .chatbot-header .status {
            font-size: 12px;
            opacity: 0.9;
          }
          
          .chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f9fafb;
          }
          
          .message {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
          }
          
          .message.user {
            justify-content: flex-end;
          }
          
          .message-bubble {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: ${chatbotConfig.bubbleShape === 'rounded-full' ? '20px' : 
                           chatbotConfig.bubbleShape === 'rounded-xl' ? '12px' : 
                           chatbotConfig.bubbleShape === 'rounded-md' ? '6px' : '0px'};
            font-size: ${chatbotConfig.fontSize === 'sm' ? '14px' : 
                        chatbotConfig.fontSize === 'lg' ? '18px' : '16px'};
            line-height: 1.4;
            word-wrap: break-word;
          }
          
          .message.bot .message-bubble {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
          }
          
          .message.user .message-bubble {
            background: ${chatbotConfig.primaryColor};
            color: white;
          }
          
          .chatbot-input {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
          }
          
          .chatbot-input input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            outline: none;
            font-size: 14px;
          }
          
          .chatbot-input input:focus {
            border-color: ${chatbotConfig.primaryColor};
          }
          
          .chatbot-input button {
            padding: 8px 16px;
            background: ${chatbotConfig.primaryColor};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s ease;
          }
          
          .chatbot-input button:hover {
            filter: brightness(0.9);
          }
          
          .close-button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
          }

          @media (max-width: 768px) {
            .chatbot-window {
              width: calc(100vw - 40px);
              height: calc(100vh - 120px);
              right: 20px;
              left: 20px;
              bottom: 80px;
            }
          }
        </style>
        
        <button class="chatbot-button" onclick="toggleChatbot()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <div>
              <h3>${chatbotConfig.name}</h3>
              <div class="status">🟢 Online</div>
            </div>
            <button class="close-button" onclick="toggleChatbot()">×</button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="message bot">
              <div class="message-bubble">${chatbotConfig.welcomeMessage}</div>
            </div>
          </div>
          
          <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
            <button onclick="window.sendMessage()">Send</button>
          </div>
        </div>
      `;
      
      return chatbotContainer;
    };

    // Add chatbot to page
    const chatbotElement = createChatbotHTML();
    document.body.appendChild(chatbotElement);

    // Chatbot functionality
    let isOpen = false;
    let messages = [];

    window.toggleChatbot = function() {
      const window = document.getElementById('chatbot-window');
      isOpen = !isOpen;
      window.style.display = isOpen ? 'flex' : 'none';
    };

    window.sendMessage = function() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Add user message
      addMessage(message, 'user');
      input.value = '';
      
      // Try demo API, fallback to simulated response
      fetch((window.__AI_ORCH_API__ || 'http://localhost:4000') + '/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Bad response')))
      .then(data => {
        if (data && data.success && data.reply) {
          addMessage(data.reply, 'bot');
        } else {
          throw new Error('Invalid payload');
        }
      })
      .catch(() => {
        setTimeout(() => {
          const responses = [
            "Grazie per il messaggio! Posso aiutarti con la demo.",
            "Capito. Ecco una risposta di esempio per mostrare il flusso.",
            "Demo mode: questa è una risposta generata per l'anteprima.",
            "Sto elaborando la tua richiesta. Ecco un esempio di output.",
            "Certo! Questo è un messaggio di risposta della demo."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'bot');
        }, 400);
      });
    };

    window.handleKeyPress = function(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    };

    function addMessage(text, sender) {
      const messagesContainer = document.getElementById('chatbot-messages');
      const messageElement = document.createElement('div');
      messageElement.className = `message ${sender}`;
      messageElement.innerHTML = `<div class="message-bubble">${text}</div>`;
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      messages.push({ text, sender, timestamp: new Date() });
    }

    // Analytics tracking
    function trackEvent(eventName, data = {}) {
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...data,
          chatbot_id: chatbotConfig.chatbotId
        });
      }
      
      // Send to AI Orchestrator analytics
      fetch(`https://api.ai-orchestrator.com/analytics/${chatbotConfig.chatbotId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          data: data,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      }).catch(() => {}); // Fail silently
    }

    // Track chatbot load
    trackEvent('chatbot_loaded');

    // Track interactions
    const originalToggle = window.toggleChatbot;
    window.toggleChatbot = function() {
      trackEvent(isOpen ? 'chatbot_closed' : 'chatbot_opened');
      originalToggle();
    };

    const originalSendMessage = window.sendMessage;
    window.sendMessage = function() {
      const input = document.getElementById('chatbot-input');
      if (input.value.trim()) {
        trackEvent('message_sent', { message_length: input.value.length });
      }
      originalSendMessage();
    };

    console.log('AI Orchestrator Chatbot Widget loaded successfully!');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotWidget);
  } else {
    initChatbotWidget();
  }
})();