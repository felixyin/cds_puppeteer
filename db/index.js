// get the client
const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: '139.224.1.36',
    database: 'cds_puppeteer',
    user: 'root',
    password: 'Xr2017.',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

exports.pool = pool;
