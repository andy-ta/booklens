let { sentenceId, wordId, pageId } = require('../services/index');
const { Sentence } = require('../models/sentence');
const { Word } = require('../models/word');
const { Page } = require('../models/page');
const pages = require('../services/database');
const axios = require('axios');
const dictAPI = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/`;
const url = keyword => {
  return dictAPI + keyword + `/?key=${process.env.DIC_API_KEY}`;
};
const vision = require('@google-cloud/vision');
const fs = require('fs');
// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

const fileName = 'assets/fatChick.jpg';
const file = 'assets/hello.jpg';

exports.getImage = (req, res) => {
  const { id } = req.params;
  res.sendFile(pages.pages.find(page => page.id === parseInt(id)).image);
};

exports.getText = (req, res) => {
  // Performs text detection on the local file
  client.textDetection(req.file.path)
    .then((result) => {
    const detections = result[0].textAnnotations;
    const filter = detections.filter((value) => {
      return value.description.split(" ").length === 1;
    });
    const filteredResults = [];
    filter.forEach(wordObj => {
      let filteredWordObj = (({description, boundingPoly : { vertices }}) => ({word: description, vertices}))(wordObj);
      filteredResults.push(filteredWordObj);
    });
    const p = new Page(++pageId, parse(detections), req.file.path);
    pages.pages.push(p);
    res.json(p);
  })
    .catch((err) => {
      console.log(err);
    });
};

function parse(results) {
  const phrases = [];
  const sentences = results[0].description.replace(/\n/g, ' ').split(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
  for (let sentence of sentences) {
    let words = sentence.split(' ');
    words = words.map((e, i) => {
      return e === '' ? null : { index: i, word: e};
    }).filter(val => val !== null);

    if (words.length > 0) {
      const newSentence = new Sentence(++sentenceId, words, sentence);
      phrases.push(newSentence);
    }
  }
  results.splice(0, 1); // delete the sentences XD;

  phrases.forEach(sentence => {
    sentence.words = sentence.words.map(word => {
      return new Word(++wordId, word.word, sentence.id, results[word.index].boundingPoly.vertices, true);
    });
  });

  return phrases;
}

async function isNoun(word) {
  const r =  await axios.get(url(word));
  let result;
  if (r.data.length && r.data[0].hwi) {
    result = (({ fl }) => ({
      isNoun: fl === 'noun'
    }))(r.data[0]);
  } else {
    result = {};
  }
  return result.isNoun;
}
