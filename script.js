const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.desktop-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('is-open', !expanded);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const siteHeader = document.querySelector('.site-header');
const updateHeaderState = () => {
  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  }
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

const approachSection = document.querySelector('[data-approach]');

if (approachSection) {
  const approachCards = [...approachSection.querySelectorAll('[data-approach-step]')];
  const visualIndex = approachSection.querySelector('[data-visual-index]');
  const visualTitle = approachSection.querySelector('[data-visual-title]');
  const visualDescription = approachSection.querySelector('[data-visual-description]');
  const approachVisual = approachSection.querySelector('.approach-visual');
  const approachContent = {
    1: {
      title: 'Discover & Define',
      description: 'Map the workflows, systems, and data that hold the highest potential for AI leverage.',
    },
    2: {
      title: 'Design & Build',
      description: 'Connect the right data, models, and automation into a dependable working system.',
    },
    3: {
      title: 'Validate & Optimize',
      description: 'Measure quality, speed, and reliability before improving the system with confidence.',
    },
    4: {
      title: 'Collaborate & Iterate',
      description: 'Keep product, engineering, and operations aligned around the outcome that matters.',
    },
    5: {
      title: 'Launch & Scale',
      description: 'Deploy, monitor, and evolve AI systems that are ready for the real world.',
    },
  };

  const activateApproachStep = (step) => {
    const content = approachContent[step];
    if (!content) return;

    approachSection.dataset.active = String(step);
    approachSection.style.setProperty('--progress', `${((step - 1) / 4) * 100}%`);

    approachCards.forEach((card) => {
      const cardStep = Number(card.dataset.approachStep);
      card.classList.toggle('is-active', cardStep === step);
      card.classList.toggle('is-complete', cardStep < step);
      card.setAttribute('aria-pressed', String(cardStep === step));
    });

    visualIndex.textContent = `0${step} / 05`;
    visualTitle.textContent = content.title;
    visualDescription.textContent = content.description;
  };

  approachCards.forEach((card) => {
    card.addEventListener('click', () => activateApproachStep(Number(card.dataset.approachStep)));
    card.addEventListener('focus', () => activateApproachStep(Number(card.dataset.approachStep)));
  });

  const approachObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateApproachStep(Number(entry.target.dataset.approachStep));
      }
    });
  }, { rootMargin: '-34% 0px -42% 0px', threshold: 0 });

  approachCards.forEach((card) => approachObserver.observe(card));

  let pointerFrame;
  approachVisual.addEventListener('pointermove', (event) => {
    const bounds = approachVisual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      approachSection.style.setProperty('--pointer-x', `${x}%`);
      approachSection.style.setProperty('--pointer-y', `${y}%`);
    });
  });

  approachVisual.addEventListener('pointerleave', () => {
    approachSection.style.setProperty('--pointer-x', '50%');
    approachSection.style.setProperty('--pointer-y', '50%');
  });
}
