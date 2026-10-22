#!/usr/bin/env python3
"""Gera as páginas estáticas do site a partir de src/.

Uso: python3 build.py

Cada página em src/pages/<arquivo>.html recebe o layout comum
(head, ícones, cabeçalho e rodapé) e é salva em <slug>/index.html
(ou index.html para a home). Os marcadores {{...}} são trocados aqui.
"""
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent
SRC = RAIZ / "src"

# ---------- Contatos e links ----------
WA_CLINICA = "5547992474764"
WA_PROTOCOLO = "5547991171887"
CHECKOUT_CURSO = "https://pay.kirvano.com/8bbc66dd-c444-4c95-b761-2db8615758fd"


def wa(msg, numero=WA_CLINICA):
    return f"https://wa.me/{numero}?text={quote(msg)}"


LINKS = {
    "WA": wa("Olá! Vim pelo site e gostaria de agendar uma consulta com o Dr. Felipe Benthien."),
    "WA_PSG": wa("Olá, gostaria de agendar minha polissonografia"),
    "WA_PROTOCOLO": wa("Olá, Dr. Felipe! Vim pela página do Protocolo Reset do Sono e quero entender como funciona o acompanhamento de 120 dias. Pode me enviar os detalhes?", WA_PROTOCOLO),
    # Pendentes: trocar pelos links reais de checkout do desafio e de convite da comunidade
    "WA_DESAFIO": wa("Olá! Quero participar do Desafio Desconexão 7 Noites."),
    "WA_COMUNIDADE": wa("Olá! Quero entrar na Comunidade Reset do Sono."),
    "CHECKOUT_CURSO": CHECKOUT_CURSO,
}

ARROW = '<svg width="16" height="16" class="ico-arrow" aria-hidden="true"><use href="#i-arrow"/></svg>'
ZAP = '<svg width="18" height="18" aria-hidden="true"><use href="#i-zap"/></svg>'

# ---------- Produtos (vitrine da home e "outros produtos" nas páginas) ----------
PRODUTOS = [
    {"slug": "/diagnostico-sono", "titulo": "Teste do Sono", "tag": "Gratuito", "preco": "Grátis",
     "img": "hero-identificacao-desktop.webp",
     "texto": "10 perguntas, 2 minutos. Descubra o seu Índice de Sono e o pilar que está sabotando as suas noites."},
    {"slug": "/comunidade", "titulo": "Comunidade Reset do Sono", "tag": "Gratuito", "preco": "Grátis",
     "img": "comunidade-02.webp",
     "texto": "Grupo no WhatsApp com conteúdos práticos sobre sono, ronco e hábitos, algumas vezes por semana."},
    {"slug": "/desafio-7-noites", "titulo": "Desafio Desconexão 7 Noites", "tag": "Desafio", "preco": "R$ 27",
     "img": "sleep-room.jpg",
     "texto": "Uma missão por noite, durante 7 noites, começando por tirar a tela da cama."},
    {"slug": "/curso", "titulo": "Curso Reset do Sono", "tag": "Curso online", "preco": "R$ 97",
     "img": "retrato-consultorio.webp",
     "texto": "19 aulas com o Método DERAA, incluindo um módulo sobre ronco e apneia."},
    {"slug": "/protocolo", "titulo": "Protocolo 120 Dias", "tag": "Individual", "preco": "Por candidatura",
     "img": "consulta-receita.webp",
     "texto": "Acompanhamento médico individual por quatro meses: sono e peso cuidados juntos."},
    {"slug": "/#exame", "titulo": "Consulta e Polissonografia", "tag": "Presencial", "preco": "Particular ou plano",
     "img": "consulta-paciente.webp",
     "texto": "Avaliação na Inter Clínicas e exame do sono quando indicado. Para quem tem sinais de apneia."},
]


