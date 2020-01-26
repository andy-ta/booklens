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

exports.getText = (req, res) => {
  const reg = /([.,\/#!$%\^&\*;:{}=\-_`~()?])/g;
  // Performs text detection on the local file
  client.textDetection(req.file.path)
    .then((result) => {
    const detections = result[0].textAnnotations;
    const pageStringObj = detections.shift();
    const wordsStringObj = detections;
    // console.log(pageStringObj);
    // console.log(wordsStringObj);
    const newWords = [];
    wordsStringObj.forEach(wordObj => {
      let found = wordObj.description.match(reg);
      if (found) {
        let wordT = (({description, boundingPoly : { vertices }}) => ({id: wordId++, sentenceId: sentenceId++, word: description, vertices}))(wordObj);
        newWords.push(new Word(wordT.id, wordT.word, wordT.sentenceId, wordT.vertices));
      } else {
        let wordT = (({description, boundingPoly : { vertices }}) => ({id: wordId++, sentenceId: sentenceId, word: description, vertices}))(wordObj);
        newWords.push(new Word(wordT.id, wordT.word, wordT.sentenceId, wordT.vertices));
      }
    });
    const newSentencesHolder = [];
    for (let i = 0; i <= sentenceId; i++) {
      newSentencesHolder.push({
        id: null,
        words: [],
      });
    }
    // console.log(newSentences);
    let currentSentenceID = 0;
    newWords.forEach(word => {
      if (word.sentenceId === currentSentenceID) {
        newSentencesHolder[currentSentenceID].id = currentSentenceID;
        newSentencesHolder[currentSentenceID].words.push(word);
      } else {
        currentSentenceID++;
        newSentencesHolder[currentSentenceID].id = currentSentenceID;
        newSentencesHolder[currentSentenceID].words.push(word);
      }
    });
    const realNewSentences = [];
    newSentencesHolder.forEach(s => {
      let sentenceString = '';
      s.words.forEach(w => {
        sentenceString = sentenceString + `${w.word} `;
      });
      realNewSentences.push(new Sentence(s.id, s.words, sentenceString));
    });
    const newPage = new Page(++pageId, realNewSentences, req.file.path);
    pages.push(newPage);
    res.json(newPage);
    // console.log(realNewSentences);
      // const filteredResults = [];
    //   wordsOnly.forEach(wordObj => {
    //   let filteredWordObj = (({description, boundingPoly : { vertices }}) => ({word: description, vertices}))(wordObj);
    //   filteredResults.push(filteredWordObj);
    // });
    // const p = new Page(++pageId, parse(detections), req.file.path);
    // pages.push(p);
    // res.json(p);
  })
    .catch((err) => {
      console.log(err);
    });
};

function parse(results) {
  const phrases = [];
  const sentences = results[0].description.replace(/\n/g, ' ').replace(/([.,\/#!$%\^&\*;:{}=\-_`~()])/g, '$1\u03B1').split('\u03B1');
  let index = 0;
  // console.log(sentences);
  for (let sentence of sentences) {
    let words = sentence.split(' ');
    let wordsRe = [];
    words.forEach(e => {
      let temp = e === '' ? null : { index: index++, word: e};
      if (temp) {
        wordsRe.push(temp);
      }
    });
    // console.log(wordsRe);

    if (wordsRe.length > 0) {
      const newSentence = new Sentence(++sentenceId, wordsRe, sentence);
      phrases.push(newSentence);
    }
  }
  // console.log(results);
  // results.splice(0, 1); // delete the sentences XD;
  //
  // console.log(results.length);
  // console.log(index);
  // console.log(results);
  // console.log(phrases.length);
  // console.log(results);
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
