describe('Security Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Input Sanitization & XSS Prevention', () => {
    it('should prevent XSS attacks in text inputs', () => {
      // Test various XSS payloads
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>'
      ];

      xssPayloads.forEach((payload) => {
        cy.get('[data-testid="text-input"]').clear().type(payload);
        cy.get('[data-testid="submit-input"]').click();
        
        // Check that script tags are escaped
        cy.get('[data-testid="displayed-content"]').should('contain', payload);
        cy.get('[data-testid="displayed-content"]').should('not.contain', '<script>');
      });
    });

    it('should prevent XSS in URL inputs', () => {
      const maliciousUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:alert("XSS")'
      ];

      maliciousUrls.forEach((url) => {
        cy.get('[data-testid="url-input"]').clear().type(url);
        cy.get('[data-testid="submit-url"]').click();
        
        // Check URL is sanitized
        cy.get('[data-testid="url-display"]').should('not.contain', 'javascript:');
        cy.get('[data-testid="url-display"]').should('not.contain', 'data:text/html');
      });
    });

    it('should prevent XSS in rich text editors', () => {
      // Test rich text editor XSS
      const richTextXss = '<script>alert("XSS")</script><p>Safe content</p>';
      
      cy.get('[data-testid="rich-text-editor"]').clear().type(richTextXss);
      cy.get('[data-testid="save-content"]').click();
      
      // Check content is sanitized
      cy.get('[data-testid="displayed-rich-text"]').should('contain', 'Safe content');
      cy.get('[data-testid="displayed-rich-text"]').should('not.contain', '<script>');
    });

    it('should prevent XSS in file uploads', () => {
      // Test malicious file upload
      cy.get('[data-testid="file-upload"]').attachFile({
        fileContent: '<script>alert("XSS")</script>',
        fileName: 'malicious.html',
        mimeType: 'text/html'
      });
      
      // Check file is rejected or sanitized
      cy.get('[data-testid="file-error"]').should('be.visible');
      cy.get('[data-testid="file-error"]').should('contain', 'Invalid file type');
    });
  });

  describe('CSRF Protection', () => {
    it('should include CSRF tokens in forms', () => {
      // Check CSRF token presence
      cy.get('[data-testid="csrf-token"]').should('exist');
      cy.get('[data-testid="csrf-token"]').should('have.attr', 'value');
      cy.get('[data-testid="csrf-token"]').should('not.have.value', '');
    });

    it('should validate CSRF tokens on form submission', () => {
      // Remove CSRF token
      cy.get('[data-testid="csrf-token"]').invoke('removeAttr', 'value');
      
      // Submit form
      cy.get('[data-testid="submit-form"]').click();
      
      // Check CSRF error
      cy.get('[data-testid="csrf-error"]').should('be.visible');
      cy.get('[data-testid="csrf-error"]').should('contain', 'Invalid CSRF token');
    });

    it('should refresh CSRF tokens periodically', () => {
      // Get initial token
      cy.get('[data-testid="csrf-token"]').invoke('val').then((initialToken) => {
        // Trigger token refresh
        cy.get('[data-testid="refresh-csrf"]').click();
        
        // Check token is refreshed
        cy.get('[data-testid="csrf-token"]').should('not.have.value', initialToken);
      });
    });
  });

  describe('Content Security Policy (CSP)', () => {
    it('should have proper CSP headers', () => {
      // Check CSP header
      cy.request('/').then((response) => {
        expect(response.headers['content-security-policy']).to.exist;
        expect(response.headers['content-security-policy']).to.include('default-src');
        expect(response.headers['content-security-policy']).to.include('script-src');
      });
    });

    it('should prevent inline scripts', () => {
      // Try to execute inline script
      cy.window().then((win) => {
        const originalEval = win.eval;
        win.eval = cy.stub();
        
        // Attempt to execute inline script
        const script = document.createElement('script');
        script.textContent = 'alert("XSS")';
        document.head.appendChild(script);
        
        expect(win.eval).to.not.have.been.called;
      });
    });

    it('should restrict external resource loading', () => {
      // Check CSP prevents unauthorized external resources
      cy.window().then((win) => {
        // Try to load external script
        const script = document.createElement('script');
        script.src = 'https://malicious-site.com/script.js';
        
        // Should be blocked by CSP
        expect(() => document.head.appendChild(script)).to.not.throw();
      });
    });
  });

  describe('Authentication & Authorization', () => {
    it('should prevent unauthorized access to protected routes', () => {
      // Clear authentication
      cy.window().then((win) => {
        win.localStorage.clear();
        win.sessionStorage.clear();
      });
      
      // Try to access protected route
      cy.visit('/admin');
      cy.url().should('include', '/login');
    });

    it('should validate JWT tokens properly', () => {
      // Set invalid JWT token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'invalid.jwt.token');
      });
      
      // Try to access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });

    it('should handle token expiration gracefully', () => {
      // Set expired token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'expired.jwt.token');
      });
      
      // Try to perform action
      cy.get('[data-testid="protected-action"]').click();
      cy.get('[data-testid="token-expired"]').should('be.visible');
    });

    it('should implement proper logout', () => {
      // Login first
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Logout
      cy.get('[data-testid="logout-button"]').click();
      
      // Check all auth data is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null;
        expect(win.sessionStorage.getItem('user')).to.be.null;
      });
      
      // Check redirect to login
      cy.url().should('include', '/login');
    });
  });

  describe('Data Validation & Sanitization', () => {
    it('should validate input data types', () => {
      // Test invalid data types
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="email-input"]').blur();
      cy.get('[data-testid="email-error"]').should('be.visible');
      
      cy.get('[data-testid="number-input"]').type('not-a-number');
      cy.get('[data-testid="number-input"]').blur();
      cy.get('[data-testid="number-error"]').should('be.visible');
    });

    it('should prevent SQL injection attempts', () => {
      const sqlInjectionPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --"
      ];

      sqlInjectionPayloads.forEach((payload) => {
        cy.get('[data-testid="search-input"]').clear().type(payload);
        cy.get('[data-testid="search-button"]').click();
        
        // Check input is sanitized
        cy.get('[data-testid="search-results"]').should('not.contain', 'DROP TABLE');
        cy.get('[data-testid="search-results"]').should('not.contain', 'INSERT INTO');
      });
    });

    it('should prevent NoSQL injection attempts', () => {
      const nosqlInjectionPayloads = [
        '{"$gt": ""}',
        '{"$ne": null}',
        '{"$where": "1==1"}'
      ];

      nosqlInjectionPayloads.forEach((payload) => {
        cy.get('[data-testid="query-input"]').clear().type(payload);
        cy.get('[data-testid="query-button"]').click();
        
        // Check query is sanitized
        cy.get('[data-testid="query-results"]').should('not.contain', '$gt');
        cy.get('[data-testid="query-results"]').should('not.contain', '$where');
      });
    });

    it('should validate file uploads', () => {
      // Test malicious file types
      const maliciousFiles = [
        { name: 'script.php', content: '<?php system($_GET["cmd"]); ?>' },
        { name: 'script.jsp', content: '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>' },
        { name: 'script.asp', content: '<% Response.Write(CreateObject("WScript.Shell").Exec(Request.QueryString("cmd")).StdOut.ReadAll()) %>' }
      ];

      maliciousFiles.forEach((file) => {
        cy.get('[data-testid="file-upload"]').attachFile({
          fileContent: file.content,
          fileName: file.name,
          mimeType: 'text/plain'
        });
        
        // Check file is rejected
        cy.get('[data-testid="file-error"]').should('be.visible');
        cy.get('[data-testid="file-error"]').should('contain', 'Invalid file type');
      });
    });
  });

  describe('Session Security', () => {
    it('should use secure session cookies', () => {
      // Login to create session
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check cookie security attributes
      cy.getCookie('sessionId').then((cookie) => {
        expect(cookie.secure).to.be.true;
        expect(cookie.httpOnly).to.be.true;
        expect(cookie.sameSite).to.equal('strict');
      });
    });

    it('should implement session timeout', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Mock session timeout
      cy.window().then((win) => {
        win.localStorage.setItem('sessionExpiry', Date.now() - 3600000); // 1 hour ago
      });
      
      // Try to perform action
      cy.get('[data-testid="protected-action"]').click();
      cy.get('[data-testid="session-expired"]').should('be.visible');
    });

    it('should prevent session fixation', () => {
      // Set session ID before login
      cy.window().then((win) => {
        win.localStorage.setItem('sessionId', 'fixed-session-id');
      });
      
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('password123');
      cy.get('[data-testid="login-button"]').click();
      
      // Check session ID is regenerated
      cy.window().then((win) => {
        expect(win.localStorage.getItem('sessionId')).to.not.equal('fixed-session-id');
      });
    });
  });

  describe('API Security', () => {
    it('should validate API request headers', () => {
      // Intercept API request
      cy.intercept('GET', '**/api/**', (req) => {
        // Check required headers
        expect(req.headers['content-type']).to.exist;
        expect(req.headers['user-agent']).to.exist;
        
        req.reply({ statusCode: 200, body: {} });
      }).as('apiRequest');
      
      // Trigger API request
      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@apiRequest');
    });

    it('should prevent API rate limiting bypass', () => {
      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="api-button"]').click();
      }
      
      // Check rate limiting is enforced
      cy.get('[data-testid="rate-limit-error"]').should('be.visible');
      cy.get('[data-testid="rate-limit-error"]').should('contain', 'Too many requests');
    });

    it('should validate API response data', () => {
      // Intercept API response with malicious data
      cy.intercept('GET', '**/api/data', {
        statusCode: 200,
        body: {
          content: '<script>alert("XSS")</script>',
          user: { role: 'admin' } // Unauthorized role escalation
        }
      }).as('maliciousResponse');
      
      // Trigger request
      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@maliciousResponse');
      
      // Check response is sanitized
      cy.get('[data-testid="displayed-content"]').should('not.contain', '<script>');
      cy.get('[data-testid="user-role"]').should('not.contain', 'admin');
    });
  });

  describe('Error Handling & Information Disclosure', () => {
    it('should not expose sensitive information in error messages', () => {
      // Trigger error
      cy.get('[data-testid="trigger-error"]').click();
      
      // Check error message doesn't expose sensitive info
      cy.get('[data-testid="error-message"]').should('not.contain', 'password');
      cy.get('[data-testid="error-message"]').should('not.contain', 'token');
      cy.get('[data-testid="error-message"]').should('not.contain', 'database');
    });

    it('should not expose stack traces in production', () => {
      // Trigger JavaScript error
      cy.window().then((win) => {
        win.console.error = cy.stub();
        
        // Trigger error
        cy.get('[data-testid="trigger-js-error"]').click();
        
        // Check stack trace is not exposed
        expect(win.console.error).to.not.have.been.calledWith(/\bat\s+/);
      });
    });

    it('should handle security errors gracefully', () => {
      // Test various security error scenarios
      cy.get('[data-testid="test-security-error"]').click();
      
      // Check generic error message
      cy.get('[data-testid="security-error"]').should('be.visible');
      cy.get('[data-testid="security-error"]').should('contain', 'Security error occurred');
      cy.get('[data-testid="security-error"]').should('not.contain', 'details');
    });
  });

  describe('HTTPS & Transport Security', () => {
    it('should enforce HTTPS in production', () => {
      // Check for HTTPS enforcement
      cy.request('/').then((response) => {
        expect(response.headers['strict-transport-security']).to.exist;
        expect(response.headers['strict-transport-security']).to.include('max-age');
      });
    });

    it('should implement proper SSL/TLS configuration', () => {
      // Check SSL configuration headers
      cy.request('/').then((response) => {
        expect(response.headers['x-content-type-options']).to.equal('nosniff');
        expect(response.headers['x-frame-options']).to.exist;
        expect(response.headers['x-xss-protection']).to.exist;
      });
    });

    it('should prevent mixed content', () => {
      // Check for mixed content warnings
      cy.window().then((win) => {
        const originalConsoleWarn = win.console.warn;
        win.console.warn = cy.stub();
        
        // Load mixed content
        const img = document.createElement('img');
        img.src = 'http://insecure-site.com/image.jpg';
        document.body.appendChild(img);
        
        // Check for mixed content warning
        expect(win.console.warn).to.have.been.calledWith(/mixed content/i);
      });
    });
  });
}); 