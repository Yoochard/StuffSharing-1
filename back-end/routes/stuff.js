import conn from './connection';

const express = require('express');
const bid = require('./queries/bid');
const loan = require('./queries/loan');
const queries = require('./queries/stuff');
const utils = require('./utils');

const router = express.Router();

router.param('stuffId', (req, res, next, stuffId) => {
  req.stuffId = null;
  if (stuffId.length > 0) {
    req.stuffId = stuffId;
  }
  console.log('StuffId: ', stuffId, req.stuffId);
  next();
});

router.delete('/:stuffId/bid/delete', (req, res, next) => {
  utils.isValidUser(req.body.user).then((isValid) => {
    if (!isValid) {
      console.log('unauthorized');
      return res.status(403).end();
    }
    const bidInfo = { stuffId: req.stuffId, user: req.body.user.username, timestamp: req.body.timestamp };
    const response = conn.query(bid.deleteBidLog(stuffId));
    response.then(data => res.send(data));
  });
});

router.post('/:stuffId/bid', (req, res, next) => {
	// Bid for this stuff
  utils.isValidUser(req.body.user).then((isValid) => {
    if (!isValid) {
      console.log('unauthorized');
      return res.status(403).end();
    }
    const bidInfo = { user: req.body.user.username, bidAmt: req.body.bidAmt, stuffId: req.stuffId };
    const response = conn.query(bid.bidForStuff(bidInfo));
    response.then(data => res.send(data));
  });
});

router.post('/:stuffId/return', (req, res, next) => {
 utils.isValidUser(req.body.user).then((isValid) => {
    if (!isValid) {
      console.log('unauthorized');
      return res.status(403).end();
    }
    const stuffInfo = { user: req.body.user.username, stuffId: req.stuffId };
    const response = conn.query(bid.returnStuff(stuffInfo));
    response.then(data => res.send(data));
  });
});

router.get('/:stuffId', (req, res, next) => {
	// Detail view for stuff with stuff id
  const response = conn.query(queries.getStuffData(req.stuffId));
  response.then(data => res.send(data));
});

router.delete('/:stuffId/delete', (req, res, next) => {
  console.log('Delete Stuff', req.stuffId);
  utils.isValidUser(req.body.user).then((isValid) => {
    if (!isValid) {
      console.log('unauthorized');
      return res.status(403).end();
    }
    const response = conn.query(queries.deleteStuff(req.stuffId));
    response.then((data) => {
      console.log('sending delete data', data);
      res.send(data);
    });
  });
});

router.get('/', (req, res, next) => {
	// List of all available things
  if (req.query) {
    return filterStuff(req.query, res);
  }
  const response = conn.query(queries.allStuffData);
  response.then(data => res.send({ data, pages: 1 }));
});

function filterStuff(queryList, res) {
  queryList = utils.cleanQueryList(queryList);
  const response = conn.query(queries.getFilteredStuff(queryList));
  return response.then((data) => {
  	const resp = queries.foundRows();
  	resp.then((rows) => {
  		const numRows = rows[0]['FOUND_ROWS()'];
  		res.send({ data, pages: Math.ceil(numRows / queryList.count) });
  	});
  });
}

module.exports = router;
