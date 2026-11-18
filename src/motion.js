const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let pending = false;
const projectCards = [...document.querySelectorAll('.project')];
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  projectCards.forEach(card => {
    if (motionPreference.matches) {
      card.style.removeProperty('--spotlight');
      card.style.removeProperty('--scroll-lift');
      return;
    }
    const rect = card.getBoundingClientRect();
    // Follow reading order across the row, then naturally down the mobile stack.
    const focalLine = innerHeight * (.58 - .18 * projectCards.indexOf(card));
    const distance = Math.abs(rect.top + rect.height * .4 - focalLine);
    const focus = Math.max(0, 1 - distance / (innerHeight * .6));
    card.style.setProperty('--spotlight', focus.toFixed(3));
    card.style.setProperty('--scroll-lift', `${(-10 * focus).toFixed(2)}px`);
  });
  pending = false;
}
window.addEventListener('scroll', () => {
  if (!pending) { pending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
motionPreference.addEventListener('change', updateProgress);
updateProgress();
document.documentElement.classList.add('motion-ready');
document.querySelectorAll('.project').forEach(card => {
  let frame;
  card.addEventListener('pointermove', event => {
    if (motionPreference.matches || !finePointer.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-x', `${(y - .5) * -5}deg`);
      card.style.setProperty('--tilt-y', `${(x - .5) * 7}deg`);
      card.style.setProperty('--light-x', `${x * 100}%`);
      card.style.setProperty('--light-y', `${y * 100}%`);
    });
  });
  const reset = () => {
    cancelAnimationFrame(frame);
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };
  card.addEventListener('pointerleave', reset);
  motionPreference.addEventListener('change', reset);
});
