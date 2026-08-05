/*
============================================

    GlassMind
    script.js
    Version 0.1

    Handles ONLY the UI.

============================================
*/

//===========================================
// Brain
//===========================================

const brain = new Brain();

//===========================================
// Elements
//===========================================

const chat = document.getElementById("chat");

const prompt = document.getElementById("prompt");

const sendBtn = document.getElementById("send");

const trainBtn = document.getElementById("train");

const saveBtn = document.getElementById("save");

const loadBtn = document.getElementById("load");

const resetBtn = document.getElementById("reset");

const wordCount = document.getElementById("wordCount");

const epoch = document.getElementById("epoch");

const loss = document.getElementById("loss");

const vocabList = document.getElementById("vocabList");

const brainFile = document.getElementById("brainFile");

//===========================================
// Chat
//===========================================

function addMessage(text, type = "user") {

    const div = document.createElement("div");

    div.className = "message " + type;

    div.textContent = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

}

//===========================================
// Vocabulary
//===========================================

function updateVocabulary() {

    vocabList.innerHTML = "";

    const words = brain.getWords();

    wordCount.textContent = words.length;

    for (const info of words) {

        const chip = document.createElement("span");

        chip.className = "chip";

        chip.textContent = info.word;

        chip.title =
`Seen: ${info.seen}
ID: ${info.id}`;

        vocabList.appendChild(chip);

    }

}

//===========================================
// Statistics
//===========================================

function updateStats() {

    wordCount.textContent = brain.statistics.learnedWords;

    epoch.textContent = brain.statistics.messages;

    loss.textContent = brain.statistics.predictions;

}

//===========================================
// Send Message
//===========================================

function sendMessage() {

    const text = prompt.value.trim();

    if (!text)
        return;

    addMessage(text, "user");

    brain.learn(text);

    const reply = brain.generate(text);

    addMessage(reply, "ai");

    updateVocabulary();

    updateStats();

    prompt.value = "";

    prompt.focus();

}

//===========================================
// Save Brain
//===========================================

function saveBrain() {

    const json = brain.save();

    const blob = new Blob([json], {

        type: "application/json"

    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "glassmind.brain.json";

    a.click();

    URL.revokeObjectURL(a.href);

}

//===========================================
// Load Brain
//===========================================

function loadBrain(event) {

    const file = event.target.files[0];

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = () => {

        brain.load(reader.result);

        updateVocabulary();

        updateStats();

        addMessage("Brain loaded.", "ai");

    };

    reader.readAsText(file);

}

//===========================================
// Reset
//===========================================

function resetBrain() {

    if (!confirm("Delete everything GlassMind has learned?"))
        return;

    brain.reset();

    chat.innerHTML = "";

    addMessage("Brain reset.", "ai");

    updateVocabulary();

    updateStats();

}

//===========================================
// Buttons
//===========================================

sendBtn.onclick = sendMessage;

prompt.addEventListener("keydown", e => {

    if (e.key === "Enter")
        sendMessage();

});

trainBtn.onclick = () => {

    addMessage(
        "Training system coming in Version 0.2",
        "ai"
    );

};

saveBtn.onclick = saveBrain;

loadBtn.onclick = () => {

    brainFile.click();

};

brainFile.addEventListener(

    "change",

    loadBrain

);

resetBtn.onclick = resetBrain;

//===========================================
// Startup
//===========================================

addMessage(

    "GlassMind initialized.",

    "ai"

);

updateVocabulary();

updateStats();
