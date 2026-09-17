const year = document.querySelector("#current-year");
const progress = document.querySelector(".scroll-progress span");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progress) progress.style.setProperty("--scroll-progress", `${percentage}%`);
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

if (finePointer && cursorDot && cursorRing) {
  let pointerX = 0;
  let pointerY = 0;
  let ringX = 0;
  let ringY = 0;

  const moveCursor = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.left = `${pointerX}px`;
    cursorDot.style.top = `${pointerY}px`;
    document.body.style.setProperty("--mouse-x", `${pointerX}px`);
    document.body.style.setProperty("--mouse-y", `${pointerY}px`);
    document.body.classList.add("cursor-active");
  };

  const animateRing = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  };

  window.addEventListener("pointermove", moveCursor, { passive: true });
  animateRing();

  document.querySelectorAll("a, [data-tilt]").forEach((element) => {
    element.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    element.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });
}

if (finePointer) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 5}deg`);
      card.style.setProperty("--tilt-y", `${y * -5}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}
