describe('Core Functional Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Navigation Testing', () => {
    it('should navigate to all sidebar links correctly', () => {
      // Test sidebar navigation
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      cy.url().should('include', '/dashboard');
      
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.url().should('include', '/analytics');
      
      cy.get('[data-testid="sidebar-link-chatbot"]').click();
      cy.url().should('include', '/chatbot');
      
      cy.get('[data-testid="sidebar-link-workflows"]').click();
      cy.url().should('include', '/workflows');
      
      cy.get('[data-testid="sidebar-link-settings"]').click();
      cy.url().should('include', '/settings');
    });

    it('should navigate to all header links correctly', () => {
      // Test header navigation
      cy.get('[data-testid="header-link-profile"]').click();
      cy.url().should('include', '/profile');
      
      cy.get('[data-testid="header-link-notifications"]').click();
      cy.get('[data-testid="notifications-panel"]').should('be.visible');
    });

    it('should handle breadcrumb navigation', () => {
      // Navigate to nested page
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="analytics-subpage"]').click();
      
      // Test breadcrumb
      cy.get('[data-testid="breadcrumb-analytics"]').should('be.visible');
      cy.get('[data-testid="breadcrumb-analytics"]').click();
      cy.url().should('include', '/analytics');
    });

    it('should handle back button navigation', () => {
      // Navigate to page
      cy.get('[data-testid="sidebar-link-settings"]').click();
      cy.url().should('include', '/settings');
      
      // Test back button
      cy.get('[data-testid="back-button"]').click();
      cy.url().should('not.include', '/settings');
    });
  });

  describe('Button & Toggle Functionality', () => {
    it('should handle all button clicks correctly', () => {
      // Test primary buttons
      cy.get('[data-testid="primary-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
      
      // Test secondary buttons
      cy.get('[data-testid="secondary-button"]').click();
      cy.get('[data-testid="info-message"]').should('be.visible');
      
      // Test danger buttons
      cy.get('[data-testid="danger-button"]').click();
      cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    });

    it('should handle toggle switches correctly', () => {
      // Test toggle switches
      cy.get('[data-testid="toggle-switch"]').click();
      cy.get('[data-testid="toggle-switch"]').should('have.class', 'active');
      
      cy.get('[data-testid="toggle-switch"]').click();
      cy.get('[data-testid="toggle-switch"]').should('not.have.class', 'active');
    });

    it('should handle dropdown menus correctly', () => {
      // Test dropdown opening
      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-menu"]').should('be.visible');
      
      // Test dropdown item selection
      cy.get('[data-testid="dropdown-item"]').first().click();
      cy.get('[data-testid="dropdown-menu"]').should('not.be.visible');
    });
  });

  describe('Form Validation & Functionality', () => {
    it('should validate required fields', () => {
      // Test empty form submission
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="validation-error"]').should('be.visible');
      
      // Test required field validation
      cy.get('input[required]').each(($input) => {
        cy.wrap($input).focus().blur();
        cy.get('[data-testid="validation-error"]').should('be.visible');
      });
    });

    it('should validate email format', () => {
      // Test invalid email
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="email"]').blur();
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      // Test valid email
      cy.get('input[type="email"]').clear().type('valid@email.com');
      cy.get('input[type="email"]').blur();
      cy.get('[data-testid="email-error"]').should('not.be.visible');
    });

    it('should validate password strength', () => {
      // Test weak password
      cy.get('input[type="password"]').type('weak');
      cy.get('input[type="password"]').blur();
      cy.get('[data-testid="password-strength"]').should('contain', 'Weak');
      
      // Test strong password
      cy.get('input[type="password"]').clear().type('StrongPass123!');
      cy.get('input[type="password"]').blur();
      cy.get('[data-testid="password-strength"]').should('contain', 'Strong');
    });

    it('should validate max length constraints', () => {
      // Test max length
      const longText = 'a'.repeat(1000);
      cy.get('input[data-maxlength="100"]').type(longText);
      cy.get('input[data-maxlength="100"]').should('have.value.length', 100);
    });

    it('should handle form submission correctly', () => {
      // Fill form with valid data
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('StrongPass123!');
      
      // Submit form
      cy.get('[data-testid="submit-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('should handle form reset correctly', () => {
      // Fill form
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      
      // Reset form
      cy.get('[data-testid="reset-button"]').click();
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
    });
  });

  describe('Modal & Dialog Functionality', () => {
    it('should open and close modals correctly', () => {
      // Open modal
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Close modal with close button
      cy.get('[data-testid="close-modal"]').click();
      cy.get('[data-testid="modal"]').should('not.be.visible');
    });

    it('should close modal with escape key', () => {
      // Open modal
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Close with escape key
      cy.get('body').type('{esc}');
      cy.get('[data-testid="modal"]').should('not.be.visible');
    });

    it('should close modal by clicking outside', () => {
      // Open modal
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Click outside modal
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.be.visible');
    });

    it('should handle confirmation dialogs', () => {
      // Trigger confirmation dialog
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="confirm-dialog"]').should('be.visible');
      
      // Cancel confirmation
      cy.get('[data-testid="cancel-button"]').click();
      cy.get('[data-testid="confirm-dialog"]').should('not.be.visible');
      
      // Confirm action
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="confirm-button"]').click();
      cy.get('[data-testid="success-message"]').should('be.visible');
    });
  });

  describe('Loading States & Async Actions', () => {
    it('should show loading spinners during async actions', () => {
      // Trigger async action
      cy.get('[data-testid="async-button"]').click();
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      
      // Wait for completion
      cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.be.visible');
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('should show skeleton loading for data fetching', () => {
      // Navigate to data-heavy page
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="skeleton-loader"]').should('be.visible');
      
      // Wait for data to load
      cy.get('[data-testid="skeleton-loader"]', { timeout: 10000 }).should('not.be.visible');
      cy.get('[data-testid="analytics-data"]').should('be.visible');
    });

    it('should handle loading states for forms', () => {
      // Fill and submit form
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('[data-testid="submit-button"]').click();
      
      // Check loading state
      cy.get('[data-testid="submit-button"]').should('be.disabled');
      cy.get('[data-testid="submit-button"]').should('contain', 'Submitting');
      
      // Wait for completion
      cy.get('[data-testid="submit-button"]', { timeout: 10000 }).should('not.be.disabled');
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('should handle multiple concurrent async actions', () => {
      // Trigger multiple async actions
      cy.get('[data-testid="async-button-1"]').click();
      cy.get('[data-testid="async-button-2"]').click();
      cy.get('[data-testid="async-button-3"]').click();
      
      // Check all loading states
      cy.get('[data-testid="loading-spinner"]').should('have.length', 3);
      
      // Wait for all to complete
      cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('have.length', 0);
    });
  });

  describe('State Management & Updates', () => {
    it('should update UI state correctly', () => {
      // Test toggle state
      cy.get('[data-testid="toggle-switch"]').click();
      cy.get('[data-testid="toggle-status"]').should('contain', 'Enabled');
      
      cy.get('[data-testid="toggle-switch"]').click();
      cy.get('[data-testid="toggle-status"]').should('contain', 'Disabled');
    });

    it('should persist state across navigation', () => {
      // Set state
      cy.get('[data-testid="toggle-switch"]').click();
      cy.get('[data-testid="toggle-status"]').should('contain', 'Enabled');
      
      // Navigate away and back
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      
      // Check state is preserved
      cy.get('[data-testid="toggle-status"]').should('contain', 'Enabled');
    });

    it('should handle real-time updates', () => {
      // Trigger real-time update
      cy.get('[data-testid="refresh-data"]').click();
      cy.get('[data-testid="data-timestamp"]').should('contain', new Date().getFullYear());
    });
  });
}); 