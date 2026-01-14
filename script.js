// script.js — lida com seleção, acessibilidade e persistência
const cards = document.querySelectorAll('.mood-card');
const result = document.getElementById('result');
const STORAGE_KEY = 'humorHoje.selected';

function setSelectedCard(card){
  // limpa seleção anterior
  cards.forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });

  // aplica nova seleção
  if(card){
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');
    const emoji = card.dataset.emoji || '';
    const mood = card.dataset.mood || '';
    result.textContent = `${emoji} Você escolheu: ${mood}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({emoji, mood}));
  } else {
    result.textContent = '';
    localStorage.removeItem(STORAGE_KEY);
  }
}

// inicializa a seleção a partir do localStorage (se houver)
(function initFromStorage(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved && saved.mood){
      const card = Array.from(cards).find(c => c.dataset.mood === saved.mood);
      if(card) setSelectedCard(card);
    }
  }catch(e){ /* ignore */ }
})();

cards.forEach(card => {
  card.addEventListener('click', () => setSelectedCard(card));

  // Suporte a teclado (Enter/Space) já funciona em <button>, mas deixamos como demonstração
  card.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      card.click();
    }
  });
});

// para permitir desmarcar ao clicar de novo (opcional):
result.addEventListener('dblclick', () => setSelectedCard(null));
