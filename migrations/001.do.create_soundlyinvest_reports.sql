CREATE TABLE soundlyinvest_reports (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    report_name TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now()
);                