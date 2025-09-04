describe('FAQ Management', () => {
  const adminUser = {
    email: 'admin@example.com',
    password: 'AdminPass123!'
  };

  beforeEach(() => {
    // Login as admin
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(adminUser.email);
    cy.get('[data-testid=password-input]').type(adminUser.password);
    cy.get('[data-testid=login-button]').click();
    cy.url().should('include', '/dashboard');
  });

  const testFAQ = {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.',
    category: 'account'
  };

  it('should create a new FAQ', () => {
    cy.visit('/admin/faqs');
    cy.get('[data-testid=add-faq-button]').click();
    
    cy.get('[data-testid=faq-question-input]').type(testFAQ.question);
    cy.get('[data-testid=faq-answer-input]').type(testFAQ.answer);
    cy.get('[data-testid=faq-category-select]').select(testFAQ.category);
    cy.get('[data-testid=save-faq-button]').click();

    // Verify FAQ was created
    cy.contains(testFAQ.question).should('be.visible');
  });

  it('should display FAQ list to users', () => {
    cy.visit('/faqs');
    cy.get('[data-testid=faq-list]').should('be.visible');
    cy.contains(testFAQ.question).should('be.visible');
    
    // Test category filter
    cy.get('[data-testid=category-filter]').select('account');
    cy.contains(testFAQ.question).should('be.visible');
  });

  it('should edit an existing FAQ', () => {
    cy.visit('/admin/faqs');
    cy.contains(testFAQ.question)
      .parent()
      .find('[data-testid=edit-faq-button]')
      .click();

    const updatedAnswer = testFAQ.answer + ' Updated text.';
    cy.get('[data-testid=faq-answer-input]')
      .clear()
      .type(updatedAnswer);
    cy.get('[data-testid=save-faq-button]').click();

    // Verify changes
    cy.contains(updatedAnswer).should('be.visible');
  });

  it('should delete an FAQ', () => {
    cy.visit('/admin/faqs');
    cy.contains(testFAQ.question)
      .parent()
      .find('[data-testid=delete-faq-button]')
      .click();

    // Confirm deletion
    cy.get('[data-testid=confirm-delete-button]').click();

    // Verify FAQ was deleted
    cy.contains(testFAQ.question).should('not.exist');
  });
}); 