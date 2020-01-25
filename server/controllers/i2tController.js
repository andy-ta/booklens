const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

const fileName = 'C:/Users/Rosa/Pictures/sign_small.jpg';

exports.hello = (req, res) => {
  // Performs text detection on the local file
  client.textDetection(fileName)
    .then((result) => {
    const detections = result[0].textAnnotations;
    console.log('Text:');
    const filter = detections.filter((value) => {
      return value.description.split(" ").length === 1;
    });
      console.log(filter);
  })
    .catch((err) => {
      console.log(err);
    });
/*  */
};


