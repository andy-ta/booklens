const express = require('express');
const router = express.Router();
const i2tController = require('../controllers/i2tController');

/* GET mamaw. */
router.get('/', (req, res, next) => {
  res.send('gietmamaw');
});

router.get('/image', i2tController.hello);

module.exports = router;
