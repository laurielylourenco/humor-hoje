#!/usr/bin/env node

/**
 * Simula visitantes reais no site para popular o Microsoft Clarity.
 * O Clarity só registra sessões com JavaScript — por isso usamos Playwright.
 *
 * Uso:
 *   npm install
 *   npx playwright install chromium
 *   npm run simulate:prod -- --sessions 8
 */

import { chromium } from 'playwright';

const DEFAULT_URL = 'https://laurielylourenco.github.io/humor-hoje';
const MOODS = ['Cansada', 'Animada', 'Sobrecarregada', 'Focada', 'Procrastinando', 'Tranquila', 'Engraçada', 'Inspirada'];

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_URL,
    sessions: 5,
    headless: true,
    delay: 800,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--url' && argv[i + 1]) {
      options.baseUrl = argv[i + 1].replace(/\/$/, '');
      i += 1;
    } else if (arg === '--sessions' && argv[i + 1]) {
      options.sessions = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--headed') {
      options.headless = false;
    } else if (arg === '--delay' && argv[i + 1]) {
      options.delay = Number(argv[i + 1]);
      i += 1;
    }
  }

  return options;
}

function pageUrl(baseUrl, path) {
  return `${baseUrl}/${path}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function chance(percent) {
  return Math.random() < percent / 100;
}

async function wait(page, ms, delay) {
  const jitter = Math.floor(Math.random() * delay);
  await page.waitForTimeout(ms + jitter);
}

async function clickNav(page, label, delay) {
  const link = page.locator('.nav-link', { hasText: label });
  if (await link.count()) {
    await link.first().click();
    await wait(page, 1200, delay);
    return true;
  }
  return false;
}

/** Usuário rápido: só escolhe humor e sai */
async function personaFocused(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'index.html'), { waitUntil: 'networkidle' });
  await wait(page, 1000, delay);

  const mood = pick(MOODS);
  await page.locator('.mood-card', { hasText: mood }).click();
  await wait(page, 1500, delay);
}

/** Usuário curioso: visita várias páginas */
async function personaCurious(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'index.html'), { waitUntil: 'networkidle' });
  await wait(page, 800, delay);
  await page.locator('.mood-card').first().click();
  await wait(page, 1000, delay);

  const pages = ['Explorar', 'Guia Clarity', 'Escolher humor'];
  for (const label of pages) {
    if (chance(70)) {
      await clickNav(page, label, delay);
    }
  }
}

/** Explorador: maioria vai pra sala principal, poucos acham o secreto */
async function personaExplorer(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'explorar.html'), { waitUntil: 'networkidle' });
  await wait(page, 1000, delay);

  if (chance(15)) {
    await page.locator('#secret-link').click();
    await wait(page, 1500, delay);
    return;
  }

  if (chance(25)) {
    await page.locator('a', { hasText: 'Arquivo' }).click();
    await wait(page, 1500, delay);
    return;
  }

  await page.locator('a', { hasText: 'Sala principal' }).click();
  await wait(page, 1500, delay);

  if (chance(40)) {
    await page.locator('#fake-door').click();
    await wait(page, 600, delay);
  }
}

/** Frustrado: gera rage clicks e dead clicks no laboratório */
async function personaFrustrated(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'lab.html'), { waitUntil: 'networkidle' });
  await wait(page, 1000, delay);

  await page.locator('#dead-click').click();
  await wait(page, 500, delay);
  await page.locator('#dead-click').click();
  await wait(page, 500, delay);

  const rage = page.locator('#rage-click');
  await rage.click();
  await wait(page, 200, delay);
  await rage.click();
  await wait(page, 200, delay);
  await rage.click();
  await wait(page, 800, delay);

  await page.locator('#open-modal').click();
  await wait(page, 700, delay);
  await page.locator('#modal-fake-close').click();
  await wait(page, 500, delay);
  await page.locator('#modal-fake-close').click();
  await wait(page, 500, delay);
  await page.locator('#modal-real-close').click();
  await wait(page, 800, delay);
}

/** Perdido: página de estatísticas confusa */
async function personaLost(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'estatisticas.html'), { waitUntil: 'networkidle' });
  await wait(page, 1200, delay);

  await page.locator('#periodo').selectOption({ index: Math.floor(Math.random() * 3) });
  await wait(page, 600, delay);
  await page.locator('#apply-filters').click();
  await wait(page, 800, delay);

  if (chance(60)) {
    await page.locator('#fake-export').click();
    await wait(page, 700, delay);
  }

  if (chance(30)) {
    await page.locator('#real-export').click();
    await wait(page, 700, delay);
  }
}

/** Scroll profundo no laboratório */
async function personaScroller(page, baseUrl, delay) {
  await page.goto(pageUrl(baseUrl, 'lab.html'), { waitUntil: 'networkidle' });
  await wait(page, 800, delay);

  const scrollBox = page.locator('.long-scroll');
  await scrollBox.evaluate((el) => { el.scrollTop = el.scrollHeight; });
  await wait(page, 1200, delay);

  if (chance(50)) {
    await page.locator('#scroll-cta').click();
    await wait(page, 1000, delay);
  }
}

const PERSONAS = [
  { name: 'focado', weight: 30, run: personaFocused },
  { name: 'curioso', weight: 25, run: personaCurious },
  { name: 'explorador', weight: 20, run: personaExplorer },
  { name: 'frustrado', weight: 15, run: personaFrustrated },
  { name: 'perdido', weight: 7, run: personaLost },
  { name: 'scroller', weight: 3, run: personaScroller },
];

function pickPersona() {
  const total = PERSONAS.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (const persona of PERSONAS) {
    roll -= persona.weight;
    if (roll <= 0) return persona;
  }
  return PERSONAS[0];
}

async function runSession(browser, index, options) {
  const persona = pickPersona();
  const context = await browser.newContext({
    viewport: pick([
      { width: 390, height: 844 },
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
    ]),
    locale: 'pt-BR',
    userAgent: undefined,
  });

  const page = await context.newPage();
  console.log(`[${index + 1}] Sessão "${persona.name}" iniciada`);

  try {
    await persona.run(page, options.baseUrl, options.delay);
    await wait(page, 2000, options.delay);
    console.log(`[${index + 1}] Sessão "${persona.name}" concluída`);
  } catch (error) {
    console.warn(`[${index + 1}] Erro na sessão "${persona.name}":`, error.message);
  } finally {
    await context.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log('Simulador de tráfego — Humor Hoje');
  console.log(`URL: ${options.baseUrl}`);
  console.log(`Sessões: ${options.sessions}`);
  console.log('Aguarde alguns minutos para os dados aparecerem no Clarity.\n');

  const browser = await chromium.launch({ headless: options.headless });

  try {
    for (let i = 0; i < options.sessions; i += 1) {
      await runSession(browser, i, options);
      if (i < options.sessions - 1) {
        await sleep(1500 + Math.random() * 2000);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\nPronto! Verifique o painel do Clarity em alguns minutos.');
}

main().catch((error) => {
  console.error('Falha no simulador:', error);
  process.exit(1);
});
