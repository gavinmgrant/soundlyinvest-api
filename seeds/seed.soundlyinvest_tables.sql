BEGIN;

TRUNCATE
    soundlyinvest_reports,
    soundlyinvest_users
    RESTART IDENTITY CASCADE;

INSERT INTO soundlyinvest_users (user_name, password)
VALUES
    ('demo', 'password');

INSERT INTO soundlyinvest_reports (
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
    vacancy_rate,
    user_id)
VALUES  
    ('Example Report 1',
    '327 28th St, San Diego, CA 92102, USA',
    750000,
    20,
    3.75,
    30,
    3500,
    50,
    100,
    1.25,
    0,
    120,
    80,
    0,
    100,
    2,
    1),
    ('Example Report 2',
    '4112 Nordica St, San Diego, CA 92113',
    800000,
    20,
    3.5,
    20,
    4000,
    0,
    0,
    1,
    0,
    140,
    100,
    50,
    150,
    3,
    1);

COMMIT;