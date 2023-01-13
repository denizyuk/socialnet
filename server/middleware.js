const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            const extension = path.extname(file.originalname);
            const randomFileName = uid + extension;
            callback(null, randomFileName);
        });
    },
});

module.exports.uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

module.exports.checkId = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.json({ session: "you dont have ID dude!!!" });
    }
};
