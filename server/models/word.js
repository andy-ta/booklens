class Word {
    constructor(id, word, sentenceId, vertices, isNoun, index) {
        this.id = id;
        this.word = word;
        this.sentenceId = sentenceId;
        this.vertices = vertices;
        this.isNoun = isNoun;
        this.index = index;
    }
}

module.exports = { Word };
