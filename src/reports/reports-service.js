const ReportsService = {
    getAllReports(knex, id) {
        return knex
            .select('*')
            .where('user_id', id)
            .from('soundlyinvest_reports')
    },
    insertReport(knex, newReport) {
        return knex 
            .insert(newReport)
            .into('soundlyinvest_reports')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex 
            .from('soundlyinvest_reports')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteReport(knex, id, userId) {
        return knex ('soundlyinvest_reports')
            .where({ id })
            .where('user_id', userId)
            .delete()
    },
    updateReport(knex, id, newReportFields) {
        return knex('soundlyinvest_reports')
            .where({ id })
            .update(newReportFields)
    },
};

module.exports = ReportsService;