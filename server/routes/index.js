const express = require('express');
const multer = require('multer');
const upload = multer({dest: __dirname + '/../assets'});
const router = express.Router();
require('dotenv').config();
const dictionaryController = require('../controllers/dictionaryController');
const wordToImageController = require('../controllers/wordToImagesController');
const translateController = require('../controllers/translateController');
const i2tController = require('../controllers/i2tController');

router.post('/pages', upload.single('image'), i2tController.getText);

router.get('/pages/:id/image', i2tController.getImage);

router.get('/pages/:id', i2tController.getPage);

router.get('/translate/:type/:id', translateController.getTranslation);

router.get('/syllable/:word', dictionaryController.getSyllable);

router.get('/words/:word/images', wordToImageController.getImages);

module.exports = router;
