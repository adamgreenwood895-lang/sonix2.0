// ===============================
// SONIX 2.0 - STABLE AI CORE
// ===============================

const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");

let uploadedSongs = [];
let uploadIndex = 0;

// ===============================
// 🧠 MEMORY (SAFE STORAGE)
// ===============================

let memory = JSON.parse(localStorage.getItem("sonix_memory")) || {
  name: null,
  interactions: 0
};

function saveMemory() {
  localStorage.setItem("sonix_memory", JSON.stringify(memory));
}

// ===============================
// 🎧 MUSIC LIBRARY (REPO FILES)
// ===============================

const library = {
  chill: [
    "music/chill1.mp3",
    "music/chill2.mp3"
  ],
  dance: [
    "music/dance1.mp3",
    "music/dance2.mp3"
  ]
};

// ===============================
// 🚀 SAFE INIT (NO CRASH SYSTEM)
// ===============================

window.addEventListener("load", () => {

  log("SONIX CORE LOADED ✔");

  const upload = document.getElementById("upload");

  // ===============================
  // 📁 UPLOAD SYSTEM
  // ===============================

  if (upload) {
    upload.addEventListener("change", (e) => {

      const files = Array.from(e.target.files || []);

      uploadedSongs = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));

      uploadIndex = 0;

      output(`Uploaded ${uploadedSongs.length} songs ✔`);
    });
  }

  // ===============================
  // 🎤 VOICE SYSTEM (SAFE)
  // ===============================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output("Voice not supported in this browser");
    return;
  }

  let rec;

  try {
    rec = new SpeechRecognition();
    rec.continuous = true;
    rec.lang = "en-GB";

    rec.start();
    log("VOICE ENGINE STARTED ✔");

  } catch (e) {
    output("Voice blocked — enable microphone permission");
    log("VOICE START ERROR: " + e.message);
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    output(text);

    memory.interactions++;
    saveMemory();

    // wake word
    if (text.includes("hey sonix")) {
      speak("I'm here");
      setState("listening");
      return;
    }

    handleCommand(text);
  };

  rec.onerror = (e) => {

    log("VOICE ERROR: " + e.error);

    if (e.error === "not-allowed") {
      output("Microphone blocked — allow permission in browser settings");
    }

    if (e.error === "no-speech") {
      output("Waiting for voice input...");
    }
  };

  rec.onend = () => {
    setTimeout(() => {
      try {
        rec.start();
      } catch (e) {
        log("VOICE RESTART FAILED");
      }
    }, 500);
  };

});

// ===============================
// 🧠 COMMAND ENGINE
// ===============================

function handleCommand(text) {

  // NAME MEMORY
  if (text.includes("my name is")) {
    const name = text.split("my name is")[1]?.trim();
    memory.name = name;
    saveMemory();
    speak(`Nice to meet you ${name}`);
    return;
  }

  if (text.includes("who am i")) {
    speak(memory.name ? `You are ${memory.name}` : "I don't know yet");
    return;
  }

  // MUSIC COMMANDS
  if (text.includes("play chill")) return playGenre("chill");
  if (text.includes("play dance")) return playGenre("dance");

  if (text.includes("play")) return playAny();
  if (text.includes("stop")) return stopMusic();
  if (text.includes("next")) return playAny();

  speak("I heard you");
}

// ===============================
// 🎧 PLAY GENRE (LOCAL FILES)
// ===============================

function playGenre(genre) {

  const songs = library[genre];

  if (!songs || songs.length === 0) {
    output("No songs in " + genre);
    return;
  }

  const pick = songs[Math.floor(Math.random() * songs.length)];

  audio.src = pick;
  audio.play();

  output("Playing " + genre + ": " + pick);
  setState("speaking");
}

// ===============================
// 🎧 PLAY ANY (UPLOAD FIRST)
// ===============================

function playAny() {

  // uploaded songs first
  if (uploadedSongs.length > 0) {

    const song = uploadedSongs[uploadIndex];

    audio.src = song.url;
    audio.play();

    output("Playing: " + song.name);

    uploadIndex++;
    if (uploadIndex >= uploadedSongs.length) uploadIndex = 0;

    return;
  }

  // fallback library
  const all = Object.values(library).flat();
  const pick = all[Math.floor(Math.random() * all.length)];

  audio.src = pick;
  audio.play();

  output("Playing system track");
}

// ===============================
// ⏹ STOP MUSIC
// ===============================

function stopMusic() {
  audio.pause();
  output("Music stopped");
}

// ===============================
// 🗣️ SPEECH OUTPUT
// ===============================

function speak(text) {

  try {
    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1.05;

    speechSynthesis.speak(msg);

  } catch (e) {
    log("SPEAK ERROR");
  }
}

// ===============================
// 📺 UI HELPERS
// ===============================

function output(text) {
  if (outputEl) outputEl.textContent = text;
  log(text);
}

function setState(state) {
  if (orb) orb.className = "orb " + state;
  if (statusEl) statusEl.textContent = state;
}

function log(msg) {
  console.log("SONIX:", msg);
    }
