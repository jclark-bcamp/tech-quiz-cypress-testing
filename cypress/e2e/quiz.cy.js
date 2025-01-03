describe('E2E Quiz', () => {
    beforeEach(() => {
        cy.visit('/');  // Visit the root of the app
    })

    // this test is to check if the "Start Quiz" button is displayed and then click it
    it('should start quiz and show the first question', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.contains('Start Quiz').click();
        cy.fixture('questions.json').then((questions) => {
            cy.get('h2').should('contain', questions[0].question); // Check if the first question is displayed
        });
    });

    // this test is to check if the quiz is loading while waiting for questions and then show the first question
    it('should show "Quiz Completed" message after answering all questions', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.contains('Start Quiz').click();
        cy.fixture('questions.json').then((questions) => {
            questions.forEach((question) => {
                const correctAnswer = question.answers.find(answer => answer.isCorrect).text;
                cy.contains(correctAnswer).click();
            });
            cy.contains('Quiz Completed').should('be.visible');
            cy.get('.alert-success').should('contain', 'Your score: ${questions.length}');
        });
    });

    // this test is to check if the quiz is reset after clicking the "Take New Quiz" button after completing the quiz
    it('should reset quiz after "Start Quiz" button click', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.contains('Start Quiz').click();
        cy.fixture('questions.json').then((questions) => {
            questions.forEach((question) => {
                const correctAnswer = question.answers.find(answer => answer.isCorrect).text;
                cy.contains(correctAnswer).click();
            });
            cy.contains('Quiz Completed').should('be.visible');
            cy.contains('Take New Quiz').click();
            cy.get('h2').should('not.contain', 'Quiz Completed');
        });
    });

});