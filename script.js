// ===============================
// SONIX HARD DEBUG (BUTTON TEST)
// ===============================

console.log("SCRIPT LOADED");

// grab elements
const btn = document.getElementById("playBtn");
const output = document.getElementById("output");

// check button exists
if (!btn) {
  alert("BUTTON NOT FOUND");
} else {
  console.log("BUTTON FOUND");
}

// click test
btn.addEventListener("click", () => {
  console.log("BUTTON CLICKED");
  output.textContent = "BUTTON WORKING ✔";
});
