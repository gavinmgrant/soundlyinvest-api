const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { report } = require('../src/reports/reports-router');

describe('Reports Endpoints', function() {
    let db;

    const {
        testReports,
        testFields,
        testUsers,
    } = helpers.makeReportsFixtures();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/reports`, () => {

        context('Given no reports', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/reports')
                    .expect(200)
            })
        })

        context('Given there are reports in the database', () => {
            beforeEach('insert reports', () => 
                helpers.seedReportsTables(
                    db,
                    testUsers,
                    testReports,
                )
            )

            it('GET /reports responds with 200 and all of the reports', () => {
                return supertest(app)
                    .get('/api/reports')
                    .expect(200)
            })
        })
    })

    describe(`GET /api/reports/:id`, () => {
        context(`Given there are reports in the database`, () => {
            beforeEach('insert reports', () => 
                helpers.seedReportsTables(
                    db,
                    testUsers,
                    testReports,
                )
            )

            it(`responds with 404 when report does not exist`, () => {
                const reportId = 999
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(404, { error: { message: `Report doesn't exist`} })
            })

            it('responds with 200 and the specified favorites', () => {
                const reportId = 1;
                const expectedReport = helpers.makeExpectedReports(
                    testUsers,
                    testReports[0],
                )
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(200, expectedReport)
            })
        })
    })
})