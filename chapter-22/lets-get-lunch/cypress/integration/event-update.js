describe('Event Update', () => {
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

  it('should redirect to the event update page when ' +
    'the edit link is clicked', () => {
    cy
      .get('.event-edit').click()
      .url().should('include', '/update');
  });

  it('should display a success message for an event that ' +
    'has successfully been updated', () => {
    cy
      .get('.end').invoke('text').then(end1 => {
        cy
          .get('.event-edit').click()
          
          .get('input[name=title]').clear().type('Dinner')
          .get('input[name=description]').clear().type('Dinner with Bob')
          .get('input[name=location]').clear()
            .type('Miami').wait(1000).type('{downarrow}{enter}')
          .get('input[name=startTime]').click()
            .get('.owl-dt-calendar-cell-today').click()
            .get('.owl-dt-container-buttons button').last().wait(1000).click()
          .get('input[name=endTime]').click()
            .get('.owl-dt-calendar-cell-today').click()
            .get('[aria-label="Add a hour"]').click().click()
            .get('.owl-dt-container-buttons button').last().wait(1000).click()
          .get('#suggest-true').click()
          .get('button[type=submit]').click()
          .get('.alert-success').should('be.visible')

          .get('.cancel').click()
          .url().should('include', '/event/')

          .get('.event-name').should('have.text', 'Dinner')
          .get('.description').should('contain', 'Dinner with Bob')
          .get('.location').should('contain', 'Miami, FL')
          .get('.end').invoke('text').then(end2 => {
            expect(end1).not.to.eq(end2);
          })
          .get('.recommendations-container').should('be.visible');
      });
  });

  it('should display an error message for an event that cannot be updated', () => {
    cy.server({
      method: 'PATCH',
      status: 500
    });
    cy.route('/api/events/**', { message: 'Event could not be updated!' });
  
    cy
      .get('.event-edit').click()
      .get('button[type=submit]').click()
      .get('.alert-danger').should('be.visible');
  });
});