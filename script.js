const music = document.getElementById("bg-music");

// Fade in function
function fadeIn(audio, duration = 3000) {
  audio.volume = 0;
  audio.play();

  let step = 0.01;
  let interval = duration * step;

  let fade = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(audio.volume + step, 1);
    } else {
      clearInterval(fade);
    }
  }, interval);
}

// Trigger saat klik pertama
document.addEventListener("click", () => {
  fadeIn(music);
  initVisualizer();
}, { once: true });


// ================= VISUALIZER =================

function initVisualizer() {
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = 120;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(music);
  const analyser = audioContext.createAnalyser();

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i] / 2;

      ctx.fillStyle = "silver";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  animate();
}
const controlBtn = document.getElementById("music-control");
let isPlaying = false;

function fadeOut(audio, duration = 800) {
  let step = 0.01;
  let interval = duration * step;

  let fade = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      clearInterval(fade);
      audio.pause();
    }
  }, interval);
}

controlBtn.addEventListener("click", () => {
  if (isPlaying) {
    fadeOut(music);
    controlBtn.textContent = "Play Music 🎵";
  } else {
    fadeIn(music);
    controlBtn.textContent = "Pause Music ⏸";
  }
  isPlaying = !isPlaying;
});

