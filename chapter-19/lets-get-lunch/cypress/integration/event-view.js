describe('Event View', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  beforeEach(() => {
    cy
      .signup()
      .createEvent('Lunch', 'Atlanta');
  });

  it('should redirect to the event view when an event\'s title is clicked', () => {
    cy
      .get('.cal-event .cal-event-title').should('have.text', 'Lunch').click()
      .url().should('include', '/event/')
      .get('.event-name').should('have.text', 'Lunch');
  });
});