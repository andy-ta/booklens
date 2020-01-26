const express = require('express');
const router = express.Router();
require('dotenv').config();
const i2tController = require('../controllers/i2tController');
const dictionaryController = require('../controllers/dictionaryController');
const wordToImageController = require('../controllers/wordToImagesController');

/* GET mamaw. */
router.get('/', (req, res, next) => {
    res.send('gietmamaw');
});

router.post('/image', i2tController.getText);

router.get('/syllable/:word', dictionaryController.getSyllable);

router.get('/:word/images', wordToImageController.getImages);

module.exports = router;
