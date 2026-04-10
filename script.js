const orb = document.getElementById("orb");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const sub = document.getElementById("sub");
const audio = document.getElementById("audio");

let songs = [];
let memory = JSON.parse(localStorage.getItem("sonix_memory")) || {
  name: null,
  interactions: 0
};

// =========================
// FILE UPLOAD
// =========================
document.getElementById("upload").addEventListener("change", (e) => {
  songs = Array.from(e.target.files).map(file =>
    URL.createObjectURL(file)
  );
});

// =========================
// SPEECH
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

rec.onend = () => setTimeout(() => rec.start(), 500);

// =========================
// CORE
// =========================
function handle(text) {

  if (text.includes("my name is")) {
    const name = text.split("my name is")[1].trim();
    memory.name = name;
    save();
    speak(`Nice to meet you ${name}`);
    return;
  }

  if (text.includes("play")) {
    speak("Playing music");
    play();
    return;
  }

  if (text.includes("stop")) {
    audio.pause();
    speak("Stopped");
    return;
  }

  if (text.includes("who am i")) {
    if (memory.name) {
      speak(`You are ${memory.name}`);
    } else {
      speak("I don't know your name yet");
    }
    return;
  }

  // basic conversation feel
  respond();
}

// =========================
// MUSIC
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
// RESPONSE
// =========================
function respond() {
  setState("thinking");

  const replies = [
    "I understand",
    "Tell me more",
    "Interesting",
    "I'm learning from you"
  ];

  const reply = replies[Math.floor(Math.random() * replies.length)];

  setTimeout(() => speak(reply), 800);
}

// =========================
// VOICE
// =========================
function speak(text) {
  speechSynthesis.cancel();

  setState("speaking");

  const msg = new SpeechSynthesisUtterance(text);
  msg.onend = () => setState("listening");

  speechSynthesis.speak(msg);
}

// =========================
// STATE
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
// STORAGE
// =========================
function save() {
  localStorage.setItem("sonix_memory", JSON.stringify(memory));
}

// =========================
// OUTPUT
// =========================
function output(text) {
  outputEl.textContent = text;
}
