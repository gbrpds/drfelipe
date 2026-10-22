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

  // Revelar ao rolar
  var reveals = document.querySelectorAll(".reveal");
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

  // Parallax leve dos polaroids decorativos
  var decos = document.querySelectorAll(".deco[data-speed]");
  if (decos.length && !reduz) {
    var tick = false;
    var mover = function () {
      decos.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var v = parseFloat(el.dataset.speed) || 0.1;
        el.style.transform = "translateY(" + (-(r.top) * v).toFixed(1) + "px)";
      });
      tick = false;
    };
    window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(mover); } }, { passive: true });
    mover();
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
