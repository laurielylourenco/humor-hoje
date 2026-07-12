const NAV_ITEMS = [
  {
    href: 'index.html',
    icon: '😊',
    label: 'Escolher humor',
    hint: 'Alta visitação esperada',
    clarityPage: 'humor',
  },
  {
    href: 'explorar.html',
    icon: '🗺️',
    label: 'Explorar',
    hint: 'Rotas populares vs escondidas',
    clarityPage: 'explorar',
  },
  {
    href: 'lab.html',
    icon: '🧪',
    label: 'Laboratório UX',
    hint: 'Fricções intencionais',
    clarityPage: 'laboratorio',
  },
  {
    href: 'estatisticas.html',
    icon: '📊',
    label: 'Estatísticas',
    hint: 'Interface confusa de propósito',
    clarityPage: 'estatisticas',
  },
  {
    href: 'guia.html',
    icon: '📖',
    label: 'Guia Clarity',
    hint: 'Como interpretar os dados',
    clarityPage: 'guia',
  },
];

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
}

function renderSidebar() {
  const current = getCurrentPage();
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  nav.innerHTML = NAV_ITEMS.map((item) => {
    const active = current === item.href ? ' is-active' : '';
    return `
      <a href="${item.href}" class="nav-link${active}" data-clarity-page="${item.clarityPage}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-text">
          <span class="nav-label">${item.label}</span>
          <span class="nav-hint">${item.hint}</span>
        </span>
      </a>
    `;
  }).join('');
}

function setupMobileNav() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  overlay?.addEventListener('click', close);
  sidebar.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', close);
  });
}

function trackNavClicks() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const page = link.dataset.clarityPage;
      if (page && window.trackClarity) {
        window.trackClarity('event', 'navegacao_menu', { destino: page });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  setupMobileNav();
  trackNavClicks();
});
