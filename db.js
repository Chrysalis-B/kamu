var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.createUser = function createUser(first, last, email, password) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first || null, last || null, email || null, password || null]
    );
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return db.query(
        `
        SELECT first, last, password, id
        FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.getUserInfo = function getUserInfo(id) {
    return db.query(`SELECT * FROM users WHERE id=$1`, [id]);
};

module.exports.getBook = function getBook(id) {
    return db.query(`SELECT * FROM books WHERE user_id = $1`, [id || null]);
};

module.exports.searchUsers = function searchUsers(search) {
    return db.query(
        `SELECT id, first, last, img_url FROM users
                    WHERE first ILIKE $1 OR last ILIKE $1`,
        [search + "%"]
    );
};

module.exports.updateImage = function updateImage(imgUrl, id) {
    return db.query(
        `UPDATE users SET img_url = $1 WHERE id=$2 RETURNING id, img_url`,
        [imgUrl || null, id || null]
    );
};

module.exports.saveBio = function saveBio(bio, id) {
    return db.query(`UPDATE users SET bio = $1 WHERE id=$2 RETURNING bio`, [
        bio || null,
        id || null
    ]);
};

module.exports.saveQuestion = function saveQuestion(id, question) {
    return db.query(
        `INSERT INTO books (user_id, question) VALUES ($1, $2) ON CONFLICT (id)
        DO UPDATE SET question = $2 RETURNING *`,
        [id || null, question || null]
    );
};

module.exports.getAnswerStatus = function getAnswerStatus(
    questionId,
    authorId,
    fillerId
) {
    return db.query(
        `SELECT * FROM answers WHERE question_id=$1 AND author_id=$2 AND filler_id=$3`,
        [questionId, authorId, fillerId]
    );
};

module.exports.updateAnswer = function updateAnswer(
    questionId,
    authorId,
    fillerId,
    answer
) {
    return db.query(
        `UPDATE answers SET answer = $4 WHERE question_id=$1 AND author_id=$2 AND filler_id=$3
        RETURNING *`,
        [questionId, authorId, fillerId, answer]
    );
};

module.exports.saveAnswer = function saveAnswer(
    questionId,
    authorId,
    fillerId,
    answer
) {
    return db.query(
        `INSERT INTO answers (question_id, author_id, filler_id, answer)
    VALUES ($1, $2, $3, $4) RETURNING *`,
        [questionId, authorId, fillerId, answer]
    );
};

module.exports.getAnswers = function getAnswers(authorId, fillerId) {
    return db.query(
        `SELECT * FROM answers WHERE author_id = $1 AND filler_id = $2`,
        [authorId, fillerId]
    );
};

module.exports.getUserById = function getUserById(id) {
    return db.query(`SELECT * FROM users WHERE id=$1`, [id || null]);
};

module.exports.getStatus = function getStatus(recipientId, senderId) {
    return db.query(
        `SELECT * FROM friendships WHERE (status = 1 OR status = 2) AND
    (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [recipientId, senderId]
    );
};

module.exports.makeFriendRequest = function makeFriendRequest(
    recipientId,
    senderId
) {
    return db.query(
        `INSERT INTO friendships (recipient_id, sender_id, status) VALUES ($1, $2, 1)
        RETURNING recipient_id, sender_id, status`,
        [recipientId, senderId]
    );
};

module.exports.cancelFriendRequest = function cancelFriendRequest(
    recipientId,
    senderId
) {
    return db.query(
        `DELETE from friendships WHERE (recipient_id = $1 AND sender_id = $2)`,
        [recipientId, senderId]
    );
};

module.exports.acceptFriendRequest = function acceptFriendRequest(
    senderId,
    recipientId
) {
    return db.query(
        `UPDATE friendships SET status = 2 WHERE (sender_id = $1 AND recipient_id = $2)
        RETURNING recipient_id, sender_id, status`,
        [senderId, recipientId]
    );
};

module.exports.endFriendship = function endFriendship(recipientId, senderId) {
    return db.query(
        `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [recipientId, senderId]
    );
};

module.exports.getFriendsAndWannabes = function getFriendsAndWannabes(userId) {
    return db.query(
        `SELECT users.id, first, last, img_url, status
    FROM friendships
    JOIN users
    ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
    OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)
 `,
        [userId]
    );
};

module.exports.getBookFriends = function getBookFriends(userId) {
    return db.query(
        `SELECT users.first, users.last, users.img_url, users.id FROM users
        INNER JOIN friendships
        ON (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)
        INNER JOIN answers
        ON (answers.author_id = $1 AND friendships.sender_id = answers.filler_id)
        OR (answers.author_id = $1 AND friendships.recipient_id = answers.filler_id)
        GROUP BY users.first, users.last, users.img_url, users.id
    `,
        [userId]
    );
};

module.exports.getPage = function getPage(friendId, userId) {
    return db.query(
        `SELECT * from books
        JOIN answers ON (answers.author_id = $2 AND answers.filler_id = $1 AND books.id = answers.question_id)
        WHERE books.user_id = $2`,
        [friendId, userId]
    );
};

// module.exports.getPages = function getPages(userId) {
//     return db.query(`SELECT users.id, first, last, img_url, books.id, books.question,
//         answers.questionId, answers.answer`, [userId]);
// };

module.exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getChatMessages = function getChatMessages() {
    return db.query(
        `SELECT chat.id, chat.content, chat.user_id, chat.created_at, users.first, users.last, users.img_url
        FROM chat JOIN users ON chat.user_id=users.id ORDER BY chat.id DESC LIMIT 10`
    );
};

module.exports.insertChatMessage = function insertChatMessage(content, userId) {
    return db.query(
        `INSERT INTO chat (content, user_id) VALUES ($1, $2) RETURNING *`,
        [content || null, userId || null]
    );
};

module.exports.returnMessage = function returnMessage(id) {
    return db.query(
        `SELECT chat.id, chat.user_id, first, last, img_url, content, chat.created_at FROM chat
        LEFT JOIN users
        ON users.id = chat.user_id
        WHERE chat.id = $1
        `,
        [id]
    );
};

// -- statuses
// -- 1. pending
// -- 2. accepted
// -- additional statuses
// -- 3. cancelled
// -- 4. terminated
// -- 5. rejected (optional)
