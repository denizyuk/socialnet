const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const aws = require("aws-sdk");
const { AWS_KEY, AWS_SECRET, AWS_BUCKET } = process.env;
const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});
require("dotenv").config();
const fs = require("fs");

const cookieSession = require("cookie-session");
const { uploader, checkId } = require("./middleware.js");

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

app.get("/user/id", checkId, function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

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

// BUNU SAKIN SILME!!!

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

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
});

app.post("/profilePic", checkId, uploader.single("file"), (req, res) => {
    if (req.file) {
        const { filename, mimetype, size, path } = req.file;
        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                console.log("success uploading");
                fs.unlinkSync(req.file.path);
                let profilePic = `https://s3.amazonaws.com/${AWS_BUCKET}/${filename}`;

                db.insertProfilePic(profilePic, req.session.userId).then(() => {
                    res.json({
                        success: true,
                        message: "Thank you upload complete!",
                        profilePic,
                    });
                });
            })
            .catch((err) => {
                console.log("ERROR in insertProfilePic: ", err);
            });
    } else {
        res.json({
            success: false,
            message: "Upload failed!",
        });
    }
});

app.post("/bio", checkId, (req, res) => {
    const { newBio } = req.body;

    db.insertBio(newBio, req.session.userId)
        .then(() => {
            res.json({
                success: true,
                bio: newBio,
            });
        })
        .catch((err) => {
            console.log("error in insertbio: ", err);
        });
});

app.get("/user", checkId, (req, res) => {
    console.log("test outside of the if statement in /user");
    if (req.session.userId) {
        const { userId } = req.session.userId;
        console.log("userID", userId);
        db.findUserById(userId)
            .then((data) => {
                res.json(data.rows[0]);
            })
            .catch((err) => {
                console.log("error in findUserById ", err);
            });
    }
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
