const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')
const Datastore = require('nedb')
const db = new Datastore({
  filename: './users.db',
  autoload: true
});

function listUsers(callback) {
  db.find({}, callback);
}

function findUser(username, callback) {
  db.find({ username }, function(err, results) {
    if(err) return callback(err);

    const user = results.length > 0 ? results[0] : null;
    callback(null, user);
  })
}

function createUser(username, password, callback) {
  bcrypt.hash(password, 10, function(err, hash) {
    if(err) return callback(err);

    const user = {
      id: uuid(),
      username: username,
      passwordHash: hash,
      avatarUrl: 'https://api.adorable.io/avatars/300/' + username
    }

    db.insert(user, callback);
  });
}

function setAvatarUrl(userId, avatarUrl, callback) {
  db.update({ id: userId}, { $set: { avatarUrl } }, callback)
}

module.exports = {
  listUsers,
  findUser,
  createUser,
  setAvatarUrl
}