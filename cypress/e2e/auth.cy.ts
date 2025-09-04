describe('Authentication E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });

  it('should navigate to dashboard by default', () => {
    cy.url().should('include', '/dashboard');
  });

  it('should show loading state initially', () => {
    cy.get('[data-testid="loading"]').should('exist');
  });

  it('should display dashboard content after loading', () => {
    cy.get('h1').should('contain', 'Dashboard');
    cy.get('[data-testid="stats-grid"]').should('exist');
  });

  it('should handle navigation between pages', () => {
    // Navigate to chatbot page
    cy.get('a[href="/chatbot"]').click();
    cy.url().should('include', '/chatbot');
    
    // Navigate to analytics page
    cy.get('a[href="/analytics"]').click();
    cy.url().should('include', '/analytics');
    
    // Navigate back to dashboard
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should handle search functionality', () => {
    cy.get('input[placeholder*="Cerca"]').type('test search');
    cy.get('input[placeholder*="Cerca"]').should('have.value', 'test search');
  });

  it('should handle user menu interactions', () => {
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="user-dropdown"]').should('be.visible');
    
    // Test logout
    cy.get('[data-testid="logout-button"]').click();
    cy.get('[data-testid="user-dropdown"]').should('not.be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
  });

  it('should handle keyboard navigation', () => {
    // Tab through navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'button');
    
    // Test Enter key
    cy.focused().type('{enter}');
  });

  it('should show proper error states', () => {
    // Simulate network error
    cy.intercept('GET', '**/api/**', { statusCode: 500 }).as('apiError');
    cy.visit('/dashboard');
    cy.wait('@apiError');
    
    // Should show error message
    cy.get('[data-testid="error-message"]').should('exist');
  });

  it('should handle form interactions', () => {
    // Test input validation
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="email"]').blur();
    cy.get('[data-testid="error-message"]').should('contain', 'email');
    
    // Test valid input
    cy.get('input[type="email"]').clear().type('valid@email.com');
    cy.get('input[type="email"]').blur();
    cy.get('[data-testid="error-message"]').should('not.exist');
  });
}); 