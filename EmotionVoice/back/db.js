const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3006',
    password: '0000',
    database: 'EmotionVoice'
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database');
});

module.exports = conn;