def card_produto(p, oculto=False):
    attrs = ' aria-hidden="true" tabindex="-1"' if oculto else ""
    return (
        f'<a class="v-card prod-card" href="{p["slug"]}"{attrs}>'
        f'<img src="/assets/img/{p["img"]}" alt="" loading="lazy" width="900" height="1200">'
        f'<span class="v-veil"></span>'
        f'<span class="prod-tag">{p["tag"]}</span>'
        f'<div class="v-text"><span class="prod-preco">{p["preco"]}</span>'
        f'<h3>{p["titulo"]}</h3><p>{p["texto"]}</p>'
        f'<span class="v-link">Conhecer {ARROW}</span></div></a>'
    )


def vitrine_produtos():
    um = "".join(card_produto(p) for p in PRODUTOS)
    dois = "".join(card_produto(p, oculto=True) for p in PRODUTOS)
    return um + dois


def outros_produtos(atual):
    itens = [p for p in PRODUTOS if p["slug"] != atual]
    return "".join(
        f'<a class="outro spot" href="{p["slug"]}"><span class="etiqueta">{p["tag"]}</span>'
        f'<h3>{p["titulo"]}</h3><p>{p["texto"]}</p><span class="artigo-link">Conhecer {ARROW}</span></a>'
        for p in itens
    )


# ---------- Faixas em marquee ----------
TEMAS = ["Ronco", "Apneia do sono", "Polissonografia", "Insônia", "Sonolência diurna", "CPAP", "Placa oral",
         "Higiene do sono", "Asma", "DPOC", "Enfisema", "Tabagismo", "Vape", "Método DERAA"]


def faixa(classe, sep_attr):
    um = "".join(f'<span class="{classe}">{t}<span{sep_attr}>◆</span></span>' for t in TEMAS)
    return um * 2


PALAVRAS_1 = [("exausto", ""), ("atropelado", "it"), ("sem paciência", "outline"), ("irritado", ""),
              ("sem energia", "it"), ("esquecido", "outline"), ("sobrecarregado", "")]
PALAVRAS_2 = [("cansado", "outline"), ("sem foco", ""), ("arrastado", "it"), ("no café", "outline"),
              ("sonolento", ""), ("sem ânimo", "it"), ("destruído", "outline")]


def palavras(lista):
    um = "".join(f'<span class="palavra {c}">{t}<span class="palavra-sep">●</span></span>' for t, c in lista)
    return um * 2


DEPOIMENTOS = [
    ("O Dr. Felipe foi muito atencioso durante todo o processo. Me senti segura e bem orientada desde o agendamento até receber o laudo. Recomendo sem hesitar.", "Ana P.", "Jaraguá do Sul"),
    ("Fui com muitas dúvidas e saí com tudo bem explicado. O atendimento na Inter Clínicas foi excelente e o processo muito mais simples do que eu imaginava.", "Carlos M.", "Jaraguá do Sul"),
    ("Agendei pelo WhatsApp e foi muito rápido. O exame foi tranquilo, o laudo bem detalhado e o Dr. Felipe explicou tudo com clareza. Ótima experiência.", "Juliana S.", "Guaramirim"),
]


def depoimentos():
    def card(t, n, c, oculto=False):
        a = ' aria-hidden="true"' if oculto else ""
        return (f'<article class="t-card"{a}><p>“{t}”</p><span class="t-div"></span><div class="t-foot"><div>'
                f'<span class="t-name">{n}</span><span class="t-role">{c}</span></div>'
                f'<svg width="28" height="28" class="t-quote" aria-hidden="true"><use href="#i-aspas"/></svg></div></article>')
    visiveis = "".join(card(*d) for d in DEPOIMENTOS) * 2
    ocultos = "".join(card(*d, oculto=True) for d in DEPOIMENTOS) * 2
    return visiveis + ocultos


