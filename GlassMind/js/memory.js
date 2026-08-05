/*
============================================

GlassMind
memory.js
Version 0.2

Stores the knowledge graph.

Responsibilities:
- Store word nodes
- Learn relationships
- Predict next words
- Generate sentences
- Import/Export memory

============================================
*/

class Memory {

    constructor() {

        this.nextId = 0;

        this.nodes = {};

    }

    //--------------------------------------
    // Create a word node
    //--------------------------------------

    createNode(word) {

    if (!word)
        return null;

    word = word.toLowerCase();

    if (this.nodes[word])
        return this.nodes[word];

    const now = Date.now();

    this.nodes[word] = {

        id: this.nextId++,

        word: word,

        seen: 0,

        created: now,

        lastSeen: now,

        previous: {},

        next: {},

        examples: []

    };

    return this.nodes[word];

    }

    //--------------------------------------
    // Get a word node
    //--------------------------------------

    getNode(word) {

    if (!word)
        return null;

    word = word.trim().toLowerCase();

    return this.nodes[word] || null;

    }

    //--------------------------------------
    // Learn a sentence
    //--------------------------------------

    learnSentence(words) {

    if (!Array.isArray(words) || words.length === 0)
        return;

    const sentence = words.join(" ");

    // Learn every word

    for (const word of words) {

        const node = this.createNode(word);

        node.seen++;

        node.lastSeen = Date.now();

        if (!node.examples.includes(sentence)) {

            node.examples.push(sentence);

            // Keep only the last 10 examples

            if (node.examples.length > 10)
                node.examples.shift();

        }

    }

    // Learn relationships

    for (let i = 0; i < words.length - 1; i++) {

        this.learnTransition(words[i], words[i + 1]);

    }

    }

    //--------------------------------------
    // Learn a transition
    //--------------------------------------

    learnTransition(previous, next) {

    if (!previous || !next)
        return;

    previous = previous.trim().toLowerCase();
    next = next.trim().toLowerCase();

    const previousNode = this.createNode(previous);
    const nextNode = this.createNode(next);

    // Learn next word

    if (!previousNode.next[next]) {

        previousNode.next[next] = 0;

    }

    previousNode.next[next]++;

    // Learn previous word

    if (!nextNode.previous[previous]) {

        nextNode.previous[previous] = 0;

    }

    nextNode.previous[previous]++;


    }

    //--------------------------------------
    // Predict next word
    //--------------------------------------

    predictNextWord(word) {

    if (!word)
        return null;

    word = word.trim().toLowerCase();

    const node = this.getNode(word);

    if (!node)
        return null;

    let bestWord = null;

    let highest = -1;

    for (const nextWord in node.next) {

        const count = node.next[nextWord];

        if (count > highest) {

            highest = count;

            bestWord = nextWord;

        }

    }

    return bestWord;

    }

    //--------------------------------------
    // Generate a sentence
    //--------------------------------------

    generateSentence(start, maxWords = 20) {

    if (!start)
        return "";

    start = start.trim().toLowerCase();

    const sentence = [start];

    let current = start;

    for (let i = 1; i < maxWords; i++) {

        const node = this.getNode(current);

        if (!node)
            break;

        const nextWords = Object.keys(node.next);

        if (nextWords.length === 0)
            break;

        // Calculate total weight

        let total = 0;

        for (const word of nextWords) {

            total += node.next[word];

        }

        // Pick a random word based on weight

        let random = Math.random() * total;

        let chosen = null;

        for (const word of nextWords) {

            random -= node.next[word];

            if (random <= 0) {

                chosen = word;

                break;

            }

        }

        if (!chosen)
            break;

        sentence.push(chosen);

        current = chosen;

    }

    return sentence.join(" ");


    }

    //--------------------------------------
    // Inspect a word
    //--------------------------------------

    inspect(word) {

    if (!word)
        return null;

    word = word.trim().toLowerCase();

    return this.getNode(word);


    }

    //--------------------------------------
    // Get vocabulary
    //--------------------------------------

    getWords() {

    return Object.values(this.nodes)
        .sort((a, b) => a.word.localeCompare(b.word));

    }

    //--------------------------------------
    // Get word count
    //--------------------------------------

    getWordCount() {

        return Object.keys(this.nodes).length;

    }

    //--------------------------------------
    // Reset memory
    //--------------------------------------

    clear() {

        this.nextId = 0;

        this.nodes = {};

    }

    //--------------------------------------
    // Print memory
    //--------------------------------------

    print() {

        console.table(this.getWords().map(node => ({

            id: node.id,

            word: node.word,

            seen: node.seen,

            next: Object.keys(node.next).length,

            previous: Object.keys(node.previous).length

        })));

    }

    //--------------------------------------
    // Export
    //--------------------------------------

    export() {

        return {

            nextId: this.nextId,

            nodes: this.nodes

        };

    }

    //--------------------------------------
    // Import
    //--------------------------------------

    import(data) {

    if (!data || typeof data !== "object") {

        this.clear();

        return;

    }

    this.nextId = Number.isInteger(data.nextId)
        ? data.nextId
        : 0;

    this.nodes = data.nodes || {};

    }

}
