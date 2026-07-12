# Humor Hoje — Laboratório Microsoft Clarity

Projeto para aprender análise de comportamento com [Microsoft Clarity](https://clarity.microsoft.com/), com menu lateral, múltiplas páginas e cenários de fricção UX intencionais.

## Estrutura do site

| Página | Objetivo no Clarity |
|--------|---------------------|
| `index.html` | Página principal — mais visitas, eventos `humor_selecionado` |
| `explorar.html` | Mapa com rotas populares vs escondidas |
| `explorar-sala.html` | Alta visitação dentro de Explorar |
| `explorar-arquivo.html` | Visitação média |
| `explorar-secreto.html` | Baixíssima visitação (link minúsculo) |
| `lab.html` | Dead clicks, rage clicks, lentidão, modal confuso |
| `estatisticas.html` | Interface confusa de propósito |
| `guia.html` | Como interpretar os dados no painel |

## Eventos customizados

- `humor_selecionado` — humor escolhido no card
- `navegacao_menu` — clique no menu lateral
- `visita_*` — entrada em cada página
- `lab_*` — interações no laboratório de fricção
- `explorar_*` — navegação no mapa

## Como estudar

1. Publique o site (GitHub Pages) e navegue em todas as páginas
2. Peça para outras pessoas usarem sem instrução
3. No Clarity, compare **Pages**, **Heatmaps**, **Recordings**, **Dead clicks** e **Rage clicks**
4. Use o `guia.html` como referência

## Rodar localmente

Abra `index.html` no navegador ou use um servidor estático:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Simular tráfego fake (para o Clarity)

O Clarity só registra visitas com JavaScript no navegador. Use o simulador com Playwright:

```bash
npm install
npx playwright install chromium
npm run simulate:prod -- --sessions 10
```

Opções úteis:

```bash
# Site em produção (GitHub Pages)
npm run simulate:prod -- --sessions 8

# Local
npm run simulate:local -- --sessions 5

# Ver o navegador abrindo
npm run simulate:prod -- --sessions 3 --headed
```

O script simula perfis diferentes: usuário focado, curioso, explorador, frustrado (rage/dead clicks), perdido nas estatísticas e scroller.

Os dados levam alguns minutos para aparecer no painel do Clarity.

## Simular via GitHub Actions

O workflow **Simular tráfego Clarity** roda automaticamente 2x por dia (9h e 21h, horário de Brasília) com 5 sessões.

Para rodar manualmente:

1. Vá em **Actions** → **Simular tráfego Clarity**
2. Clique em **Run workflow**
3. Defina quantas sessões quer (ex.: `10`)

Arquivo: `.github/workflows/simulate-traffic.yml`
