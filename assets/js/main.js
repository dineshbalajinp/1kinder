/* OneKinder marketing site — small, dependency-free interactions */

/* REPLACE THIS with the email address that should receive demo requests. */
const DEMO_EMAIL = "hello@onekinder.example";

(function () {
  "use strict";

  /* Footer year */
  const years = document.querySelectorAll("#year, .year");
  years.forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* Mobile navigation */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setOpen(false);
    });
  }

  /* Role tabs */
  const tabs = Array.from(document.querySelectorAll(".role-tab"));
  const panels = Array.from(document.querySelectorAll(".role-panel"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.id === tab.getAttribute("aria-controls");
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  /* FAQ: keep one answer open at a time */
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Demo request form -> prefilled email */
  const form = document.getElementById("demo-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;

      form.querySelectorAll("[required]").forEach((input) => {
        const error = input.parentElement.querySelector(".field-error");
        const value = input.value.trim();
        let message = "";

        if (!value) {
          message = "Please fill in this field.";
        } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Please enter a valid email address.";
        }

        input.classList.toggle("invalid", Boolean(message));
        if (error) error.textContent = message;
        if (message) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector(".invalid");
        if (firstError) firstError.focus();
        return;
      }

      const name = form.elements.name.value.trim();
      const school = form.elements.school.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      const subject = `OneKinder demo request — ${school}`;
      const body = [
        `Hello OneKinder team,`,
        ``,
        `I'd like to see a demo of OneKinder for my school.`,
        ``,
        `Name: ${name}`,
        `School: ${school}`,
        `Email: ${email}`,
        `Notes: ${message || "(none)"}`,
      ].join("\n");

      window.location.href = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("invalid");
        const error = input.parentElement.querySelector(".field-error");
        if (error) error.textContent = "";
      });
    });
  }

  /* Screenshot lightbox — only images explicitly marked with data-lightbox.
     Logos and other images are deliberately not included. */
  const zoomLinks = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (zoomLinks.length) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Screenshot viewer");
    overlay.innerHTML = [
      '<button class="lightbox-close" type="button" aria-label="Close screenshot viewer">&times;</button>',
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous screenshot">&#8249;</button>',
      '<figure class="lightbox-figure">',
      '<img class="lightbox-image" alt="">',
      '<figcaption class="lightbox-caption" aria-live="polite"></figcaption>',
      '</figure>',
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next screenshot">&#8250;</button>',
    ].join("");
    document.body.appendChild(overlay);

    const bigImage = overlay.querySelector(".lightbox-image");
    const caption = overlay.querySelector(".lightbox-caption");
    const closeBtn = overlay.querySelector(".lightbox-close");
    const prevBtn = overlay.querySelector(".lightbox-prev");
    const nextBtn = overlay.querySelector(".lightbox-next");
    let current = 0;
    let lastFocused = null;

    const show = (index) => {
      current = (index + zoomLinks.length) % zoomLinks.length;
      const link = zoomLinks[current];
      const thumb = link.querySelector("img");
      bigImage.src = link.getAttribute("href");
      bigImage.alt = thumb ? thumb.alt : "";
      const figure = link.closest("figure");
      const figcaption = figure ? figure.querySelector("figcaption") : null;
      if (!figcaption) {
        caption.textContent = "";
      } else {
        const title = figcaption.querySelector("strong");
        if (title) {
          const heading = title.textContent.trim();
          const detail = figcaption.textContent.replace(heading, "").trim();
          caption.textContent = detail ? `${heading} — ${detail}` : heading;
        } else {
          caption.textContent = figcaption.textContent.trim();
        }
      }
      const multiple = zoomLinks.length > 1;
      prevBtn.hidden = !multiple;
      nextBtn.hidden = !multiple;
    };

    const open = (index) => {
      lastFocused = document.activeElement;
      show(index);
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    };

    const close = () => {
      overlay.hidden = true;
      document.body.classList.remove("lightbox-open");
      bigImage.removeAttribute("src");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    zoomLinks.forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        open(index);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn.addEventListener("click", () => show(current + 1));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.classList.contains("lightbox-figure")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (overlay.hidden) return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        show(current - 1);
      } else if (event.key === "ArrowRight") {
        show(current + 1);
      } else if (event.key === "Tab") {
        const focusables = [closeBtn];
        if (!prevBtn.hidden) focusables.push(prevBtn, nextBtn);
        const position = focusables.indexOf(document.activeElement);
        if (event.shiftKey && position <= 0) {
          event.preventDefault();
          focusables[focusables.length - 1].focus();
        } else if (!event.shiftKey && position === focusables.length - 1) {
          event.preventDefault();
          focusables[0].focus();
        }
      }
    });
  }
})();
