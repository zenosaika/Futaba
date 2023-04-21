var express = require('express');
var router = express.Router();

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("sqlite3.db");

// get all record from table
router.get('/get_table/:table', function (req, res) {
    let table = req.params.table
    let sql = `SELECT * FROM ${table}`
    db.all(sql, (err, rows) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        return res.json({ status: 'Success', data: rows })
    })
});

router.post('/insert_mockdata/:table/:n', function (req, res) {
    let n = req.params.n
    let table = req.params.table

    if (table == 'user') {
        for (let i = 0; i < n; i++) {
            let unique = Math.random() * 1e16
            let insert_new_user = `
                INSERT INTO user (firstname, lastname, username, email, password)
                VALUES ("minerva", "despair", "${unique}", "${unique}@despair.mail", "p@ssw0rd")
            `;
            db.run(insert_new_user);
        }
    }

    if (table == 'message') {
        for (let i = 0; i < n; i++) {
            let insert_new_message = `
                INSERT INTO message (timestamp, body, sender_user_id, receiver_user_id)
                VALUES (${Date.now()}, "hello, world!", 1, 1)
            `;
            db.run(insert_new_message);
        }
    }

    if (table == 'video') {
        for (let i = 0; i < n; i++) {
            let insert_new_video = `
                INSERT INTO video (title, url, description)
                VALUES ("You know it's fool on cool", "https://youtu.be/ruCzgIWwb-8", "Nothing Amazing Happens Here"),
            `;
            db.run(insert_new_video);
        }
    }

    if (table == 'package') {
        let insert_new_package = `
            INSERT INTO package (package_name, price, description)
            VALUES 
            ("Dragon Plan", 999.0, "4K resolution"),
            ("Hero Plan", 799.0, "2K resolution"),
            ("Slime Plan", 199.0, "480p resolution")
        `;
        db.run(insert_new_package);
    }

    if (table == 'creditcard') {
        let insert_new_creditcard = `
            INSERT INTO creditcard (card_number, expiration_month, expiration_year, security_code, user_id)
            VALUES
            ("4345567508074369", "08", "29", "420", 1),
            ("7150425677193487", "12", "27", "030", 2),
            ("3981759543298434", "03", "25", "635", 3)
        `;
        db.run(insert_new_creditcard);
    }

    if (table == 'bill') {
        for (let i = 0; i < n; i++) {
            let rand = Math.random()
            let min = 1649545067893;
            let max = 1682068275502;
            let random_timestamp = min + Math.floor((max - min) * rand);
            let package = [1, 2, 3][Math.floor(rand * 3)];
            let insert_new_bill = `
                INSERT INTO bill (start_timestamp, end_timestamp, package_id, user_id, creditcard_id)
                VALUES (${random_timestamp}, ${random_timestamp + 2592000000}, ${package}, 1, 1)
            `;
            db.run(insert_new_bill);
        }
    }

    res.json({ status: 'Success', data: 'Insert mock data successful!' });
})

module.exports = router;
