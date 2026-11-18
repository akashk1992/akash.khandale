const hero = document.querySelector('.hero');
const wrapper = document.createElement('div');
wrapper.className = 'story-track';
hero.before(wrapper);
wrapper.append(hero);
const chapters = [
  ['01 / FROM POSSIBILITY', 'From possibility to reality.'],
  ['02 / CONNECT THE PIECES', 'The whole picture.<br><span>Built to work together.</span>', 'From the interface to the database, I connect the pieces into one thoughtful product. Software, cloud architecture, and hands-on leadership, working toward the same goal.'],
  ['03 / MAKE ROOM FOR WHAT\'S NEXT', 'A little curiosity.<br><span>New possibilities.</span>', 'Today, I am exploring AI agents and intelligent workflows, bringing a decade of product engineering experience to a new generation of software.'],
];
const panels = chapters.slice(1).map(([label, title, copy]) => {
  const panel = document.createElement('div');
  panel.className = 'story-panel';
  panel.innerHTML = `<div class="eyebrow">${label}</div><h2>${title}</h2><p>${copy}</p><a class="button" href="#work">See the products I've built</a>`;
  hero.append(panel);
  return panel;
});
const first = hero.querySelector('.hero-copy');
const allPanels = [first, ...panels];
const index = hero.querySelector('.hero-index');
const desktop = matchMedia('(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
let current = -1;
export const story = { progress: 0, chapter: 0, enabled: false };
function update() {
  story.enabled = desktop.matches;
  wrapper.classList.toggle('story-enabled', story.enabled);
  const rect = wrapper.getBoundingClientRect();
  story.progress = story.enabled ? Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight))) : 0;
  const next = story.enabled ? Math.min(2, Math.floor(story.progress * 3)) : 0;
  story.chapter = next;
  hero.dataset.chapter = String(next);
  if (next !== current) {
    allPanels.forEach((panel, i) => {
      const active = i === next;
      panel.classList.toggle('story-active', active);
      panel.inert = !active;
      panel.setAttribute('aria-hidden', String(!active));
    });
    index.textContent = chapters[next][0];
    current = next;
  }
  hero.style.setProperty('--chapter-progress', String(story.progress));
}
let queued = false;
window.addEventListener('scroll', () => {
  if (!queued) { queued = true; requestAnimationFrame(() => { update(); queued = false; }); }
}, { passive: true });
window.addEventListener('resize', update);
desktop.addEventListener('change', update);
update();
