(function () {
  "use strict";

  var header = document.querySelector(".header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var navLinks = document.querySelectorAll(".nav__list a");

  if (header) {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    window.addEventListener(
      "resize",
      function () {
        document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
      },
      { passive: true }
    );
  }

  function closeMenu() {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          closeMenu();
        }
      });
    });
  }

  /* Scroll spy — link ativo */
  var sections = document.querySelectorAll("main section[id]");
  function updateActiveNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var id = section.getAttribute("id");
      if (!id) return;
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var link = document.querySelector('.nav__list a[href="#' + id + '"]');
      if (link && scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (l) {
          l.classList.remove("is-active");
        });
        link.classList.add("is-active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* Depoimentos slider */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var track = slider.querySelector("[data-track]");
    var prev = slider.querySelector("[data-prev]");
    var next = slider.querySelector("[data-next]");
    var dotsContainer = slider.querySelector("[data-dots]");
    var quotes = track ? track.querySelectorAll(".quote") : [];
    var index = 0;

    function goTo(i) {
      var n = quotes.length;
      if (n === 0) return;
      index = ((i % n) + n) % n;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll(".depo-dot");
        dots.forEach(function (d, j) {
          d.classList.toggle("is-active", j === index);
        });
      }
    }

    if (dotsContainer && quotes.length) {
      quotes.forEach(function (_, j) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "depo-dot" + (j === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Ir para depoimento " + (j + 1));
        dot.addEventListener("click", function () {
          goTo(j);
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); });

    var touchStartX = 0;
    if (track) {
      track.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      track.addEventListener(
        "touchend",
        function (e) {
          var dx = e.changedTouches[0].screenX - touchStartX;
          if (Math.abs(dx) > 50) {
            goTo(dx < 0 ? index + 1 : index - 1);
          }
        },
        { passive: true }
      );
    }
  }

  /* Formulário — demo local */
  var form = document.getElementById("form-contato");
  var feedback = document.querySelector("[data-feedback]");
  if (form && feedback) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      feedback.textContent = "";
      feedback.classList.remove("is-ok", "is-err");

      var nome = form.nome.value.trim();
      var email = form.email.value.trim();
      var mensagem = form.mensagem.value.trim();

      if (!nome || !email || !mensagem) {
        feedback.textContent = "Preencha todos os campos.";
        feedback.classList.add("is-err");
        return;
      }

      feedback.textContent = "Obrigada! Em um site real, esta mensagem seria enviada ao seu e-mail ou CRM.";
      feedback.classList.add("is-ok");
      form.reset();
    });
  }

  /* Ano no footer */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".section__inner, .hero, .page-hero__inner");
  revealEls.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
