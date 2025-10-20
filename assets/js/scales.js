// scales.js
const keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const scales = {
  Major: [2, 2, 1, 2, 2, 2, 1],
  Minor: [2, 1, 2, 2, 1, 2, 2],
  Blues: [3, 2, 1, 1, 3, 2],
  Pentatonic: [2, 2, 3, 2, 3],
  Dorian: [2, 1, 2, 2, 2, 1, 2],
  Mixolydian: [2, 2, 1, 2, 2, 1, 2],
};

function randomScale(keysToInclude) {
  const key = keys[Math.floor(Math.random() * keys.length)];
  const scaleNames = Object.keys(scales);
  
  // Filter to only include selected scales
  const availableScales = scaleNames.filter((name, index) => keysToInclude[index]);
  
  // If no scales selected, use all scales
  if (availableScales.length === 0) {
    const scale = scaleNames[Math.floor(Math.random() * scaleNames.length)];
    return `${key} ${scale}`;
  }
  
  const scale = availableScales[Math.floor(Math.random() * availableScales.length)];
  return `${key} ${scale}`;
}

let scaleInterval;
let currentScale = "";
let timer = null;
let timeLeft = 0;
let duration = 120;
let paused = true;

function parseScaleName(scaleString) {
  const [root, ...rest] = scaleString.split(" ");
  return { root, scaleName: rest.join(" ") };
}

function buildScale(root, scaleName) {
  const semitones = scales[scaleName];
  if (!semitones) return [];
  const rootIndex = keys.indexOf(root);
  if (rootIndex === -1) return [];
  let notes = [keys[rootIndex]];
  let idx = rootIndex;
  for (let step of semitones) {
    idx = (idx + step) % keys.length;
    notes.push(keys[idx]);
  }
  return notes;
}

const displayScale = document.getElementById("current-scale");
const countdownEl = document.getElementById("countdown");
const durationInput = document.getElementById("timer-duration");

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function pickNewScale(keysToInclude = [true, true, true, true, true, true]) {
  currentScale = randomScale(keysToInclude);
  displayScale.textContent = currentScale;
  const { root, scaleName } = parseScaleName(currentScale);
  const notes = buildScale(root, scaleName);
  updateFretboard(notes, root);
  timeLeft = durationInput.value || duration;
  countdownEl.textContent = formatTime(timeLeft);
}

let scaleSelections = [true, true, true, true, true, true]; 

function startTimer() {
  if (timer) return; // already running

  paused = false;

  timer = setInterval(() => {
    if (paused) return;
    timeLeft--;
    countdownEl.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      pickNewScale(scaleSelections); // Use the stored selections
    }
  }, 1000);
}

function pauseTimer() {
  paused = true;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  paused = true; // Reset pause state
  timeLeft = durationInput.value || duration;
  countdownEl.textContent = formatTime(timeLeft);
  displayScale.textContent = "";
  updateFretboard([], "");
}
