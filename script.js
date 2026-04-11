const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");
const playBtn = document.getElementById("playBtn");

// =========================
// 🔐 GLOBAL AUDIO UNLOCK
// =========================

let isUnlocked = false;
let voiceActive = false;

// =========================
// 🎧 MUSIC LIBRARY
// =========================

const tracks = [
  "/music/chill1.mp3",
  "/music/chill2.mp3",
  "/music/dance1.mp3",
  "/music/dance2.mp3"
];

let currentTrack = null;

// =========================
// 🚀 BOOT
// =========================

window.addEventListener("load", () => {
  output("Tap anywhere to activate SONIX");
  setState("locked");
});

// =========================
// 🔓 UNLOCK SYSTEM (CRITICAL)
// =========================

document.addEventListener("click", async () => {

  if (isUnlocked) return;

  try {
    // unlock audio
    audio.src = tracks[0];
    await audio.play();
    audio.pause();
    audio.currentTime = 0;

    // unlock speech
    const msg = new SpeechSynthesisUtterance("SONIX online");
    speechSynthesis.speak(msg);

    isUnlocked = true;

    output("SONIX ACTIVE ✔");
    setState("active");

    initVoice();

  } catch (e) {
    output("Tap again to enable audio");
  }

});

// =========================
// 🎤 VOICE SYSTEM (STARTS AFTER UNLOCK)
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
    voiceActive = true;
    output("Voice active");
  } catch {
    output("Voice blocked");
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    output(text);

    if (text.includes("play")) playRandom();
    if (text.includes("stop")) stop();
  };

  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 1500);
  };
}

// =========================
// 🎧 PLAY
// =========================

function playRandom() {

  if (!isUnlocked) {
    output("Tap screen first");
    return;
  }

  let pick;

  do {
    pick = tracks[Math.floor(Math.random() * tracks.length)];
  } while (pick === currentTrack && tracks.length > 1);

  currentTrack = pick;

  audio.src = pick;

  audio.play().then(() => {
    output("Playing music");
    setState("playing");
  }).catch(() => {
    output("Audio blocked");
  });
}

// =========================
// ⏹ STOP
// =========================

function stop() {
  audio.pause();
  output("Stopped");
}

// =========================
// ▶️ BUTTON (FORCE WORK)
// =========================

if (playBtn) {
  playBtn.addEventListener("click", playRandom);
}

// =========================
// UI
// =========================

function output(text) {
  if (outputEl) outputEl.textContent = text;
}

function setState(state) {
  if (statusEl) statusEl.textContent = state;
  if (orb) orb.className = "orb " + state;
}
