const express = require('express');
const router = express.Router();

/* GET mamaw. */
router.get('/', function(req, res, next) {
  res.send('gietmamaw')
});

module.exports = router;
