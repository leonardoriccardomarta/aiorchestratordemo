// Import commands.js using ES2015 syntax:
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Example of a custom command:
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
});

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
}); 