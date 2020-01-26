const axios = require('axios');
const dictAPI = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/`;
const url = keyword => {
    return dictAPI + keyword + `/?key=${process.env.DIC_API_KEY}`;
};

exports.getSyllable = (req, res) => {
    const { word } = req.params;
    axios
        .get(url(word))
        .then(r => {
            let result;
            if (r.data.length && r.data[0].hwi) {
                result = (({ hwi, fl }) => ({
                    syllable: hwi.hw.split('*'),
                    ipa: hwi.prs[0].mw.split('-'),
                    isNoun: fl === 'noun'
                }))(r.data[0]);
            } else {
                result = {};
            }
            res.json(result);
        })
        .catch(e => {
            console.log(e);
            res.statusCode = 500;
            res.json(e);
        });
};
