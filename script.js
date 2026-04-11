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
// 📁 UPLOADED SONGS
// =========================

let uploadedSongs = [];
let uploadIndex = 0;

// =========================
// 🧠 MEMORY
// =========================

let memory = JSON.parse(localStorage.getItem("sonix_memory")) || {
  name: null,
  interactions: 0
};

function saveMemory() {
  localStorage.setItem("sonix_memory", JSON.stringify(memory));
}

// =========================
// 🚀 BOOT SYSTEM (IMPORTANT FIX)
// =========================

window.addEventListener("load", () => {

  boot("SONIX ONLINE ✔");

  // =========================
  // 📁 UPLOAD
  // =========================

  if (upload) {
    upload.addEventListener("change", (e) => {

      const files = Array.from(e.target.files || []);

      uploadedSongs = files.map(f => ({
        name: f.name,
        url: URL.createObjectURL(f)
      }));

      uploadIndex = 0;

      output(`Uploaded ${uploadedSongs.length} songs ✔`);
    });
  }

  // =========================
  // ▶️ TEST BUTTON (FIXED)
  // =========================

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      playAny();
    });
  }

  // =========================
  // 🎤 VOICE ENGINE (SAFE)
// =========================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output("Voice not supported — manual mode active");
    return;
  }

  let rec;

  try {
    rec = new SpeechRecognition();
    rec.continuous = true;
    rec.lang = "en-GB";
    rec.start();
    boot("VOICE ACTIVE ✔");

  } catch (e) {
    output("Voice blocked — click page & retry");
    console.log(e);
    return;
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    output(text);

    memory.interactions++;
    saveMemory();

    if (text.includes("hey sonix")) {
      speak("I'm here");
      setState("listening");
      return;
    }

    handle(text);
  };

  rec.onerror = (e) => {

    console.log("VOICE ERROR:", e.error);

    if (e.error === "not-allowed") {
      output("Microphone blocked — enable permission in Chrome");
    }
  };

  rec.onend = () => {
    setTimeout(() => {
      try { rec.start(); } catch {}
    }, 500);
  };

});

// =========================
// 🧠 COMMANDS
// =========================

function handle(text) {

  if (text.includes("my name is")) {
    const name = text.split("my name is")[1]?.trim();
    memory.name = name;
    saveMemory();
    speak(`Nice to meet you ${name}`);
    return;
  }

  if (text.includes("who am i")) {
    speak(memory.name ? `You are ${memory.name}` : "I don't know yet");
    return;
  }

  if (text.includes("play chill")) return playGenre("chill");
  if (text.includes("play dance")) return playGenre("dance");

  if (text.includes("play")) return playAny();
  if (text.includes("stop")) return stop();
  if (text.includes("next")) return playAny();

  speak("I heard you");
}

// =========================
// 🎧 PLAY GENRE (FIXED PATH)
// =========================

function playGenre(type) {

  const list = library[type];

  if (!list || list.length === 0) {
    output("No songs in " + type);
    return;
  }

  const pick = list[Math.floor(Math.random() * list.length)];

  audio.src = pick;
  audio.play();

  output("Playing " + type);
  setState("speaking");
}

// =========================
// 🎧 PLAY ANY
// =========================

function playAny() {

  if (uploadedSongs.length > 0) {

    const song = uploadedSongs[uploadIndex];

    audio.src = song.url;
    audio.play();

    output("Playing: " + song.name);

    uploadIndex++;
    if (uploadIndex >= uploadedSongs.length) uploadIndex = 0;

    return;
  }

  const all = Object.values(library).flat();
  const pick = all[Math.floor(Math.random() * all.length)];

  audio.src = pick;
  audio.play();

  output("Playing system track");
}

// =========================
// ⏹ STOP
// =========================

function stop() {
  audio.pause();
  output("Stopped");
}

// =========================
// 🗣️ SPEAK
// =========================

function speak(text) {
  try {
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1.05;
    speechSynthesis.speak(msg);
  } catch {}
}

// =========================
// 📺 UI
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
