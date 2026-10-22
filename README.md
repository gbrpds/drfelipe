# Site — Dr. Felipe Benthien

Site estático do Dr. Felipe Benthien, pneumologista em Jaraguá do Sul (SC).

## Páginas

| URL | Fonte | Conteúdo |
|---|---|---|
| `/` | `src/pages/home.html` | Polissonografia, sinais, especialista, vitrine de produtos, blog, FAQ |
| `/diagnostico-sono` | `src/pages/diagnostico-sono.html` | Teste do Sono (quiz DERAA, `assets/js/quiz.js`) |
| `/comunidade` | `src/pages/comunidade.html` | Comunidade Reset do Sono (WhatsApp, grátis) |
| `/desafio-7-noites` | `src/pages/desafio-7-noites.html` | Desafio Desconexão 7 Noites (R$ 27) |
| `/curso` | `src/pages/curso.html` | Curso Reset do Sono (R$ 97, checkout Kirvano) |
| `/protocolo` | `src/pages/protocolo.html` | Protocolo 120 Dias (candidatura pelo WhatsApp) |

## Como editar

1. Edite os arquivos em `src/` (layout comum em `src/layout/`, conteúdo em `src/pages/`).
2. Links, preços e a lista de produtos ficam no topo de `build.py`.
3. Rode `python3 build.py` para gerar `index.html` e as pastas de cada página.
4. Faça o commit dos arquivos de `src/` **e** dos HTML gerados.

Visualizar localmente: `python3 -m http.server 8080` e abrir http://localhost:8080.

## Design

- `assets/css/site.css`: design system (Host Grotesk, DM Sans, Instrument Serif; vinho `#8A1027`).
- `assets/js/site.js`: cabeçalho, menu, animações, marquees, story, accordion e formulário → WhatsApp.
- Fotos originais em `fotos/`; versões otimizadas em `assets/img/`.

## Pendências de conteúdo

- Link de checkout do Desafio 7 Noites (`WA_DESAFIO` em `build.py`, hoje abre o WhatsApp).
- Link de convite da Comunidade (`WA_COMUNIDADE`, hoje abre o WhatsApp).
- Missões reais de cada noite do desafio (a página mostra os temas).
- Captura de nome/e-mail no teste do sono (o site antigo gravava no Supabase).
- Confirmar o RQE 4.650 (Pneumologia ou Medicina do Sono).
- Logo em SVG.
- Fotos: o bordado do jaleco aparece com o nome errado em várias fotos (imagem gerada/editada por IA).
- Migrar os artigos do blog (`/blog` e `/blog/...`).
