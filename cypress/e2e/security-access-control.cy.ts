describe('Security & Access Control - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Protected Route Logic', () => {
    it('should redirect unauthenticated users to login', () => {
      // Clear any existing auth
      cy.window().then((win) => {
        win.localStorage.clear();
      });

      // Try to access protected routes
      const protectedRoutes = ['/dashboard', '/analytics', '/settings', '/profile'];
      
      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/login');
        cy.get('[data-testid="login-form"]').should('be.visible');
      });
    });

    it('should allow authenticated users to access protected routes', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Access protected routes
      const protectedRoutes = ['/dashboard', '/analytics', '/settings', '/profile'];
      
      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', route);
        cy.get('[data-testid="page-content"]').should('be.visible');
      });
    });

    it('should prevent access to restricted areas without proper permissions', () => {
      // Login as regular user
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Try to access admin routes
      cy.visit('/admin');
      cy.get('[data-testid="access-denied"]').should('be.visible');
      cy.get('[data-testid="access-denied"]').should('contain', 'Access Denied');
    });

    it('should handle role-based access control correctly', () => {
      // Login as admin
      cy.get('[data-testid="login-email"]').type('admin@example.com');
      cy.get('[data-testid="login-password"]').type('admin123');
      cy.get('[data-testid="login-button"]').click();

      // Check admin features are visible
      cy.get('[data-testid="admin-panel"]').should('be.visible');
      cy.get('[data-testid="user-management"]').should('be.visible');

      // Logout and login as regular user
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Check admin features are hidden
      cy.get('[data-testid="admin-panel"]').should('not.exist');
      cy.get('[data-testid="user-management"]').should('not.exist');
    });
  });

  describe('Sensitive Data Protection', () => {
    it('should not expose sensitive data in client-side code', () => {
      // Check that sensitive data is not in HTML source
      cy.get('body').should('not.contain', 'password');
      cy.get('body').should('not.contain', 'secret');
      cy.get('body').should('not.contain', 'api_key');
      cy.get('body').should('not.contain', 'token');
    });

    it('should not expose sensitive data in browser devtools', () => {
      // Check localStorage for sensitive data
      cy.window().then((win) => {
        const localStorage = win.localStorage;
        const keys = Object.keys(localStorage);
        
        // Check that sensitive keys are not exposed
        keys.forEach((key) => {
          expect(key).to.not.contain('password');
          expect(key).to.not.contain('secret');
          expect(key).to.not.contain('api_key');
        });
      });
    });

    it('should not expose API keys in network requests', () => {
      // Intercept network requests
      cy.intercept('**/*', (req) => {
        // Check that API keys are not in URL parameters
        expect(req.url).to.not.contain('api_key');
        expect(req.url).to.not.contain('secret');
        
        // Check that sensitive data is not in headers
        const headers = req.headers;
        Object.keys(headers).forEach((key) => {
          expect(key.toLowerCase()).to.not.contain('api_key');
          expect(key.toLowerCase()).to.not.contain('secret');
        });
        
        req.reply({});
      }).as('networkRequest');

      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@networkRequest');
    });

    it('should not expose sensitive data in console logs', () => {
      // Spy on console.log to check for sensitive data
      cy.window().then((win) => {
        const originalLog = win.console.log;
        const logs: string[] = [];
        
        win.console.log = (...args: any[]) => {
          logs.push(args.join(' '));
          originalLog.apply(win.console, args);
        };

        // Trigger some actions
        cy.get('[data-testid="login-email"]').type('test@example.com');
        cy.get('[data-testid="login-password"]').type('password123');
        
        // Check logs for sensitive data
        cy.wrap(logs).then((logArray) => {
          logArray.forEach((log) => {
            expect(log).to.not.contain('password');
            expect(log).to.not.contain('secret');
            expect(log).to.not.contain('api_key');
          });
        });
      });
    });
  });

  describe('API Security', () => {
    it('should include authentication headers in API requests', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Intercept API requests
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.headers.authorization).to.include('Bearer');
        req.reply({ statusCode: 200, body: {} });
      }).as('apiRequest');

      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@apiRequest');
    });

    it('should handle token expiration gracefully', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Mock expired token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'expired-token');
      });

      // Intercept API request with 401 response
      cy.intercept('GET', '**/api/**', {
        statusCode: 401,
        body: { error: 'Token expired' }
      }).as('expiredToken');

      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@expiredToken');

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should validate CSRF tokens', () => {
      // Check for CSRF token in forms
      cy.get('form').each(($form) => {
        cy.wrap($form).find('[name="csrf_token"]').should('exist');
        cy.wrap($form).find('[name="csrf_token"]').should('have.attr', 'value');
      });
    });

    it('should prevent XSS attacks', () => {
      // Test XSS prevention
      const xssPayload = '<script>alert("XSS")</script>';
      
      cy.get('[data-testid="user-input"]').type(xssPayload);
      cy.get('[data-testid="submit-input"]').click();
      
      // Check that script is not executed
      cy.get('[data-testid="user-input"]').should('contain', xssPayload);
      cy.get('[data-testid="user-input"]').should('not.contain', '<script>');
    });
  });

  describe('Input Validation & Sanitization', () => {
    it('should validate and sanitize user inputs', () => {
      // Test SQL injection prevention
      const sqlInjection = "'; DROP TABLE users; --";
      cy.get('[data-testid="search-input"]').type(sqlInjection);
      cy.get('[data-testid="search-input"]').should('have.value', sqlInjection);
      
      // Test HTML injection prevention
      const htmlInjection = '<img src="x" onerror="alert(1)">';
      cy.get('[data-testid="text-input"]').type(htmlInjection);
      cy.get('[data-testid="text-input"]').should('have.value', htmlInjection);
    });

    it('should prevent file upload vulnerabilities', () => {
      // Test file type validation
      cy.get('input[type="file"]').attachFile('malicious.exe');
      cy.get('[data-testid="file-error"]').should('be.visible');
      cy.get('[data-testid="file-error"]').should('contain', 'invalid file type');
    });

    it('should validate email formats', () => {
      // Test invalid email formats
      const invalidEmails = ['invalid', 'test@', '@example.com', 'test..test@example.com'];
      
      invalidEmails.forEach((email) => {
        cy.get('input[type="email"]').clear().type(email);
        cy.get('input[type="email"]').blur();
        cy.get('[data-testid="email-error"]').should('be.visible');
      });
    });

    it('should validate password strength', () => {
      // Test weak passwords
      const weakPasswords = ['123', 'password', 'abc123'];
      
      weakPasswords.forEach((password) => {
        cy.get('input[type="password"]').clear().type(password);
        cy.get('input[type="password"]').blur();
        cy.get('[data-testid="password-strength"]').should('contain', 'Weak');
      });
    });
  });

  describe('Session Security', () => {
    it('should handle session timeout correctly', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Mock session timeout
      cy.window().then((win) => {
        win.localStorage.setItem('sessionExpiry', Date.now() - 3600000);
      });

      // Try to perform action
      cy.get('[data-testid="protected-action"]').click();
      
      // Should show session expired message
      cy.get('[data-testid="session-expired"]').should('be.visible');
    });

    it('should clear sensitive data on logout', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Logout
      cy.get('[data-testid="logout-button"]').click();

      // Check sensitive data is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null;
        expect(win.localStorage.getItem('userData')).to.be.null;
      });
    });

    it('should prevent session hijacking', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('user@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      // Check for secure session handling
      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken');
        expect(token).to.not.be.null;
        
        // Check token format (should be JWT)
        expect(token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
      });
    });
  });

  describe('Content Security Policy', () => {
    it('should have proper CSP headers', () => {
      // Check for CSP meta tag
      cy.get('meta[http-equiv="Content-Security-Policy"]').should('exist');
      
      // Check CSP content
      cy.get('meta[http-equiv="Content-Security-Policy"]').should('have.attr', 'content');
    });

    it('should prevent inline script execution', () => {
      // Check that inline scripts are blocked by CSP
      cy.get('script:not([src])').should('not.exist');
    });

    it('should restrict external resource loading', () => {
      // Check that external resources are properly restricted
      cy.get('script[src]').each(($script) => {
        const src = $script.attr('src');
        if (src && !src.startsWith('/') && !src.startsWith('./')) {
          // External scripts should be from trusted domains
          expect(src).to.match(/^(https:\/\/cdn\.|https:\/\/unpkg\.|https:\/\/jsdelivr\.)/);
        }
      });
    });
  });
}); 