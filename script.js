const header = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const tiltCard = document.querySelector('.tilt-card');

function handleScrollUI() {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 20);
  backToTop.classList.toggle('visible', scrollY > 650);
}
window.addEventListener('scroll', handleScrollUI);
handleScrollUI();

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});
navLinks.forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach(item => revealObserver.observe(item));

const sections = ['about','experience','expertise','projects','contact']
  .map(id => document.getElementById(id)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    projectCards.forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (tiltCard && window.matchMedia('(pointer: fine)').matches) {
  tiltCard.addEventListener('mousemove', event => {
    const rect = tiltCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}
