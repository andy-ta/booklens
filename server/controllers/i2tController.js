const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

const fileName = 'assets/fatChick.jpg';

exports.hello = (req, res) => {
  // Performs text detection on the local file
  client.textDetection(fileName)
    .then((result) => {
    const detections = result[0].textAnnotations;
    const filter = detections.filter((value) => {
      return value.description.split(" ").length === 1;
    });
    console.log(filter);
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
/*  */
};


