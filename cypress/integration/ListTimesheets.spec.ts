describe('ListTimesheets', () => {
  it('should load the current month\'s timesheets', () => {
    cy.server();
    cy.route('/timesheets', 'fixtures:timesheets.json');
    cy.visit('/');
  })
});