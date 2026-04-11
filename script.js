const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");

// =========================
// 🎧 MUSIC LIBRARY (LOCAL FILES)
// =========================

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

// =========================
// 📁 UPLOADED SONGS
// =========================

let uploadedSongs = [];
let uploadIndex = 0;

// =========================
// 🧠 MEMORY SYSTEM
// =========================

let memory = JSON.parse(localStorage.getItem("sonix_memory")) || {
  name: null,
  interactions: 0
};

function saveMemory() {
  localStorage.setItem("sonix_memory", JSON.stringify(memory));
}

// =========================
// 🚀 SAFE INIT (PREVENT BREAKS)
// =========================

window.addEventListener("load", () => {

  log("SONIX CORE LOADED ✔");

  const upload = document.getElementById("upload");

  // =========================
  // 📁 UPLOAD SYSTEM (FIXED)
  // =========================

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

  // =========================
  // 🎤 VOICE SYSTEM (WORKING CORE)
  // =========================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output("Voice not supported in this browser");
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  try {
    rec.start();
    log("VOICE STARTED ✔");
  } catch (e) {
    log("VOICE ERROR START: " + e.message);
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    output(text);
    memory.interactions++;
    saveMemory();

    if (text.includes("hey sonix")) {
      speak("I'm here");
      setState("listening");
      return;
    }

    handleCommand(text);
  };

  rec.onend = () => {
    setTimeout(() => rec.start(), 400);
  };
});

// =========================
// 🧠 COMMAND ENGINE
// =========================

function handleCommand(text) {

  // NAME MEMORY
  if (text.includes("my name is")) {
    const name = text.split("my name is")[1].trim();
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

// =========================
// 🎧 PLAY GENRE (LOCAL FILES)
// =========================

function playGenre(genre) {

  const songs = library[genre];

  if (!songs || songs.length === 0) {
    output("No songs found in " + genre);
    return;
  }

  const pick = songs[Math.floor(Math.random() * songs.length)];

  audio.src = pick;
  audio.play();

  output("Playing " + genre + ": " + pick);
  setState("speaking");
}

// =========================
// 🎧 PLAY ANY (UPLOAD FIRST)
// =========================

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

// =========================
// ⏹ STOP
// =========================

function stopMusic() {
  audio.pause();
  output("Music stopped");
}

// =========================
// 🗣️ VOICE OUTPUT
// =========================

function speak(text) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1.05;

  speechSynthesis.speak(msg);
}

// =========================
// 📺 UI
// =========================

function setState(state) {
  if (orb) orb.className = "orb " + state;
}

function output(text) {
  if (outputEl) outputEl.textContent = text;
}

function log(msg) {
  console.log("SONIX:", msg);
}
