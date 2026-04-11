console.log("SONIX SCRIPT LOADED ✔");

// ELEMENT CHECKS
const btn = document.getElementById("playBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");
const audio = document.getElementById("audio");

// SHOW IF ELEMENTS EXIST
console.log("BTN:", btn);
console.log("OUTPUT:", output);
console.log("STATUS:", status);
console.log("AUDIO:", audio);

// IF BUTTON NOT FOUND → STOP HERE
if (!btn) {
  alert("ERROR: playBtn NOT FOUND in HTML");
}

// TEST CLICK
btn.addEventListener("click", () => {

  console.log("BUTTON CLICKED ✔");

  output.textContent = "Button works ✔";

  // SIMPLE AUDIO TEST
  const testTrack = "music/chill1.mp3";

  audio.src = testTrack;

  audio.play()
    .then(() => {
      output.textContent = "Playing: chill1.mp3";
      status.textContent = "PLAYING";
    })
    .catch((err) => {
      console.log("AUDIO ERROR:", err);
      output.textContent = "Audio blocked or path wrong";
    });

});
