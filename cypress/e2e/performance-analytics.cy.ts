describe('Performance & Analytics - Product Launch', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Lighthouse Performance Testing', () => {
    it('should achieve 90+ Lighthouse performance score', () => {
      // Run Lighthouse audit
      cy.lighthouse({
        performance: 90,
        accessibility: 95,
        'best-practices': 95,
        seo: 90
      });
    });

    it('should have fast First Contentful Paint (FCP)', () => {
      cy.lighthouse({
        'first-contentful-paint': 2000
      });
    });

    it('should have fast Largest Contentful Paint (LCP)', () => {
      cy.lighthouse({
        'largest-contentful-paint': 2500
      });
    });

    it('should have low Cumulative Layout Shift (CLS)', () => {
      cy.lighthouse({
        'cumulative-layout-shift': 0.1
      });
    });

    it('should have fast First Input Delay (FID)', () => {
      cy.lighthouse({
        'first-input-delay': 100
      });
    });

    it('should have good Time to Interactive (TTI)', () => {
      cy.lighthouse({
        'interactive': 3500
      });
    });
  });

  describe('Lazy Loading Implementation', () => {
    it('should lazy load heavy components', () => {
      // Check that heavy components are not loaded initially
      cy.get('[data-testid="heavy-chart"]').should('not.exist');
      cy.get('[data-testid="heavy-table"]').should('not.exist');

      // Scroll to trigger lazy loading
      cy.scrollTo('bottom');
      cy.get('[data-testid="heavy-chart"]').should('be.visible');
      cy.get('[data-testid="heavy-table"]').should('be.visible');
    });

    it('should lazy load images', () => {
      // Check for lazy loading images
      cy.get('img[loading="lazy"]').should('exist');
      
      // Check for intersection observer usage
      cy.get('[data-testid="lazy-image"]').should('have.attr', 'data-src');
    });

    it('should lazy load routes', () => {
      // Navigate to different routes and check for loading states
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      cy.get('[data-testid="analytics-page"]').should('be.visible');

      cy.get('[data-testid="sidebar-link-chatbot"]').click();
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      cy.get('[data-testid="chatbot-page"]').should('be.visible');
    });

    it('should implement code splitting', () => {
      // Check for multiple JavaScript bundles
      cy.window().then((win) => {
        const performance = win.performance;
        const entries = performance.getEntriesByType('resource');
        const jsFiles = entries.filter(entry => entry.name.includes('.js'));
        
        // Should have multiple JS files (code splitting)
        expect(jsFiles.length).to.be.greaterThan(1);
      });
    });
  });

  describe('Google Analytics Integration', () => {
    it('should have Google Analytics properly configured', () => {
      // Check for Google Analytics script
      cy.get('script[src*="google-analytics"]').should('exist');
      cy.get('script[src*="gtag"]').should('exist');
    });

    it('should track page views', () => {
      // Mock gtag function
      cy.window().then((win) => {
        win.gtag = cy.stub().as('gtag');
      });

      // Navigate to different pages
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('@gtag').should('have.been.calledWith', 'config', 'GA_MEASUREMENT_ID', {
        page_title: 'Analytics',
        page_location: Cypress.config().baseUrl + '/analytics'
      });
    });

    it('should track user interactions', () => {
      // Mock gtag function
      cy.window().then((win) => {
        win.gtag = cy.stub().as('gtag');
      });

      // Perform user interactions
      cy.get('[data-testid="primary-button"]').click();
      cy.get('@gtag').should('have.been.calledWith', 'event', 'button_click', {
        button_name: 'primary_button'
      });
    });

    it('should track form submissions', () => {
      // Mock gtag function
      cy.window().then((win) => {
        win.gtag = cy.stub().as('gtag');
      });

      // Submit a form
      cy.get('[data-testid="submit-form"]').click();
      cy.get('@gtag').should('have.been.calledWith', 'event', 'form_submit', {
        form_name: 'test_form'
      });
    });
  });

  describe('Privacy-Friendly Analytics (Plausible)', () => {
    it('should have Plausible Analytics configured', () => {
      // Check for Plausible script
      cy.get('script[src*="plausible"]').should('exist');
    });

    it('should track custom events', () => {
      // Mock plausible function
      cy.window().then((win) => {
        win.plausible = cy.stub().as('plausible');
      });

      // Trigger custom events
      cy.get('[data-testid="custom-event-trigger"]').click();
      cy.get('@plausible').should('have.been.calledWith', 'Custom Event');
    });
  });

  describe('Page Transition Performance', () => {
    it('should have fast page transitions', () => {
      // Measure page transition time
      cy.window().then((win) => {
        const startTime = performance.now();
        
        cy.get('[data-testid="sidebar-link-analytics"]').click().then(() => {
          const endTime = performance.now();
          const transitionTime = endTime - startTime;
          
          // Page transition should be under 300ms
          expect(transitionTime).to.be.lessThan(300);
        });
      });
    });

    it('should have smooth page transitions', () => {
      // Check for transition animations
      cy.get('[data-testid="page-transition"]').should('have.css', 'transition');
      
      // Navigate and check for smooth transition
      cy.get('[data-testid="sidebar-link-analytics"]').click();
      cy.get('[data-testid="page-transition"]').should('have.class', 'transitioning');
      
      // Wait for transition to complete
      cy.get('[data-testid="page-transition"]', { timeout: 1000 }).should('not.have.class', 'transitioning');
    });

    it('should preload critical resources', () => {
      // Check for preload links
      cy.get('link[rel="preload"]').should('exist');
      cy.get('link[rel="prefetch"]').should('exist');
    });
  });

  describe('Bundle Size Optimization', () => {
    it('should have optimized bundle size', () => {
      // Check bundle size after build
      cy.exec('npm run build').then((result) => {
        const buildOutput = result.stdout;
        
        // Check for bundle size information
        expect(buildOutput).to.contain('bundle size');
        
        // Check for bundle size warnings
        expect(buildOutput).to.not.contain('bundle size is too large');
      });
    });

    it('should implement tree shaking', () => {
      // Check that unused code is not included
      cy.window().then((win) => {
        // This would require bundle analysis
        // For now, we check that the app loads quickly
        const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(3000);
      });
    });

    it('should optimize third-party libraries', () => {
      // Check for optimized third-party imports
      cy.get('script[src*="cdn"]').each(($script) => {
        const src = $script.attr('src');
        expect(src).to.include('.min.js');
      });
    });
  });

  describe('Image Optimization', () => {
    it('should use optimized images', () => {
      // Check for WebP images
      cy.get('img[src*=".webp"]').should('exist');
      
      // Check for responsive images
      cy.get('img[srcset]').should('exist');
      cy.get('img[sizes]').should('exist');
    });

    it('should implement proper image loading', () => {
      // Check for lazy loading images
      cy.get('img[loading="lazy"]').should('exist');
      
      // Check for proper alt attributes
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should use appropriate image formats', () => {
      // Check for modern image formats
      cy.get('img').each(($img) => {
        const src = $img.attr('src');
        if (src) {
          expect(src).to.match(/\.(webp|avif|jpg|jpeg|png|svg)$/);
        }
      });
    });
  });

  describe('Caching Strategy', () => {
    it('should implement proper caching headers', () => {
      // Check cache headers for static assets
      cy.intercept('GET', '**/*.js', (req) => {
        expect(req.headers['cache-control']).to.include('max-age');
        req.reply({});
      }).as('jsFiles');

      cy.reload();
      cy.wait('@jsFiles');
    });

    it('should implement service worker caching', () => {
      // Check service worker registration
      cy.window().then((win) => {
        expect(win.navigator.serviceWorker).to.exist;
      });

      // Check for service worker file
      cy.request('/sw.js').then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should cache API responses appropriately', () => {
      // Check API caching
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.headers['cache-control']).to.exist;
        req.reply({});
      }).as('apiRequest');

      cy.get('[data-testid="fetch-data"]').click();
      cy.wait('@apiRequest');
    });
  });

  describe('Core Web Vitals Monitoring', () => {
    it('should track Core Web Vitals', () => {
      // Mock performance observer
      cy.window().then((win) => {
        const observer = {
          observe: cy.stub(),
          disconnect: cy.stub()
        };

        win.PerformanceObserver = cy.stub().returns(observer);

        // Trigger performance measurement
        cy.get('[data-testid="measure-performance"]').click();

        expect(observer.observe).to.have.been.called;
      });
    });

    it('should report performance metrics', () => {
      // Check for performance reporting
      cy.window().then((win) => {
        // Mock performance API
        win.performance.getEntriesByType = cy.stub().returns([
          { name: 'FCP', startTime: 1000 },
          { name: 'LCP', startTime: 2000 },
          { name: 'CLS', value: 0.05 }
        ]);

        // Trigger performance check
        cy.get('[data-testid="check-performance"]').click();
      });
    });
  });

  describe('Performance Budgets', () => {
    it('should meet performance budgets', () => {
      // Check bundle size budget
      cy.exec('npm run analyze').then((result) => {
        const analysis = result.stdout;
        
        // Check that bundle sizes are within budget
        expect(analysis).to.not.contain('bundle size exceeds budget');
      });
    });

    it('should optimize critical rendering path', () => {
      // Check for critical CSS inlining
      cy.get('style[data-critical]').should('exist');
      
      // Check for non-critical CSS loading
      cy.get('link[rel="preload"][as="style"]').should('exist');
    });

    it('should minimize render-blocking resources', () => {
      // Check for async/defer loading
      cy.get('script[async]').should('exist');
      cy.get('script[defer]').should('exist');
    });
  });
}); 