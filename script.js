/*
  SAMIM AKTHAR — PORTFOLIO INTERACTIONS
  This file handles theme persistence, scroll reveal, and navigation state.
*/

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem("samim-portfolio-theme");
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("samim-portfolio-theme", theme);
    } catch (error) {
      // The selected theme still works for this visit if storage is unavailable.
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";

    if (themeToggle) {
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#111310" : "#f7f6f2");
    }
  }

  const initialTheme = getSavedTheme() || (darkModeQuery.matches ? "dark" : "light");
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index % 4, 3) * 45 + "ms";
      revealObserver.observe(item);
    });
  }

  const header = document.querySelector(".site-header");

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const navigationLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
  const navigationSections = document.querySelectorAll("#social, #projects, #skills, #ai-tools");

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach(function (link) {
            const matchesSection = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", matchesSection);
            if (matchesSection) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    navigationSections.forEach(function (section) {
      navigationObserver.observe(section);
    });
  }
})();
