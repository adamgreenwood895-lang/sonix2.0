// ===============================
// SONIX 2.0 — FINAL (PATH FIXED)
// ===============================

const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const playBtn = document.getElementById("playBtn");

let unlocked = false;
let voiceActive = false;
let currentTrack = null;

// ✅ FIXED PATHS (NO /)
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

window.addEventListener("load", () => {
  setStatus("Tap TEST AUDIO to start");
  setOutput("SONIX ready");
});

playBtn.addEventListener("click", async () => {

  if (!unlocked) {
    try {
      audio.src = "music/chill1.mp3";

      await audio.play();
      audio.pause();
      audio.currentTime = 0;

      unlocked = true;

      setStatus("ACTIVE");
      setOutput("SONIX unlocked ✔");

      speak("Sonix online");

      startVoice();

    } catch {
      setOutput("Tap again to enable audio");
      return;
    }
  }

  playRandom();
});

function playRandom() {

  const allTracks = [
    ...library.chill,
    ...library.dance
  ];

  let pick;

  do {
    pick = allTracks[Math.floor(Math.random() * allTracks.length)];
  } while (pick === currentTrack && allTracks.length > 1);

  playTrack(pick);
}

function playGenre(type) {

  const list = library[type];

  if (!list || list.length === 0) {
    setOutput("No songs in " + type);
    return;
  }

  let pick;

  do {
    pick = list[Math.floor(Math.random() * list.length)];
  } while (pick === currentTrack && list.length > 1);

  playTrack(pick);
}

function playTrack(src) {

  if (!unlocked) {
    setOutput("Tap TEST AUDIO first");
    return;
  }

  currentTrack = src;

  audio.pause();
  audio.currentTime = 0;

  audio.src = src;
  audio.load();

  audio.play()
    .then(() => {
      setOutput("Playing music");
      setStatus("PLAYING");
    })
    .catch(() => {
      setOutput("Audio blocked — press button again");
    });
}

function stopMusic() {
  audio.pause();
  setOutput("Stopped");
  setStatus("IDLE");
}

function startVoice() {

  if (voiceActive) return;

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
    voiceActive = true;
    setOutput("Voice active");
  } catch {
    setOutput("Voice blocked");
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    setOutput(text);

    if (text.includes("play chill")) playGenre("chill");
    else if (text.includes("play dance")) playGenre("dance");
    else if (text.includes("play")) playRandom();
    else if (text.includes("stop")) stopMusic();
  };

  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 1500);
  };
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

function setOutput(text) {
  if (outputEl) outputEl.textContent = text;
}

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}
