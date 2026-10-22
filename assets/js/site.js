(function () {
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Cabeçalho: fundo sólido ao rolar + menu mobile
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector(".menu-toggle");
  function aoRolar() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 40); }
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });
  if (toggle) {
    toggle.addEventListener("click", function () {
      var abrir = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", abrir);
      toggle.setAttribute("aria-expanded", String(abrir));
      toggle.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    });
  }
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Títulos: quebra em palavras para a animação em sequência
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var n = 0;
    var quebrar = function (no) {
      [].slice.call(no.childNodes).forEach(function (filho) {
        if (filho.nodeType === 3) {
          var frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach(function (parte) {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = parte; i.style.setProperty("--wi", n++);
            w.appendChild(i); frag.appendChild(w);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1 && filho.tagName !== "BR") {
          quebrar(filho);
        }
      });
    };
    quebrar(el);
  });

  // Revelar ao rolar
  var reveals = document.querySelectorAll(".reveal, [data-split], .img-reveal, .grifo:not(.hero .grifo)");
  if ("IntersectionObserver" in window && !reduz) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Palavra que alterna no hero
  var palavra = document.querySelector("[data-rotate]");
  if (palavra && !reduz) {
    var lista = (palavra.dataset.rotate || "").split(","), i = 0;
    setInterval(function () {
      palavra.classList.add("is-out");
      setTimeout(function () {
        i = (i + 1) % lista.length;
        palavra.textContent = lista[i];
        palavra.classList.remove("is-out");
      }, 380);
    }, 2600);
  }

  // Story (slides com barras de progresso)
  var story = document.querySelector("[data-story]");
  if (story) {
    var slides = [].slice.call(story.querySelectorAll(".story-slide"));
    var barras = [].slice.call(story.querySelectorAll(".story-bars span"));
    var atual = 0;
    var mostrar = function (n) {
      slides.forEach(function (s, k) { s.classList.toggle("is-on", k === n); });
      barras.forEach(function (b, k) {
        b.classList.toggle("is-done", k < n);
        b.classList.remove("is-active");
        if (k === n) { void b.offsetWidth; b.classList.add("is-active"); }
      });
    };
    mostrar(0);
    if (!reduz) setInterval(function () { atual = (atual + 1) % slides.length; mostrar(atual); }, 4200);
  }

  // Slides da seção de diferenciais
  var difSlides = document.querySelectorAll("[data-dif-slides] .dif-slide");
  if (difSlides.length > 1 && !reduz) {
    var d = 0;
    setInterval(function () {
      difSlides[d].classList.remove("is-on");
      d = (d + 1) % difSlides.length;
      difSlides[d].classList.add("is-on");
    }, 3800);
  }

  // Accordion (um aberto por vez)
  var itens = document.querySelectorAll("[data-acc] .dif-item");
  itens.forEach(function (item) {
    var b = item.querySelector("button");
    if (!b) return;
    b.addEventListener("click", function () {
      itens.forEach(function (outro) {
        var aberto = outro === item;
        outro.classList.toggle("is-open", aberto);
        var bt = outro.querySelector("button");
        if (bt) bt.setAttribute("aria-expanded", String(aberto));
      });
    });
  });

  // Chat: mensagens entram ao rolar, resposta "digitando"
  var msgs = document.querySelectorAll("[data-msg]");
  if ("IntersectionObserver" in window) {
    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var m = e.target;
        m.classList.add("is-in");
        if (m.hasAttribute("data-typing")) setTimeout(function () { m.classList.add("is-typed"); }, reduz ? 0 : 1100);
        mo.unobserve(m);
      });
    }, { threshold: 0.6 });
    msgs.forEach(function (m) { mo.observe(m); });
  } else {
    msgs.forEach(function (m) { m.classList.add("is-in", "is-typed"); });
  }

  // Barra de progresso de leitura
  var barra = document.querySelector(".progress");
  if (barra) {
    var atualizar = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
    };
    window.addEventListener("scroll", atualizar, { passive: true });
    atualizar();
  }

  // Contadores
  var contadores = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, fim = parseFloat(el.dataset.count), ini = performance.now(), dur = 1600;
        if (reduz) { el.textContent = fim; co.unobserve(el); return; }
        var passo = function (t) {
          var k = Math.min(1, (t - ini) / dur), ease = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(fim * ease);
          if (k < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    contadores.forEach(function (el) { co.observe(el); });
  }

  // Luz que segue o cursor nos cards
  document.querySelectorAll(".spot").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Parallax da foto do hero
  var heroFoto = document.querySelector(".hero-photo");
  if (heroFoto && !reduz) {
    var tk = false;
    window.addEventListener("scroll", function () {
      if (tk) return; tk = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        heroFoto.style.translate = "0 " + (y * 0.25).toFixed(1) + "px";
        tk = false;
      });
    }, { passive: true });
  }

  // Formulário → WhatsApp
  var form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var texto = "Olá! Vim pelo site do Dr. Felipe Benthien.\n" +
        "Nome: " + f.get("nome") + "\n" +
        "O que me traz: " + f.get("motivo") + "\n" +
        "Atendimento: " + f.get("plano") + "\n" +
        "Melhor período: " + f.get("periodo") + "\n" +
        "Gostaria de agendar uma consulta.";
      window.open("https://wa.me/" + form.dataset.whatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
      var nota = form.querySelector(".form-note");
      if (nota) nota.textContent = "Abrimos o WhatsApp com a sua mensagem pronta. É só enviar.";
    });
  }
})();
