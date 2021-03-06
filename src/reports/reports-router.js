const express = require('express');
const xss = require('xss');
const ReportsService = require('./reports-service');
const { requireAuth } = require('../middleware/jwt-auth');

const reportsRouter = express.Router();
const jsonParser = express.json();

const serializeReport = report => ({
    id: report.id,
    report_name: xss(report.report_name),
    date_created: report.date_created,
    prop_address: report.prop_address,
    purchase_price: report.purchase_price,
    down_payment: report.down_payment,
    interest_rate: report.interest_rate,
    loan_period: report.loan_period,
    rental_income: report.rental_income,
    storage_income: report.storage_income,
    parking_income: report.parking_income,
    tax_rate: report.tax_rate,
    property_manager: report.property_manager,
    insurance: report.insurance,
    utilities: report.utilities,
    gardener: report.gardener,
    miscellaneous: report.miscellaneous,
    vacancy_rate: report.vacancy_rate,
    user_id: report.user_id,
}) 

reportsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        ReportsService.getAllReports(knexInstance, req.user.id)
            .then(reports => {
                res.json(reports)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { 
            report_name, 
            prop_address,
            purchase_price,
            down_payment,
            interest_rate,
            loan_period,
            rental_income,
            storage_income,
            parking_income,
            tax_rate,
            property_manager,
            insurance,
            utilities,
            gardener,
            miscellaneous,
            vacancy_rate,
            user_id, 
        } = req.body;
        const newReport = { 
            report_name, 
            prop_address,
            purchase_price,
            down_payment,
            interest_rate,
            loan_period,
            rental_income,
            storage_income,
            parking_income,
            tax_rate,
            property_manager,
            insurance,
            utilities,
            gardener,
            miscellaneous,
            vacancy_rate,
            user_id,  
        };

        for(const [key, value] of Object.entries(newReport)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        newReport.user_id = req.user.id;

        ReportsService.insertReport(
            req.app.get('db'),
            newReport
        )
            .then(report => {
                res 
                    .status(201)
                    .location(`/reports/${report.id}`)
                    .json(serializeReport(report))
            })
            .catch(next)
    })

reportsRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        ReportsService.getById(knexInstance, req.params.id)
            .then(report => {
                if (!report) {
                    return res.status(404).json({
                        error: { message: "Report doesn't exist" }
                    })
                }
                res.report = report
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        ReportsService.getById(knexInstance, req.params.id)
            .then(report => {
                res.json(report)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        ReportsService.deleteReport(knexInstance, req.params.id, req.user.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { 
            report_name,
            prop_address,
            purchase_price,
            down_payment,
            interest_rate,
            loan_period,
            rental_income,
            storage_income,
            parking_income,
            tax_rate,
            property_manager,
            insurance,
            utilities,
            gardener,
            miscellaneous,
            vacancy_rate
        } = req.body;
        const reportToUpdate = {
            report_name,
            prop_address,
            purchase_price,
            down_payment,
            interest_rate,
            loan_period,
            rental_income,
            storage_income,
            parking_income,
            tax_rate,
            property_manager,
            insurance,
            utilities,
            gardener,
            miscellaneous,
            vacancy_rate
        };
        const numberOfValues = Object.values(reportToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain at least one updated field`
                }
            })
        }
        const knexInstance = req.app.get('db')
        ReportsService.updateReport(
            knexInstance,
            req.params.id,
            reportToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = reportsRouter;