const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");

let songs = [];
let currentIndex = 0;

// =========================
// 🔧 FORCE SAFE INIT
// =========================

window.onload = () => {

  console.log("SONIX JS LOADED ✔");

  const upload = document.getElementById("upload");
  const playBtn = document.getElementById("playBtn");

  if (!upload) console.error("UPLOAD INPUT NOT FOUND ❌");
  if (!playBtn) console.error("PLAY BUTTON NOT FOUND ❌");

  // =========================
  // 📁 FILE UPLOAD DEBUG
  // =========================

  upload.addEventListener("change", (event) => {

    console.log("UPLOAD EVENT TRIGGERED ✔");

    const files = event.target.files;

    console.log("FILES RECEIVED:", files);

    if (!files || files.length === 0) {
      output("No files selected");
      return;
    }

    songs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      console.log("ADDING FILE:", file.name);

      songs.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }

    currentIndex = 0;

    console.log("SONGS ARRAY:", songs);

    output(`Loaded ${songs.length} songs ✔`);
  });

  // =========================
  // ▶️ PLAY BUTTON TEST
  // =========================

  playBtn.addEventListener("click", () => {
    console.log("PLAY BUTTON CLICKED");
    playMusic();
  });
};

// =========================
// 🎧 MUSIC ENGINE
// =========================

function playMusic() {

  console.log("PLAY MUSIC CALLED");
  console.log("SONGS:", songs);

  if (!songs || songs.length === 0) {
    output("No uploads detected → playing fallback track");

    audio.src =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    audio.play();
    return;
  }

  const song = songs[currentIndex];

  if (!song) {
    output("Song missing at index");
    return;
  }

  console.log("PLAYING:", song.name);

  audio.src = song.url;
  audio.play();

  output("Playing: " + song.name);

  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }
}

// =========================
// UI
// =========================

function output(text) {
  outputEl.textContent = text;
  console.log("OUTPUT:", text);
}
