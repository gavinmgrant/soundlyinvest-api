const express = require('express');
const ReportsService = require('./reports-service');

const reportsRouter = express.Router();

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

module.exports = reportsRouter;