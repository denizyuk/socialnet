require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/deyuk`
);

const bcrypt = require("bcryptjs");

const hash = (password) => {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
};

module.exports.authenticate = function (email, password) {
    return this.findUserByEmail(email).then((result) => {
        return bcrypt
            .compare(password, result.rows[0].password)
            .then((success) => {
                return success;
            });
    });
};

module.exports.insertUser = function (first_name, last_name, email, password) {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    console.log("password: ", password);
    return hash(password)
        .then((hpassword) => {
            return db
                .query(sql, [first_name, last_name, email, hpassword])
                .then((result) => result.rows)
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

module.exports.checkEmail = function (email) {
    const sql = `
        SELECT email FROM users WHERE email = $1;
    `;

    return db.query(sql, [email]).then((result) => result.rows);
};

module.exports.findUserByEmail = function (email) {
    const sql = `SELECT id, email, password FROM users WHERE email = $1;`;
    return db.query(sql, [email]);
};
