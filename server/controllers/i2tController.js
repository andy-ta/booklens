let { sentenceId, wordId, pageId } = require('../services/index');
const { Sentence } = require('../models/sentence');
const { Word } = require('../models/word');
const { Page } = require('../models/page');
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

exports.getText = (req, res) => {
  const { image } = req.body;
  //let imageFile = fs.writeFile(file, new Buffer(image, "base64"), function(err) {});

  // Performs text detection on the local file
  client.textDetection(file)
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
    res.json(new Page(++pageId, parse(detections), 'caca'));
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
    sentence.words.map(async word => {
      const izNoun = await isNoun(word.word);
      return new Word(++wordId, word.word, sentence.id, results[word.index].boundingPoly.vertices, izNoun);
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
