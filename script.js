const music = document.getElementById("bg-music");
const btn = document.getElementById("music-control");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioContext;
let analyser;
let source;
let animationId;

canvas.width = window.innerWidth;
canvas.height = 120;

function fadeIn(audio, duration = 2000) {
  audio.volume = 0;
  audio.play();

  let step = 0.02;
  let interval = duration * step;

  let fade = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(audio.volume + step, 1);
    } else {
      clearInterval(fade);
    }
  }, interval);
}

function fadeOut(audio, duration = 500) {
  let step = 0.02;
  let interval = duration * step;

  let fade = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      clearInterval(fade);
      audio.pause();
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, interval);
}

function initVisualizer() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(music);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  }

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animate() {
    animationId = requestAnimationFrame(animate);

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

btn.addEventListener("click", async () => {
  try {
    if (music.paused) {

      // Init audio context kalau belum ada
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(music);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
      }

      // WAJIB untuk mobile
      if (audioContext.state === "suspended") {
        await audioContext.resume();  
      }

      fadeIn(music);
      initVisualizer();
      btn.textContent = "Pause Music ⏸";

    } else {
      fadeOut(music);
      btn.textContent = "Play Music 🎵";
    }
  } catch (err) {
    console.log("Error audio:", err);
  }
});
