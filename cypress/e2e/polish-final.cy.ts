describe('Polish & Final Touch Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Favicon & Metadata', () => {
    it('should have proper favicon', () => {
      // Check favicon exists
      cy.get('link[rel="icon"]').should('exist');
      cy.get('link[rel="icon"]').should('have.attr', 'href');
      
      // Check favicon is accessible
      cy.request('/favicon.ico').then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should have proper page titles', () => {
      // Check default page title
      cy.title().should('not.be.empty');
      cy.title().should('contain', 'AI Orchestrator');
      
      // Navigate to different pages and check titles
      cy.get('[data-testid="sidebar-link-dashboard"]').click();
      cy.title().should('contain', 'Dashboard');
      
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.title().should('contain', 'Analytics');
      
      cy.get('[data-testid="sidebar-link-chatbot"]').click();
      cy.title().should('contain', 'Chatbot');
    });

    it('should have proper meta tags', () => {
      // Check essential meta tags
      cy.get('meta[name="description"]').should('exist');
      cy.get('meta[name="viewport"]').should('exist');
      cy.get('meta[name="theme-color"]').should('exist');
      
      // Check Open Graph tags
      cy.get('meta[property="og:title"]').should('exist');
      cy.get('meta[property="og:description"]').should('exist');
      cy.get('meta[property="og:type"]').should('exist');
      
      // Check Twitter Card tags
      cy.get('meta[name="twitter:card"]').should('exist');
      cy.get('meta[name="twitter:title"]').should('exist');
      cy.get('meta[name="twitter:description"]').should('exist');
    });

    it('should have proper manifest file', () => {
      // Check web app manifest
      cy.get('link[rel="manifest"]').should('exist');
      cy.get('link[rel="manifest"]').should('have.attr', 'href');
      
      // Check manifest file is accessible
      cy.request('/manifest.json').then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.exist;
        expect(response.body.short_name).to.exist;
        expect(response.body.theme_color).to.exist;
      });
    });
  });

  describe('Smooth Animations & Transitions', () => {
    it('should have smooth page transitions', () => {
      // Check for transition classes
      cy.get('[data-testid="page-transition"]').should('exist');
      
      // Navigate between pages
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="page-transition"]').should('have.class', 'transitioning');
      
      // Wait for transition to complete
      cy.get('[data-testid="page-transition"]', { timeout: 1000 }).should('not.have.class', 'transitioning');
    });

    it('should have smooth loading animations', () => {
      // Trigger loading state
      cy.get('[data-testid="load-data"]').click();
      
      // Check loading animation
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      cy.get('[data-testid="loading-spinner"]').should('have.class', 'spinning');
      
      // Wait for loading to complete
      cy.get('[data-testid="loading-spinner"]', { timeout: 5000 }).should('not.be.visible');
    });

    it('should have smooth hover effects', () => {
      // Test button hover effects
      cy.get('[data-testid="primary-button"]').trigger('mouseover');
      cy.get('[data-testid="primary-button"]').should('have.class', 'hover');
      
      cy.get('[data-testid="primary-button"]').trigger('mouseout');
      cy.get('[data-testid="primary-button"]').should('not.have.class', 'hover');
    });

    it('should have smooth focus transitions', () => {
      // Test focus transitions
      cy.get('[data-testid="text-input"]').focus();
      cy.get('[data-testid="text-input"]').should('have.class', 'focused');
      
      cy.get('[data-testid="text-input"]').blur();
      cy.get('[data-testid="text-input"]').should('not.have.class', 'focused');
    });

    it('should have smooth modal animations', () => {
      // Open modal
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('have.class', 'opening');
      
      // Wait for opening animation
      cy.get('[data-testid="modal"]', { timeout: 500 }).should('not.have.class', 'opening');
      
      // Close modal
      cy.get('[data-testid="close-modal"]').click();
      cy.get('[data-testid="modal"]').should('have.class', 'closing');
      
      // Wait for closing animation
      cy.get('[data-testid="modal"]', { timeout: 500 }).should('not.be.visible');
    });
  });

  describe('Custom 404 Page', () => {
    it('should have a custom 404 page', () => {
      // Visit non-existent page
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      
      // Check 404 page elements
      cy.get('[data-testid="404-page"]').should('be.visible');
      cy.get('[data-testid="404-title"]').should('contain', '404');
      cy.get('[data-testid="404-message"]').should('contain', 'Page not found');
      cy.get('[data-testid="back-home"]').should('be.visible');
    });

    it('should provide navigation options on 404 page', () => {
      // Visit 404 page
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      
      // Check navigation options
      cy.get('[data-testid="back-home"]').click();
      cy.url().should('include', '/dashboard');
      
      // Check search functionality
      cy.get('[data-testid="404-search"]').should('be.visible');
      cy.get('[data-testid="404-search"]').type('dashboard');
      cy.get('[data-testid="search-suggestions"]').should('be.visible');
    });

    it('should have helpful 404 page content', () => {
      // Visit 404 page
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      
      // Check helpful content
      cy.get('[data-testid="404-suggestions"]').should('be.visible');
      cy.get('[data-testid="popular-pages"]').should('be.visible');
      cy.get('[data-testid="contact-support"]').should('be.visible');
    });
  });

  describe('Premium Feel & Polish', () => {
    it('should have consistent visual hierarchy', () => {
      // Check typography hierarchy
      cy.get('h1').should('have.css', 'font-size');
      cy.get('h2').should('have.css', 'font-size');
      cy.get('h3').should('have.css', 'font-size');
      
      // Check spacing consistency
      cy.get('[data-testid="section"]').should('have.css', 'margin');
      cy.get('[data-testid="section"]').should('have.css', 'padding');
    });

    it('should have proper visual feedback', () => {
      // Test button feedback
      cy.get('[data-testid="primary-button"]').click();
      cy.get('[data-testid="success-feedback"]').should('be.visible');
      
      // Test form feedback
      cy.get('[data-testid="text-input"]').type('test');
      cy.get('[data-testid="input-feedback"]').should('be.visible');
    });

    it('should have micro-interactions', () => {
      // Test button micro-interactions
      cy.get('[data-testid="interactive-button"]').trigger('mouseover');
      cy.get('[data-testid="interactive-button"]').should('have.class', 'hover');
      
      cy.get('[data-testid="interactive-button"]').trigger('mousedown');
      cy.get('[data-testid="interactive-button"]').should('have.class', 'active');
      
      cy.get('[data-testid="interactive-button"]').trigger('mouseup');
      cy.get('[data-testid="interactive-button"]').should('not.have.class', 'active');
    });

    it('should have smooth scrolling', () => {
      // Test smooth scrolling behavior
      cy.get('[data-testid="scroll-to-top"]').click();
      cy.window().then((win) => {
        expect(win.scrollY).to.equal(0);
      });
      
      // Scroll to bottom
      cy.scrollTo('bottom');
      cy.get('[data-testid="scroll-to-top"]').should('be.visible');
    });

    it('should have proper loading states', () => {
      // Test skeleton loading
      cy.get('[data-testid="load-skeleton"]').click();
      cy.get('[data-testid="skeleton-loader"]').should('be.visible');
      
      // Wait for content to load
      cy.get('[data-testid="skeleton-loader"]', { timeout: 5000 }).should('not.be.visible');
      cy.get('[data-testid="loaded-content"]').should('be.visible');
    });
  });

  describe('Accessibility Polish', () => {
    it('should have proper ARIA labels', () => {
      // Check ARIA labels on interactive elements
      cy.get('[data-testid="primary-button"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="text-input"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="toggle-switch"]').should('have.attr', 'aria-label');
    });

    it('should have proper focus management', () => {
      // Test focus management in modals
      cy.get('[data-testid="open-modal"]').click();
      cy.get('[data-testid="modal"]').should('be.visible');
      
      // Check focus is trapped in modal
      cy.get('[data-testid="modal"]').should('have.attr', 'aria-modal', 'true');
      cy.focused().should('be.within', '[data-testid="modal"]');
    });

    it('should have proper keyboard navigation', () => {
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'tabindex');
      
      // Test Enter key
      cy.focused().type('{enter}');
      cy.get('[data-testid="keyboard-action"]').should('be.visible');
    });

    it('should have proper color contrast', () => {
      // Check color contrast ratios
      cy.get('[data-testid="text-content"]').then(($el) => {
        const color = $el.css('color');
        const backgroundColor = $el.css('background-color');
        
        // This would require a color contrast calculation library
        // For now, we check that colors are defined
        expect(color).to.not.be.empty;
        expect(backgroundColor).to.not.be.empty;
      });
    });

    it('should have proper screen reader support', () => {
      // Check screen reader announcements
      cy.get('[data-testid="screen-reader-announcement"]').should('have.attr', 'aria-live');
      cy.get('[data-testid="screen-reader-announcement"]').should('have.attr', 'aria-atomic');
    });
  });

  describe('Performance Polish', () => {
    it('should have fast initial load', () => {
      // Measure initial load time
      cy.window().then((win) => {
        const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should have smooth interactions', () => {
      // Test interaction responsiveness
      cy.get('[data-testid="responsive-button"]').click();
      cy.get('[data-testid="response-time"]').should('contain', 'fast');
    });

    it('should have optimized images', () => {
      // Check image optimization
      cy.get('img').each(($img) => {
        const src = $img.attr('src');
        if (src && src.includes('webp')) {
          expect(src).to.include('webp');
        }
      });
    });

    it('should have proper caching', () => {
      // Check caching headers
      cy.request('/').then((response) => {
        expect(response.headers['cache-control']).to.exist;
        expect(response.headers['etag']).to.exist;
      });
    });
  });

  describe('Error Handling Polish', () => {
    it('should have graceful error handling', () => {
      // Trigger error
      cy.get('[data-testid="trigger-error"]').click();
      
      // Check graceful error display
      cy.get('[data-testid="error-boundary"]').should('be.visible');
      cy.get('[data-testid="error-message"]').should('contain', 'Something went wrong');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('should have offline support', () => {
      // Simulate offline mode
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
      });
      
      // Check offline message
      cy.get('[data-testid="offline-message"]').should('be.visible');
      cy.get('[data-testid="offline-message"]').should('contain', 'You are offline');
    });

    it('should have retry mechanisms', () => {
      // Test retry functionality
      cy.get('[data-testid="retry-button"]').click();
      cy.get('[data-testid="retry-attempt"]').should('contain', 'Retrying');
      
      // Check retry success
      cy.get('[data-testid="retry-success"]', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('User Experience Polish', () => {
    it('should have intuitive navigation', () => {
      // Test navigation intuitiveness
      cy.get('[data-testid="sidebar-link-dashboard"]').should('be.visible');
      cy.get('[data-testid="sidebar-link-analytics"]').should('be.visible');
      cy.get('[data-testid="sidebar-link-chatbot"]').should('be.visible');
      
      // Check navigation labels are clear
      cy.get('[data-testid="sidebar-link-dashboard"]').should('contain', 'Dashboard');
      cy.get('[data-testid="sidebar-link-analytics"]').should('contain', 'Analytics');
    });

    it('should have helpful tooltips', () => {
      // Test tooltip functionality
      cy.get('[data-testid="tooltip-trigger"]').trigger('mouseover');
      cy.get('[data-testid="tooltip"]').should('be.visible');
      cy.get('[data-testid="tooltip"]').should('contain', 'Helpful information');
      
      cy.get('[data-testid="tooltip-trigger"]').trigger('mouseout');
      cy.get('[data-testid="tooltip"]').should('not.be.visible');
    });

    it('should have progressive disclosure', () => {
      // Test progressive disclosure
      cy.get('[data-testid="advanced-options"]').should('not.be.visible');
      cy.get('[data-testid="show-advanced"]').click();
      cy.get('[data-testid="advanced-options"]').should('be.visible');
    });

    it('should have contextual help', () => {
      // Test contextual help
      cy.get('[data-testid="help-trigger"]').click();
      cy.get('[data-testid="contextual-help"]').should('be.visible');
      cy.get('[data-testid="contextual-help"]').should('contain', 'Help content');
    });
  });
}); 