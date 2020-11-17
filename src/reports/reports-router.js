const express = require('express');
const ReportsService = require('./reports-service');

const reportsRouter = express.Router();
const jsonParser = express.json();

reportsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        ReportsService.getAllReports(knexInstance)
            .then(reports => {
                res.json(reports)
            })
            .catch(next)
    })

reportsRouter
    .route('/:id')
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
        ReportsService.deleteReport(knexInstance, req.params.id)
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