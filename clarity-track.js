window.trackClarity = function trackClarity(type, name, data = {}) {
  if (typeof clarity !== 'function') return;

  if (type === 'event') {
    clarity('event', name);
    Object.entries(data).forEach(([key, value]) => {
      clarity('set', key, String(value));
    });
    return;
  }

  if (type === 'tag') {
    Object.entries(data).forEach(([key, value]) => {
      clarity('set', key, String(value));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page) {
    trackClarity('tag', null, { pagina_atual: page });
    trackClarity('event', `visita_${page}`);
  }
});
