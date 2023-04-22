var express = require('express');
var router = express.Router();

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("sqlite3.db");

// get all records from table
router.get('/get/:table', function (req, res) {
    let table = req.params.table
    let sql = `SELECT * FROM ${table}`

    db.all(sql, (err, rows) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        return res.json({ status: 'Success', data: rows })
    })

});

// get a record from table by id
router.get('/get/:table/:id', function (req, res) {
    let table = req.params.table
    let id = req.params.id
    let sql = `SELECT * FROM ${table} WHERE ${table}_id = ${id}`

    db.get(sql, (err, row) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        else if (!row) {
            return res.json({ status: 'Not Found' })
        }
        return res.json({ status: 'Success', data: row })
    })

});

// insert one record to table
router.post('/insert/:table', function (req, res) {
    let table = req.params.table
    let body = req.body
    let sql = ''

    switch (table) {
        case 'user':
            sql = `
                INSERT INTO user (firstname, lastname, username, email, password)
                VALUES ("${body.firstname}", "${body.lastname}", "${body.username}", "${body.email}", "${body.password}")
            `;
            break;
        case 'message':
            sql = `
                INSERT INTO message (timestamp, body, sender_user_id, receiver_user_id)
                VALUES ("${body.timestamp}", "${body.body}", ${body.sender_user_id}, ${body.receiver_user_id})
            `;
            break;
        case 'video':
            sql = `
                INSERT INTO video (title, url, description)
                VALUES ("${body.title}", "${body.url}", "${body.description}")
            `;
            break
        case 'package':
            sql = `
                INSERT INTO package (package_name, price, description)
                VALUES ("${body.package_name}", ${body.price}, "${body.description}")
            `;
            break
        case 'creditcard':
            sql = `
                INSERT INTO creditcard (card_number, expiration_month, expiration_year, security_code, user_id)
                VALUES ("${body.card_number}", "${body.expiration_month}", "${body.expiration_year}", "${body.security_code}", ${body.user_id})
            `;
            break
        case 'bill':
            sql = `
                INSERT INTO bill (start_timestamp, end_timestamp, package_id, user_id, creditcard_id)
                VALUES ("${body.start_timestamp}", "${body.end_timestamp}", ${body.package_id}, ${body.user_id}, ${body.creditcard_id})
            `;
            break
    }

    db.run(sql, (err) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        return res.json({ status: 'Success', data: 'Insert data successful!' });
    })
});


// update one record by id
router.put('/update/:table/:id', function (req, res) {
    let table = req.params.table
    let id = req.params.id
    let body = req.body
    let sql = ''

    switch (table) {
        case 'user':
            sql = `
                UPDATE user SET firstname = "${body.firstname}", 
                lastname = "${body.lastname}", 
                username = "${body.username}",
                email = "${body.email}",
                password = "${body.password}"
                WHERE ${table}_id = ${id}
            `;
            break;
        case 'message':
            sql = `
                UPDATE message SET timestamp = "${body.timestamp}",
                body = "${body.body}",
                sender_user_id = ${body.sender_user_id},
                receiver_user_id = ${body.receiver_user_id}
                WHERE ${table}_id = ${id}
            `;
            break;
        case 'video':
            sql = `
                UPDATE video SET title = "${body.title}",
                url = "${body.url}",
                description = "${body.description}"
                WHERE ${table}_id = ${id}
            `;
            break
        case 'package':
            sql = `
                UPDATE package SET package_name = "${body.package_name}",
                price = ${body.price}, 
                description = "${body.description}"
                WHERE ${table}_id = ${id}
            `;
            break
        case 'creditcard':
            sql = `
                UPDATE creditcard SET card_number = "${body.card_number}",
                expiration_month = "${body.expiration_month}",
                expiration_year = "${body.expiration_year}",
                security_code = "${body.security_code}", 
                user_id = ${body.user_id}
                WHERE ${table}_id = ${id}
            `;
            break
        case 'bill':
            sql = `
                UPDATE bill SET start_timestamp = "${body.start_timestamp}", 
                end_timestamp = "${body.end_timestamp}",
                package_id = ${body.package_id}, 
                user_id = ${body.user_id}, 
                creditcard_id = ${body.creditcard_id}
                WHERE ${table}_id = ${id}
            `;
            break
    }

    db.run(sql, (err) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        return res.json({ status: 'Success', data: 'Update data successful!' });
    })
});

// delete one record by id
router.delete('/delete/:table/:id', function (req, res) {
    let table = req.params.table
    let id = req.params.id
    let sql = `DELETE FROM ${table} WHERE ${table}_id = ${id}`
    db.run(sql, (err) => {
        if (err) {
            return res.json({ status: 'Failed', error: err })
        }
        return res.json({ status: 'Success', data: 'Delete data successful!' });
    })
});

