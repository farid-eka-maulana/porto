const music = document.getElementById("bg-music");
const btn = document.getElementById("music-control");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioContext = null;
let analyser = null;
let source = null;
let animationId = null;

canvas.width = window.innerWidth;
canvas.height = 120;

// Resize biar responsif
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
});

// Buat Audio System SEKALI SAJA
function setupAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source = audioContext.createMediaElementSource(music);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

// Visualizer
function startVisualizer() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animate() {
    animationId = requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = "silver";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  animate();
}

// Stop visualizer
function stopVisualizer() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// BUTTON CONTROL
btn.addEventListener("click", async () => {

  setupAudio();

  // FIX WAJIB UNTUK HP
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (music.paused) {
    try {
      await music.play();
      startVisualizer();
      btn.textContent = "Pause Music ⏸";
    } catch (err) {
      console.log("Play error:", err);
    }
  } else {
    music.pause();
    stopVisualizer();
    btn.textContent = "Play Music 🎵";
  }
});
