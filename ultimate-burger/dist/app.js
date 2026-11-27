const burger = document.querySelector('#burger');
const particles = document.querySelector('#particles');
const toggle = document.querySelector('#toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const duration = 15000;
const ingredients = [
  { clip: '0 0 75% 0', rest: 26, x: 160, y: -340, rotation: 24 },
  { clip: '22% 0 65% 0', rest: 21, x: -260, y: -260, rotation: -32 },
  { clip: '33% 0 53% 0', rest: 16, x: 270, y: -180, rotation: 28 },
  { clip: '44% 0 39% 0', rest: 12, x: -300, y: -110, rotation: -20 },
  { clip: '59% 0 28% 0', rest: 8, x: 280, y: 15, rotation: 35 },
  { clip: '68% 0 15% 0', rest: 4, x: -250, y: 80, rotation: -30 },
  { clip: '83% 0 0 0', rest: 0, x: 80, y: 210, rotation: 12 }
];
const animations = [];

ingredients.forEach((ingredient, index) => {
  const element = document.createElement('div');
  element.className = 'layer';
  element.style.clipPath = `inset(${ingredient.clip})`;
  const resting = `translateY(${ingredient.rest}%)`;
  element.style.transform = resting;
  burger.append(element);

  if (reducedMotion.matches) return;
  const start = 0.025 + (6 - index) * 0.065;
  const arrival = start + 0.12;
  const animation = element.animate([
    { offset: 0, transform: `translateY(calc(${ingredient.rest}% - 22vh))`, opacity: 0 },
    { offset: start, transform: `translateY(calc(${ingredient.rest}% - 22vh))`, opacity: 0, easing: 'cubic-bezier(.22,.61,.36,1)' },
    { offset: arrival, transform: resting, opacity: 1 },
    { offset: 0.75, transform: resting, opacity: 1, easing: 'cubic-bezier(.22,.61,.36,1)' },
    { offset: 0.91, transform: `translate(${ingredient.x}px, ${ingredient.y}px) rotate(${ingredient.rotation}deg)`, opacity: 0, easing: 'cubic-bezier(.13,.68,.24,1)' },
    { offset: 1, transform: `translate(${ingredient.x}px, ${ingredient.y}px) rotate(${ingredient.rotation}deg)`, opacity: 0 }
  ], { duration, iterations: Infinity });
  animations.push(animation);
});

if (!reducedMotion.matches) {
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('span');
    const angle = (i / 20) * Math.PI * 2;
    const distance = 130 + (i * 47 % 170);
    dot.className = i % 4 === 0 ? 'particle sauce' : 'particle crumb';
    dot.style.left = `${48 + (i % 5 - 2) * 2}%`;
    dot.style.top = `${47 + (i % 7 - 3) * 2}%`;
    particles.append(dot);
    animations.push(dot.animate([
      { offset: 0, transform: 'translate(0, 0) scale(0)', opacity: 0 },
      { offset: 0.75, transform: 'translate(0, 0) scale(0)', opacity: 0 },
      { offset: 0.77, transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { offset: 0.92, transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${i * 35}deg) scale(.6)`, opacity: 0, easing: 'ease-out' },
      { offset: 1, opacity: 0 }
    ], { duration, iterations: Infinity }));
  }

  const sharedStart = document.timeline.currentTime;
  animations.forEach(animation => { animation.startTime = sharedStart; });
  let paused = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    animations.forEach(animation => paused ? animation.pause() : animation.play());
    toggle.textContent = paused ? 'Play animation' : 'Pause animation';
    toggle.setAttribute('aria-pressed', String(paused));
  });
} else {
  toggle.hidden = true;
}
