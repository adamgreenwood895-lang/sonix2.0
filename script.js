const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const sub = document.getElementById("sub");
const audio = document.getElementById("audio");

// =========================
// 🎧 MUSIC LIBRARY
// =========================

const library = {
  chill: [
    "music/chill1.mp3",
    "music/chill2.mp3"
  ],
  drill: [
    "music/drill1.mp3",
    "music/drill2.mp3"
  ],
  house: [
    "music/house1.mp3"
  ]
};

let uploadedSongs = [];

// upload support
document.getElementById("upload").addEventListener("change", (e) => {
  uploadedSongs = Array.from(e.target.files).map(file =>
    URL.createObjectURL(file)
  );
});

// =========================
// 🧠 MEMORY
// =========================

let memory = JSON.parse(localStorage.getItem("sonix_memory")) || {
  name: null,
  interactions: 0,
  lastGenre: null
};

function save() {
  localStorage.setItem("sonix_memory", JSON.stringify(memory));
}

// =========================
// 🎤 SPEECH ENGINE
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
  memory.interactions++;
  save();

  if (text.includes("hey sonix")) {
    speak("I'm here");
    setState("listening");
    return;
  }

  handle(text);
};

rec.onend = () => setTimeout(() => rec.start(), 400);

// =========================
// 🧠 CORE LOGIC
// =========================

function handle(text) {

  // name memory
  if (text.includes("my name is")) {
    const name = text.split("my name is")[1].trim();
    memory.name = name;
    save();
    speak(`Nice to meet you ${name}`);
    return;
  }

  // recall name
  if (text.includes("who am i")) {
    speak(memory.name ? `You are ${memory.name}` : "I don't know yet");
    return;
  }

  // MUSIC CONTROL
  if (text.includes("play")) {

    if (text.includes("chill")) return playGenre("chill");
    if (text.includes("dance")) return playGenre("drill");
    if (text.includes("bounce")) return playGenre("bounce");
                                          
    // fallback
    speak("Playing music");
    playAny();
    return;
  }

  if (text.includes("stop")) {
    audio.pause();
    speak("Stopped");
    return;
  }

  // next track
  if (text.includes("next")) {
    speak("Next track");
    playAny();
    return;
  }

  // conversation feel
  respond();
}

// =========================
// 🎧 MUSIC FUNCTIONS
// =========================

function playGenre(genre) {
  const songs = library[genre];

  if (!songs || songs.length === 0) {
    speak("No songs found in that category");
    return;
  }

  const pick = songs[Math.floor(Math.random() * songs.length)];

  memory.lastGenre = genre;
  save();

  audio.src = pick;
  audio.play();

  speak(`Playing ${genre} music`);
}

function playAny() {
  if (uploadedSongs.length > 0) {
    const pick =
      uploadedSongs[Math.floor(Math.random() * uploadedSongs.length)];
    audio.src = pick;
  } else {
    const all = Object.values(library).flat();
    const pick = all[Math.floor(Math.random() * all.length)];
    audio.src = pick;
  }

  audio.play();
}

// =========================
// 🤖 RESPONSE ENGINE
// =========================

function respond() {
  setState("thinking");

  const replies = [
    "I understand",
    "Tell me more",
    "Interesting",
    "I'm learning from you",
    "That makes sense"
  ];

  const reply = replies[Math.floor(Math.random() * replies.length)];

  setTimeout(() => speak(reply), 700);
}

// =========================
// 🗣️ VOICE
// =========================

function speak(text) {
  speechSynthesis.cancel();

  setState("speaking");

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1.1;

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
