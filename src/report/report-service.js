const ReportService = {
    insertReport(knex, newReport) {
        return knex 
            .insert(newReport)
            .into('soundlyinvest_reports')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertFields(knex, newFields) {
        // need to find a way to link fields to reports
        return knex
            .insert(newFields)
            .into('soundlyinvest_fields')
            .returning('*')
    }
};

module.exports = ReportService;