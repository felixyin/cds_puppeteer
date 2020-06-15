const pool = require('../db').pool;

pool.query('select * from user',function(err, rows, fields) {
    console.log(err);
    console.log(rows);
});
