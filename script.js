const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");
const upload = document.getElementById("upload");
const playBtn = document.getElementById("playBtn");

// =========================
// AUDIO UNLOCK (CRITICAL FIX)
// =========================

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audioUnlocked = true;
    output("Audio unlocked ✔");
  }).catch(() => {
    output("Tap again to enable audio");
  });
}

// unlock on ANY tap
document.addEventListener("click", unlockAudio);

// =========================
// MUSIC LIBRARY
// =========================

const library = {
  chill: [
    "/music/chill1.mp3",
    "/music/chill2.mp3"
  ],
  dance: [
    "/music/dance1.mp3",
    "/music/dance2.mp3"
  ]
};

// =========================
// STATE CONTROL
// =========================

let currentTrack = null;
let isPlaying = false;
let lastCommandTime = 0;
const COMMAND_DELAY = 1500;

// =========================
// INIT
// =========================

window.addEventListener("load", () => {

  boot("SONIX READY");

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      playAny(true);
    });
  }

  initVoice();
});

// =========================
// VOICE SYSTEM
// =========================

function initVoice() {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output("Voice not supported");
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  try {
    rec.start();
  } catch {
    output("Voice blocked");
    return;
  }

  rec.onresult = (e) => {

    const text =
      e
