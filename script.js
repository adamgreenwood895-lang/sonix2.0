const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");

let songs = [];
let current = 0;

// =========================
// ⚡ SAFE INIT (FIXES MOBILE BUGS)
// =========================
window.addEventListener("DOMContentLoaded", () => {

  const upload = document.getElementById("upload");
  const playBtn = document.getElementById("playBtn");

  // =========================
  // 🎧 UPLOAD FIX (MAIN ISSUE FIXED)
  // =========================
  upload.addEventListener("change", (e) => {

    const files = Array.from(e.target.files);

    if (!files || files.length === 0) {
      output("No files selected");
      return;
    }

    songs = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    current = 0;

    output(`Loaded ${songs.length} songs ✔`);
  });

  // =========================
  // ▶️ PLAY BUTTON (FOR TESTING)
  // =========================
  playBtn.addEventListener("click", () => {
    playMusic();
  });

});

// =========================
// 🎧 MUSIC ENGINE (FIXED)
// =========================
function playMusic() {

  // DEBUG LOG
  console.log("Songs array:", songs);

  if (!songs || songs.length === 0) {
    output("No uploaded songs — using fallback track");

    audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audio.play();

    return;
  }

  const song = songs[current];

  if (!song || !song.url) {
    output("Song error detected");
    return;
  }

  audio.src = song.url;
  audio.play();

  output("Playing: " + song.name);

  current++;

  if (current >= songs.length) {
    current = 0;
  }
}

// =========================
// 🧠 UI HELPERS
// =========================
function output(text) {
  outputEl.textContent = text;
}

function setState(state) {
  orb.className = "orb " + state;
}
