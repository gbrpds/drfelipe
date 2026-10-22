(function () {
  var topo = document.querySelector(".topo");
  var botao = document.querySelector(".menu-botao");
  var menu = document.getElementById("menu");

  // Sombra no cabeçalho ao rolar
  function aoRolar() {
    if (topo) topo.classList.toggle("rolou", window.scrollY > 8);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // Menu mobile
  if (botao && menu) {
    botao.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Animação de entrada das seções
  var itens = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add("visivel"); });
  }

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
