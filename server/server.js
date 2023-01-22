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
const server = require("http").Server(app);

const cookieSession = require("cookie-session");
const { uploader, checkId } = require("./middleware.js");

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);
const { PORT = 3001 } = process.env;

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socket connection", socket.id);

    const { userId } = socket.request.session;
    if (!userId) {
        return socket.disconnect(true);
    }

    const latestMessages = await db.getLastMessages();

    socket.emit("chatMessages", latestMessages.rows);

    socket.on("chatMessage", async (text) => {
        const newMessage = await db.insertMessage(userId, text);
        console.log("messages in server", newMessage);

        io.emit("chatMessage", newMessage);
    });
});

// ---------- COOKIES ----------

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

//   DOUBLE CHECK NAMES !!!!!!
app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("req.body:", req.body);
    console.log("---------------------");
    next();
});

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

//app.post("/forgetPassword", (req, res) => {
//    const email = req.body.email;
//
//    db.checkEmail(email).then((result) => {
//        // console.log("email log", result[0]);
//        if (!result.length) {
//            res.json({ message: "email not found" });
//        } else {
//            const secretCode = cryptoRandomString({
//                length: 6,
//            });
//            console.log("password code is: ", secretCode);
//
//            db.insertPasswordCode(email, secretCode).then(() => {
//                if (req.body) {
//                    res.json({
//                        success: true,
//                        passCode: secretCode,
//                    });
//                } else {
//                    res.json({
//                        success: false,
//                        message: "something went wrong!",
//                    });
//                }
//            });
//        }
//    });
//});

// app.post("/resetPassword", (req, res) => {
//     const { email, passwordCode, newPassword } = req.body;

//     db.findPasswordCode(email).then((data) => {
//         if (data.rows[0].passwordcode === passwordCode) {
//             db.insertNewPassword(email, newPassword).then(() => {
//                 res.json({
//                     success: true,
//                 });
//             });
//         } else {
//             res.json({ success: false, message: "wrong code!" });
//         }
//     });
// });

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
        const { userId } = req.session;
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

app.get("/findUsers/:search", checkId, (req, res) => {
    console.log("req", req.params.search);
    db.findUsersByValue(req.params.search)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("ERROR in findUsers: ", err);
        });
});

app.get("/users/:id", checkId, (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({
            success: false,
        });
    } else {
        db.findUserById(req.params.id)
            .then((data) => {
                res.json({
                    success: true,
                    data: data.rows[0],
                });
            })
            .catch((err) => {
                console.log("ERROR : ", err);
            });
    }
});

app.get("/friends", (req, res) => {
    const userId = req.session.userId;

    db.retrievingFriends(userId)
        .then((friends) => {
            db.getHowManyFriends(userId)
                .then((count) => {
                    res.json({
                        friends: friends.rows,
                        count: count.rows[0],
                    });
                })
                .catch((err) => {
                    console.log("Error getting friends count: ", err);
                    res.json({
                        success: false,
                        error: err,
                    });
                });
        })
        .catch((err) => {
            console.log("Error retrieving friends: ", err);
            res.json({
                success: false,
                error: err,
            });
        });
});

app.get("/friendship/:otherUserId", checkId, (req, res) => {
    db.findFriendship(req.session.userId, req.params.otherUserId)
        .then((data) => {
            res.json({ data: data.rows, userId: req.session.userId });
        })
        .catch((err) => {
            console.log("ERROR in friendship GET: ", err);
        });
});

app.post("/friendship/:otherUserId", checkId, (req, res) => {
    db.insertFriendship(req.session.userId, req.params.otherUserId)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("ERROR in friendship POST: ", err);
        });
});

app.post("/friendship/cancel/:otherUserId", checkId, (req, res) => {
    db.deleteFriendship(req.session.userId, req.params.otherUserId)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("ERROR in friendship cancel POST: ", err);
        });
});

app.post("/friendship/accept/:otherUserId", checkId, (req, res) => {
    db.acceptFriendship(req.session.userId, req.params.otherUserId)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("ERROR in friendship accept POST: ", err);
        });
});

app.get("/friendship", checkId, (req, res) => {
    db.retrievingFriends(req.session.userId).then((data) => {
        db.getHowManyFriends(req.session.userId)
            .then((friendsCount) => {
                res.json({
                    success: true,
                    friends: data.rows,
                    count: friendsCount.rows[0],
                });
            })
            .catch((err) => {
                console.log("ERROR in friendship GET: ", err);
            });
    });
});

app.get("/messages", (req, res) => {
    const limit = req.query.limit || 10;
    db.getLastMessages(limit)
        .then((data) => res.json(data.rows))
        .catch((error) => res.json(error));
});

app.get("/messages/:id", (req, res) => {
    const messageId = req.params.id;
    db.getLastMessageById(messageId)
        .then((data) => res.json(data.rows[0]))
        .catch((error) => res.json(error));
});

app.post("/messages", (req, res) => {
    const userId = req.body.userId;
    const message = req.body.message;
    db.insertMessage(userId, message)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
