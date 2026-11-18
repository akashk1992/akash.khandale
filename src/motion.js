const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let pending = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  pending = false;
}
window.addEventListener('scroll', () => {
  if (!pending) { pending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
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
