describe('Signup', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  it('should navigate to the dashboard with valid credentials', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#username').type('user')
      .get('#password').type('password')
      .get('form').submit()
      .url().should('include', '/dashboard');
  });

  it('should navigate to the dashboard with valid credentials ' +
    'and diet preferences', () => {
    cy
      .visit('/signup')
      .url().should('include',  '/signup')
      .get('#username').type('user')
      .get('#password').type('password')
      .get('#BBQ').click()
      .get('form').submit()
      .url().should('include', '/dashboard');
  });

  it('should display an error with invalid credentials', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#username').type('user')
      .get('#password').type('123')
      .get('form').submit()
      .get('.alert')
        .should('be.visible')
        .should('have.text', 'Your password must be at least 5 characters long.');
  });

  it('should display an error for a username that already exists', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#username').type('user')
      .get('#password').type('password')
      .get('form').submit()
      .url().should('include', '/dashboard');
  
    cy
      .get('[data-test=logout]').click();
  
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#username').type('user')
      .get('#password').type('password')
      .get('form').submit()
      .get('.alert')
        .should('be.visible')
        .should('have.text', 'This user already exists.');
  });
});