function makeReportsArray() {
    return [
        {
            id: 1,
            report_name: 'Test Report 1',
            date_created: "2020-11-12T02:35:00.029Z",
            user_id: 1
        },
        {
            id: 2,
            report_name: 'Test Report 2',
            date_created: "2020-11-12T02:35:00.029Z",
            user_id: 1
        },
    ]
};

function makeFieldsArray() {
    return [
        {
            report_id: 1,
            field_name: 'prop_address',
            field_val: '327 28th St, San Diego, CA 92102, USA',
            field_type: 'string'
        },
        {
            report_id: 1,
            field_name: 'purchase_price',
            field_val: '750000',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'down_payment',
            field_val: '20',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'interest_rate',
            field_val: '3.75',
            field_type: 'float'
        },
        {
            report_id: 1,
            field_name: 'loan_period',
            field_val: '30',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'rental_income',
            field_val: '3500',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'storage_income',
            field_val: '50',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'parking_income',
            field_val: '100',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'tax_rate',
            field_val: '1.25',
            field_type: 'float'
        },
        {
            report_id: 1,
            field_name: 'property_manager',
            field_val: '0',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'insurance',
            field_val: '120',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'utilities',
            field_val: '80',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'gardener',
            field_val: '0',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'miscellaneous',
            field_val: '100',
            field_type: 'integer'
        },
        {
            report_id: 1,
            field_name: 'vacancy_rate',
            field_val: '2',
            field_type: 'integer'
        },
    ]
};

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test',
            password: 'password',
        },
    ]
};

function makeReportsFixtures() {
    const testReports = makeReportsArray();
    const testFields = makeFieldsArray();
    const testUsers = makeUsersArray();
    return { testReports, testFields, testUsers };
};

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
            soundlyinvest_reports,
            soundlyinvest_fields,
            soundlyinvest_users
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE soundlyinvest_reports_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE soundlyinvest_fields_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE soundlyinvest_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('soundlyinvest_reports_id_seq', 0)`),
                trx.raw(`SELECT setval('soundlyinvest_fields_id_seq', 0)`),
                trx.raw(`SELECT setval('soundlyinvest_users_id_seq', 0)`),
            ])
        )
    )
};

function seedReportsTables(db, users, reports) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('soundlyinvest_reports').insert(reports)
        // update the auto sequence to match the forced id values
        await trx.raw(
            `SELECT setval('soundlyinvest_reports_id_seq', ?)`,
            [reports[reports.length - 1].id],      
        )
    })    
};

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        //password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('soundlyinvest_users').insert(preppedUsers)
    .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
            `SELECT setval('soundlyinvest_users_id_seq', ?)`,
            [users[users.length - 1].id],
        )
    )
};

function makeExpectedReports(users, report) {
    const user = users
        .find(user => user.id === report.user_id)

    return {
        id: report.id,
        report_name: report.report_name,
        date_created: "2020-11-12T02:35:00.029Z",
        user_id: user.id,
    }
};

module.exports = {
    makeReportsArray,
    makeFieldsArray,
    makeUsersArray,
    makeReportsFixtures,
    cleanTables,
    seedReportsTables,
    seedUsers,
    makeExpectedReports,
};