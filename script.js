const audio = document.getElementById("audio");
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");
const orb = document.getElementById("orb");

let songs = [];

// =========================
// 🧠 SAFE STARTUP CHECK
// =========================

window.addEventListener("load", () => {

  log("SONIX LOADED ✔");

  const upload = document.getElementById("upload");
  const playBtn = document.getElementById("playBtn");

  if (!outputEl || !statusEl || !orb) {
    alert("CRITICAL ERROR: Missing HTML elements");
    return;
  }

  // =========================
  // 📁 UPLOAD TEST
  // =========================

  if (upload) {
    upload.addEventListener("change", (e) => {

      log("UPLOAD TRIGGERED");

      const files = Array.from(e.target.files || []);

      songs = files.map(f => ({
        name: f.name,
        url: URL.createObjectURL(f)
      }));

      output(`Loaded ${songs.length} songs ✔`);
    });
  } else {
    log("UPLOAD ELEMENT NOT FOUND");
  }

  // =========================
  // ▶️ BUTTON TEST (IMPORTANT)
  // =========================

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      log("PLAY BUTTON CLICKED");
      playMusic();
    });
  }

  // =========================
  // 🎤 VOICE CHECK (CRITICAL FIX)
  // =========================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output("SpeechRecognition NOT supported in this browser");
    log("VOICE API MISSING");
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.lang = "en-GB";

  try {
    rec.start();
    log("VOICE STARTED");
  } catch (e) {
    log("VOICE START ERROR: " + e.message);
  }

  rec.onresult = (e) => {

    const text =
      e.results[e.results.length - 1][0].transcript.toLowerCase();

    log("VOICE INPUT: " + text);

    output(text);

    if (text.includes("hey sonix")) {
      speak("I'm here");
      return;
    }

    if (text.includes("play")) playMusic();
    if (text.includes("stop")) stopMusic();
  };

  rec.onerror = (e) => {
    log("VOICE ERROR: " + e.error);
    output("Voice error: " + e.error);
  };

  rec.onend = () => {
    log("VOICE RESTARTING");
    setTimeout(() => rec.start(), 500);
  };

});

// =========================
// 🎧 MUSIC ENGINE (SAFE)
// =========================

function playMusic() {

  log("PLAY MUSIC CALLED");

  if (!songs || songs.length === 0) {
    output("No uploaded songs → fallback track");

    audio.src =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    audio.play();
    return;
  }

  const song = songs[0];

  if (!song?.url) {
    output("Song broken object");
    return;
  }

  audio.src = song.url;
  audio.play();

  output("Playing: " + song.name);
}

function stopMusic() {
  audio.pause();
  output("Stopped");
}

// =========================
// 🗣️ VOICE OUTPUT
// =========================

function speak(text) {
  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;

  speechSynthesis.speak(msg);
}

// =========================
// 📺 UI HELPERS
// =========================

function output(text) {
  outputEl.textContent = text;
  log("OUTPUT: " + text);
}

function log(msg) {
  console.log("SONIX DEBUG:", msg);
        }
