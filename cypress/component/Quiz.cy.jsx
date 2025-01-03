import Quiz from './Quiz';

describe ('Quiz component', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    })});

    it('should display "Start Quiz" button', () => {
        cy.contains('button', 'Start Quiz').should('be.visible');
    });

    it('should display question after "Start Quiz" button click' , () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions').its('response.statusCode').should('eq', 200);
        cy.get('h2').should('be.visible');
    });

    it('should load while waiting for questions', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', (req) => {
            req.reply((res) => {
                res.send([{
                    status: 200,
                    body: {fixture: 'questions.json'}
                }]);});
            });
        }
    ).as('getQuestions');

    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions').its('response.statusCode').should('eq', 200);

    it('should show "Quiz Completed" message after answering all questions', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions').its('response.statusCode').should('eq', 200);
        cy.get('button').contains('Submit').click();
        cy.get('h2').should('contain', 'Quiz Completed');
    });

    cy.fixture('questions.json').then((questions) => {
        const questionsDone = questions.length;
        for (let i = 0; i < questionsDone; i++) {
            cy.get('.btn').contains('1').click();
        }
        cy.contains('Quiz Completed').should('be.visible');
    });

    it('should reset quiz after "Start Quiz" button click', () => {
        cy.intercept('GET', 'http://localhost:3000/questions', {fixture: 'questions.json'}).as('getQuestions');
        cy.get('button').contains('Start Quiz').click();
        cy.wait('@getQuestions').its('response.statusCode').should('eq', 200);

        cy.fixture('questions.json').then((questions) => {
            questions.forEach((question) => {
                const correctAnswer = question.answers.find(answer=> answer.isCorrect).text;
                cy.contains(correctAnswer).click();

        cy.contains('Quiz Completed').should('be.visible');
        cy.contains('Take New Quiz').click();
            })})});