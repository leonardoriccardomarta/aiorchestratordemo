describe('Referral System', () => {
  const testUser = {
    email: `referrer${Date.now()}@example.com`,
    password: 'TestPass123!',
    name: 'Referrer User'
  };

  const referredUser = {
    email: `referred${Date.now()}@example.com`,
    password: 'TestPass123!',
    name: 'Referred User'
  };

  let referralCode: string;

  before(() => {
    // Sign up the referrer
    cy.visit('/signup');
    cy.get('[data-testid=name-input]').type(testUser.name);
    cy.get('[data-testid=email-input]').type(testUser.email);
    cy.get('[data-testid=password-input]').type(testUser.password);
    cy.get('[data-testid=signup-button]').click();
  });

  it('should generate a referral code for user', () => {
    // Login as the referrer
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(testUser.email);
    cy.get('[data-testid=password-input]').type(testUser.password);
    cy.get('[data-testid=login-button]').click();

    // Navigate to referral page
    cy.visit('/referrals');
    
    // Get and store referral code
    cy.get('[data-testid=referral-code]')
      .invoke('text')
      .then((code) => {
        referralCode = code;
        expect(code).to.match(/^[A-Z0-9]{8}$/);
      });
  });

  it('should allow sharing referral code', () => {
    cy.visit('/referrals');
    cy.get('[data-testid=share-referral-button]').click();
    
    // Check if sharing options are visible
    cy.get('[data-testid=share-options]').should('be.visible');
    cy.get('[data-testid=copy-link-button]').should('be.visible');
  });

  it('should allow user to sign up with referral code', () => {
    cy.visit('/signup');
    cy.get('[data-testid=name-input]').type(referredUser.name);
    cy.get('[data-testid=email-input]').type(referredUser.email);
    cy.get('[data-testid=password-input]').type(referredUser.password);
    cy.get('[data-testid=referral-code-input]').type(referralCode);
    cy.get('[data-testid=signup-button]').click();

    // Verify successful signup
    cy.url().should('include', '/confirm-email-sent');
  });

  it('should show referral rewards', () => {
    // Login as referrer
    cy.visit('/login');
    cy.get('[data-testid=email-input]').type(testUser.email);
    cy.get('[data-testid=password-input]').type(testUser.password);
    cy.get('[data-testid=login-button]').click();

    // Check referral dashboard
    cy.visit('/referrals');
    cy.get('[data-testid=referral-stats]').should('be.visible');
    cy.get('[data-testid=successful-referrals]').should('contain', '1');
    cy.get('[data-testid=reward-amount]').should('be.visible');
  });

  it('should show referral history', () => {
    cy.visit('/referrals/history');
    cy.get('[data-testid=referral-history]').should('be.visible');
    cy.contains(referredUser.email).should('be.visible');
  });
}); 