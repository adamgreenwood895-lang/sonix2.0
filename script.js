const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const sub = document.getElementById("sub");
const audio = document.getElementById("audio");

let songs = [];

// =========================
// LOAD SONGS (UPLOAD)
// =========================
document.getElementById("upload").addEventListener("change", (e) => {
  songs = Array.from(e.target.files).map(file =>
    URL.createObjectURL(file)
  );
});

// =========================
// SPEECH SETUP
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

  handle(text);
};

rec.onend = () => setTimeout(() => rec.start(), 500);

// =========================
// CORE LOGIC
// =========================

function handle(text) {
  if (text.includes("play")) {
    speak("Playing music");
    play();
  }

  if (text.includes("stop")) {
    audio.pause();
    speak("Stopped");
  }
}

// =========================
// PLAY MUSIC
// =========================

function play() {
  const src =
    songs.length > 0
      ? songs[Math.floor(Math.random() * songs.length)]
      : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  audio.src = src;
  audio.play();
}

// =========================
// VOICE
// =========================

function speak(text) {
  window.speechSynthesis.cancel();

  setState("speaking");

  const msg = new SpeechSynthesisUtterance(text);
  msg.onend = () => setState("listening");

  speechSynthesis.speak(msg);
}

// =========================
// UI STATE
// =========================

function setState(state) {
  orb.className = "orb " + state;

  const map = {
    listening: "Listening...",
    speaking: "Responding...",
    thinking: "Thinking..."
  };

  statusEl.textContent = map[state] || "Active";
}

// =========================
// OUTPUT
// =========================

function output(text) {
  outputEl.textContent = text;
    }
