describe('QA + UX Testing - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Real User Scenarios', () => {
    it('should handle complete login flow', () => {
      // Test login flow
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Verify successful login
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('be.visible');
      cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
    });

    it('should handle content management flow', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Navigate to content management
      cy.get('[data-testid="sidebar-link-content"]').click();
      
      // Create new content
      cy.get('[data-testid="create-content"]').click();
      cy.get('[data-testid="content-title"]').type('Test Content');
      cy.get('[data-testid="content-description"]').type('Test Description');
      cy.get('[data-testid="save-content"]').click();
      
      // Verify content created
      cy.get('[data-testid="content-list"]').should('contain', 'Test Content');
    });

    it('should handle payment flow', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Navigate to billing
      cy.get('[data-testid="sidebar-link-billing"]').click();
      
      // Select plan
      cy.get('[data-testid="plan-selector"]').click();
      cy.get('[data-testid="plan-option"]').first().click();
      
      // Enter payment details
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="card-expiry"]').type('12/25');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="payment-submit"]').click();
      
      // Verify payment success
      cy.get('[data-testid="payment-success"]').should('be.visible');
    });

    it('should handle profile editing flow', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Navigate to profile
      cy.get('[data-testid="sidebar-link-profile"]').click();
      
      // Edit profile
      cy.get('[data-testid="edit-profile"]').click();
      cy.get('[data-testid="profile-name"]').clear().type('Updated Name');
      cy.get('[data-testid="profile-email"]').clear().type('updated@example.com');
      cy.get('[data-testid="save-profile"]').click();
      
      // Verify profile updated
      cy.get('[data-testid="profile-name"]').should('contain', 'Updated Name');
    });

    it('should handle FAQ usage flow', () => {
      // Navigate to help/FAQ
      cy.get('[data-testid="sidebar-link-help"]').click();
      
      // Search FAQ
      cy.get('[data-testid="faq-search"]').type('how to use');
      cy.get('[data-testid="faq-results"]').should('be.visible');
      
      // Open FAQ item
      cy.get('[data-testid="faq-item"]').first().click();
      cy.get('[data-testid="faq-content"]').should('be.visible');
      
      // Rate FAQ helpfulness
      cy.get('[data-testid="faq-helpful"]').click();
      cy.get('[data-testid="faq-feedback"]').should('be.visible');
    });
  });

  describe('Onboarding Flow', () => {
    it('should have clear and intuitive onboarding', () => {
      // Test onboarding flow
      cy.get('[data-testid="onboarding-start"]').click();
      
      // Step 1: Welcome
      cy.get('[data-testid="onboarding-step-1"]').should('be.visible');
      cy.get('[data-testid="onboarding-title"]').should('contain', 'Welcome');
      cy.get('[data-testid="onboarding-next"]').click();
      
      // Step 2: Features
      cy.get('[data-testid="onboarding-step-2"]').should('be.visible');
      cy.get('[data-testid="onboarding-features"]').should('be.visible');
      cy.get('[data-testid="onboarding-next"]').click();
      
      // Step 3: Setup
      cy.get('[data-testid="onboarding-step-3"]').should('be.visible');
      cy.get('[data-testid="onboarding-setup"]').should('be.visible');
      cy.get('[data-testid="onboarding-complete"]').click();
      
      // Verify onboarding complete
      cy.get('[data-testid="onboarding-complete"]').should('not.be.visible');
    });

    it('should be beautiful and engaging', () => {
      // Test onboarding aesthetics
      cy.get('[data-testid="onboarding-start"]').click();
      
      // Check animations
      cy.get('[data-testid="onboarding-animation"]').should('be.visible');
      
      // Check progress indicator
      cy.get('[data-testid="onboarding-progress"]').should('be.visible');
      
      // Check visual appeal
      cy.get('[data-testid="onboarding-visual"]').should('have.css', 'background-color');
      cy.get('[data-testid="onboarding-visual"]').should('have.css', 'border-radius');
    });

    it('should allow skipping onboarding', () => {
      // Test skip functionality
      cy.get('[data-testid="onboarding-start"]').click();
      cy.get('[data-testid="onboarding-skip"]').click();
      
      // Verify skip confirmation
      cy.get('[data-testid="skip-confirmation"]').should('be.visible');
      cy.get('[data-testid="confirm-skip"]').click();
      
      // Verify onboarding skipped
      cy.get('[data-testid="onboarding"]').should('not.be.visible');
    });
  });

  describe('Error States & Success Feedback', () => {
    it('should display clear error states', () => {
      // Test form validation errors
      cy.get('[data-testid="submit-form"]').click();
      cy.get('[data-testid="validation-error"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'required');
      
      // Test network errors
      cy.intercept('**/*', { forceNetworkError: true }).as('networkError');
      cy.get('[data-testid="fetch-data"]').click();
      cy.get('[data-testid="network-error"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'network');
    });

    it('should display helpful error messages', () => {
      // Test specific error messages
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="email"]').blur();
      cy.get('[data-testid="email-error"]').should('contain', 'valid email');
      
      cy.get('input[type="password"]').type('weak');
      cy.get('input[type="password"]').blur();
      cy.get('[data-testid="password-error"]').should('contain', 'stronger');
    });

    it('should display success feedback', () => {
      // Test success messages
      cy.get('[data-testid="success-action"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
      cy.get('[data-testid="success-message"]').should('contain', 'success');
      
      // Test success animations
      cy.get('[data-testid="success-animation"]').should('be.visible');
    });

    it('should provide recovery options', () => {
      // Test error recovery
      cy.get('[data-testid="trigger-error"]').click();
      cy.get('[data-testid="retry-button"]').should('be.visible');
      cy.get('[data-testid="contact-support"]').should('be.visible');
      cy.get('[data-testid="go-back"]').should('be.visible');
    });
  });

  describe('Form Validations & Messages', () => {
    it('should validate form inputs properly', () => {
      // Test required field validation
      cy.get('[data-testid="submit-form"]').click();
      cy.get('[data-testid="required-error"]').should('be.visible');
      
      // Test email validation
      cy.get('input[type="email"]').type('invalid');
      cy.get('input[type="email"]').blur();
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      // Test password validation
      cy.get('input[type="password"]').type('123');
      cy.get('input[type="password"]').blur();
      cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('should display toast/alert messages', () => {
      // Test success toast
      cy.get('[data-testid="show-success"]').click();
      cy.get('[data-testid="toast-success"]').should('be.visible');
      cy.get('[data-testid="toast-message"]').should('contain', 'Success');
      
      // Test error toast
      cy.get('[data-testid="show-error"]').click();
      cy.get('[data-testid="toast-error"]').should('be.visible');
      cy.get('[data-testid="toast-message"]').should('contain', 'Error');
      
      // Test warning toast
      cy.get('[data-testid="show-warning"]').click();
      cy.get('[data-testid="toast-warning"]').should('be.visible');
      cy.get('[data-testid="toast-message"]').should('contain', 'Warning');
    });

    it('should auto-dismiss toast messages', () => {
      // Test auto-dismiss
      cy.get('[data-testid="show-toast"]').click();
      cy.get('[data-testid="toast"]').should('be.visible');
      
      // Wait for auto-dismiss
      cy.get('[data-testid="toast"]', { timeout: 5000 }).should('not.be.visible');
    });

    it('should allow manual dismissal of toast messages', () => {
      // Test manual dismiss
      cy.get('[data-testid="show-toast"]').click();
      cy.get('[data-testid="toast"]').should('be.visible');
      
      // Dismiss manually
      cy.get('[data-testid="dismiss-toast"]').click();
      cy.get('[data-testid="toast"]').should('not.be.visible');
    });
  });

  describe('Session Management', () => {
    it('should handle session expiration gracefully', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Mock session expiration
      cy.window().then((win) => {
        win.localStorage.setItem('sessionExpiry', Date.now() - 3600000);
      });
      
      // Try to perform action
      cy.get('[data-testid="protected-action"]').click();
      
      // Check session expired message
      cy.get('[data-testid="session-expired"]').should('be.visible');
      cy.get('[data-testid="session-expired"]').should('contain', 'expired');
    });

    it('should handle logout flow properly', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Logout
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      // Verify logout
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-form"]').should('be.visible');
    });

    it('should handle JWT token properly', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check token is stored
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.not.be.null;
      });
      
      // Check token is used in requests
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.headers.authorization).to.include('Bearer');
        req.reply({ statusCode: 200, body: {} });
      }).as('apiRequest');
      
      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@apiRequest');
    });

    it('should handle token refresh', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Mock expired token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'expired-token');
      });
      
      // Intercept refresh request
      cy.intercept('POST', '**/auth/refresh', {
        statusCode: 200,
        body: { token: 'new-token' }
      }).as('refreshToken');
      
      // Trigger action that requires auth
      cy.get('[data-testid="protected-action"]').click();
      cy.wait('@refreshToken');
      
      // Check new token is stored
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.equal('new-token');
      });
    });
  });

  describe('User Experience Flow', () => {
    it('should have intuitive navigation', () => {
      // Test navigation intuitiveness
      cy.get('[data-testid="sidebar-link-dashboard"]').should('contain', 'Dashboard');
      cy.get('[data-testid="sidebar-link-analytics"]').should('contain', 'Analytics');
      cy.get('[data-testid="sidebar-link-settings"]').should('contain', 'Settings');
      
      // Test navigation icons
      cy.get('[data-testid="nav-icon-dashboard"]').should('be.visible');
      cy.get('[data-testid="nav-icon-analytics"]').should('be.visible');
    });

    it('should provide helpful tooltips', () => {
      // Test tooltip functionality
      cy.get('[data-testid="tooltip-trigger"]').trigger('mouseover');
      cy.get('[data-testid="tooltip"]').should('be.visible');
      cy.get('[data-testid="tooltip"]').should('contain', 'helpful information');
      
      cy.get('[data-testid="tooltip-trigger"]').trigger('mouseout');
      cy.get('[data-testid="tooltip"]').should('not.be.visible');
    });

    it('should provide contextual help', () => {
      // Test contextual help
      cy.get('[data-testid="help-trigger"]').click();
      cy.get('[data-testid="contextual-help"]').should('be.visible');
      cy.get('[data-testid="help-content"]').should('contain', 'help');
    });

    it('should handle progressive disclosure', () => {
      // Test progressive disclosure
      cy.get('[data-testid="advanced-options"]').should('not.be.visible');
      cy.get('[data-testid="show-advanced"]').click();
      cy.get('[data-testid="advanced-options"]').should('be.visible');
    });
  });
}); 