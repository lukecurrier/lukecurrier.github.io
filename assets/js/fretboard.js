// fretboard.js
const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
const numFrets = 12;
const allNotes = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

function noteAt(stringNote, fret) {
  const startIndex = allNotes.indexOf(stringNote);
  return allNotes[(startIndex + fret) % allNotes.length];
}

function buildFretboardGrid() {
  const fretboardDiv = document.getElementById('fretboard');
  fretboardDiv.innerHTML = '';

  const grid = document.createElement('div');
  grid.classList.add('fretboard-grid');

  for (let s = strings.length - 1; s >= 0; s--) {
    const stringNote = strings[s];

    for (let f = 0; f <= numFrets; f++) {
      const note = noteAt(stringNote, f);
      const cell = document.createElement('div');
      cell.classList.add('fret');
      cell.setAttribute('data-note', note);
      cell.setAttribute('data-fret', f);
      cell.setAttribute('data-string', stringNote);

      // Label open string
      if (f === 0) {
        cell.textContent = stringNote;
      }

      grid.appendChild(cell);
    }
  }

  fretboardDiv.appendChild(grid);
}

function updateFretboard(scaleNotes, rootNote) {
  const cells = document.querySelectorAll('#fretboard .fret');

  cells.forEach(cell => {
    const note = cell.getAttribute('data-note');
    const fret = parseInt(cell.getAttribute('data-fret'));

    // Remove old classes
    cell.classList.remove('in-scale', 'root');
    
    // Clear text except for open strings
    if (fret === 0) {
      cell.textContent = cell.getAttribute('data-string');
    } else {
      cell.textContent = '';
    }

    // Add classes and text if in the scale
    if (scaleNotes && scaleNotes.length > 0 && scaleNotes.includes(note)) {
      if (note === rootNote) {
        cell.classList.add('root');
      } else {
        cell.classList.add('in-scale');
      }
      cell.textContent = note;
    }
  });
}

function clearFretboard() {
  updateFretboard([], '');
}