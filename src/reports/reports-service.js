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
};

module.exports = ReportsService;