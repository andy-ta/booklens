const axios = require('axios');
const imgAPI = `https://api.shutterstock.com/v2/images/search?query=`;
const url = keyword => {
  return imgAPI + `${keyword}`;
};

exports.getImages = (req, res) => {
  const { word } = req.params;
  axios
    .get(url(word), {
      headers: {
        Authorization: `Basic ${process.env.SHUTTERS_STOCK_API_KEY}`,
        Accept: 'application/json'
      }
    })
    .then(r => {
      let result;
      if (r.data && r.data.data.length) {
        result = r.data.data[0].assets;
      } else {
        result = [];
      }
      res.json(result);
    })
    .catch(e => {
      console.log(e);
      res.statusCode = 500;
      res.json(e);
    });
};
