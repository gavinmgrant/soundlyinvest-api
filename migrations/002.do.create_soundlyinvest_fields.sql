CREATE TABLE soundlyinvest_fields (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    report_id INTEGER REFERENCES soundlyinvest_reports(id),
    field_name TEXT NOT NULL,
    field_val TEXT NOT NULL,
    field_type TEXT NOT NULL
);