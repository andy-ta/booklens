let { sentenceId, wordId, pageId } = require('../services/index');
const { Sentence } = require('../models/sentence');
const { Word } = require('../models/word');
const { Page } = require('../models/page');
const { pages } = require('../services/database');
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
  res.sendFile(pages.find(page => page.id === parseInt(id)).image);
};

exports.getPage = (req, res) => {
  const { id } = req.params;
  res.json(pages.find(page => page.id === parseInt(id)));
};

exports.getPages = (req, res) => {
  res.json(pages);
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
    pages.push(p);
    res.json(p);
  })
    .catch((err) => {
      console.log(err);
    });
};

function parse(results) {
  const phrases = [];

  const sentences = results[0].description
      .replace(/\n/g, ' ')
      .replace(/([.!?])/g, '$1\u03B1')
      .split('\u03B1')
      .map(sentence => sentence.trim());
  sentences.forEach((sentence, i) => {
    phrases.push(new Sentence(++sentenceId, i, [], sentence));
  });

  let sent = 0;
  // Go through each actual word
  for (let i = 1; i < results.length; i++) {
    for (let j = sent; j < phrases.length; j++) {
      if (phrases[j].sentenceString.includes(results[i].description)) {
        phrases[j].words.push(new Word(++wordId, results[i].description, j, results[i].boundingPoly.vertices));
        sent = j;
        break;
      }
    }
  }

/*  const sentences = results[0].description.replace(/\n/g, ' ').replace(/([.!?])/g, '$1\u03B1').split('\u03B1');
  for (let sentence of sentences) {
    let words = sentence.split(' ');
    words = words.map((e) => {
      return { index: index++, word: e};
    });

    if (words.length > 0) {
      const newSentence = new Sentence(++sentenceId, words, sentence);
      phrases.push(newSentence);
    }
  }

  phrases.forEach(sentence => {
    sentence.words = sentence.words.map(word => {
      if (word.word.length === 0) {
        return null;
      }
      return new Word(++wordId, word.word, sentence.id, results[word.index].boundingPoly.vertices, true, word.index);
    }).filter(r => r != null);
  });*/

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
