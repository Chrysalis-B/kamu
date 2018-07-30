const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" }); //myapp.herokuapp.com:*
const compression = require("compression");
const db = require("./db.js");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const animation = require("chalk-animation");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3.js");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2997152
    }
});

app.use(bodyParser.json());
app.use(require("cookie-parser")());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/register", function(req, res) {
    hashPassword(req.body.password)
        .then(function(hashedPassword) {
            return db.createUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            );
        })
        .then(function(result) {
            const userId = result.rows[0].id;
            req.session.userId = userId;
            const firstName = req.body.first;
            req.session.first = firstName;
            const lastName = req.body.last;
            req.session.last = lastName;
        })
        .then(function() {
            return res.json({
                success: true
            });
        })
        .catch(function(err) {
            res.json({
                success: false
            });
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    let userId;
    let firstName;
    let lastName;
    db
        .getUserByEmail(req.body.email)
        .then(function(result) {
            userId = result.rows[0].id;
            firstName = result.rows[0].first;
            lastName = result.rows[0].last;
            return checkPassword(req.body.password, result.rows[0].password);
        })
        .then(function(result) {
            if (result == false) {
                throw new Error();
            } else {
                req.session.userId = userId;
                req.session.first = firstName;
                req.session.last = lastName;
                return res.json({
                    success: true
                });
            }
        })
        .catch(function() {
            return res.json({
                success: false
            });
        });
});

app.get("/user", (req, res) => {
    Promise.all([
        db.getUserInfo(req.session.userId),
        db.getBook(req.session.userId)
    ])
        .then(function([userdata, bookdata]) {
            if (userdata.rows[0].img_url == null) {
                res.json({
                    first: userdata.rows[0].first,
                    last: userdata.rows[0].last,
                    profilePic: "/assets/donut.svg",
                    id: userdata.rows[0].id,
                    bio: userdata.rows[0].bio,
                    questions: bookdata.rows
                });
            } else {
                res.json({
                    first: userdata.rows[0].first,
                    last: userdata.rows[0].last,
                    profilePic: userdata.rows[0].img_url,
                    id: userdata.rows[0].id,
                    bio: userdata.rows[0].bio,
                    questions: bookdata.rows
                });
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/users/search", function(req, res) {
    db
        .searchUsers(req.query.q)
        .then(function({ rows }) {
            res.json({
                userResult: rows
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/friends.json", function(req, res) {
    db
        .getFriendsAndWannabes(req.session.userId)
        .then(function({ rows }) {
            res.json({
                users: rows
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    db
        .updateImage(config.s3Url + req.file.filename, req.session.userId)
        .then(function(results) {
            res.json({
                imgUrl: results.rows[0].img_url
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/savebio", (req, res) => {
    db
        .saveBio(req.body.bio, req.session.userId)
        .then(function(results) {
            res.json({
                bio: results.rows[0].bio
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/savequestion.json", (req, res) => {
    db
        .saveQuestion(req.session.userId, req.body.question)
        .then(function(data) {
            res.json({
                question: data.rows
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/user/:id.json", function(req, res) {
    Promise.all([
        db.getUserById(req.params.id),
        db.getBook(req.params.id),
        db.getStatus(req.params.id, req.session.userId),
        db.getAnswers(req.params.id, req.session.userId)
    ])
        .then(function([userdata, bookdata, statusdata, answerdata]) {
            if (req.params.id == req.session.userId) {
                return res.json({
                    redirectToProfile: true
                });
            }
            res.json({
                first: userdata.rows[0].first,
                last: userdata.rows[0].last,
                profilePic: userdata.rows[0].img_url || "/assets/donut.svg",
                id: userdata.rows[0].id,
                bio: userdata.rows[0].bio,
                questions: bookdata.rows,
                answers: answerdata.rows,
                status: statusdata.rows[0]
                    ? statusdata.rows[0].status
                    : "noStatus"
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/bookfriends.json", function(req, res) {
    db.getBookFriends(req.session.userId).then(function(data) {
        res.json({
            data: data.rows
        });
    });
});

app.get("/getpage/:friendId.json", function(req, res) {
    db.getPage(req.params.friendId, req.session.userId).then(function(data) {
        res.json({
            data: data.rows
        });
        console.log(data.rows);
    });
});

app.get("/status/:otherUserId.json", function(req, res) {
    db
        .getStatus(req.params.otherUserId, req.session.userId)
        .then(function({ rows }) {
            res.json({
                status: rows[0].status,
                recipientId: rows[0].recipient_id,
                senderId: rows[0].sender_id
            });
        })
        .catch(function() {
            res.json({
                status: "noStatus"
            });
        });
});

app.post("/addFriend/:otherUserId.json", function(req, res) {
    db
        .makeFriendRequest(req.params.otherUserId, req.session.userId)
        .then(function({ rows }) {
            res.json({
                status: rows[0].status,
                recipientId: rows[0].recipient_id,
                senderId: rows[0].sender_id
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/cancelrequest/:otherUserId.json", function(req, res) {
    db
        .cancelFriendRequest(req.params.otherUserId, req.session.userId)
        .then(function() {
            res.json({
                status: "noStatus"
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/unfriend/:otherUserId.json", function(req, res) {
    db
        .endFriendship(req.params.otherUserId, req.session.userId)
        .then(function() {
            res.json({
                status: "noStatus",
                unfriendedUser: req.params.otherUserId
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/acceptfriend/:otherUserId.json", function(req, res) {
    db
        .acceptFriendRequest(req.params.otherUserId, req.session.userId)
        .then(function({ rows }) {
            res.json({
                status: rows[0].status,
                recipientId: rows[0].recipient_id,
                senderId: rows[0].sender_id
            });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/saveanswer/:otherUserId.json", function(req, res) {
    db
        .getAnswerStatus(
            req.body.questionId,
            req.params.otherUserId,
            req.session.userId
        )
        .then(function(data) {
            if (data.rows[0]) {
                return db.updateAnswer(
                    req.body.questionId,
                    req.params.otherUserId,
                    req.session.userId,
                    req.body.answer
                );
            } else {
                return db.saveAnswer(
                    req.body.questionId,
                    req.params.otherUserId,
                    req.session.userId,
                    req.body.answer
                );
            }
        })
        .then(function(data) {
            res.json({
                answer: data.rows
            });
        });
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    animation.rainbow("Magic on port 8080");
});

let onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    const socketId = socket.id;
    var userIds = Object.values(onlineUsers);
    onlineUsers[socketId] = userId;
    db.getUsersByIds(Object.values(onlineUsers)).then(({ rows }) => {
        socket.emit("onlineUsers", rows);
    });
    let count = Object.values(onlineUsers).filter(id => id == userId).length;
    if (count == 1) {
        db.getUserById(userId).then(({ rows }) => {
            socket.broadcast.emit("userJoined", rows);
        });
    }

    db.getChatMessages().then(({ rows }) => {
        io.sockets.emit("chatMessages", rows.reverse());
    });

    socket.on("chatMessage", function(newMessage) {
        const userId = socket.request.session.userId;
        db.insertChatMessage(newMessage, userId).then(({ rows }) => {
            let chatId = rows[0].id;
            db.returnMessage(chatId).then(({ rows }) => {
                io.sockets.emit("chatMessage", rows[0]);
            });
        });
    });
    socket.on("disconnect", function() {
        const thisUserId = onlineUsers[socketId];
        delete onlineUsers[socketId];
        let userIndex = userIds.indexOf(userId);
        userIds.splice(userIndex, 1);
        if (userIds.indexOf(userId) == -1) {
            io.sockets.emit("userLeft", thisUserId);
        }
    });
});

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}
