describe('Login', () => {
  let unique;

  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  before(() => {
    unique = 'uniqueUser';

    cy
      .signup(unique, 'password')
      .get('[data-test=logout]').should('have.text', 'Logout').click();
  });

  it('should display an error messsage for an incorrect password', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type(unique)
      .get('#password').type('wrong')
      .get('form').submit()
      .get('.alert').should('have.text', 'Incorrect password.');
  });

  it('should display an error message for a user who does not exist', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type('doesnotexist')
      .get('#password').type('doesnotexist')
      .get('form').submit()
      .get('.alert').should('have.text', 'User could not be found.');
  });

  it('should log in a user who does exist redirecting ' +
    'them to the dashboard', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#username').type(unique)
      .get('#password').type('password')
      .get('form').submit()
      .url().should('include', '/dashboard');
  });
});