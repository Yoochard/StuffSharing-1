import conn from './connection';

const express = require('express');
const analytics = require('./userAnalytics')
const queries = require('./queries');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  const response = conn.query(queries.allSafeUserData);
  return response.then(data => res.send(data));
});

router.get('/:username', (req, res, next) => {
	return Promise.all(getUserInfo(username, req.body.months)).then(values => {
		console.log('All User Info loaded');
		console.log(JSON.stringify(values));
		res.send(arrangeValues(values));
	});
});

function getUserInfo(username, months) {
	months = (months)? months : 6;
	const queries = [analytics.stuffBorrowed(username),
						analytics.stuffLent(username),
						analytics.totalEarned(username),
						analytics.monthlyEarned(username),
						analytics.totalSpent(username),
						analytics.monthlySpent(username),
						analytics.mostPopularStuff(username),
						analytics.favouriteCategory(username)];
	var promiseList = [];
	for(var query in queries) {
		promiseList.push(conn.query(query));
	}
	return promiseList;
}

function arrangeValues(listValues) {
	return {stuffBorrowed: listValues[0], stuffLent: listValues[1],
			totalEarning: listValues[2], monthlyEarning: 20,
			totalSpent: listValues[4], monthlySpent: 20,
			mostPopular: listValues[6] , favoriteCategory: listValues[7]}
}

module.exports = router;
