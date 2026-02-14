function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

// HEADER DARK SAAT SCROLL
window.addEventListener("scroll", function() {
  document.querySelector("header").style.background =
    window.scrollY > 50 ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.6)";
});

// SCROLL REVEAL EFFECT
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".glass").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "1s";
  observer.observe(el);
});

document.addEventListener("scroll", () => {
  document.querySelectorAll(".glass").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

const music = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");

btn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    btn.textContent = "Pause Music ⏸";
  } else {
    music.pause();
    btn.textContent = "Play Music 🎵";
  }
});

