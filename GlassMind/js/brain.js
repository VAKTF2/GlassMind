/*
============================================

GlassMind
brain.js
Version 0.2

The Brain of GlassMind.

Responsibilities:
- Learn text
- Tokenize text
- Ask Memory to learn
- Predict next word
- Generate sentences
- Save brain
- Load brain

============================================
*/

class Brain {

    constructor() {

        this.version = "0.2.0";

        // Knowledge Graph
        this.memory = new Memory();

        // Reserved for future versions
        this.embeddings = [];

        this.weights = {};

        this.statistics = {

            messages: 0,
            words: 0,
            learnedWords: 0,
            predictions: 0

        };

    }

    //--------------------------------------
    // Tokenize text
    //--------------------------------------

    tokenize(text) {

        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(Boolean);

    }

    //--------------------------------------
    // Learn text
    //--------------------------------------

    learn(text) {

        const words = this.tokenize(text);

        if (words.length === 0)
            return;

        this.statistics.messages++;

        this.statistics.words += words.length;

        this.memory.learnSentence(words);

        this.statistics.learnedWords = this.memory.getWordCount();

    }

    //--------------------------------------
    // Predict next word
    //--------------------------------------

    think(text) {

        const words = this.tokenize(text);

        if (words.length === 0)
            return "...";

        const last = words[words.length - 1];

        const prediction = this.memory.predictNextWord(last);

        if (!prediction)
            return "I don't know yet.";

        this.statistics.predictions++;

        return prediction;

    }

    //--------------------------------------
    // Generate sentence
    //--------------------------------------

    generate(text, maxWords = 20) {

        const words = this.tokenize(text);

        if (words.length === 0)
            return "...";

        const last = words[words.length - 1];

        return this.memory.generateSentence(last, maxWords);

    }

    //--------------------------------------
    // Inspect a word
    //--------------------------------------

    inspect(word) {

        return this.memory.inspect(word);

    }

    //--------------------------------------
    // Vocabulary
    //--------------------------------------

    getWords() {

        return this.memory.getWords();

    }

    //--------------------------------------
    // Reset
    //--------------------------------------

    reset() {

        this.memory.clear();

        this.embeddings = [];

        this.weights = {};

        this.statistics = {

            messages: 0,
            words: 0,
            learnedWords: 0,
            predictions: 0

        };

    }

    //--------------------------------------
    // Export
    //--------------------------------------

    export() {

        return {

            version: this.version,

            memory: this.memory.export(),

            embeddings: this.embeddings,

            weights: this.weights,

            statistics: this.statistics

        };

    }

    //--------------------------------------
    // Import
    //--------------------------------------

    import(data) {

        this.version = data.version || "0.2.0";

        this.memory.import(data.memory);

        this.embeddings = data.embeddings || [];

        this.weights = data.weights || {};

        this.statistics = data.statistics || {

            messages: 0,
            words: 0,
            learnedWords: 0,
            predictions: 0

        };

    }

    //--------------------------------------
    // Save
    //--------------------------------------

    save() {

        return JSON.stringify(this.export(), null, 4);

    }

    //--------------------------------------
    // Load
    //--------------------------------------

    load(json) {

        this.import(JSON.parse(json));

    }

}
