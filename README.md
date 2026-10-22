# Site — Dr. Felipe Benthien

Site estático (HTML + CSS + JS, sem build) do Dr. Felipe Benthien, pneumologista em Jaraguá do Sul (SC).

## Estrutura

- `index.html` — home / ecossistema (sono, pulmão, sobre, "Comece em casa", blog, FAQ)
- `assets/css/site.css` — design system: hero full-bleed, marquees, polaroids, story, chat, trilha do ecossistema; cores da logo (vinho `#8A1027`, cinza `#999999`) e fontes Libre Baskerville + Inter
- `assets/js/site.js` — header, menu mobile, reveal, palavra rotativa, story, accordion, chat, parallax e formulário → WhatsApp
- `assets/img/` — logo, favicon e fotos

Próximas páginas (mantendo as URLs atuais): `/blog`, `/curso`, `/protocolo`, `/diagnostico-sono`.

## Rodar localmente

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Pendências de conteúdo

- Link de checkout do Desafio Desconexão 7 Noites (hoje aponta para o WhatsApp)
- Link de convite da Comunidade Reset do Sono no WhatsApp (hoje aponta para o WhatsApp)
- Confirmar se o RQE 4.650 é de Pneumologia ou Medicina do Sono
- Logo em vetor (SVG) e versão branca
- Endereço completo da Inter Clínicas
- Fotos: as fotos atuais do Dr. Felipe mostram o nome bordado no jaleco com grafia errada (ex.: "Felipe Baulah", "Felipe Bonit"), sinal de imagem gerada/editada por IA. Substituir por fotos originais assim que possível.
