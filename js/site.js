(function () {
  "use strict";

  // Korriger anker-navigasjon fra andre sider (f.eks. kontakt.html -> index.html#tillit).
  // scroll-behavior: smooth på <html> kan kollidere med layout-endringer mens
  // hero-bildet laster, og nettleserens innledende hopp til #anker treffer da
  // aldri målet. Tving et øyeblikkelig (ikke smooth) hopp etter at ALT (inkl.
  // bilder) er ferdig lastet, som eliminerer race-tilstanden.
  if (location.hash) {
    window.addEventListener("load", function () {
      var target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  var THEME_KEY = "klopp-theme";
  var ICON_MOON = '<svg class="icon" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><path d="M9.5 1.5a6.5 6.5 0 1 0 5 10.9A7 7 0 0 1 9.5 1.5Z"/></svg>';
  var ICON_SUN = '<svg class="icon" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0v-1.2A.75.75 0 0 1 8 1.5Zm0 10.9a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0v-1.2a.75.75 0 0 1 .75-.75ZM14.5 8a.75.75 0 0 1-.75.75h-1.2a.75.75 0 0 1 0-1.5h1.2A.75.75 0 0 1 14.5 8ZM3.45 8a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5h1.2A.75.75 0 0 1 3.45 8Zm8.97-4.42a.75.75 0 0 1 0 1.06l-.85.85a.75.75 0 1 1-1.06-1.06l.85-.85a.75.75 0 0 1 1.06 0ZM4.64 11.38a.75.75 0 0 1 0 1.06l-.85.85a.75.75 0 1 1-1.06-1.06l.85-.85a.75.75 0 0 1 1.06 0Zm7.78 1.91a.75.75 0 0 1-1.06 0l-.85-.85a.75.75 0 1 1 1.06-1.06l.85.85a.75.75 0 0 1 0 1.06ZM4.64 4.62a.75.75 0 0 1-1.06 0l-.85-.85a.75.75 0 1 1 1.06-1.06l.85.85a.75.75 0 0 1 0 1.06Z"/></svg>';
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    var iconWrap = themeToggle.querySelector(".theme-toggle-icon");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    function effectiveTheme() {
      var manual = document.documentElement.getAttribute("data-theme");
      if (manual === "light" || manual === "dark") return manual;
      return prefersDark.matches ? "dark" : "light";
    }

    function syncButton(animate) {
      var current = effectiveTheme();
      var isDark = current === "dark";
      var apply = function () {
        iconWrap.innerHTML = isDark ? ICON_SUN : ICON_MOON;
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
          "aria-label",
          isDark ? "Bytt til lyst utseende" : "Bytt til mørkt utseende"
        );
      };
      if (!animate) {
        apply();
        return;
      }
      iconWrap.classList.add("is-swapping");
      window.setTimeout(function () {
        apply();
        iconWrap.classList.remove("is-swapping");
      }, 120);
    }

    themeToggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      syncButton(true);
    });

    prefersDark.addEventListener("change", function () {
      if (!document.documentElement.hasAttribute("data-theme")) syncButton();
    });

    syncButton(false);
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    // .contact-band deliberately excluded: its fixed dark-navy background briefly blends toward
    // the white page behind it while .js-reveal fades opacity in, washing the section down to a
    // pale gray mid-transition and making the cyan CTA button nearly invisible for a moment.
    var revealTargets = document.querySelectorAll(".callout, .service-entry, .teaser-card, .photo-frame");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
    );
    revealTargets.forEach(function (el) {
      el.classList.add("js-reveal");
      observer.observe(el);
    });
  }
})();
