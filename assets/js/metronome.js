// metronome.js
let audioCtx;
let nextNoteTime = 0;
let isMetronomePlaying = false;
let metronomeSchedulerHandle = null;

function getBPM() {
  const bpmInput = document.getElementById('bpm');
  return parseInt(bpmInput.value) || 100;
}

function playClick(time) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  
  osc.frequency.value = 1000;
  osc.start(time);
  osc.stop(time + 0.05);
}

function metronomeScheduler() {
  if (!isMetronomePlaying) return;
  
  const bpm = getBPM();
  const secondsPerBeat = 60.0 / bpm;
  
  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    playClick(nextNoteTime);
    nextNoteTime += secondsPerBeat;
  }
  
  metronomeSchedulerHandle = requestAnimationFrame(metronomeScheduler);
}

function startMetronome() {
  if (isMetronomePlaying) return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  nextNoteTime = audioCtx.currentTime;
  isMetronomePlaying = true;
  metronomeScheduler();
}

function stopMetronome() {
  isMetronomePlaying = false;
  if (metronomeSchedulerHandle) {
    cancelAnimationFrame(metronomeSchedulerHandle);
    metronomeSchedulerHandle = null;
  }
}