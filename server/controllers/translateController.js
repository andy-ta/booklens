const translateService = require("../services/translateService");
let { pages } = require('../services/database');

exports.getTranslation = (req, res) => {
  const { id, type } = req.params;
  const { target } = req.query;

  let result;
  if (type === 'page') {
    const page = pages.find(p => p.id === Number.parseInt(id));
    // console.log(page);
    const sentences = [];
    page.sentences.forEach(sentence => {
      sentences.push(sentence.sentenceString);
    });
    result = sentences.length ? sentences.join(' ') : null;
    console.log(result);
  } else if (type === 'sentence') {
    let sentence;
    pages.forEach(page => {
      page.sentences.forEach(s => {
        if (s.id === Number.parseInt(id)) {
          sentence = s;
        }
      });
    });
    result = sentence ? sentence.sentenceString : null;
    console.log(result);
  } else {
    let word;
    pages.forEach(page => {
      page.sentences.forEach(s => {
        s.words.forEach(w => {
          if (w.id === Number.parseInt(id)) {
            word = w;
          }
        });
      });
    });
    result = word ? word.word : null;
    console.log(result);
  }

  // do stuff here to get the text by type
  // const text = "hello world";
  //
  if (result) {
    translateService
      .getTranslation(result, target)
      .then(value => {
        // console.log(value);
        res.json(value[0]);
      })
      .catch(e => {
        console.log(e);
        res.json(e);
      });
  } else {
    res.statusCode = 500;
    res.json({
      error: `no such ${type}`
    });
  }
};
