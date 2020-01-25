const express = require('express');
const router = express.Router();
const i2tController = require('../controllers/i2tController');

/* GET mamaw. */
router.get('/', (req, res, next) => {
  res.send('gietmamaw');
});

router.post('/image', i2tController.something());

module.exports = router;
