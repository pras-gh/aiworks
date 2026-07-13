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

const siteHeader = document.querySelector('.site-header');
const updateHeaderState = () => {
  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  }
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

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

const interventions = document.querySelector('[data-interventions]');

if (interventions) {
  const controls = [...interventions.querySelectorAll('[data-intervention]')];
  const exhibitNumber = interventions.querySelector('[data-exhibit-number]');
  const exhibitTitle = interventions.querySelector('[data-exhibit-title]');
  const exhibitDescription = interventions.querySelector('[data-intervention-description]');
  const interventionContent = {
    automation: {
      number: '01 / 03',
      title: 'Workflow Automation',
      description: 'Replace repetitive handoffs with AI systems that keep work moving across the tools your team already uses.',
    },
    roadmap: {
      number: '02 / 03',
      title: 'AI Roadmap',
      description: 'Find the few AI opportunities worth pursuing, then build a clear route from investment to measurable impact.',
    },
    product: {
      number: '03 / 03',
      title: 'AI Product Development',
      description: 'Turn a useful AI capability into a product experience customers understand, trust, and return to.',
    },
  };

  const activateIntervention = (intervention) => {
    const content = interventionContent[intervention];
    if (!content) return;

    interventions.dataset.active = intervention;
    exhibitNumber.textContent = content.number;
    exhibitTitle.textContent = content.title;
    exhibitDescription.textContent = content.description;

    controls.forEach((control) => {
      const isActive = control.dataset.intervention === intervention;
      control.classList.toggle('is-active', isActive);
      control.setAttribute('aria-pressed', String(isActive));
    });
  };

  controls.forEach((control) => {
    control.addEventListener('click', () => activateIntervention(control.dataset.intervention));
    control.addEventListener('focus', () => activateIntervention(control.dataset.intervention));
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  document.querySelectorAll('[data-magnetic]').forEach((element) => {
    let magneticFrame;

    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 7;

      cancelAnimationFrame(magneticFrame);
      magneticFrame = requestAnimationFrame(() => {
        element.style.setProperty('--mag-x', `${x}px`);
        element.style.setProperty('--mag-y', `${y}px`);
      });
    });

    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--mag-x', '0px');
      element.style.setProperty('--mag-y', '0px');
    });
  });
}
