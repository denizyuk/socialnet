const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
require("dotenv").config();

const cookieSession = require("cookie-session");

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);
const { PORT = 3001 } = process.env;

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

// ---------- COOKIES ----------

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

//   DOUBLE CHECK NAMES !!!!!!

app.post("/registration", (req, res) => {
    console.log("req.body: ", req.body);
    if (req.body) {
        const { first_name, last_name, email, password } = req.body;

        db.insertUser(first_name, last_name, email, password)
            .then((rows) => {
                console.log(rows);
                req.session.userId = rows[0].id;

                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                console.log("ERROR in insertUser: ", err);
            });
    } else {
        res.json({
            success: false,
            message: "something went wrong!",
        });
    }
});

app.get("/user/id.json", function (req, res) {
    if (req.session) {
        return res.json({
            userId: req.session.userId,
        });
    }

    res.json({});
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/Login", (req, res) => {
    const { email, password } = req.body;

    db.findUserByEmail(email).then((result) => {
        db.checkEmail(email).then((rows) => {
            if (!rows.length) {
                res.json({ message: "email not found" });
            } else {
                db.authenticate(email, password).then((success) => {
                    if (success === true) {
                        req.session.userId = result.rows[0].id;
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({
                            success: false,
                            message: "something went wrong!",
                        });
                    }
                });
            }
        });
    });
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
