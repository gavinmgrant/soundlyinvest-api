const ReportService = {
    insertReport(knex, newReport) {
        return knex 
            .insert(newReport)
            .into('soundlyinvest_reports')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
};

module.exports = ReportService;