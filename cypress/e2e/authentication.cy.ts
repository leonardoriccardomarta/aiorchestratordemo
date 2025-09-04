describe('Authentication & Access Control Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('JWT Token Management', () => {
    it('should store JWT token correctly after login', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check token is stored
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.not.be.null;
      });
    });

    it('should include JWT token in API requests', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Intercept API request and check headers
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.headers.authorization).to.include('Bearer');
        req.reply({ statusCode: 200, body: {} });
      }).as('apiRequest');
      
      // Trigger API request
      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@apiRequest');
    });

    it('should refresh JWT token when expired', () => {
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

    it('should clear JWT token on logout', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Logout
      cy.get('[data-testid="logout-button"]').click();
      
      // Check token is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null;
      });
    });
  });

  describe('Protected Route Access', () => {
    it('should redirect unauthenticated users to login', () => {
      // Clear any existing auth
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      
      // Try to access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('should allow authenticated users to access protected routes', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="dashboard"]').should('be.visible');
    });

    it('should prevent authenticated users from accessing login page', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Try to access login page
      cy.visit('/login');
      cy.url().should('include', '/dashboard');
    });

    it('should prevent authenticated users from accessing signup page', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Try to access signup page
      cy.visit('/signup');
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should show admin features for admin users', () => {
      // Login as admin
      cy.get('[data-testid="login-email"]').type('admin@example.com');
      cy.get('[data-testid="login-password"]').type('admin123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check admin features are visible
      cy.get('[data-testid="admin-panel"]').should('be.visible');
      cy.get('[data-testid="user-management"]').should('be.visible');
      cy.get('[data-testid="system-settings"]').should('be.visible');
    });

    it('should hide admin features for regular users', () => {
      // Login as regular user
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('user123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check admin features are hidden
      cy.get('[data-testid="admin-panel"]').should('not.exist');
      cy.get('[data-testid="user-management"]').should('not.exist');
      cy.get('[data-testid="system-settings"]').should('not.exist');
    });

    it('should show user-specific content based on role', () => {
      // Login as admin
      cy.get('[data-testid="login-email"]').type('admin@example.com');
      cy.get('[data-testid="login-password"]').type('admin123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check admin content
      cy.get('[data-testid="admin-dashboard"]').should('be.visible');
      cy.get('[data-testid="admin-stats"]').should('be.visible');
      
      // Logout and login as user
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('user123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check user content
      cy.get('[data-testid="user-dashboard"]').should('be.visible');
      cy.get('[data-testid="user-stats"]').should('be.visible');
    });

    it('should prevent unauthorized access to admin routes', () => {
      // Login as regular user
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('user123');
      cy.get('[data-testid="login-button"]').click();
      
      // Try to access admin route
      cy.visit('/admin');
      cy.url().should('not.include', '/admin');
      cy.get('[data-testid="access-denied"]').should('be.visible');
    });
  });

  describe('Session Management', () => {
    it('should maintain session across page refreshes', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Navigate to protected page
      cy.visit('/dashboard');
      cy.get('[data-testid="dashboard"]').should('be.visible');
      
      // Refresh page
      cy.reload();
      cy.get('[data-testid="dashboard"]').should('be.visible');
    });

    it('should handle session timeout gracefully', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Mock session timeout
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'expired-token');
      });
      
      // Try to perform action
      cy.get('[data-testid="protected-action"]').click();
      cy.get('[data-testid="session-expired"]').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('should handle concurrent sessions', () => {
      // Login in first tab
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Open new tab and login with same credentials
      cy.window().then((win) => {
        win.open('/login', '_blank');
      });
      
      // Check for concurrent session warning
      cy.get('[data-testid="concurrent-session-warning"]').should('be.visible');
    });
  });

  describe('Security Features', () => {
    it('should prevent XSS attacks in user input', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Try to inject XSS
      const xssPayload = '<script>alert("XSS")</script>';
      cy.get('[data-testid="user-input"]').type(xssPayload);
      cy.get('[data-testid="submit-input"]').click();
      
      // Check that script is not executed
      cy.get('[data-testid="user-input"]').should('contain', xssPayload);
      cy.get('[data-testid="user-input"]').should('not.contain', '<script>');
    });

    it('should prevent CSRF attacks', () => {
      // Check CSRF token is present in forms
      cy.get('[data-testid="csrf-token"]').should('be.visible');
      cy.get('[data-testid="csrf-token"]').should('have.attr', 'value');
    });

    it('should handle brute force protection', () => {
      // Try multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="login-email"]').type('test@example.com');
        cy.get('[data-testid="login-password"]').type('wrongpassword');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="login-error"]').should('be.visible');
      }
      
      // Check account is temporarily locked
      cy.get('[data-testid="account-locked"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.disabled');
    });

    it('should validate password strength requirements', () => {
      // Test weak password
      cy.get('[data-testid="signup-password"]').type('weak');
      cy.get('[data-testid="password-strength"]').should('contain', 'Weak');
      cy.get('[data-testid="signup-button"]').should('be.disabled');
      
      // Test strong password
      cy.get('[data-testid="signup-password"]').clear().type('StrongPass123!');
      cy.get('[data-testid="password-strength"]').should('contain', 'Strong');
      cy.get('[data-testid="signup-button"]').should('not.be.disabled');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept network error
      cy.intercept('POST', '**/auth/login', { forceNetworkError: true }).as('loginError');
      
      // Try to login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check error handling
      cy.get('[data-testid="network-error"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should handle server errors gracefully', () => {
      // Intercept server error
      cy.intercept('POST', '**/auth/login', { statusCode: 500 }).as('serverError');
      
      // Try to login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check error handling
      cy.get('[data-testid="server-error"]').should('be.visible');
      cy.get('[data-testid="contact-support"]').should('be.visible');
    });

    it('should handle invalid credentials gracefully', () => {
      // Try invalid login
      cy.get('[data-testid="login-email"]').type('invalid@example.com');
      cy.get('[data-testid="login-password"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      
      // Check error message
      cy.get('[data-testid="invalid-credentials"]').should('be.visible');
      cy.get('[data-testid="forgot-password"]').should('be.visible');
    });
  });
}); 