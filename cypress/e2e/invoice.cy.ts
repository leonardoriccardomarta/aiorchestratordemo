describe('Invoice Generation', () => {
  const adminUser = {
    email: 'admin@example.com',
    password: 'AdminPass123!'
  };

  const testInvoice = {
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    customerAddress: '123 Test St, Test City, 12345',
    items: [
      {
        description: 'Premium Subscription',
        quantity: 1,
        price: 99.99
      },
      {
        description: 'Setup Fee',
        quantity: 1,
        price: 49.99
      }
    ]
  };

  beforeEach(() => {
    // Login as admin
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(adminUser.email);
    cy.get('[data-testid=password-input]').type(adminUser.password);
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should create a new invoice', () => {
    cy.visit('/admin/invoices/new');
    
    // Fill customer information
    cy.get('[data-testid=customer-name-input]').type(testInvoice.customerName);
    cy.get('[data-testid=customer-email-input]').type(testInvoice.customerEmail);
    cy.get('[data-testid=customer-address-input]').type(testInvoice.customerAddress);

    // Add invoice items
    testInvoice.items.forEach((item, index) => {
      if (index > 0) {
        cy.get('[data-testid=add-item-button]').click();
      }
      cy.get(`[data-testid=item-description-${index}]`).type(item.description);
      cy.get(`[data-testid=item-quantity-${index}]`).type(item.quantity.toString());
      cy.get(`[data-testid=item-price-${index}]`).type(item.price.toString());
    });

    // Generate invoice
    cy.get('[data-testid=generate-invoice-button]').click();

    // Verify invoice was created
    cy.get('[data-testid=invoice-preview]').should('be.visible');
    cy.contains(testInvoice.customerName).should('be.visible');
    
    // Check total calculation
    const total = testInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    cy.get('[data-testid=invoice-total]').should('contain', total.toFixed(2));
  });

  it('should download invoice as PDF', () => {
    cy.visit('/admin/invoices');
    
    // Find the test invoice
    cy.contains(testInvoice.customerName)
      .parent()
      .find('[data-testid=download-pdf-button]')
      .click();

    // Verify download started
    cy.readFile('cypress/downloads/invoice.pdf').should('exist');
  });

  it('should send invoice by email', () => {
    cy.visit('/admin/invoices');
    
    // Find the test invoice
    cy.contains(testInvoice.customerName)
      .parent()
      .find('[data-testid=send-email-button]')
      .click();

    // Confirm email
    cy.get('[data-testid=confirm-email-input]').type(testInvoice.customerEmail);
    cy.get('[data-testid=send-invoice-button]').click();

    // Verify success message
    cy.get('[data-testid=success-message]')
      .should('be.visible')
      .and('contain', 'Invoice sent successfully');
  });

  it('should show invoice history', () => {
    cy.visit('/admin/invoices');
    
    // Verify invoice list
    cy.get('[data-testid=invoice-list]').should('be.visible');
    cy.contains(testInvoice.customerName).should('be.visible');
    
    // Check invoice details
    cy.contains(testInvoice.customerName).click();
    cy.get('[data-testid=invoice-details]').should('be.visible');
    cy.contains(testInvoice.customerEmail).should('be.visible');
    testInvoice.items.forEach(item => {
      cy.contains(item.description).should('be.visible');
    });
  });
}); 