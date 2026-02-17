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

music.setAttribute("playsinline", "");

async function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(music);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

function fadeIn() {
  music.volume = 0;
  music.play();
  let vol = 0;
  const fade = setInterval(() => {
    if (vol < 1) {
      vol += 0.05;
      music.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 100);
}

function fadeOut() {
  let vol = music.volume;
  const fade = setInterval(() => {
    if (vol > 0) {
      vol -= 0.05;
      music.volume = vol;
    } else {
      clearInterval(fade);
      music.pause();
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 100);
}

function animate() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    animationId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i] / 2;
      ctx.fillStyle = "rgba(192,192,192,0.8)";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  draw();
}

btn.addEventListener("click", async () => {
  if (music.paused) {
    await initAudio();
    fadeIn();
    animate();
    btn.textContent = "Pause Music ⏸";
  } else {
    fadeOut();
    btn.textContent = "Play Music 🎵";
  }
});
