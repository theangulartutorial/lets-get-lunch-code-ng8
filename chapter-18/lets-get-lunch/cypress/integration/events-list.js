describe('Events List', () => {
  let eventName;

  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  beforeEach(() => {
    cy.signup();
  });

  it('should populate the table with events if events exist', () => {
    eventName = 'MyEvent';
  
    cy
      .createEvent(eventName, 'Atlanta')
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName);
  });

  it('should redirect to the event view page when ' +
    'the "View" link is clicked', () => {
    eventName = 'MyEvent';

    cy
      .createEvent(eventName, 'Atlanta')
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()
      .url().should('include', '/event/')
      .get('.event-name').should('have.text', eventName);
  });

  it('should display a message if no events exist', () => {
    cy.server({
      method: 'GET',
      status: 200
    });
    cy.route('/api/events', []);
  
    cy
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.no-events').should('be.visible');
  });

  it('should display a message if there\'s an error', () => {
    cy.server({
      method: 'GET',
      status: 500
    });
    cy.route('/api/events', { message: 'Something went wrong!' });
  
    cy
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.alert-danger').should('be.visible');
  });
});