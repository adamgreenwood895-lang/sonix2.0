// ===============================
// SONIX 2.0 — STABLE WORKING CORE
// ===============================

const audio = document.getElementById("audio");
const output = document.getElementById("output");
const status = document.getElementById("status");
const btn = document.getElementById("playBtn");

// IMPORTANT: correct GitHub path
const tracks = [
  "music/chill1.mp3",
  "music/chill2.mp3",
  "music/dance1.mp3",
  "music/dance2.mp3"
];

let unlocked = false;
let voiceActive = false;
let currentTrack = null;

// ===============================
// BOOT
// ===============================

window.addEventListener("load", () => {
  output.textContent = "Press TEST AUDIO";
  status.textContent = "READY";
  console.log("SONIX LOADED");
});

// ===============================
// BUTTON (MAIN CONTROL)
// ===============================

btn.addEventListener("click", async () => {

  console.log("BUTTON CLICKED");

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

      startVoice();

    } catch (e) {
      console.log(e);
      output.textContent = "Tap again to enable audio";
      return;
    }
  }

  playRandom();
});

// ===============================
// PLAY MUSIC
// ===============================

function playRandom() {

  let pick;

  do {
    pick = tracks[Math.floor(Math.random() * tracks.length)];
  } while (pick === currentTrack && tracks.length > 1);

  currentTrack = pick;

  audio.pause();
  audio.currentTime = 0;

  audio.src = pick;
  audio.load();

  audio.play()
    .then(() => {
      output.textContent = "Playing music";
      status.textContent = "PLAYING";
    })
    .catch(err => {
      console.log(err);
      output.textContent = "Audio blocked";
    });
}

// ===============================
// VOICE SYSTEM
// ===============================

function startVoice() {

  if (voiceActive) return;

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
    voiceActive = true;
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
