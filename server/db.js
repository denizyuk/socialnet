require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials..
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/social-network`
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

module.exports.insertPasswordCode = function (email, passwordCode) {
    const sql = `
        INSERT INTO passwordCodes (email, passwordCode)
        VALUES ($1, $2)
        RETURNING *;
    `;
    return db.query(sql, [email, passwordCode]);
};

module.exports.findPasswordCode = function (email) {
    const sql = `
        SELECT passwordCode FROM passwordCodes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '20 minutes'
        ORDER BY created_at DESC
        LIMIT 1;
    `;
    return db.query(sql, [email]);
};

module.exports.insertNewPassword = function (email, password) {
    const sql = `
        UPDATE users SET password = $2
        WHERE email = $1;
    `;
    return this.hash(password).then((hpassword) => {
        return db.query(sql, [email, hpassword]);
    });
};

module.exports.insertProfilePic = function (profile_pic, userId) {
    const sql = `
        UPDATE users SET profile_pic = $1
        WHERE id = $2
        RETURNING *;
    `;
    return db.query(sql, [profile_pic, userId]);
};

module.exports.insertBio = function (bio, userId) {
    const sql = `
    UPDATE users SET bio = $1
    WHERE id = $2
    RETURNING *;
    `;
    return db.query(sql, [bio, userId]);
};

module.exports.findUserById = function (userId) {
    const sql = `
    SELECT * FROM users WHERE id = $1;
    `;
    return db.query(sql, [userId]).then((result) => result.rows[0]);
};

module.exports.findUsersByValue = function (name) {
    const sql = `
        SELECT id, first_name, last_name, profile_pic FROM users
        WHERE first_name ILIKE $1 OR last_name ILIKE $1
        
    `;
    return db.query(sql, [name + "%"]);
};

module.exports.findFriendship = (user1, user2) => {
    const sql = `
        SELECT * FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`;
    return db.query(sql, [user1, user2]);
};

module.exports.insertFriendship = (userId1, userId2) => {
    const sql = `
        INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)
        RETURNING *;
        `;
    return db.query(sql, [userId1, userId2]);
};

module.exports.deleteFriendship = (userId1, userId2) => {
    const sql = `
        DELETE FROM friendships 
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        `;
    return db.query(sql, [userId1, userId2]);
};

module.exports.acceptFriendship = (userId1, userId2) => {
    const sql = `
        UPDATE friendships SET accepted = true
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)
        `;
    return db.query(sql, [userId1, userId2]);
};

module.exports.retrievingFriends = (userId) => {
    const sql = `
    
        SELECT users.id, first_name, last_name, accepted, profile_pic FROM users
        JOIN friendships
        ON (accepted = true AND recipient_id = $1 AND users.id = friendships.sender_id)
        OR (accepted = true AND sender_id = $1 AND users.id = friendships.recipient_id)
        OR (accepted = false AND recipient_id = $1 AND users.id = friendships.sender_id)
        ORDER BY first_name ASC;
 `;
    return db.query(sql, [userId]);
};

module.exports.getHowManyFriends = (userId) => {
    const sql = `
        SELECT count(CASE WHEN accepted THEN 1 END) 
        FROM friendships
        WHERE sender_id = $1 or recipient_id = $1;
        `;
    return db.query(sql, [userId]);
};

module.exports.addMessage = (senderId, message) => {
    return db
        .query(
            `INSERT INTO messages (sender_id, message) VALUES ($1, $2) RETURNING *;`,
            [senderId, message]
        )
        .then((data) => data.rows[0])
        .catch((err) => console.log(console.log("Messages query error:", err)));
};

module.exports.getMessageUserData = (id) => {
    return db
        .query(
            `SELECT messages.id, m.sender_id, m.message, m.created_at,
                    u.first_name, u.last_name, u.profile_pic
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id=$1;`,
            [id]
        )
        .then((data) => data.rows[0])
        .catch((err) => console.log(console.log("Messages query error:", err)));
};

module.exports.getLatestMessages = (limit = 10) => {
    return db
        .query(
            `SELECT * FROM (
            SELECT m.id,  m.message, m.created_at,
                   u.first_name, u.last_name, u.profile_pic
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            ORDER BY m.created_at DESC
            LIMIT $1
        ) as results ORDER BY created_at DESC;`,
            [limit]
        )
        .then((data) => data.rows)
        .catch((err) => console.log(console.log("Messages query error:", err)));
};
