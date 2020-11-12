module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql:gavingrant@localhost/soundlyinvest',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
};