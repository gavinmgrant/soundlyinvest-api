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
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/reports')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Report doesn't exist`} })
            })

            it('responds with 200 and correct fields for the report', () => {
                const reportId = 1;
                const expectedReport = helpers.makeReportsArray();

                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(postRes.body)
                    )
            })     
    })

    describe(`DELETE /api/reports/:id`, () => {
        context(`Given no reports`, () => { 
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 404`, () => {
                const id = 123456
                return supertest(app)
                    .delete(`/api/reports/${id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { 
                        error: { message: `Report doesn't exist` }
                    })
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

            it('responds with 204 and removes the report', () => {
                const idToRemove = 1;
                const expectedReports = testReports.filter(report => report.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/reports/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/reports`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedReports)    
                    )
            })
        })
    })

    describe(`PATCH /api/reports/:id`, () => {
        context(`Given no reports`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )
            it(`responds with 404`, () => {
                const reportId = 123456
                return supertest(app)
                    .patch(`/api/reports/${reportId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Report doesn't exist` } })
            })
        })

        context('Given there are reports in the database', () => {
            beforeEach('insert reports', () => 
                helpers.seedReports(
                    db, 
                    testUsers,
                    testReports
                )
            )
        
            it('responds with 204 and updates the report', () => {
                const idToUpdate = 2
                const updateReport = {
                    report_name: 'New Name',
                    prop_address: "4112 Nordica St, San Diego, CA 92113",
                    purchase_price: 899000,
                    down_payment: 15,
                    interest_rate: 3.5,
                    loan_period: 20,
                    rental_income: 4000,
                    storage_income: 0,
                    parking_income: 0,
                    tax_rate: 1,
                    property_manager: 0,
                    insurance: 140,
                    utilities: 100,
                    gardener: 50,
                    miscellaneous: 150,
                    vacancy_rate: 3,
                    user_id: 1
                }
                const expectedReport = {
                    ...testReports[idToUpdate - 1],
                    ...updateReport
                }
                return supertest(app)
                    .patch(`/api/reports/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updateReport)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/reports/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedReport)    
                    )
                })

            it(`responds with 400 with no fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/reports/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain at least one updated field`
                        }
                    })
            })
        })
    })
})