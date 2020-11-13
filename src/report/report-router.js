const express = require('express');
const xss = require('xss');
const ReportService = require('./report-service');

const reportRouter = express.Router();
const jsonParser = express.json();

const serializeReport = report => ({
    id: report.id,
    report_name: xss(report.report_name),
    date_created: report.date_created,
    user_id: report.user_id,
})

reportRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { report_name, date_created, user_id } = req.body;
        const newReport = { report_name, date_created, user_id };

        for(const [key, value] of Object.entries(newReport)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        // newReport.user_id = req.user.id;

        ReportService.insertReport(
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

module.exports = reportRouter;