# ---------- Páginas ----------
PAGINAS = [
    {"src": "home.html", "path": "/", "og": "hero-consultorio.webp",
     "title": "Polissonografia em Jaraguá do Sul | Dr. Felipe Benthien",
     "desc": "Polissonografia em Jaraguá do Sul com o Dr. Felipe Benthien, pneumologista com atuação em medicina do sono. Ronco, cansaço ao acordar e pausas na respiração podem indicar apneia. CRM-SC 10.890 · RQE 4.650."},
    {"src": "diagnostico-sono.html", "path": "/diagnostico-sono", "og": "hero-identificacao-desktop.webp",
     "title": "Teste do Sono gratuito | Método DERAA · Dr. Felipe Benthien",
     "desc": "10 perguntas, 2 minutos: descubra o seu Índice de Sono e qual dos 5 pilares do Método DERAA está sabotando as suas noites. Gratuito."},
    {"src": "comunidade.html", "path": "/comunidade", "og": "comunidade-02.webp",
     "title": "Comunidade Reset do Sono | Dr. Felipe Benthien",
     "desc": "Grupo gratuito no WhatsApp com conteúdos práticos do Dr. Felipe Benthien sobre sono, ronco, apneia e hábitos."},
    {"src": "desafio-7-noites.html", "path": "/desafio-7-noites", "og": "sleep-room.jpg",
     "title": "Desafio Desconexão 7 Noites | Dr. Felipe Benthien",
     "desc": "Uma missão por noite, durante 7 noites, para tirar a tela da cama e reeducar o sono. Desafio do Método DERAA por R$ 27."},
    {"src": "curso.html", "path": "/curso", "og": "retrato-consultorio.webp",
     "title": "Curso Reset do Sono | Método DERAA · Dr. Felipe Benthien",
     "desc": "19 aulas em 5 módulos com o Método DERAA, criado pelo pneumologista Dr. Felipe Benthien. Inclui módulo sobre ronco e apneia. Acesso vitalício e garantia de 7 dias."},
    {"src": "protocolo.html", "path": "/protocolo", "og": "consulta-receita.webp",
     "title": "Protocolo Reset do Sono 120 Dias | Dr. Felipe Benthien",
     "desc": "Acompanhamento médico individual de 120 dias com o Dr. Felipe Benthien: diagnóstico, plano sob medida e condução integrada de sono, peso e energia."},
]


def ler(caminho):
    return (SRC / caminho).read_text(encoding="utf-8")


def montar(pagina):
    html = (ler("layout/head.html") + ler("layout/icons.html") + "\n" + ler("layout/header.html")
            + ler(f"pages/{pagina['src']}") + "\n" + ler("layout/footer.html"))
    trocas = {
        "{{TITLE}}": pagina["title"], "{{DESC}}": pagina["desc"], "{{PATH}}": pagina["path"],
        "{{OG_IMAGE}}": pagina["og"], "{{HEAD_EXTRA}}": pagina.get("head_extra", ""),
        "{{ARROW}}": ARROW, "{{ZAP}}": ZAP,
        "{{TOPICS}}": faixa("topic", ' class="topic-sep"'), "{{CTA_TOPICS}}": faixa("cta-item", ""),
        "{{PALAVRAS_1}}": palavras(PALAVRAS_1), "{{PALAVRAS_2}}": palavras(PALAVRAS_2),
        "{{DEPOIMENTOS}}": depoimentos(), "{{PRODUTOS}}": vitrine_produtos(),
        "{{OUTROS_PRODUTOS}}": outros_produtos(pagina["path"]),
    }
    trocas.update({"{{" + k + "}}": v for k, v in LINKS.items()})
    for k, v in trocas.items():
        html = html.replace(k, v)
    if "{{" in html:
        i = html.index("{{")
        raise SystemExit(f"Marcador sem valor em {pagina['src']}: {html[i:i + 40]}")
    destino = RAIZ / "index.html" if pagina["path"] == "/" else RAIZ / pagina["path"].strip("/") / "index.html"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(html, encoding="utf-8")
    return destino


if __name__ == "__main__":
    for p in PAGINAS:
        if (SRC / "pages" / p["src"]).exists():
            print("ok", montar(p).relative_to(RAIZ))
        else:
            print("pulada (sem fonte)", p["src"])
