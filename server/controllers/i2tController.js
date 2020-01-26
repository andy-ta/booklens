import {sentenceId} from "../services";

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
  const { image } = req.body;/*
  console.log(image);
  fs.writeFile(file, new Buffer(image, "base64"), function(err) {});*/

  // Performs text detection on the local file
  client.textDetection(fileName)
    .then((result) => {
    const detections = result[0].textAnnotations;
    console.log(detections);
    const filter = detections.filter((value) => {
      return value.description.split(" ").length === 1;
    });
    const filteredResults = [];
    filter.forEach(wordObj => {
      let filteredWordObj = (({description, boundingPoly : { vertices }}) => ({word: description, vertices}))(wordObj);
      filteredResults.push(filteredWordObj);
    });
    res.json(filteredResults);
  })
    .catch((err) => {
      console.log(err);
    });
};

function parse(results) {
  const phrases = [];
  for (let i = 0; i < results.length; i++) {
    if (i === 0) {
      const sentences = results[i].description.split('\n');
      for (let sentence in sentences) {
        const words = sentence.split(' ');
        const newSentence = new Sentence(++sentenceId, words);
      }
    }
  }
}


