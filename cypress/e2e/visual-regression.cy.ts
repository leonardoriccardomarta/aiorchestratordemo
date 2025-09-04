describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should match dashboard screenshot', () => {
    cy.get('[data-testid="dashboard"]').should('be.visible');
    cy.percySnapshot('Dashboard - Default State');
  });

  it('should match dashboard with different screen sizes', () => {
    // Desktop
    cy.viewport(1920, 1080);
    cy.percySnapshot('Dashboard - Desktop');

    // Tablet
    cy.viewport(768, 1024);
    cy.percySnapshot('Dashboard - Tablet');

    // Mobile
    cy.viewport(375, 667);
    cy.percySnapshot('Dashboard - Mobile');
  });

  it('should match navigation components', () => {
    // Sidebar
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.percySnapshot('Navigation - Sidebar');

    // Top navigation
    cy.get('[data-testid="top-nav"]').should('be.visible');
    cy.percySnapshot('Navigation - Top Bar');
  });

  it('should match form components', () => {
    cy.visit('/settings');
    
    // Form in default state
    cy.percySnapshot('Forms - Default State');

    // Form with validation errors
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="email"]').blur();
    cy.percySnapshot('Forms - Validation Errors');

    // Form with success state
    cy.get('input[type="email"]').clear().type('valid@email.com');
    cy.percySnapshot('Forms - Success State');
  });

  it('should match modal components', () => {
    // Open modal
    cy.get('[data-testid="open-modal-button"]').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.percySnapshot('Modal - Open State');

    // Close modal
    cy.get('[data-testid="close-modal-button"]').click();
    cy.percySnapshot('Modal - Closed State');
  });

  it('should match loading states', () => {
    // Loading spinner
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.percySnapshot('Loading - Spinner');

    // Skeleton loading
    cy.visit('/dashboard');
    cy.get('[data-testid="skeleton"]').should('be.visible');
    cy.percySnapshot('Loading - Skeleton');
  });

  it('should match error states', () => {
    // Network error
    cy.intercept('GET', '**/api/**', { statusCode: 500 }).as('apiError');
    cy.visit('/dashboard');
    cy.wait('@apiError');
    cy.percySnapshot('Error - Network Error');

    // 404 page
    cy.visit('/non-existent-page');
    cy.percySnapshot('Error - 404 Page');
  });

  it('should match data tables', () => {
    cy.visit('/analytics');
    
    // Empty table
    cy.percySnapshot('Table - Empty State');

    // Table with data
    cy.get('[data-testid="table"]').should('be.visible');
    cy.percySnapshot('Table - With Data');

    // Table with pagination
    cy.get('[data-testid="pagination"]').should('be.visible');
    cy.percySnapshot('Table - With Pagination');
  });

  it('should match charts and graphs', () => {
    cy.visit('/analytics');
    
    // Line chart
    cy.get('[data-testid="line-chart"]').should('be.visible');
    cy.percySnapshot('Charts - Line Chart');

    // Bar chart
    cy.get('[data-testid="bar-chart"]').should('be.visible');
    cy.percySnapshot('Charts - Bar Chart');

    // Pie chart
    cy.get('[data-testid="pie-chart"]').should('be.visible');
    cy.percySnapshot('Charts - Pie Chart');
  });

  it('should match dark mode', () => {
    // Toggle dark mode
    cy.get('[data-testid="theme-toggle"]').click();
    cy.percySnapshot('Theme - Dark Mode');

    // Toggle back to light mode
    cy.get('[data-testid="theme-toggle"]').click();
    cy.percySnapshot('Theme - Light Mode');
  });

  it('should match responsive design', () => {
    // Test different breakpoints
    const breakpoints = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 1366, height: 768, name: 'Laptop' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 375, height: 667, name: 'Mobile' },
      { width: 320, height: 568, name: 'Small Mobile' }
    ];

    breakpoints.forEach(({ width, height, name }) => {
      cy.viewport(width, height);
      cy.percySnapshot(`Responsive - ${name} (${width}x${height})`);
    });
  });
}); 