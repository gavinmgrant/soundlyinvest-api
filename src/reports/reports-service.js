const ReportsService = {
    getAllReports(knex) {
        return knex
            .select('*')
            // .where('user_id', id)
            .from('soundlyinvest_reports')
    },
    getById(knex, id) {
        return knex 
            .from('soundlyinvest_reports')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteReport(knex, id) {
        return knex ('soundlyinvest_reports')
            .where({ id })
            // .where('user_id', id)
            .delete()
    },
    updateReport(knex, id, newReportFields) {
        return knex('soundlyinvest_reports')
            .where({ id })
            .update(newReportFields)
    },
};

module.exports = ReportsService;