router.post("/starter_mockdata", function (req, res) {
    let add_new_user = `
        INSERT INTO user (firstname, lastname, username, email, password)
        VALUES 
        ("minerva", "despair", "minerva", "minerva@despair.mail", "p@ssword"),
        ("neuro", "sama", "neurosama", "neurosama@vedal.mail", "p@ssword"),
        ("morgana", "zz", "morganazz", "morgana@mona.mail", "p@ssword")
    `;

    let add_new_message = `
        INSERT INTO message (timestamp, body, sender_user_id, receiver_user_id)
        VALUES
        ("1680958708342", "hello, world!", 1, 1),
        ("1680958769654", "supporter to user", 2, 1)
    `;

    let add_new_video = `
        INSERT INTO video (title, url, description)
        VALUES
        ("I Really Want To Stay At Your House", "https://youtu.be/sEDDfohAbU4", "From Cyberpunk2077"),
        ("You know it's fool on cool", "https://youtu.be/ruCzgIWwb-8", "Nothing Amazing Happens Here"),
        ("Headphone Actor", "https://youtu.be/nnyACg_WQLw", "Kagerou Daze!")
    `;

    let add_new_package = `
        INSERT INTO package (package_name, price, description)
        VALUES 
        ("Dragon Plan", 999.0, "4K resolution"),
        ("Hero Plan", 799.0, "2K resolution"),
        ("Slime Plan", 199.0, "480p resolution")
    `;

    let add_new_creditcard = `
        INSERT INTO creditcard (card_number, expiration_month, expiration_year, security_code, user_id)
        VALUES
        ("15473685234345", "08", "29", "420", 1),
        ("24623456336363", "12", "27", "030", 2),
        ("42364646232343", "03", "25", "635", 3)
    `;

    let add_new_bill = `
        INSERT INTO bill (start_timestamp, end_timestamp, package_id, user_id, creditcard_id)
        VALUES
        ("1680951233657", "1680955677327", 1, 1, 2),
        ("1680954324674", "1680955676264", 2, 1, 1),
        ("1680953246345", "1680956788234", 3, 3, 3)
    `;

    db.run(add_new_user);
    db.run(add_new_message);
    db.run(add_new_video);
    db.run(add_new_package);
    db.run(add_new_creditcard);
    db.run(add_new_bill);
    res.json({ status: 'Success', data: 'Insert starter mockdata successful!' });
});

router.post('/random_mockdata/:table/:n', function (req, res) {
    let n = req.params.n
    let table = req.params.table

    if (table == 'user') {
        for (let i = 0; i < n; i++) {
            let rand = Math.random();
            let unique = rand * 1e16;
            let package = [null, 1, 2, 3][Math.floor(rand * 4)];
            let choice = [0, 1][Math.floor(Math.random() * 2)];
            let insert_new_user = `
                INSERT INTO user (firstname, lastname, username, email, password, package_id, is_auto_renewal)
                VALUES ("minerva", "despair", "${unique}", "${unique}@despair.mail", "p@ssw0rd", ${package}, ${choice})
            `;
            db.run(insert_new_user);
        }
    }

    if (table == 'message') {
        for (let i = 0; i < n; i++) {
            let min = 1680338307324;
            let max = 1682068275502;
            let random_timestamp = min + Math.floor((max - min) * Math.random());
            let insert_new_message = `
                INSERT INTO message (timestamp, body, sender_user_id, receiver_user_id)
                VALUES (${random_timestamp}, "hello, world!", 1, 1)
            `;
            db.run(insert_new_message);
        }
    }

    if (table == 'video') {
        for (let i = 0; i < n; i++) {
            let insert_new_video = `
                INSERT INTO video (title, url, description)
                VALUES ("You know it's fool on cool", "https://youtu.be/ruCzgIWwb-8", "Nothing Amazing Happens Here")
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
            let max = 1686406948569;
            let random_timestamp = min + Math.floor((max - min) * rand);
            let package = [1, 2, 3][Math.floor(rand * 3)];
            let insert_new_bill = `
                INSERT INTO bill (start_timestamp, end_timestamp, package_id, user_id, creditcard_id)
                VALUES (${random_timestamp}, ${random_timestamp + 2592000000}, ${package}, 1, 1)
            `;
            db.run(insert_new_bill);
        }
    }

    res.json({ status: 'Success', data: 'Insert random mockdata successful!' });
})

module.exports = router;
