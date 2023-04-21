var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("sqlite3.db");

db.serialize(function () {
  let create_user_table = `
    CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role INTEGER DEFAULT 3,
    package_id INTEGER,
    is_auto_renewal INTEGER DEFAULT 0,
    FOREIGN KEY (package_id)
      REFERENCES package(package_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`;

  let create_message_table = `
    CREATE TABLE IF NOT EXISTS message (
    message_id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    body TEXT NOT NULL,
    has_seen INTEGER DEFAULT 0,
    sender_user_id INTEGER NOT NULL,
    receiver_user_id INTEGER NOT NULL,
    FOREIGN KEY (sender_user_id)
      REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (receiver_user_id)
      REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`;

  let create_video_table = `
    CREATE TABLE IF NOT EXISTS video (
    video_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL
  )`;

  let create_package_table = `
    CREATE TABLE IF NOT EXISTS package (
    package_id INTEGER PRIMARY KEY,
    package_name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL
  )`;

  let create_creditcard_table = `
    CREATE TABLE IF NOT EXISTS creditcard (
    creditcard_id INTEGER PRIMARY KEY,
    card_number TEXT NOT NULL,
    expiration_month TEXT NOT NULL,
    expiration_year TEXT NOT NULL,
    security_code TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`;

  let create_bill_table = `
    CREATE TABLE IF NOT EXISTS bill (
    bill_id INTEGER PRIMARY KEY,
    start_timestamp TEXT NOT NULL,
    end_timestamp TEXT NOT NULL,
    package_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    creditcard_id INTEGER NOT NULL,
    FOREIGN KEY (package_id)
      REFERENCES package(package_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
      REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (creditcard_id)
      REFERENCES creditcard(creditcard_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`;

  db.run(create_user_table);
  db.run(create_message_table);
  db.run(create_video_table);
  db.run(create_package_table);
  db.run(create_creditcard_table);
  db.run(create_bill_table);
});