/* Teste do Sono — Método DERAA
   Mesmas perguntas e pontuação do teste anterior do site:
   cada pilar soma até 8 pontos (2 perguntas); quanto mais pontos, pior. */
(function () {
  var raiz = document.getElementById("quiz");
  if (!raiz) return;
  var links = JSON.parse(raiz.dataset.links || "{}");

  var PILARES = {
    desconexao: { letra: "D", nome: "Desconexão",
      critico: "Sua mente não desliga na hora de dormir. Você deita e o pensamento acelera: o corpo está pronto, a cabeça não. É o gatilho que mais rouba o início do seu sono.",
      dica: "Hoje à noite, deixe o celular carregando fora do quarto e desligue as telas uma hora antes de deitar." },
    energia: { letra: "E", nome: "Energia",
      critico: "Você acorda sem combustível. O corpo não completa as fases profundas que recarregam de verdade, por isso o cansaço persiste mesmo dormindo horas.",
      dica: "Pegue 10 minutos de luz natural ao acordar e, se cochilar, no máximo 20 minutos antes das 15h." },
    rotina: { letra: "R", nome: "Rotina",
      critico: "Seus horários estão desregulando o seu relógio interno. Sem ritmo, o corpo nunca sabe a hora de soltar o sono.",
      dica: "Fixe um horário para acordar e mantenha amanhã, mesmo no fim de semana." },
    alimentacao: { letra: "A", nome: "Alimentação",
      critico: "O que e quando você come atrapalha o sono sem você perceber. Cafeína, horário e refeições pesadas sabotam a noite pela porta dos fundos.",
      dica: "Antecipe e deixe mais leve o jantar, e corte a cafeína a partir das 14h." },
    atividade: { letra: "A", nome: "Atividade",
      critico: "Seu corpo passa o dia sem gastar a energia que precisaria para pedir sono à noite. Movimento é um dos reguladores mais subestimados do sono profundo.",
      dica: "Faça 20 minutos de caminhada ao sol e encerre treinos intensos até 3 horas antes de dormir." }
  };
  var ORDEM = ["desconexao", "energia", "rotina", "alimentacao", "atividade"];

  var PERGUNTAS = [
    { id: "d1", pilar: "desconexao", t: "Você usa o celular na cama antes de dormir?", o: [["Nunca", 0], ["Às vezes", 1], ["Frequentemente", 3], ["Todo dia", 4]] },
    { id: "d2", pilar: "desconexao", t: "Quanto tempo antes de dormir você para de usar telas?", o: [["Mais de 1h", 0], ["30 a 60 min", 1], ["Menos de 30 min", 3], ["Uso até dormir", 4]] },
    { id: "e1", pilar: "energia", t: "Você acorda sentindo que não descansou, mesmo dormindo horas suficientes?", o: [["Raramente", 0], ["Às vezes", 1], ["Frequentemente", 3], ["Todo dia", 4]] },
    { id: "e2", pilar: "energia", t: "Sua energia despenca à tarde ou você sente necessidade de cochilar?", o: [["Nunca", 0], ["Raramente", 1], ["Às vezes", 2], ["Quase todo dia", 4]] },
    { id: "r1", pilar: "rotina", t: "Você dorme e acorda nos mesmos horários todos os dias?", o: [["Sempre", 0], ["Quase sempre", 1], ["Raramente", 3], ["Nunca", 4]] },
    { id: "r2", pilar: "rotina", t: "Nos fins de semana, seu horário de dormir muda mais de 1 hora?", o: [["Não muda", 0], ["Muda de 1 a 2h", 2], ["Muda mais de 2h", 4]] },
    { id: "a1", pilar: "alimentacao", t: "Você faz refeições pesadas nas últimas 2 horas antes de dormir?", o: [["Nunca", 0], ["Às vezes", 1], ["Frequentemente", 3], ["Todo dia", 4]] },
    { id: "a2", pilar: "alimentacao", t: "Você consome cafeína (café, chá preto, energético) depois das 15h?", o: [["Nunca", 0], ["Às vezes", 1], ["Frequentemente", 3], ["Todo dia", 4]] },
    { id: "f1", pilar: "atividade", t: "Você pratica atividade física regularmente?", o: [["Todo dia", 0], ["3 a 4x por semana", 1], ["1 a 2x por semana", 3], ["Raramente ou nunca", 4]] },
    { id: "f2", pilar: "atividade", t: "Quando você costuma se exercitar?", o: [["De manhã", 0], ["À tarde", 0], ["À noite", 3], ["Não pratico", 4]] }
  ];

  var FAIXAS = [
    { min: 80, nome: "Sono Restaurador", cor: "#2f7d4f", texto: "Seu sono está trabalhando a seu favor. Mas “bom” não é “à prova de recaída”: pequenos sabotadores derrubam isso rápido. Dá para blindar o que você já conquistou." },
    { min: 60, nome: "Sono Funcional", cor: "#7a8a22", texto: "Você se vira, mas não descansa de verdade. Funciona no dia a dia, mas deixa energia, foco e humor na mesa toda noite." },
    { min: 40, nome: "Sono em Alerta", cor: "#c27a0e", texto: "Seu corpo já paga a conta: as noites não restauram o que o dia gasta. Quanto mais tempo nesse padrão, mais difícil sair sozinho." },
    { min: 0, nome: "Sono em Débito", cor: "#8a1027", texto: "Faz tempo que o seu corpo opera no vermelho: dorme, mas não repara. Isso não se resolve com uma boa noite. É preciso reconstruir o sono na sequência certa, começando pelo seu maior gargalo." }
  ];

  var respostas = {}, escolhas = {}, passo = 0;
  var conteudo = raiz.querySelector(".quiz-conteudo");
  var barra = raiz.querySelector(".quiz-barra i");
  var contador = raiz.querySelector(".quiz-contador");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function progresso() {
    var total = PERGUNTAS.length;
    var feito = Math.min(passo, total);
    barra.style.width = (feito / total * 100) + "%";
    contador.textContent = passo === 0 ? "2 minutos" : passo > total ? "Resultado" : "Pergunta " + passo + " de " + total;
  }

  function inicio() {
    passo = 0; progresso();
    conteudo.innerHTML =
      '<div class="quiz-passo quiz-inicio">' +
      '<h2>10 perguntas sobre os 5 pilares que mais pesam no seu sono.</h2>' +
      '<p style="color:var(--ink-2)">No final você recebe o seu Índice de Sono, o retrato dos 5 pilares e o pilar que mais está te sabotando.</p>' +
      '<div class="quiz-pilares">' + ORDEM.map(function (k) { return '<span><b>' + PILARES[k].letra + '</b>' + PILARES[k].nome + '</span>'; }).join("") + '</div>' +
      '<button type="button" class="btn btn-accent" data-acao="comecar">Começar minha avaliação</button>' +
      '</div>';
  }

  function pergunta() {
    progresso();
    var q = PERGUNTAS[passo - 1], p = PILARES[q.pilar];
    conteudo.innerHTML =
      '<div class="quiz-passo">' +
      '<span class="quiz-pilar"><b>' + p.letra + '</b>' + p.nome + '</span>' +
      '<h2>' + esc(q.t) + '</h2>' +
      '<div class="quiz-opcoes">' + q.o.map(function (op, i) {
        var sel = escolhas[q.id] === i ? " is-sel" : "";
        return '<button type="button" class="quiz-op' + sel + '" data-op="' + i + '"><span>' + String.fromCharCode(65 + i) + '</span>' + esc(op[0]) + '</button>';
      }).join("") + '</div>' +
      (passo > 1 ? '<button type="button" class="quiz-voltar" data-acao="voltar">← Voltar</button>' : "") +
      '</div>';
    var primeira = conteudo.querySelector(".quiz-op");
    if (primeira) primeira.focus({ preventScroll: true });
  }

  function calcular() {
    var soma = {};
    ORDEM.forEach(function (k) { soma[k] = 0; });
    PERGUNTAS.forEach(function (q) { soma[q.pilar] += respostas[q.id] || 0; });
    var pilares = ORDEM.map(function (k) { return { key: k, saude: Math.round((1 - soma[k] / 8) * 100) }; });
    var total = ORDEM.reduce(function (a, k) { return a + soma[k]; }, 0);
    var indice = Math.round((1 - total / 40) * 100);
    var faixa = FAIXAS.filter(function (f) { return indice >= f.min; })[0];
    var critico = pilares.reduce(function (a, b) { return b.saude < a.saude ? b : a; });
    var apneia = (respostas.e1 || 0) >= 3 && (respostas.e2 || 0) >= 4;
    return { pilares: pilares, indice: indice, faixa: faixa, critico: critico.key, apneia: apneia };
  }

  function radar(pilares) {
    var cx = 150, cy = 150, r = 100, n = pilares.length;
    function ponto(i, k) {
      var a = Math.PI / 180 * (-90 + 360 / n * i);
      return [cx + r * k * Math.cos(a), cy + r * k * Math.sin(a)];
    }
    var grade = [0.25, 0.5, 0.75, 1].map(function (k) {
      return '<polygon points="' + pilares.map(function (_, i) { return ponto(i, k).join(","); }).join(" ") + '" fill="none" stroke="var(--line)"/>';
    }).join("");
    var eixos = pilares.map(function (_, i) { var p = ponto(i, 1); return '<line x1="150" y1="150" x2="' + p[0] + '" y2="' + p[1] + '" stroke="var(--line)"/>'; }).join("");
    var dados = pilares.map(function (p, i) { return ponto(i, Math.max(p.saude, 4) / 100).join(","); }).join(" ");
    var rotulos = pilares.map(function (p, i) {
      var q = ponto(i, 1.2);
      return '<text x="' + q[0] + '" y="' + (q[1] + 4) + '" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink-2)" font-family="var(--display)">' + PILARES[p.key].nome + '</text>';
    }).join("");
    return '<svg class="radar" viewBox="0 0 300 300" role="img" aria-label="Gráfico dos 5 pilares do seu sono">' + grade + eixos +
      '<polygon class="dados" points="' + dados + '"/>' + rotulos + '</svg>';
  }

  function resultado() {
    passo = PERGUNTAS.length + 1; progresso();
    var r = calcular(), c = PILARES[r.critico];
    var principal = r.apneia
      ? '<a class="btn btn-accent" href="' + links.consulta + '" target="_blank" rel="noopener">Agendar avaliação com o Dr. Felipe</a>'
      : r.critico === "desconexao"
        ? '<a class="btn btn-accent" href="/desafio-7-noites">Começar pelo Desafio 7 Noites</a>'
        : '<a class="btn btn-accent" href="/curso">Conhecer o Curso Reset do Sono</a>';
    var secundario = r.apneia
      ? '<a class="btn btn-ghost" href="/curso">Conhecer o Curso Reset do Sono</a>'
      : '<a class="btn btn-ghost" href="/comunidade">Entrar na comunidade gratuita</a>';
    conteudo.innerHTML =
      '<div class="quiz-passo">' +
      '<div class="res-topo"><p class="std-tag" style="margin-bottom:10px"><span class="std-dot"></span> Seu retrato do sono</p>' +
      '<div class="res-indice"><span data-alvo="' + r.indice + '">0</span><small>/100</small></div>' +
      '<span class="res-faixa" style="background:' + r.faixa.cor + '">' + r.faixa.nome + '</span>' +
      '<p class="res-desc">' + r.faixa.texto + '</p></div>' +
      '<div class="res-grid">' + radar(r.pilares) +
      '<ul class="res-pilares">' + r.pilares.map(function (p) {
        return '<li><span>' + PILARES[p.key].nome + '</span><strong>' + p.saude + '%</strong><span class="b"><i style="width:0" data-w="' + p.saude + '%"></i></span></li>';
      }).join("") + '</ul></div>' +
      '<div class="res-critico"><p class="quiz-pilar" style="margin-bottom:6px"><b>' + c.letra + '</b>Seu maior gargalo: ' + c.nome + '</p>' +
      '<p>' + c.critico + '</p><p class="res-dica">Para começar hoje: ' + c.dica + '</p></div>' +
      (r.apneia ? '<div class="res-apneia"><svg width="20" height="20" aria-hidden="true"><use href="#i-info"/></svg><span><strong>Um ponto que merece atenção:</strong> suas respostas mostram cansaço ao acordar e sonolência durante o dia com frequência. Isso pode ser mais do que hábito, como ronco ou apneia, e nenhum teste online confirma ou descarta sozinho. O ideal é uma avaliação presencial.</span></div>' : "") +
      '<div class="res-ctas">' + principal + secundario + '</div>' +
      '<p class="aviso">Este teste é educativo, avalia hábitos de sono e não faz diagnóstico.</p>' +
      '<button type="button" class="quiz-voltar" data-acao="refazer">Refazer o teste</button>' +
      '</div>';
    var alvo = conteudo.querySelector("[data-alvo]"), fim = r.indice, t0 = performance.now();
    (function anima(t) {
      var k = Math.min(1, (t - t0) / 1100);
      alvo.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(anima);
    })(t0);
    requestAnimationFrame(function () {
      conteudo.querySelectorAll("[data-w]").forEach(function (i) { i.style.width = i.dataset.w; });
    });
    raiz.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  raiz.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var acao = b.dataset.acao;
    if (acao === "comecar") { passo = 1; pergunta(); return; }
    if (acao === "voltar") { passo = Math.max(1, passo - 1); pergunta(); return; }
    if (acao === "refazer") { respostas = {}; escolhas = {}; inicio(); return; }
    if (b.dataset.op != null) {
      var q = PERGUNTAS[passo - 1], i = +b.dataset.op;
      respostas[q.id] = q.o[i][1]; escolhas[q.id] = i;
      b.classList.add("is-sel");
      setTimeout(function () {
        passo += 1;
        if (passo > PERGUNTAS.length) resultado(); else pergunta();
      }, 220);
    }
  });

  inicio();
})();
