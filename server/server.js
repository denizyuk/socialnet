const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const encrypt = require("./bcrypt.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//const cookieSession = require("cookie-session");

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);
const { PORT = 3001 } = process.env;

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});

// ---------- COOKIES ----------

//app.use(
//    cookieSession({
//        secret: process.env.SESSION_SECRET,
//        maxAge: 1000 * 60 * 60 * 24 * 14,
//    })
// );

//   DOUBLE CHECK NAMES !!!!!!
app.post("registration", (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    encrypt.hash(password).then((hash) => {
        return db.insertUser(first_name, last_name, email, hash);
    });
    res.redirect("/");
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});
