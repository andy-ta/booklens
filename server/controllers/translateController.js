const translateService = require("../services/translateService");

exports.getTranslation = (req, res) => {
  const { id } = req.params;
  const { type } = req.params;
  const { target } = req.params;

  // do stuff here to get the text by type
  const text = "hello world";

  const translation = translateService.getTranslation(text, target).then((value) => {
    console.log(value);
  });
  res.json(translation);
};