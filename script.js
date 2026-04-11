// ===============================
// SONIX 2.1 — STABLE CORE
// ===============================

const audio = document.getElementById("audio");
const output = document.getElementById("output");
const status = document.getElementById("status");
const btn = document.getElementById("playBtn");

// ===============================
// STATE
// ===============================

let unlocked = false;
let voiceReady = false;
let currentTrack = null;

// ===============================
// MUSIC LIBRARY
// ===============================

const tracks = [
  "music/chill1.mp3",
  "music/chill2.mp3",
  "music/dance1.mp3",
  "music/dance2.mp3"
];

// ===============================
// BOOT
// ===============================

window.addEventListener("load", () => {
  output.textContent = "Press TEST AUDIO";
  status.textContent = "READY";
  console.log("SONIX 2.1 LOADED");
});

// ===============================
// BUTTON (MAIN CONTROL)
// ===============================

btn.addEventListener("click", async () => {

  // 🔓 FIRST CLICK = UNLOCK AUDIO + VOICE
  if (!unlocked) {

    try {
      audio.src = "music/chill1.mp3";

      await audio.play();
      audio.pause();
      audio.currentTime = 0;

      unlocked = true;

      output.textContent = "SONIX ACTIVE ✔";
      status.textContent = "ACTIVE";

      speak("Sonix online");

      initVoice();

    } catch (e) {
      console.log(e);
      output.textContent = "Tap again to unlock audio";
      return;
    }
  }

  playRandom();
});

// ===============================
// PLAY MUSIC (SAFE)
// ===============================

function playRandom() {

  const pick = tracks[Math.floor(Math.random() * tracks.length)];

  if (pick === currentTrack && tracks.length > 1) {
    return playRandom();
  }

  currentTrack = pick;

  audio.pause();
  audio.currentTime = 0;

  audio.src = pick;

  audio.play()
    .then(() => {
      output.textContent = "Playing music";
      status.textContent = "PLAYING";
    })
    .catch(() => {
      output.textContent = "Audio blocked";
    });
}

// ===============================
// VOICE (SAFE LAYER)
// ===============================

function initVoice() {

  if (voiceReady) return;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output.textContent = "Voice not supported";
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  try {
    rec.start();
    voiceReady = true;
    output.textContent = "Voice active";
  } catch {
    output.textContent = "Voice blocked";
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    console.log("VOICE:", text);

    output.textContent = text;

    if (text.includes("play")) playRandom();
    if (text.includes("stop")) stopMusic();
  };

  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 2000);
  };
}

// ===============================
// STOP
// ===============================

function stopMusic() {
  audio.pause();
  output.textContent = "Stopped";
  status.textContent = "READY";
}

// ===============================
// SPEECH
// ===============================

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}
