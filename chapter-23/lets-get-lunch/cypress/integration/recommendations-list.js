describe('Recommendations List', () => {
  let creator, eventName;

  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:8080/api/test');
  });

  beforeEach(() => {
    creator = 'creator';
    cy.signup(creator, 'foobar');
  });

  it('should not display a list of recommendations for an event that ' +
    'has suggestLocations set to false', () => {
    eventName = 'MyEvent';

    cy
      .createEvent(eventName, 'Atlanta', {suggestLocations: false})
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()
      .url().should('include', '/event/')
      .get('.recommendations-container').should('not.be.visible');
  });

  it('should display a list of recommendations for an event that ' +
    'has suggestLocations set to true', () => {
    eventName = 'MyEvent';

    cy
      .createEvent(eventName, 'Atlanta', {suggestLocations: true})
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()
      .url().should('include', '/event/')
      .get('.recommendations-container').should('be.visible').wait(5000)
      .get('.recommendation').should('be.visible');
  });

  it('should display an error message for an event that\'s in the boonies', () => {
    eventName = 'MyEvent';
  
    cy
      .createEvent(eventName, 'Bayou LaBatre', {suggestLocations: true})
      .get('[data-test=events]').click()
      .url().should('include', '/events')
      .get('.event-title').contains(eventName).next().next().children().click()
      .url().should('include', '/event/')
      .get('.recommendations-container').should('be.visible')
      .get('.alert-danger').should('be.visible');
  });
});