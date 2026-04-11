// =========================
// SONIX 2.0 - ELITE AUDIO CORE
// =========================

const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");

// =========================
// 🎧 MUSIC LIBRARY (REPO FILES)
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

// Uploaded files (optional fallback)
let uploadedSongs = [];
let uploadIndex = 0;

// =========================
// 📁 FILE UPLOAD SYSTEM (SAFE)
// =========================

window.addEventListener("DOMContentLoaded", () => {

  const upload = document.getElementById("upload");

  if (upload) {
    upload.addEventListener("change", (e) => {

      console.log("UPLOAD EVENT TRIGGERED");

      const files = Array.from(e.target.files || []);

      uploadedSongs = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));

      uploadIndex = 0;

      output(`Uploaded ${uploadedSongs.length} songs`);
    });
  }

  // =========================
  // 🎤 VOICE ENGINE (SAFE INIT)
  // =========================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.lang = "en-GB";

    rec.start();

    rec.onresult = (e) => {

      const text =
        e.results[e.results.length - 1][0].transcript.toLowerCase();

      console.log("VOICE:", text);

      output(text);

      if (text.includes("hey sonix")) {
        speak("I'm here");
        setState("listening");
        return;
      }

      handleVoice(text);
    };

    rec.onend = () => setTimeout(() => rec.start(), 500);

  } else {
    output("Voice not supported in this browser");
  }

});

// =========================
// 🧠 VOICE COMMAND ENGINE
// =========================

function handleVoice(text) {

  // 🎧 CHILL
  if (text.includes("play chill")) {
    playGenre("chill");
    return;
  }

  // 🎧 DANCE
  if (text.includes("play dance")) {
    playGenre("dance");
    return;
  }

  // ▶️ GENERIC PLAY
  if (text.includes("play")) {
    playAny();
    return;
  }

  // ⏹ STOP
  if (text.includes("stop")) {
    audio.pause();
    speak("Music stopped");
    setState("idle");
    return;
  }

  // NEXT TRACK
  if (text.includes("next")) {
    playAny();
    return;
  }

  // NAME MEMORY EXAMPLE
  if (text.includes("my name is")) {
    const name = text.split("my name is")[1].trim();
    localStorage.setItem("sonix_name", name);
    speak(`Nice to meet you ${name}`);
    return;
  }

  // DEFAULT RESPONSE
  speak("I heard you");
}

// =========================
// 🎧 PLAY GENRE (REPO MUSIC FIX)
// =========================

function playGenre(genre) {

  const songs = library[genre];

  if (!songs || songs.length === 0) {
    output("No songs found in " + genre);
    return;
  }

  const pick = songs[Math.floor(Math.random() * songs.length)];

  console.log("PLAYING GENRE:", genre, pick);

  audio.src = pick;
  audio.play();

  output(`Playing ${genre}: ${pick}`);
  setState("speaking");
}

// =========================
// 🎧 PLAY ANY (UPLOAD + FALLBACK)
// =========================

function playAny() {

  // 1. Uploaded songs first
  if (uploadedSongs.length > 0) {

    const song = uploadedSongs[uploadIndex
