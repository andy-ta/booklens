const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

exports.getTranslation = (text, target) => {
  return translate.translate(text, target);
};
