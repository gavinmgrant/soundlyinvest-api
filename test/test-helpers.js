function makeReportsArray() {
    return [
        {
            id: 1,
            report_name: "Test Report 1",
            date_created: "2020-11-12T02:35:00.029Z",
            prop_address: "327 28th St, San Diego, CA 92102, USA",
            purchase_price: 750000,
            down_payment: 20,
            interest_rate: 3.75,
            loan_period: 30,
            rental_income: 3500,
            storage_income: 50,
            parking_income: 100,
            tax_rate: 1.25,
            property_manager: 0,
            insurance: 120,
            utilities: 80,
            gardener: 0,
            miscellaneous: 100,
            vacancy_rate: 2,
            user_id: 1
        },
        {
            id: 2,
            report_name: "Test Report 2",
            date_created: "2020-11-12T02:35:00.029Z",
            prop_address: "4112 Nordica St, San Diego, CA 92113",
            purchase_price: 800000,
            down_payment: 20,
            interest_rate: 3.5,
            loan_period: 20,
            rental_income: 4000,
            storage_income: 0,
            parking_income: 0,
            tax_rate: 1,
            property_manager: 0,
            insurance: 140,
            utilities: 100,
            gardener: 50,
            miscellaneous: 150,
            vacancy_rate: 3,
            user_id: 1
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
    const testUsers = makeUsersArray();
    return { testReports, testUsers };
};

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
            soundlyinvest_reports,
            soundlyinvest_users
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE soundlyinvest_reports_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE soundlyinvest_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('soundlyinvest_reports_id_seq', 0)`),
                trx.raw(`SELECT setval('soundlyinvest_users_id_seq', 0)`),
            ])
        )
    )
};

function seedReports(db, users, reports) {
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

module.exports = {
    makeReportsArray,
    makeUsersArray,
    makeReportsFixtures,
    cleanTables,
    seedReports,
    seedUsers,
};