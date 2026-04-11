// ===============================
// SONIX 2.0 - STABLE FINAL CORE
// ===============================

const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const playBtn = document.getElementById("playBtn");

// ===============================
// STATE
// ===============================

let isUnlocked = false;
let voiceStarted = false;
let currentTrack = null;

// ===============================
// MUSIC LIBRARY (CONFIRMED PATHS)
// ===============================

const tracks = [
  "/music/chill1.mp3",
  "/music/chill2.mp3",
  "/music/dance1.mp3",
  "/music/dance2.mp3"
];

// ===============================
// BOOT
// ===============================

window.addEventListener("load", () => {
  setStatus("Tap 'TEST AUDIO' to start");
  setOutput("SONIX ready");
  console.log("SONIX LOADED");
});

// ===============================
// BUTTON = PRIMARY CONTROL (IMPORTANT)
// ===============================

playBtn.addEventListener("click", async () => {

  console.log("BUTTON CLICKED");

  // 🔓 FIRST CLICK = UNLOCK AUDIO + VOICE
  if (!isUnlocked) {

    try {
      audio.src = tracks[0];

      await audio.play();   // unlock
      audio.pause();
      audio.currentTime = 0;

      isUnlocked = true;

      setStatus("ACTIVE");
      setOutput("SONIX unlocked ✔");

      speak("Sonix online");

      startVoice(); // only after unlock

    } catch (e) {
      console.log("UNLOCK FAILED", e);
      setOutput("Tap again to enable audio");
      return;
    }
  }

  // ▶️ AFTER UNLOCK = PLAY MUSIC
  playRandom();
});

// ===============================
// PLAY SYSTEM
// ===============================

function playRandom() {

  let pick;

  do {
    pick = tracks[Math.floor(Math.random() * tracks.length)];
  } while (pick === currentTrack && tracks.length > 1);

  currentTrack = pick;

  audio.src = pick;

  audio.play().then(() => {
    setOutput("Playing music");
  }).catch(() => {
    setOutput("Audio blocked — tap again");
  });
}

// ===============================
// VOICE SYSTEM (SAFE START)
// ===============================

function startVoice() {

  if (voiceStarted) return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setOutput("Voice not supported");
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  try {
    rec.start();
    voiceStarted = true;
    setOutput("Voice active");
  } catch {
    setOutput("Voice blocked");
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    console.log("VOICE:", text);
    setOutput(text);

    if (text.includes("play")) playRandom();
    if (text.includes("stop")) audio.pause();
  };

  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 1500);
  };
}

// ===============================
// SPEECH OUTPUT
// ===============================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// ===============================
// UI HELPERS
// ===============================

function setOutput(text) {
  if (outputEl) outputEl.textContent = text;
}

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}
