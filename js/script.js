// Shared JavaScript for all pages in Sonia's birthday website.

// 1. Reveal elements smoothly when they enter the screen.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("visible");
  });
}

// 2. Create a small toast message.
function showToast(message) {
  let toast = document.querySelector("#toastMessage");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastMessage";
    toast.className = "toast-message";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}

// 3. Floating hearts effect.
function sendHearts(amount) {
  const symbols = ["♡", "♥", "❤", "✧", "💕"];

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (18 + Math.random() * 25) + "px";
    heart.style.animationDuration = (3 + Math.random() * 2) + "s";
    heart.style.animationDelay = (Math.random() * 0.7) + "s";
    document.body.appendChild(heart);

    setTimeout(function () {
      heart.remove();
    }, 6000);
  }
}

// Home page heart button.
const heartBurstBtn = document.querySelector("#heartBurstBtn");
if (heartBurstBtn) {
  heartBurstBtn.addEventListener("click", function () {
    sendHearts(45);
    showToast("Sending you all my love, Sonia. ♡");
  });
}

// 4. Confetti effect for the final celebration.
function makeConfetti(amount) {
  const colors = ["#ff79b7", "#ffd6e8", "#bba0ff", "#ffe08a", "#ff4f9a"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.9 + "s";
    piece.style.animationDuration = (2.8 + Math.random() * 2) + "s";
    document.body.appendChild(piece);

    setTimeout(function () {
      piece.remove();
    }, 6000);
  }
}

// Final page gift box.
const bigGift = document.querySelector("#bigGift");
if (bigGift) {
  bigGift.addEventListener("click", function () {
    const message = document.querySelector("#surpriseMessage");
    const giftEmoji = document.querySelector("#giftEmoji");

    message.classList.add("show");
    giftEmoji.textContent = "💝";
    bigGift.querySelector("small").textContent = "LOVE, JUST FOR YOU";
    bigGift.disabled = true;
    bigGift.style.cursor = "default";
    makeConfetti(70);
    sendHearts(25);
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

const finalConfettiBtn = document.querySelector("#finalConfettiBtn");
if (finalConfettiBtn) {
  finalConfettiBtn.addEventListener("click", function () {
    makeConfetti(120);
    sendHearts(45);
    showToast("Happy Birthday, my Sonia! You are so loved. 💗");
  });
}

// 5. Birthday melody using the browser's Web Audio API.
// It creates a simple synthesized tune; it is not a recorded song.
let audioContext = null;
let musicInterval = null;
let musicNoteIndex = 0;

const melody = [
  [392, 260], [392, 260], [440, 520], [392, 520],
  [523, 520], [494, 900], [392, 260], [392, 260],
  [440, 520], [392, 520], [587, 520], [523, 900]
];

function playMusicNote() {
  if (!audioContext) return;

  const currentNote = melody[musicNoteIndex];
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = currentNote[0];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + currentNote[1] / 1000);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + currentNote[1] / 1000 + 0.03);

  musicNoteIndex = (musicNoteIndex + 1) % melody.length;
}

async function toggleMusic(button) {
  if (musicInterval !== null) {
    clearInterval(musicInterval);
    musicInterval = null;

    if (audioContext && audioContext.state !== "closed") {
      await audioContext.suspend();
    }

    updateMusicButtons(false);
    showToast("Music paused. Tap when you want to hear it again.");
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    showToast("This browser does not support the music feature.");
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  await audioContext.resume();
  playMusicNote();
  musicInterval = setInterval(playMusicNote, 580);
  updateMusicButtons(true);
  showToast("A little birthday melody, just for you. 🎵");
}

function updateMusicButtons(isPlaying) {
  document.querySelectorAll("#musicBtn, [data-music-toggle]").forEach(function (button) {
    button.textContent = isPlaying ? "Ⅱ Music: On" : "♫ Music: Off";
    button.setAttribute("aria-pressed", String(isPlaying));
  });
}

document.querySelectorAll("#musicBtn, [data-music-toggle]").forEach(function (button) {
  button.addEventListener("click", function () {
    toggleMusic(button);
  });
});
