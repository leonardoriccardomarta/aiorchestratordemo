// Comprehensive E2E Test Suite for AI Orchestrator
// Tests the complete user journey from signup to advanced features

describe('AI Orchestrator - Complete User Journey', () => {
  const testUser = {
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User'
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('🔐 Authentication Flow', () => {
    it('should complete full registration and login process', () => {
      // Visit homepage
      cy.visit('/');
      cy.url().should('include', '/');

      // Test registration
      cy.contains('Sign Up').click();
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="confirm-password-input"]').type(testUser.password);
      cy.get('[data-testid="name-input"]').type(testUser.name);
      cy.get('[data-testid="submit-button"]').click();

      // Verify email verification step
      cy.contains('Check your email').should('be.visible');

      // Simulate email verification (for testing)
      cy.request('POST', '/api/auth/verify-email', {
        email: testUser.email,
        token: 'test-verification-token'
      });

      // Complete login
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="login-button"]').click();

      // Verify successful login
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');
    });

    it('should enable and test MFA functionality', () => {
      // Login first
      cy.login(testUser.email, testUser.password);

      // Navigate to security settings
      cy.visit('/settings/security');
      cy.contains('Two-Factor Authentication').should('be.visible');

      // Enable MFA
      cy.get('[data-testid="enable-mfa-button"]').click();
      cy.get('[data-testid="qr-code"]').should('be.visible');
      cy.get('[data-testid="manual-secret"]').should('contain', 'Enter this code manually');

      // Verify MFA with test code
      cy.get('[data-testid="mfa-code-input"]').type('123456');
      cy.get('[data-testid="verify-mfa-button"]').click();

      // Check backup codes
      cy.contains('Backup Codes').should('be.visible');
      cy.get('[data-testid="backup-codes"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="download-backup-codes"]').click();

      // Complete MFA setup
      cy.get('[data-testid="complete-setup-button"]').click();
      cy.contains('MFA Enabled!').should('be.visible');
    });
  });

  describe('🤖 Chatbot Management', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should create and configure a complete chatbot', () => {
      // Navigate to chatbot creation
      cy.visit('/dashboard');
      cy.get('[data-testid="create-chatbot-button"]').click();

      // Fill chatbot details
      cy.get('[data-testid="chatbot-name"]').type('E2E Test Chatbot');
      cy.get('[data-testid="chatbot-description"]').type('This is a test chatbot for E2E testing');
      cy.get('[data-testid="chatbot-language"]').select('English');

      // Configure AI model
      cy.get('[data-testid="ai-model-select"]').select('GPT-4');
      cy.get('[data-testid="temperature-slider"]').invoke('val', 0.7).trigger('change');
      cy.get('[data-testid="max-tokens"]').clear().type('1000');

      // Set personality and instructions
      cy.get('[data-testid="personality-input"]').type('Friendly and helpful customer service representative');
      cy.get('[data-testid="instructions-input"]').type('Always be polite and try to solve customer problems efficiently');

      // Configure integrations
      cy.get('[data-testid="integrations-tab"]').click();
      cy.get('[data-testid="whatsapp-toggle"]').click();
      cy.get('[data-testid="whatsapp-number"]').type('+1234567890');
      
      cy.get('[data-testid="shopify-toggle"]').click();
      cy.get('[data-testid="shopify-domain"]').type('test-store.myshopify.com');
      cy.get('[data-testid="shopify-token"]').type('test-access-token');

      // Save chatbot
      cy.get('[data-testid="save-chatbot-button"]').click();
      cy.contains('Chatbot created successfully').should('be.visible');

      // Verify chatbot appears in dashboard
      cy.visit('/dashboard');
      cy.contains('E2E Test Chatbot').should('be.visible');
      cy.get('[data-testid="chatbot-status"]').should('contain', 'Active');
    });

    it('should test chatbot conversation functionality', () => {
      cy.visit('/dashboard');
      
      // Open chatbot tester
      cy.get('[data-testid="chatbot-card"]').first().within(() => {
        cy.get('[data-testid="test-chatbot-button"]').click();
      });

      // Test chatbot conversation
      cy.get('[data-testid="chat-input"]').type('Hello, I need help with my order');
      cy.get('[data-testid="send-message-button"]').click();

      // Verify response
      cy.get('[data-testid="chat-messages"]').should('contain', 'Hello');
      cy.get('[data-testid="response-time"]').should('be.visible');
      cy.get('[data-testid="ai-confidence"]').should('be.visible');

      // Test multiple conversation turns
      cy.get('[data-testid="chat-input"]').type('Can you help me track my order #12345?');
      cy.get('[data-testid="send-message-button"]').click();
      
      cy.get('[data-testid="chat-messages"]').should('contain', 'track');
      
      // Test file upload
      cy.get('[data-testid="file-upload"]').selectFile('cypress/fixtures/test-image.jpg');
      cy.contains('Image uploaded').should('be.visible');
    });
  });

  describe('⚙️ Workflow Automation', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should create and test a complete workflow', () => {
      // Navigate to workflows
      cy.visit('/workflows');
      cy.get('[data-testid="create-workflow-button"]').click();

      // Create workflow
      cy.get('[data-testid="workflow-name"]').type('E2E Test Workflow');
      cy.get('[data-testid="workflow-description"]').type('Automated customer support workflow');

      // Add trigger
      cy.get('[data-testid="add-trigger-button"]').click();
      cy.get('[data-testid="trigger-type"]').select('Message Received');
      cy.get('[data-testid="trigger-keywords"]').type('help, support, issue');

      // Add conditions
      cy.get('[data-testid="add-condition-button"]').click();
      cy.get('[data-testid="condition-type"]').select('Contains Keyword');
      cy.get('[data-testid="condition-value"]').type('urgent');

      // Add actions
      cy.get('[data-testid="add-action-button"]').click();
      cy.get('[data-testid="action-type"]').select('Send Message');
      cy.get('[data-testid="action-message"]').type('I understand you have an urgent issue. Let me help you right away.');

      cy.get('[data-testid="add-action-button"]').click();
      cy.get('[data-testid="action-type"]').select('Notify Human Agent');
      cy.get('[data-testid="agent-email"]').type('support@example.com');

      // Add AI analysis step
      cy.get('[data-testid="add-action-button"]').click();
      cy.get('[data-testid="action-type"]').select('AI Analysis');
      cy.get('[data-testid="analysis-prompt"]').type('Analyze the customer sentiment and urgency level');

      // Save workflow
      cy.get('[data-testid="save-workflow-button"]').click();
      cy.contains('Workflow saved successfully').should('be.visible');

      // Test workflow execution
      cy.get('[data-testid="test-workflow-button"]').click();
      cy.get('[data-testid="test-input"]').type('Help! I have an urgent issue with my order');
      cy.get('[data-testid="run-test-button"]').click();

      // Verify workflow execution
      cy.get('[data-testid="execution-log"]').should('contain', 'Trigger: Message Received');
      cy.get('[data-testid="execution-log"]').should('contain', 'Condition: Contains Keyword - PASSED');
      cy.get('[data-testid="execution-log"]').should('contain', 'Action: Send Message - EXECUTED');
      cy.get('[data-testid="execution-log"]').should('contain', 'Action: Notify Human Agent - EXECUTED');

      // Check performance metrics
      cy.get('[data-testid="execution-time"]').should('be.visible');
      cy.get('[data-testid="success-rate"]').should('contain', '100%');
    });
  });

  describe('📊 Analytics and Reporting', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should display comprehensive analytics dashboard', () => {
      cy.visit('/analytics');

      // Verify main metrics
      cy.get('[data-testid="total-messages"]').should('be.visible');
      cy.get('[data-testid="response-time"]').should('be.visible');
      cy.get('[data-testid="customer-satisfaction"]').should('be.visible');
      cy.get('[data-testid="resolution-rate"]').should('be.visible');

      // Test date range picker
      cy.get('[data-testid="date-range-picker"]').click();
      cy.get('[data-testid="last-7-days"]').click();
      cy.get('[data-testid="apply-filter"]').click();

      // Verify charts load
      cy.get('[data-testid="messages-chart"]').should('be.visible');
      cy.get('[data-testid="sentiment-chart"]').should('be.visible');
      cy.get('[data-testid="performance-chart"]').should('be.visible');

      // Test export functionality
      cy.get('[data-testid="export-data-button"]').click();
      cy.get('[data-testid="export-csv"]').click();
      cy.contains('Export started').should('be.visible');

      // Test real-time updates
      cy.get('[data-testid="real-time-toggle"]').click();
      cy.wait(5000);
      cy.get('[data-testid="last-updated"]').should('contain', 'seconds ago');
    });

    it('should generate detailed reports', () => {
      cy.visit('/analytics/reports');

      // Create custom report
      cy.get('[data-testid="create-report-button"]').click();
      cy.get('[data-testid="report-name"]').type('E2E Test Report');
      cy.get('[data-testid="report-type"]').select('Performance Analysis');

      // Configure metrics
      cy.get('[data-testid="metric-response-time"]').check();
      cy.get('[data-testid="metric-resolution-rate"]').check();
      cy.get('[data-testid="metric-customer-satisfaction"]').check();

      // Set filters
      cy.get('[data-testid="filter-chatbot"]').select('All Chatbots');
      cy.get('[data-testid="filter-date-range"]').select('Last 30 Days');

      // Generate report
      cy.get('[data-testid="generate-report-button"]').click();
      cy.contains('Generating report').should('be.visible');
      
      // Wait for report completion
      cy.get('[data-testid="report-status"]', { timeout: 30000 }).should('contain', 'Completed');

      // Verify report content
      cy.get('[data-testid="report-summary"]').should('be.visible');
      cy.get('[data-testid="key-insights"]').should('be.visible');
      cy.get('[data-testid="recommendations"]').should('be.visible');

      // Download report
      cy.get('[data-testid="download-pdf"]').click();
      cy.readFile('cypress/downloads/e2e-test-report.pdf').should('exist');
    });
  });

  describe('💳 Pricing and Billing', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should handle subscription upgrade flow', () => {
      cy.visit('/pricing');

      // View pricing plans
      cy.get('[data-testid="pricing-plan"]').should('have.length.greaterThan', 0);
      cy.get('[data-testid="pro-plan"]').should('be.visible');
      cy.get('[data-testid="enterprise-plan"]').should('be.visible');

      // Upgrade to Pro plan
      cy.get('[data-testid="pro-plan"]').within(() => {
        cy.get('[data-testid="upgrade-button"]').click();
      });

      // Fill payment information
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="card-expiry"]').type('12/25');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="billing-name"]').type('Test User');
      cy.get('[data-testid="billing-email"]').type(testUser.email);

      // Complete payment
      cy.get('[data-testid="complete-payment"]').click();
      cy.contains('Payment successful').should('be.visible');

      // Verify subscription
      cy.visit('/settings/billing');
      cy.get('[data-testid="current-plan"]').should('contain', 'Pro');
      cy.get('[data-testid="billing-status"]').should('contain', 'Active');
    });

    it('should track usage and billing', () => {
      cy.visit('/settings/billing');

      // Check usage metrics
      cy.get('[data-testid="current-usage"]').should('be.visible');
      cy.get('[data-testid="usage-chart"]').should('be.visible');
      cy.get('[data-testid="billing-history"]').should('be.visible');

      // Test usage alerts
      cy.get('[data-testid="usage-alerts"]').click();
      cy.get('[data-testid="alert-threshold"]').clear().type('80');
      cy.get('[data-testid="alert-email"]').type(testUser.email);
      cy.get('[data-testid="save-alert"]').click();
      cy.contains('Alert saved').should('be.visible');
    });
  });

  describe('🔗 Integrations', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should test Shopify integration setup', () => {
      cy.visit('/integrations');

      // Find and configure Shopify integration
      cy.get('[data-testid="shopify-integration"]').click();
      cy.get('[data-testid="store-url"]').type('test-store.myshopify.com');
      cy.get('[data-testid="access-token"]').type('test-access-token-12345');

      // Test connection
      cy.get('[data-testid="test-connection"]').click();
      cy.contains('Testing connection').should('be.visible');
      cy.get('[data-testid="connection-status"]', { timeout: 10000 }).should('contain', 'Connected');

      // Configure sync settings
      cy.get('[data-testid="sync-products"]').check();
      cy.get('[data-testid="sync-orders"]').check();
      cy.get('[data-testid="sync-customers"]').check();

      // Save integration
      cy.get('[data-testid="save-integration"]').click();
      cy.contains('Integration saved').should('be.visible');

      // Verify integration appears in list
      cy.visit('/integrations');
      cy.get('[data-testid="active-integrations"]').should('contain', 'Shopify');
      cy.get('[data-testid="integration-status"]').should('contain', 'Active');
    });

    it('should test webhook functionality', () => {
      cy.visit('/integrations/webhooks');

      // Create webhook
      cy.get('[data-testid="create-webhook"]').click();
      cy.get('[data-testid="webhook-name"]').type('E2E Test Webhook');
      cy.get('[data-testid="webhook-url"]').type('https://webhook.site/test-endpoint');
      cy.get('[data-testid="webhook-events"]').select(['message.received', 'workflow.completed']);

      // Configure authentication
      cy.get('[data-testid="auth-type"]').select('Bearer Token');
      cy.get('[data-testid="auth-token"]').type('test-bearer-token-123');

      // Save webhook
      cy.get('[data-testid="save-webhook"]').click();
      cy.contains('Webhook created').should('be.visible');

      // Test webhook
      cy.get('[data-testid="test-webhook"]').click();
      cy.get('[data-testid="test-payload"]').type('{"test": "data"}');
      cy.get('[data-testid="send-test"]').click();
      cy.contains('Test sent successfully').should('be.visible');
    });
  });

  describe('🔍 Performance Monitoring', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should monitor system performance metrics', () => {
      cy.visit('/monitoring');

      // Check real-time metrics
      cy.get('[data-testid="response-time-metric"]').should('be.visible');
      cy.get('[data-testid="error-rate-metric"]').should('be.visible');
      cy.get('[data-testid="throughput-metric"]').should('be.visible');
      cy.get('[data-testid="uptime-metric"]').should('be.visible');

      // Verify alerts system
      cy.get('[data-testid="active-alerts"]').should('be.visible');
      cy.get('[data-testid="alert-history"]').should('be.visible');

      // Test alert configuration
      cy.get('[data-testid="configure-alerts"]').click();
      cy.get('[data-testid="response-time-threshold"]').clear().type('500');
      cy.get('[data-testid="error-rate-threshold"]').clear().type('5');
      cy.get('[data-testid="save-thresholds"]').click();
      cy.contains('Thresholds updated').should('be.visible');
    });
  });

  describe('👥 Team Management', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should manage team members and roles', () => {
      cy.visit('/team');

      // Invite team member
      cy.get('[data-testid="invite-member"]').click();
      cy.get('[data-testid="member-email"]').type('teammate@example.com');
      cy.get('[data-testid="member-role"]').select('Editor');
      cy.get('[data-testid="send-invitation"]').click();
      cy.contains('Invitation sent').should('be.visible');

      // Verify member appears in list
      cy.get('[data-testid="team-members"]').should('contain', 'teammate@example.com');
      cy.get('[data-testid="member-status"]').should('contain', 'Pending');

      // Test role management
      cy.get('[data-testid="edit-member"]').first().click();
      cy.get('[data-testid="update-role"]').select('Admin');
      cy.get('[data-testid="save-changes"]').click();
      cy.contains('Member updated').should('be.visible');
    });
  });

  // Performance and Load Testing
  describe('⚡ Performance Tests', () => {
    it('should handle concurrent user actions', () => {
      const users = Array.from({ length: 5 }, (_, i) => ({
        email: `concurrent.user.${i}@example.com`,
        password: 'TestPassword123!'
      }));

      // Simulate concurrent logins
      users.forEach((user, index) => {
        cy.task('createUser', user).then(() => {
          cy.login(user.email, user.password);
          cy.visit('/dashboard');
          
          // Perform actions concurrently
          cy.get('[data-testid="create-chatbot-button"]').click();
          cy.get('[data-testid="chatbot-name"]').type(`Concurrent Bot ${index}`);
          cy.get('[data-testid="save-chatbot-button"]').click();
          
          cy.contains('Chatbot created successfully').should('be.visible');
        });
      });
    });

    it('should maintain performance under load', () => {
      cy.login(testUser.email, testUser.password);

      // Measure page load times
      cy.visit('/dashboard');
      cy.window().then((win) => {
        const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(3000); // Page should load within 3 seconds
      });

      // Test API response times
      cy.intercept('GET', '/api/dashboard/metrics').as('metricsAPI');
      cy.visit('/dashboard');
      cy.wait('@metricsAPI').then((interception) => {
        expect(interception.response.duration).to.be.lessThan(1000); // API should respond within 1 second
      });
    });
  });

  // Cleanup
  after(() => {
    // Clean up test data
    cy.task('cleanupTestData', testUser.email);
  });
});

// Custom commands for reusability
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});

Cypress.Commands.add('createChatbot', (name: string, description: string) => {
  cy.visit('/dashboard');
  cy.get('[data-testid="create-chatbot-button"]').click();
  cy.get('[data-testid="chatbot-name"]').type(name);
  cy.get('[data-testid="chatbot-description"]').type(description);
  cy.get('[data-testid="save-chatbot-button"]').click();
  cy.contains('Chatbot created successfully').should('be.visible');
});

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createChatbot(name: string, description: string): Chainable<void>;
    }
  }
}