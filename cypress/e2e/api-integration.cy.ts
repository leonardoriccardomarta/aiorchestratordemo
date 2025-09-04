describe('API Integration Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Data Fetching & Rendering', () => {
    it('should fetch and render dashboard data correctly', () => {
      // Intercept API call
      cy.intercept('GET', '**/api/dashboard', {
        statusCode: 200,
        body: {
          stats: {
            totalUsers: 1250,
            activeChatbots: 45,
            totalConversations: 12500,
            revenue: 25000
          },
          recentActivity: [
            { id: 1, type: 'chatbot_created', message: 'New chatbot created' },
            { id: 2, type: 'conversation_started', message: 'Conversation started' }
          ]
        }
      }).as('dashboardData');
      
      // Navigate to dashboard
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      cy.wait('@dashboardData');
      
      // Check data is rendered
      cy.get('[data-testid="total-users"]').should('contain', '1,250');
      cy.get('[data-testid="active-chatbots"]').should('contain', '45');
      cy.get('[data-testid="total-conversations"]').should('contain', '12,500');
      cy.get('[data-testid="revenue"]').should('contain', '$25,000');
      cy.get('[data-testid="recent-activity"]').should('have.length', 2);
    });

    it('should fetch and render analytics data correctly', () => {
      // Intercept analytics API call
      cy.intercept('GET', '**/api/analytics', {
        statusCode: 200,
        body: {
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
              {
                label: 'Conversations',
                data: [100, 150, 200, 180, 250]
              }
            ]
          },
          metrics: {
            conversionRate: 15.5,
            avgResponseTime: 2.3,
            satisfactionScore: 4.8
          }
        }
      }).as('analyticsData');
      
      // Navigate to analytics
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.wait('@analyticsData');
      
      // Check data is rendered
      cy.get('[data-testid="conversion-rate"]').should('contain', '15.5%');
      cy.get('[data-testid="avg-response-time"]').should('contain', '2.3s');
      cy.get('[data-testid="satisfaction-score"]').should('contain', '4.8');
      cy.get('[data-testid="chart-container"]').should('be.visible');
    });

    it('should handle empty data responses gracefully', () => {
      // Intercept empty response
      cy.intercept('GET', '**/api/analytics', {
        statusCode: 200,
        body: {
          chartData: { labels: [], datasets: [] },
          metrics: {}
        }
      }).as('emptyData');
      
      // Navigate to analytics
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.wait('@emptyData');
      
      // Check empty state is shown
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state-message"]').should('contain', 'No data available');
    });

    it('should handle large datasets efficiently', () => {
      // Intercept large dataset
      const largeDataset = {
        users: Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          status: i % 2 === 0 ? 'active' : 'inactive'
        }))
      };
      
      cy.intercept('GET', '**/api/users', {
        statusCode: 200,
        body: largeDataset
      }).as('largeDataset');
      
      // Navigate to users page
      cy.get('[data-testid="sidebar-link-users"]').click();
      cy.wait('@largeDataset');
      
      // Check pagination is implemented
      cy.get('[data-testid="pagination"]').should('be.visible');
      cy.get('[data-testid="user-row"]').should('have.length', 10); // Default page size
    });
  });

  describe('Error State Handling', () => {
    it('should handle 404 errors gracefully', () => {
      // Intercept 404 error
      cy.intercept('GET', '**/api/nonexistent', {
        statusCode: 404,
        body: { error: 'Resource not found' }
      }).as('notFound');
      
      // Trigger request
      cy.get('[data-testid="fetch-nonexistent"]').click();
      cy.wait('@notFound');
      
      // Check error state
      cy.get('[data-testid="error-404"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Resource not found');
    });

    it('should handle 401 unauthorized errors', () => {
      // Intercept 401 error
      cy.intercept('GET', '**/api/protected', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('unauthorized');
      
      // Trigger request
      cy.get('[data-testid="fetch-protected"]').click();
      cy.wait('@unauthorized');
      
      // Check redirect to login
      cy.url().should('include', '/login');
      cy.get('[data-testid="unauthorized-message"]').should('be.visible');
    });

    it('should handle 500 server errors', () => {
      // Intercept 500 error
      cy.intercept('GET', '**/api/server-error', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError');
      
      // Trigger request
      cy.get('[data-testid="fetch-server-error"]').click();
      cy.wait('@serverError');
      
      // Check error state
      cy.get('[data-testid="error-500"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
      cy.get('[data-testid="contact-support"]').should('be.visible');
    });

    it('should handle network timeout errors', () => {
      // Intercept timeout
      cy.intercept('GET', '**/api/slow', { delay: 10000 }).as('timeout');
      
      // Trigger request
      cy.get('[data-testid="fetch-slow"]').click();
      
      // Check timeout handling
      cy.get('[data-testid="timeout-error"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should handle malformed JSON responses', () => {
      // Intercept malformed response
      cy.intercept('GET', '**/api/malformed', {
        statusCode: 200,
        body: 'invalid json'
      }).as('malformed');
      
      // Trigger request
      cy.get('[data-testid="fetch-malformed"]').click();
      cy.wait('@malformed');
      
      // Check error handling
      cy.get('[data-testid="json-error"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Success & Error Notifications', () => {
    it('should show success notifications for successful operations', () => {
      // Intercept successful POST
      cy.intercept('POST', '**/api/chatbot', {
        statusCode: 201,
        body: { id: 123, name: 'Test Chatbot' }
      }).as('createChatbot');
      
      // Create chatbot
      cy.get('[data-testid="create-chatbot"]').click();
      cy.get('[data-testid="chatbot-name"]').type('Test Chatbot');
      cy.get('[data-testid="submit-chatbot"]').click();
      cy.wait('@createChatbot');
      
      // Check success notification
      cy.get('[data-testid="success-notification"]').should('be.visible');
      cy.get('[data-testid="success-message"]').should('contain', 'Chatbot created successfully');
    });

    it('should show error notifications for failed operations', () => {
      // Intercept failed POST
      cy.intercept('POST', '**/api/chatbot', {
        statusCode: 400,
        body: { error: 'Invalid chatbot name' }
      }).as('createChatbotError');
      
      // Create chatbot with invalid data
      cy.get('[data-testid="create-chatbot"]').click();
      cy.get('[data-testid="chatbot-name"]').type('');
      cy.get('[data-testid="submit-chatbot"]').click();
      cy.wait('@createChatbotError');
      
      // Check error notification
      cy.get('[data-testid="error-notification"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid chatbot name');
    });

    it('should show consistent notification styling', () => {
      // Test success notification styling
      cy.get('[data-testid="success-notification"]').should('have.class', 'notification-success');
      cy.get('[data-testid="success-notification"]').should('have.css', 'background-color');
      
      // Test error notification styling
      cy.get('[data-testid="error-notification"]').should('have.class', 'notification-error');
      cy.get('[data-testid="error-notification"]').should('have.css', 'background-color');
      
      // Test warning notification styling
      cy.get('[data-testid="warning-notification"]').should('have.class', 'notification-warning');
      cy.get('[data-testid="warning-notification"]').should('have.css', 'background-color');
    });

    it('should auto-dismiss notifications after timeout', () => {
      // Trigger success notification
      cy.get('[data-testid="trigger-success"]').click();
      cy.get('[data-testid="success-notification"]').should('be.visible');
      
      // Wait for auto-dismiss
      cy.get('[data-testid="success-notification"]', { timeout: 5000 }).should('not.be.visible');
    });

    it('should allow manual dismissal of notifications', () => {
      // Trigger notification
      cy.get('[data-testid="trigger-error"]').click();
      cy.get('[data-testid="error-notification"]').should('be.visible');
      
      // Dismiss manually
      cy.get('[data-testid="dismiss-notification"]').click();
      cy.get('[data-testid="error-notification"]').should('not.be.visible');
    });
  });

  describe('Retry Strategies & Timeouts', () => {
    it('should retry failed requests automatically', () => {
      // Intercept failed request followed by success
      let attemptCount = 0;
      cy.intercept('GET', '**/api/unstable', (req) => {
        attemptCount++;
        if (attemptCount === 1) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ statusCode: 200, body: { data: 'success' } });
        }
      }).as('unstable');
      
      // Trigger request
      cy.get('[data-testid="fetch-unstable"]').click();
      cy.wait('@unstable');
      cy.wait('@unstable');
      
      // Check success after retry
      cy.get('[data-testid="success-data"]').should('contain', 'success');
    });

    it('should handle request timeouts correctly', () => {
      // Intercept slow request
      cy.intercept('GET', '**/api/slow', { delay: 30000 }).as('slowRequest');
      
      // Trigger request
      cy.get('[data-testid="fetch-slow"]').click();
      
      // Check timeout handling
      cy.get('[data-testid="timeout-error"]', { timeout: 10000 }).should('be.visible');
    });

    it('should implement exponential backoff for retries', () => {
      // Intercept multiple failures
      let attemptCount = 0;
      cy.intercept('GET', '**/api/failing', (req) => {
        attemptCount++;
        if (attemptCount <= 3) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ statusCode: 200, body: { data: 'success' } });
        }
      }).as('failing');
      
      // Trigger request
      cy.get('[data-testid="fetch-failing"]').click();
      
      // Wait for retries with exponential backoff
      cy.wait('@failing');
      cy.wait('@failing');
      cy.wait('@failing');
      cy.wait('@failing');
      
      // Check final success
      cy.get('[data-testid="success-data"]').should('contain', 'success');
    });

    it('should cancel pending requests on component unmount', () => {
      // Intercept slow request
      cy.intercept('GET', '**/api/slow', { delay: 5000 }).as('slowRequest');
      
      // Trigger request
      cy.get('[data-testid="fetch-slow"]').click();
      
      // Navigate away before request completes
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      
      // Check request is cancelled
      cy.get('[data-testid="loading-spinner"]').should('not.be.visible');
    });
  });

  describe('Data Synchronization', () => {
    it('should sync data across multiple components', () => {
      // Intercept data update
      cy.intercept('PUT', '**/api/user/profile', {
        statusCode: 200,
        body: { name: 'Updated User', email: 'updated@example.com' }
      }).as('updateProfile');
      
      // Update profile
      cy.get('[data-testid="edit-profile"]').click();
      cy.get('[data-testid="profile-name"]').clear().type('Updated User');
      cy.get('[data-testid="save-profile"]').click();
      cy.wait('@updateProfile');
      
      // Check data is synced across components
      cy.get('[data-testid="header-user-name"]').should('contain', 'Updated User');
      cy.get('[data-testid="sidebar-user-name"]').should('contain', 'Updated User');
      cy.get('[data-testid="profile-user-name"]').should('contain', 'Updated User');
    });

    it('should handle optimistic updates', () => {
      // Intercept optimistic update
      cy.intercept('POST', '**/api/chatbot', {
        statusCode: 201,
        body: { id: 123, name: 'Optimistic Chatbot' }
      }).as('createOptimistic');
      
      // Create chatbot with optimistic update
      cy.get('[data-testid="create-chatbot"]').click();
      cy.get('[data-testid="chatbot-name"]').type('Optimistic Chatbot');
      cy.get('[data-testid="submit-chatbot"]').click();
      
      // Check optimistic update
      cy.get('[data-testid="chatbot-list"]').should('contain', 'Optimistic Chatbot');
      
      // Wait for server confirmation
      cy.wait('@createOptimistic');
      cy.get('[data-testid="success-notification"]').should('be.visible');
    });

    it('should handle rollback on failed optimistic updates', () => {
      // Intercept failed optimistic update
      cy.intercept('POST', '**/api/chatbot', {
        statusCode: 400,
        body: { error: 'Invalid data' }
      }).as('failedOptimistic');
      
      // Create chatbot with optimistic update
      cy.get('[data-testid="create-chatbot"]').click();
      cy.get('[data-testid="chatbot-name"]').type('Failed Chatbot');
      cy.get('[data-testid="submit-chatbot"]').click();
      
      // Check optimistic update
      cy.get('[data-testid="chatbot-list"]').should('contain', 'Failed Chatbot');
      
      // Wait for server failure
      cy.wait('@failedOptimistic');
      
      // Check rollback
      cy.get('[data-testid="chatbot-list"]').should('not.contain', 'Failed Chatbot');
      cy.get('[data-testid="error-notification"]').should('be.visible');
    });
  });
}); 