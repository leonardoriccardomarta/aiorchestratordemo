describe('Functional Testing - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Route & Page Rendering', () => {
    it('should render all routes properly without 404s', () => {
      // Test all main routes
      const routes = [
        '/',
        '/dashboard',
        '/analytics',
        '/chatbot',
        '/workflows',
        '/settings',
        '/profile',
        '/help',
        '/pricing'
      ];

      routes.forEach((route) => {
        cy.visit(route);
        cy.get('body').should('not.contain', '404');
        cy.get('body').should('not.contain', 'Page not found');
        cy.get('[data-testid="page-content"]').should('be.visible');
      });
    });

    it('should not have blank screens on any page', () => {
      // Test for blank screens
      cy.get('body').should('not.be.empty');
      cy.get('main').should('be.visible');
      cy.get('[data-testid="main-content"]').should('be.visible');
      
      // Check for loading states that might cause blank screens
      cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.be.visible');
    });

    it('should handle 404 pages gracefully', () => {
      // Test non-existent routes
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      cy.get('[data-testid="404-page"]').should('be.visible');
      cy.get('[data-testid="404-title"]').should('contain', '404');
      cy.get('[data-testid="back-home"]').should('be.visible');
    });

    it('should render all components correctly', () => {
      // Test component rendering
      cy.get('[data-testid="header"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="main-content"]').should('be.visible');
      cy.get('[data-testid="footer"]').should('be.visible');
      
      // Test text readability
      cy.get('h1, h2, h3, p').each(($el) => {
        cy.wrap($el).should('be.visible');
        cy.wrap($el).should('not.have.text', '');
      });
    });

    it('should render images and icons correctly', () => {
      // Test image rendering
      cy.get('img').each(($img) => {
        cy.wrap($img).should('be.visible');
        cy.wrap($img).should('have.attr', 'src');
        cy.wrap($img).should('not.have.attr', 'src', '');
      });
      
      // Test icon rendering
      cy.get('[data-testid="icon"]').each(($icon) => {
        cy.wrap($icon).should('be.visible');
      });
    });
  });

  describe('Interactive Elements', () => {
    it('should handle all buttons correctly', () => {
      // Test primary buttons
      cy.get('[data-testid="primary-button"]').each(($btn) => {
        cy.wrap($btn).should('be.visible');
        cy.wrap($btn).should('not.be.disabled');
        cy.wrap($btn).click();
        cy.get('[data-testid="button-action"]').should('be.visible');
      });
      
      // Test secondary buttons
      cy.get('[data-testid="secondary-button"]').each(($btn) => {
        cy.wrap($btn).should('be.visible');
        cy.wrap($btn).should('not.be.disabled');
      });
    });

    it('should handle all inputs correctly', () => {
      // Test text inputs
      cy.get('input[type="text"]').each(($input) => {
        cy.wrap($input).should('be.visible');
        cy.wrap($input).should('not.be.disabled');
        cy.wrap($input).type('test input');
        cy.wrap($input).should('have.value', 'test input');
      });
      
      // Test email inputs
      cy.get('input[type="email"]').each(($input) => {
        cy.wrap($input).should('be.visible');
        cy.wrap($input).type('test@example.com');
        cy.wrap($input).should('have.value', 'test@example.com');
      });
    });

    it('should handle forms correctly', () => {
      // Test form submission
      cy.get('form').each(($form) => {
        cy.wrap($form).should('be.visible');
        
        // Fill required fields
        cy.wrap($form).find('input[required]').each(($input) => {
          cy.wrap($input).type('test value');
        });
        
        // Submit form
        cy.wrap($form).find('button[type="submit"]').click();
        cy.get('[data-testid="form-success"]').should('be.visible');
      });
    });

    it('should handle modals correctly', () => {
      // Test modal opening
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Test modal content
      cy.get('[data-testid="modal-content"]').should('be.visible');
      
      // Test modal closing
      cy.get('[data-testid="close-modal"]').click();
      cy.get('[data-testid="modal"]').should('not.be.visible');
    });

    it('should handle tabs correctly', () => {
      // Test tab switching
      cy.get('[data-testid="tab"]').each(($tab, index) => {
        cy.wrap($tab).click();
        cy.get('[data-testid="tab-content"]').eq(index).should('be.visible');
      });
    });

    it('should handle dropdowns correctly', () => {
      // Test dropdown opening
      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-menu"]').should('be.visible');
      
      // Test dropdown item selection
      cy.get('[data-testid="dropdown-item"]').first().click();
      cy.get('[data-testid="dropdown-menu"]').should('not.be.visible');
    });

    it('should handle links correctly', () => {
      // Test internal links
      cy.get('a[href^="/"]').each(($link) => {
        const href = $link.attr('href');
        cy.wrap($link).click();
        cy.url().should('include', href);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      // Test empty state handling
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state-message"]').should('contain', 'No data available');
      cy.get('[data-testid="empty-state-action"]').should('be.visible');
    });

    it('should handle invalid input gracefully', () => {
      // Test invalid email
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="email"]').blur();
      cy.get('[data-testid="validation-error"]').should('be.visible');
      
      // Test invalid password
      cy.get('input[type="password"]').type('weak');
      cy.get('input[type="password"]').blur();
      cy.get('[data-testid="password-strength"]').should('contain', 'Weak');
    });

    it('should handle timeouts gracefully', () => {
      // Simulate slow network
      cy.intercept('**/*', { delay: 10000 }).as('slowRequest');
      
      // Trigger action that might timeout
      cy.get('[data-testid="fetch-data"]').click();
      
      // Check timeout handling
      cy.get('[data-testid="timeout-error"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('**/*', { forceNetworkError: true }).as('networkError');
      
      // Trigger action
      cy.get('[data-testid="fetch-data"]').click();
      
      // Check error handling
      cy.get('[data-testid="network-error"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Responsive Testing', () => {
    it('should be responsive on mobile devices', () => {
      // Test mobile viewport
      cy.viewport('iphone-x');
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('not.be.visible');
      
      // Test mobile menu
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('should be responsive on tablet devices', () => {
      // Test tablet viewport
      cy.viewport('ipad-2');
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
    });

    it('should be responsive on desktop devices', () => {
      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="main-content"]').should('be.visible');
    });

    it('should handle orientation changes', () => {
      // Test landscape orientation
      cy.viewport(1024, 768);
      cy.get('[data-testid="dashboard"]').should('be.visible');
      
      // Test portrait orientation
      cy.viewport(768, 1024);
      cy.get('[data-testid="dashboard"]').should('be.visible');
    });
  });

  describe('Cross-Browser Testing', () => {
    it('should work in Chrome', () => {
      // Chrome-specific tests
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('[data-testid="primary-button"]').click();
      cy.get('[data-testid="button-action"]').should('be.visible');
    });

    it('should work in Firefox', () => {
      // Firefox-specific tests
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });

    it('should work in Safari', () => {
      // Safari-specific tests
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('select').first().select('option1');
      cy.get('select').first().should('have.value', 'option1');
    });

    it('should work in Edge', () => {
      // Edge-specific tests
      cy.get('[data-testid="dashboard"]').should('be.visible');
      cy.get('input[type="file"]').attachFile('test-image.jpg');
      cy.get('[data-testid="file-upload"]').should('be.visible');
    });
  });

  describe('Internationalization', () => {
    it('should support multiple languages', () => {
      // Test language switching
      cy.get('[data-testid="language-selector"]').click();
      cy.get('[data-testid="language-option"]').contains('Italian').click();
      
      // Check content is translated
      cy.get('[data-testid="translated-content"]').should('contain', 'Benvenuto');
    });

    it('should handle RTL languages', () => {
      // Test RTL language
      cy.get('[data-testid="language-selector"]').click();
      cy.get('[data-testid="language-option"]').contains('Arabic').click();
      
      // Check RTL layout
      cy.get('body').should('have.attr', 'dir', 'rtl');
    });

    it('should format dates correctly', () => {
      // Test date formatting
      cy.get('[data-testid="date-display"]').should('contain', new Date().getFullYear());
    });

    it('should format numbers correctly', () => {
      // Test number formatting
      cy.get('[data-testid="number-display"]').should('contain', '1,234');
    });
  });
}); 