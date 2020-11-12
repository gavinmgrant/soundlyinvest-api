BEGIN;

TRUNCATE
    soundlyinvest_reports,
    soundlyinvest_fields,
    soundlyinvest_users
    RESTART IDENTITY CASCADE;

INSERT INTO soundlyinvest_users (user_name, password)
VALUES
    ('demo', 'password');

INSERT INTO soundlyinvest_reports (report_name, user_id)
VALUES  
    ('Example Report 1', 1),
    ('Example Report 2', 1);

INSERT INTO soundlyinvest_fields (report_id, field_name, field_val, field_type)
VALUES
    (1, 'prop_address', '327 28th St, San Diego, CA 92102, USA', 'string'),
    (1, 'purchase_price', '750000', 'integer'),
    (1, 'down_payment', '20', 'integer'),
    (1, 'interest_rate', '3.75', 'float'),
    (1, 'loan_period', '30', 'integer'),
    (1, 'rental_income', '3500', 'integer'),
    (1, 'storage_income', '50', 'integer'),
    (1, 'parking_income', '100', 'integer'),
    (1, 'tax_rate', '1.25', 'float'),
    (1, 'property_manager', '0', 'integer'),
    (1, 'insurance', '120', 'integer'),
    (1, 'utilities', '80', 'integer'),
    (1, 'gardener', '0', 'integer'),
    (1, 'miscellaneous', '100', 'integer'),
    (1, 'vacancy_rate', '2', 'integer'),
    (2, 'prop_address', '4112 Nordica St, San Diego, CA 92113, USA', 'string'),
    (2, 'purchase_price', '800000', 'integer'),
    (2, 'down_payment', '20', 'integer'),
    (2, 'interest_rate', '3.5', 'float'),
    (2, 'loan_period', '20', 'integer'),
    (2, 'rental_income', '4000', 'integer'),
    (2, 'storage_income', '0', 'integer'),
    (2, 'parking_income', '0', 'integer'),
    (2, 'tax_rate', '1.25', 'float'),
    (2, 'property_manager', '0', 'integer'),
    (2, 'insurance', '140', 'integer'),
    (2, 'utilities', '100', 'integer'),
    (2, 'gardener', '50', 'integer'),
    (2, 'miscellaneous', '150', 'integer'),
    (2, 'vacancy_rate', '2', 'integer');

COMMIT;