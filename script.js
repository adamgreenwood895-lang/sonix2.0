const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const audio = document.getElementById("audio");

let songs = [];
let currentIndex = 0;

// =========================
// 🔧 FIX: WAIT FOR DOM SAFETY
// =========================

window.addEventListener("DOMContentLoaded", () => {

  const upload = document.getElementById("upload");
  const testBtn = document.getElementById("testPlay");

  // =========================
  // 🎧 UPLOAD FIX (MAIN ISSUE)
  // =========================
  upload.addEventListener("change", (e) => {

    const files = Array.from(e.target.files);

    songs = files.map(file => {
      return {
        name: file.name,
        url: URL.createObjectURL(file)
      };
    });

    output(`Loaded ${songs.length} songs`);
  });

  // =========================
  // 🎧 TEST BUTTON (CRITICAL DEBUG TOOL)
  // =========================
  testBtn.addEventListener("click", () => {
    playMusic();
  });

  // =========================
  // 🎤 VOICE
  // =========================
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  rec.start();

  rec.onresult = (e) => {
    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    output(text);

    if (text.includes("hey sonix")) {
      speak("I'm here");
      setState("listening");
      return;
    }

    if (text.includes("play")) playMusic();
    if (text.includes("stop")) stopMusic();
  };

  rec.onend = () => setTimeout(() => rec.start(), 500);

});

// =========================
// 🎧 FIXED MUSIC PLAYER
// =========================

function playMusic() {

  if (songs.length === 0) {
    output("No uploaded songs — playing fallback track");
    audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audio.play();
    return;
  }

  const song = songs[currentIndex];

  audio.src = song.url;
  audio.play();

  output("Playing: " + song.name);

  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }
}

function stopMusic() {
  audio.pause();
  output("Music stopped");
}

// =========================
// 🗣️ VOICE
// =========================

function speak(text) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  speechSynthesis.speak(msg);
}

// =========================
// 🧠 UI
// =========================

function setState(state) {
  orb.className = "orb " + state;
}

function output(text) {
  outputEl.textContent = text;
}
