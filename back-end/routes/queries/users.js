import conn from '../connection';

// these queries are vulnerable to SQL injection. Need to escape user input

function allSafeUserData() {
  return `SELECT username, email, first_name, last_name FROM user`;
}

function allUserData() {
  return `SELECT * FROM user`;
}

function getUserData(username) {
  return `SELECT username, first_name, last_name, email FROM user WHERE username="${username}"`;
}

function getUserStuff(username) {
  return `SELECT stuff.*, username FROM stuff, user WHERE user.id = owner AND username="${username}"`;
}

function updateUser(username, params) {
  return `UPDATE user SET${paramsToString(params)} WHERE username="${username}"`;
}

function deleteUser(username) {
  return `DELETE FROM user WHERE username="${username}"`;
}

function loginUser(login) {
  return conn.query('SELECT * FROM user u WHERE u.username = ? AND u.password = ?', [login.username, login.password]);
}

function checkUsername(user) {
  return conn.query('SELECT * FROM user u WHERE u.username = ? OR u.email = ?', [user.username, user.email]);
}

function checkUser(details) {
  return `SELECT * FROM user WHERE username="${details.username}" AND password="${details.password}"`;
}

function stuffBorrowed(username) {
  const stuffId = `${'SELECT l.stuff FROM loan_log AS l, user AS u' +
      ' WHERE l.borrower=u.id AND u.username=' + '"'}${username}"`;
  const q = `SELECT * FROM stuff WHERE id = ANY(${stuffId})`;
  console.log(q);
  return q;
}

function stuffLent(username) {
  const stuffId = 'SELECT l.stuff' +
          ' FROM loan_log AS l, user AS u, stuff AS s' +
          ` WHERE s.id=l.stuff AND s.owner=u.id AND u.username="${username}"`;
  return `SELECT * FROM stuff WHERE id=ANY(${stuffId})`;
}

function totalEarned(username) {
  return `${'SELECT SUM(l.price) FROM loan_log AS l, user AS u, stuff AS s' +
      ' WHERE s.id=l.stuff AND s.owner=u.id AND u.username=' + '"'}${username}"`;
}

function monthlyEarned(username) {
  return 'SELECT username from user';
}

function totalSpent(username) {
  return `${'SELECT SUM(l.price) FROM loan_log AS l, user AS u' +
      ' WHERE l.borrower=u.id AND u.username=' + '"'}${username}"`;
}

function monthlySpent(username) {
  return 'SELECT username from user';
}

function mostPopularStuff(username) {
  const subQuery = `${'SELECT COUNT(*)' +
            ' FROM stuff AS s2, bid_log AS b2, user AS u2' +
            ' WHERE s2.id=b2.stuff_id AND s2.owner=u2.id AND u2.username=' + '"'}${username}"` +
            ' GROUP BY b2.stuff_id';
  return `${'SELECT * FROM stuff WHERE id = ANY (' +
      'SELECT b.stuff_id' +
      ' FROM stuff AS s, bid_log AS b, user AS u' +
      ' WHERE s.id=b.stuff_id AND s.owner=u.id AND u.username=' + '"'}${username}"` +
      ' GROUP BY b.stuff_id' +
      ` HAVING COUNT(*) >= ALL(${subQuery}))`;
}

function favouriteCategory(username) {
  console.log('Fav stuff');
  return 'SELECT s.category' +
      ' FROM stuff AS s, bid_log AS b, user AS u' +
      ` WHERE s.id=b.stuff_id AND b.user_id=u.id AND u.username="${username}"` +
      ' GROUP BY s.category' +
      ' ORDER BY COUNT(*) DESC' +
      ' LIMIT 1';
}

function registerUser(details) {
  return conn.query('INSERT INTO user SET ?', details);
}

function paramsToString(params) {
  let query = '';
  for (const key in params) {
    if (params[key]) {
      query += ` ${key}=${params[key]},`;
    }
  }
  return query.slice(0, -1);
}

module.exports = {
  allSafeUserData,
  allUserData,
  getUserData,
  getUserStuff,
  updateUser,
  deleteUser,

  loginUser,
  checkUsername,
  checkUser,
  registerUser,

  stuffBorrowed,
  stuffLent,
  totalEarned,
  monthlyEarned,
  totalSpent,
  monthlySpent,
  mostPopularStuff,
  favouriteCategory,
};
