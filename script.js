// ===================== CURSOR =====================
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});

(function anim() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(anim);
})();

document.querySelectorAll('a, button, .star, .pcard, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hov'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
});

// ===================== NAVBAR SCROLL =====================
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
});

// ===================== TYPING EFFECT =====================
const words = ['Developer.', 'Designer.', 'Creator.'];
let wi = 0, ci = 0, del = false;
const tel = document.getElementById('typed');

function type() {
  const w = words[wi];
  if (!del) {
    tel.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 1500); return; }
  } else {
    tel.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, del ? 60 : 100);
}
setTimeout(type, 1200);

// ===================== SCROLL REVEAL =====================
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

// ===================== MUSIC =====================
function toggleMusic() {
  const a = document.getElementById('bgAudio');
  const b = document.getElementById('mBtn');
  const l = document.getElementById('mLabel');
  if (a.paused) {
    a.play()
      .then(() => { b.classList.add('playing'); l.textContent = 'Pause'; })
      .catch(() => { l.textContent = 'No file'; });
  } else {
    a.pause();
    b.classList.remove('playing');
    l.textContent = 'Play Music';
  }
}

// ===================== STAR RATING =====================
let sel = 0;
const stars = document.querySelectorAll('.star');
stars.forEach(s => {
  s.addEventListener('mouseenter', () => {
    stars.forEach(st => st.classList.toggle('on', +st.dataset.v <= +s.dataset.v));
  });
  s.addEventListener('mouseleave', () => {
    stars.forEach(st => st.classList.toggle('on', +st.dataset.v <= sel));
  });
  s.addEventListener('click', () => {
    sel = +s.dataset.v;
    stars.forEach(st => st.classList.toggle('on', +st.dataset.v <= sel));
  });
});
document.getElementById('rBtn').addEventListener('click', () => {
  alert(sel ? `Makasih rating ${sel} bintangnya! ⭐` : 'Pilih bintang dulu ya!');
});
