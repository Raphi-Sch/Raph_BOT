const mysql = require('mysql');
const config = require('../config.json');

const db = mysql.createConnection({
    host: config.db_host,
    user: config.db_user,
    password: config.db_pass,
    database: config.db_name
});

db.connect(function (err) {
    if (err) throw err;
})

function query(sql, values) {
    return new Promise(resolve => db.query(sql, values, function (err, result) {
        if (err) {
            console.error(err);
            resolve(null);
        }
        resolve(result);
    }));
}

async function load_config() {
    const sql = await query("SELECT * FROM config");
    const result = [];

    try {
        sql.forEach(element => {
            result[element.id] = element.value;
        });
        return result;
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = { query, load_config }