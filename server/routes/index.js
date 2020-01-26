const express = require('express');
const router = express.Router();
require('dotenv').config();
const i2tController = require('../controllers/i2tController');
const dictionaryController = require('../controllers/dictionaryController');

/* GET mamaw. */
router.get('/', (req, res, next) => {
    res.send('gietmamaw');
});

router.post('/pages', i2tController.getText);

router.get('/syllable/:word', dictionaryController.getSyllable);

module.exports = router;
