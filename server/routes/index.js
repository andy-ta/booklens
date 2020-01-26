const express = require('express');
const router = express.Router();
require('dotenv').config();
const dictionaryController = require('../controllers/dictionaryController');
const wordToImageController = require('../controllers/wordToImagesController');
const translateController = require('../controllers/translateController');

router.get('/translate/:type/:id', translateController.getTranslation);

router.get('/syllable/:word', dictionaryController.getSyllable);

router.get('words/:word/images', wordToImageController.getImages);

module.exports = router;
