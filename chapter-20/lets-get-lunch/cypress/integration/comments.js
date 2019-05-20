describe('Comments', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  beforeEach(() => {
    cy
      .signup()
      .createEvent('Lunch', 'Atlanta')
      .get('.cal-event .cal-event-title').should('have.text', 'Lunch').click()
      .url().should('include', '/event/')
      .get('.event-name').should('have.text', 'Lunch');
  });

  it('should display a message that no comments exist for ' +
    'an event with no comments', () => {
    cy
      .get('[data-test=no-comments]').should('be.visible');
  });

  it('should populate the comment view when a user submits a comment', () => {
    cy
      .get('textarea').type('My first comment')
      .get('button[type=submit]').click()
      .get('[data-test=no-comments]').should('not.be.visible')
      .get('[data-test=comment]').should('contain', 'My first comment');
  });

  it('should display an error message if a comment cannot be created', () => {
    cy.server({
      method: 'POST',
      status: 500
    });
    cy.route('/api/comments', { message: 'Comment could not be created!' });
  
    cy
      .get('textarea').type('My first comment')
      .get('button[type=submit]').click()
      .get('[data-test=no-comments]').should('be.visible')
      .get('[data-test=submit-error').should('be.visible');
  });
});