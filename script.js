
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const keys = document.querySelectorAll(".key");

// Piano notes for 21 keys
const frequencies = [
  261.63, 277.18, 293.66, 311.13,
  329.63, 349.23, 369.99, 392.00,
  415.30, 440.00, 466.16, 493.88,
  523.25, 554.37, 587.33, 622.25,
  659.25, 698.46, 739.99, 783.99,
  830.61
];

const activeNotes = new Map();

function playNote(frequency, key) {
  if (activeNotes.has(key)) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.3,
    audioContext.currentTime + 0.02
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  activeNotes.set(key, { oscillator, gain });

  key.classList.add("active");
}

function stopNote(key) {
  const note = activeNotes.get(key);

  if (!note) return;

  note.gain.gain.cancelScheduledValues(audioContext.currentTime);
  note.gain.gain.setTargetAtTime(
    0.0001,
    audioContext.currentTime,
    0.05
  );

  note.oscillator.stop(audioContext.currentTime + 0.3);

  activeNotes.delete(key);
  key.classList.remove("active");
}

// Mouse and touch support
keys.forEach((key, index) => {
  key.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    playNote(frequencies[index], key);
  });

  key.addEventListener("pointerup", () => stopNote(key));
  key.addEventListener("pointerleave", () => stopNote(key));
  key.addEventListener("pointercancel", () => stopNote(key));
});
