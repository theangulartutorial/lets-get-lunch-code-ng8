Cypress.Commands.add('login', (username, password) => {
  cy
    .visit('/login')
    .url().should('include', '/login')
    .get('#username').type(username)
    .get('#password').type(password)
    .get('form').submit()
    .url().should('include', '/dashboard');
});