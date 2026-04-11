const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");
const upload = document.getElementById("upload");
const playBtn = document.getElementById("playBtn");

// =========================
// 🎧 MUSIC LIBRARY
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
// STATE CONTROL (IMPORTANT FIX)
// =========================

let currentTrack = null;
let isPlaying = false;
let lastCommandTime = 0;

// prevent spam (1.5 sec cooldown)
const COMMAND_DELAY = 1500;

// =========================
// UPLOAD
// =========================

let uploadedSongs = [];
let uploadIndex = 0;

// =========================
// INIT
// =========================

window.addEventListener("load", () => {

  boot("SONIX ONLINE ✔");

  if (upload) {
    upload.addEventListener("change", (e) => {

      const files = Array.from(e.target.files || []);

      uploadedSongs = files.map(f => ({
        name: f.name,
        url: URL.createObjectURL(f)
      }));

      uploadIndex = 0;

      output(`Uploaded ${uploadedSongs.length} songs`);
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      playAny(true);
    });
  }

  initVoice();
});

// =========================
// 🎤 VOICE SYSTEM (FIXED)
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
    boot("VOICE ACTIVE ✔");
  } catch {
    output("Voice blocked");
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    const now = Date.now();

    // 🔥 COOLDOWN FIX
    if (now - lastCommandTime < COMMAND_DELAY) return;

    lastCommandTime = now;

    output(text);

    if (text.includes("hey sonix")) {
      speak("I'm here");
      return;
    }

    handle(text);
  };

  rec.onerror = (e) => {
    if (e.error === "not-allowed") {
      output("Mic blocked");
    }
  };

  // 🔥 SLOW RESTART FIX
  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 1500);
  };
}

// =========================
// COMMANDS
// =========================

function handle(text) {

  if (text.includes("play chill")) return playGenre("chill");
  if (text.includes("play dance")) return playGenre("dance");

  if (text.includes("play")) return playAny();
  if (text.includes("stop")) return stop();
  if (text.includes("next")) return playAny(true);
}

// =========================
// 🎧 PLAY GENRE (SMART RANDOM)
// =========================

function playGenre(type) {

  const list = library[type];

  if (!list || list.length === 0) {
    output("No songs");
    return;
  }

  let pick;

  // 🔥 PREVENT SAME SONG LOOP
  do {
    pick = list[Math.floor(Math.random() * list.length)];
  } while (pick === currentTrack && list.length > 1);

  playTrack(pick, type);
}

// =========================
// 🎧 PLAY ANY
// =========================

function playAny(forceNext = false) {

  if (uploadedSongs.length > 0) {

    const song = uploadedSongs[uploadIndex];

    playTrack(song.url, song.name);

    uploadIndex++;
    if (uploadIndex >= uploadedSongs.length) uploadIndex = 0;

    return;
  }

  const all = Object.values(library).flat();

  let pick;

  do {
    pick = all[Math.floor(Math.random() * all.length)];
  } while (!forceNext && pick === currentTrack && all.length > 1);

  playTrack(pick);
}

// =========================
// 🎧 CORE PLAYER (IMPORTANT FIX)
// =========================

function playTrack(src, label = "music") {

  // 🔥 PREVENT RESTARTING SAME TRACK
  if (isPlaying && currentTrack === src) {
    output("Already playing");
    return;
  }

  currentTrack = src;
  isPlaying = true;

  audio.src = src;
  audio.play();

  output("Playing " + label);
  setState("playing");
}

// =========================
// STOP
// =========================

function stop() {
  audio.pause();
  isPlaying = false;
  output("Stopped");
}

// =========================
// SPEAK
// =========================

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}

// =========================
// UI
// =========================

function output(text) {
  if (outputEl) outputEl.textContent = text;
}

function setState(state) {
  if (orb) orb.className = "orb " + state;
  if (statusEl) statusEl.textContent = state;
}

function boot(text) {
  output(text);
  setState("active");
}
