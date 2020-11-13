const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Reports Endpoints', function() {
    let db;

    const {
        testReports,
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
                helpers.seedReports(
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
                helpers.seedReports(
                    db, 
                    testUsers,
                    testReports
                )
            )

            it(`responds with 404 when report does not exist`, () => {
                const reportId = 999
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(404, { error: { message: `Report doesn't exist`} })
            })

            it('responds with 200 and correct fields for the report', () => {
                const reportId = 1;
                const expectedReport = helpers.makeReportsArray();

                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .expect(200, expectedReport[0])
            })
        })
    })

    describe(`POST /api/report`, () => {
        beforeEach('insert reports', () => 
                helpers.seedReports(
                    db, 
                    testUsers,
                    testReports
                )
            )
           
            it(`creates a report, responding with 201 and the new report`, function() {
                const testUser = testUsers[0]
                const newReport = {
                    report_name: "Temp Report",
                    prop_address: "100 Main Street",
                    purchase_price: 500000,
                    down_payment: 15,
                    interest_rate: 4,
                    loan_period: 30,
                    rental_income: 3700,
                    storage_income: 0,
                    parking_income: 0,
                    tax_rate: 1.25,
                    property_manager: 100,
                    insurance: 100,
                    utilities: 50,
                    gardener: 0,
                    miscellaneous: 100,
                    vacancy_rate: 2,
                    user_id: testUser.id
                }
                return supertest(app)
                    .post('/api/report')
                    .send(newReport)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.prop_address).to.eq(newReport.prop_address)
                        expect(res.headers.location).to.eq(`/reports/${res.body.id}`)
                    })
                    .then(postRes =>
                        supertest(app)
                            .get(`/api/reports/${postRes.body.id}`)
                            .expect(postRes.body)
                    )
            })     
    })
})