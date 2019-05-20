describe('Event Subscribe', () => {
  let creator, subscriber, eventName;

  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  beforeEach(() => {
    creator = 'creator';
    subscriber = 'subscriber';
    eventName = 'MyEvent';

    cy
      .signup(creator, 'foobar')
      .createEvent(eventName, 'Atlanta')
      .get('[data-test=logout]').click()
      .url().should('include', '/');

    cy
      .signup(subscriber, 'foobar')
      .get('[data-test=logout]').click();
  });

  it('should display the event creator\'s username in the member list', () => {
    cy
      .login(creator, 'foobar')
      .get('.cal-event .cal-event-title').should('have.text', eventName).click()
      .url().should('include', '/event/')
      .get('.member').should('contain', creator);
  });

  it('should not display a subscribe button for the event creator', () => {
    cy
      .login(creator, 'foobar')
      .get('.cal-event .cal-event-title').should('have.text', eventName).click()
      .url().should('include', '/event/')
      .get('.event-subscribe').should('not.be.visible');
  });

  it('should update the member list when a user clicks the subscribe ' +
    'and unsubscribe button', () => {
    cy
      .login(subscriber, 'foobar')

      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()

      .url().should('include', '/event/')
      .get('[data-test=subscribe]').should('have.text', 'Subscribe').click()
      .get('.member').should('contain', subscriber)

      .get('[data-test=unsubscribe]').should('have.text', 'Unsubscribe').click()
      .get('.member').should('not.contain', subscriber)
      .get('[data-test=subscribe]').should('have.text', 'Subscribe');
  });

  it('should show an error message if a subscribe fails', () => {
    cy.server({
      method: 'PATCH',
      status: 500
    });
    cy.route('/api/events/**/subscribe', {
      message: 'Something went wrong. Try again.'
    });
  
    cy
      .login(subscriber, 'foobar')
  
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()
  
      .url().should('include', '/event/')
      .get('[data-test=subscribe]').should('have.text', 'Subscribe').click()
      .get('.alert-danger').should('be.visible');
  });
});