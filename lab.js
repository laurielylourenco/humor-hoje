function trackLabEvent(name, extra = {}) {
  if (window.trackClarity) {
    window.trackClarity('event', name, { area: 'laboratorio', ...extra });
  }
}

// 1. Clique morto — parece botão, mas não faz nada
document.getElementById('dead-click')?.addEventListener('click', () => {
  trackLabEvent('lab_clique_morto_tentativa');
});

// 2. Rage click — precisa de 3 cliques
const rageBtn = document.getElementById('rage-click');
let rageCount = 0;
rageBtn?.addEventListener('click', () => {
  rageCount += 1;
  const status = document.getElementById('rage-status');
  if (rageCount < 3) {
    status.textContent = `Tentativa ${rageCount}/3... nada aconteceu ainda.`;
    trackLabEvent('lab_rage_click', { tentativa: rageCount });
    return;
  }
  status.textContent = 'Finalmente funcionou! (Clarity deve marcar rage click aqui)';
  rageBtn.classList.add('is-done');
  trackLabEvent('lab_rage_click_sucesso');
});

// 3. Resposta lenta — 3 segundos de espera
document.getElementById('slow-btn')?.addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const output = document.getElementById('slow-output');
  btn.disabled = true;
  output.textContent = 'Processando... aguarde 3 segundos';
  trackLabEvent('lab_resposta_lenta_inicio');

  setTimeout(() => {
    output.textContent = 'Pronto! Usuários costumam clicar de novo antes disso.';
    btn.disabled = false;
    trackLabEvent('lab_resposta_lenta_fim');
  }, 3000);
});

// 4. Botão camuflado
document.getElementById('hidden-btn')?.addEventListener('click', () => {
  document.getElementById('hidden-result').textContent = 'Você achou o botão escondido!';
  trackLabEvent('lab_botao_camuflado');
});

// 5. Modal confuso — X falso vs fechar real
const fakeClose = document.getElementById('modal-fake-close');
const realClose = document.getElementById('modal-real-close');
const openModal = document.getElementById('open-modal');
const modal = document.getElementById('confusing-modal');

openModal?.addEventListener('click', () => {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  trackLabEvent('lab_modal_aberto');
});

fakeClose?.addEventListener('click', () => {
  trackLabEvent('lab_modal_x_falso');
  document.getElementById('modal-hint').textContent =
    'Esse X não fecha. Procure o link "descartar" no rodapé do modal.';
});

realClose?.addEventListener('click', () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('modal-hint').textContent = '';
  trackLabEvent('lab_modal_fechado_correto');
});

// 6. Scroll profundo — conteúdo longo com CTA no final
const scrollMarker = document.getElementById('scroll-bottom');
if (scrollMarker) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackLabEvent('lab_scroll_fundo');
        observer.disconnect();
      }
    });
  }, { threshold: 0.6 });
  observer.observe(scrollMarker);
}

document.getElementById('scroll-cta')?.addEventListener('click', () => {
  trackLabEvent('lab_cta_fundo_clicado');
});
