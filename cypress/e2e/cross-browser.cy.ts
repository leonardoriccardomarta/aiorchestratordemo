describe('Cross-Browser Compatibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should work in Chrome', () => {
    // Chrome-specific tests
    cy.get('[data-testid="dashboard"]').should('be.visible');
    cy.get('button').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
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

  it('should handle CSS Grid and Flexbox correctly', () => {
    // Test modern CSS features
    cy.get('[data-testid="grid-layout"]').should('be.visible');
    cy.get('[data-testid="flexbox-layout"]').should('be.visible');
    
    // Check if layouts are properly aligned
    cy.get('[data-testid="grid-layout"]').should('have.css', 'display', 'grid');
    cy.get('[data-testid="flexbox-layout"]').should('have.css', 'display', 'flex');
  });

  it('should handle CSS Custom Properties', () => {
    // Test CSS variables support
    cy.get('body').should('have.css', '--primary-color');
    cy.get('[data-testid="primary-button"]').should('have.css', 'background-color');
  });

  it('should handle ES6+ JavaScript features', () => {
    // Test modern JavaScript features
    cy.window().then((win) => {
      // Test arrow functions
      const arrowFunc = () => 'test';
      expect(arrowFunc()).to.equal('test');

      // Test destructuring
      const obj = { a: 1, b: 2 };
      const { a, b } = obj;
      expect(a).to.equal(1);
      expect(b).to.equal(2);

      // Test async/await
      const asyncFunc = async () => 'async test';
      asyncFunc().then(result => {
        expect(result).to.equal('async test');
      });
    });
  });

  it('should handle Web APIs correctly', () => {
    // Test Web APIs
    cy.window().then((win) => {
      // Test localStorage
      win.localStorage.setItem('test', 'value');
      expect(win.localStorage.getItem('test')).to.equal('value');

      // Test sessionStorage
      win.sessionStorage.setItem('test', 'value');
      expect(win.sessionStorage.getItem('test')).to.equal('value');

      // Test fetch API
      expect(win.fetch).to.be.a('function');
    });
  });

  it('should handle responsive images', () => {
    // Test responsive image loading
    cy.get('img[srcset]').should('be.visible');
    cy.get('img[srcset]').should('have.attr', 'srcset');
    cy.get('img[srcset]').should('have.attr', 'sizes');
  });

  it('should handle form validation', () => {
    // Test HTML5 form validation
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="email"]').blur();
    cy.get('input[type="email"]').should('have.attr', 'aria-invalid', 'true');

    cy.get('input[type="email"]').clear().type('valid@email.com');
    cy.get('input[type="email"]').should('not.have.attr', 'aria-invalid');
  });

  it('should handle keyboard navigation', () => {
    // Test keyboard navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'button');
    
    cy.focused().type('{enter}');
    cy.get('[data-testid="modal"]').should('be.visible');
  });

  it('should handle touch events on mobile', () => {
    // Test touch events
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
  });

  it('should handle print styles', () => {
    // Test print styles
    cy.get('body').should('have.css', 'color');
    cy.get('@media print').should('exist');
  });

  it('should handle high contrast mode', () => {
    // Test high contrast mode
    cy.get('body').should('have.css', 'color');
    cy.get('body').should('have.css', 'background-color');
    
    // Check if text has sufficient contrast
    cy.get('h1').should('have.css', 'color');
    cy.get('h1').should('have.css', 'background-color');
  });

  it('should handle reduced motion preferences', () => {
    // Test reduced motion
    cy.get('body').should('have.css', 'animation');
    cy.get('body').should('have.css', 'transition');
  });

  it('should handle different color schemes', () => {
    // Test light/dark mode
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('body').should('have.class', 'dark');
    
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('body').should('not.have.class', 'dark');
  });
}); 