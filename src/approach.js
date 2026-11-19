import './approach.css';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const stages = [...document.querySelectorAll('.capability')];
const approach = document.querySelector('#approach');
const track = document.createElement('div');
track.className = 'approach-track';
approach.before(track);
track.append(approach);
const pinned = matchMedia('(min-width: 651px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
const graphics = [
  `<div class="architecture-graphic"><div class="interface-window"><div class="window-bar"><i></i><i></i><i></i></div><div class="interface-layout"><div class="interface-sidebar"></div><div class="interface-content"><b></b><b></b><b></b></div></div><span>EXPERIENCE</span></div><div class="service-module">APPLICATION SERVICES</div><div class="database-module">DATA FOUNDATION</div><div class="system-connector"></div></div>`,
  `<div class="cloud-graphic"><div class="cloud-orbit orbit-one"></div><div class="cloud-orbit orbit-two"></div><div class="cloud-core">CLOUD<span>AWS / AZURE</span></div><div class="cloud-node node-one">BUILD</div><div class="cloud-node node-two">DEPLOY</div><div class="cloud-node node-three">EVOLVE</div></div>`,
  `<div class="team-graphic"><svg viewBox="0 0 400 350" aria-hidden="true"><path d="M80 70L200 175L320 70M80 280L200 175L320 280"/><circle r="6"><animateMotion dur="3s" repeatCount="indefinite" path="M80 70L200 175L320 280"/></circle></svg><div class="team-center">ONE<br>SHARED GOAL</div><div class="team-node team-one">PRODUCT</div><div class="team-node team-two">ENGINEERING</div><div class="team-node team-three">DESIGN</div><div class="team-node team-four">DELIVERY</div></div>`,
];
const descriptions = [
  'An interface, application services, and a data foundation assembled into one connected product.',
  'Build, deploy, and evolve modules connected around an AWS and Azure cloud core.',
  'Product, engineering, design, and delivery connected around one shared goal.',
];
stages.forEach((stage, i) => {
  stage.querySelector('.cap-symbol')?.remove();
  const copy = document.createElement('div');
  copy.className = 'capability-copy';
  while (stage.firstChild) copy.append(stage.firstChild);
  stage.append(copy);
  const visual = document.createElement('div');
  visual.className = 'capability-visual';
  visual.setAttribute('role', 'img');
  visual.setAttribute('aria-label', descriptions[i]);
  visual.innerHTML = graphics[i];
  visual.querySelectorAll('animateMotion').forEach(el => { if (reduced.matches) el.remove(); });
  stage.append(visual);
  stage.setAttribute('aria-labelledby', `capability-${i}`);
  stage.querySelector('h3').id = `capability-${i}`;
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('exhibit-active', entry.isIntersecting);
}), { threshold: .2 });
stages.forEach(stage => observer.observe(stage));
let pending = false;
function update() {
  track.classList.toggle('approach-pinned', pinned.matches);
  const trackRect = track.getBoundingClientRect();
  const chapterProgress = Math.max(0, Math.min(1, -trackRect.top / Math.max(1, trackRect.height - innerHeight)));
  const chapter = Math.min(2, Math.floor(chapterProgress * 3));
  stages.forEach((stage, i) => {
    const active = !pinned.matches || chapter === i;
    stage.classList.toggle('chapter-active', active);
    stage.inert = !active;
    stage.setAttribute('aria-hidden', String(!active));
    const rect = stage.getBoundingClientRect();
    const progress = reduced.matches ? .5 : pinned.matches ? Math.max(0, Math.min(1, chapterProgress * 3 - i)) : Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    stage.style.setProperty('--exhibit-scroll', progress.toFixed(3));
  });
  pending = false;
}
window.addEventListener('scroll', () => {
  if (!pending) { pending = true; requestAnimationFrame(update); }
}, { passive: true });
window.addEventListener('resize', update);
pinned.addEventListener('change', update);
reduced.addEventListener('change', () => {
  stages.forEach(stage => stage.querySelectorAll('animateMotion').forEach(el => el.remove()));
  update();
});
update();
