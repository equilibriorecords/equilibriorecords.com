/* Equilibrio Records — front-end (seguridad: sin eval, textContent, validación de rutas) */
(function () {
  "use strict";

  var GA_ID = "G-JBW856BE4Y";
  var CONSENT_KEY = "eq_consent";
  var LANG_KEY = "eq_lang";
  var ALLOWED_IMG_PREFIX = "imagen/";

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {}
  }

  function isSafeImagePath(src) {
    if (!src || typeof src !== "string") return false;
    if (src.length > 200) return false;
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src)) return false;
    if (src.indexOf("..") !== -1) return false;
    if (src.charAt(0) === "/" || src.charAt(0) === "\\") return false;
    return src.indexOf(ALLOWED_IMG_PREFIX) === 0;
  }

  /* Menú mobile */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("active");
      menuToggle.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Toggle Artists */
  var artistsToggle = document.getElementById("artistsToggle");
  var artistsPanel = document.getElementById("artistsPanel");

  if (artistsToggle && artistsPanel) {
    function toggleArtists() {
      var open = artistsPanel.classList.toggle("open");
      artistsToggle.classList.toggle("open", open);
      artistsToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    artistsToggle.addEventListener("click", toggleArtists);
    artistsToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleArtists();
      }
    });
  }

  /* Modal artistas — solo rutas locales bajo imagen/ */
  var modal = document.getElementById("artistModal");
  var modalImage = document.getElementById("modalImage");
  var modalName = document.getElementById("modalName");
  var modalClose = document.getElementById("modalClose");

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    if (modalImage) {
      modalImage.removeAttribute("src");
      modalImage.alt = "";
    }
    if (modalName) modalName.textContent = "";
  }

  document.querySelectorAll(".artist-name").forEach(function (artist) {
    artist.addEventListener("click", function () {
      var imgSrc = artist.getAttribute("data-img");
      var name = artist.getAttribute("data-name") || artist.textContent.trim();
      if (!isSafeImagePath(imgSrc) || !modal || !modalImage || !modalName) return;

      modalImage.src = imgSrc;
      modalImage.alt = name;
      modalName.textContent = name;
      modal.classList.add("active");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* Fade-in on scroll */
  if ("IntersectionObserver" in window) {
    var fadeEls = document.querySelectorAll(".fade-in");
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".fade-in").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* i18n EN / ES */
  var translations = {
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_listen: "Listen",
      nav_releases: "Releases",
      nav_sessions: "Sessions",
      nav_artists: "Artists",
      nav_contact: "Contact",
      hero_eyebrow: "INDEPENDENT ELECTRONIC MUSIC LABEL",
      hero_btn_releases: "Explore Releases",
      hero_btn_sessions: "Watch Sessions",
      about_label: "ABOUT THE LABEL",
      about_title: "Where opposites become one.",
      about_p1: "Music lives in the space between opposites.",
      about_p2:
        "Equilibrio Records is an independent electronic music label exploring Organic House, Progressive House, Deep House and Downtempo through a philosophy of balance.",
      about_p3:
        "Between light and darkness, rhythm and silence, nature and technology, emotion and movement, we create a space where artists can express their own identity.",
      about_p4:
        "More than a label, Equilibrio is a meeting point for music, energy and human connection.",
      about_p5: "Balance is not stillness. It is harmony in motion.",
      listen_label: "LISTEN",
      listen_title: "Featured Track",
      listen_intro: "Featured releases from the catalog",
      catalog_label: "CATALOG",
      catalog_title: "Latest Releases",
      sessions_label: "EQUILIBRIO SESSIONS",
      sessions_title: "Artists. Music. Identity.",
      sessions_text:
        "Exclusive DJ sessions created by artists from the international electronic music scene.",
      artists_label: "COMMUNITY",
      artists_title: "Artists",
      contact_label: "CONTACT",
      contact_title: "Let's create something meaningful.",
      contact_text: "Demos · Collaborations · Sessions · Press",
      contact_btn: "Contact Equilibrio",
      cookie_text:
        "We use essential storage for language preference. Analytics cookies (Google Analytics) are optional and help us understand visits. You can accept or decline.",
      cookie_accept: "Accept analytics",
      cookie_reject: "Essential only",
      cookie_privacy: "Privacy",
      footer_privacy: "Privacy",
      privacy_label: "PRIVACY",
      privacy_title: "Privacy policy",
      privacy_p1: "Equilibrio Records (“we”) operates this website to present our catalog, artists and sessions.",
      privacy_p2: "We do not run user accounts or contact forms on this site. The contact button opens your email client (mailto). We do not receive that message through the website.",
      privacy_p3: "Essential storage: we save your language choice (EN/ES) in localStorage on your device. This is not used to identify you.",
      privacy_p4: "Optional analytics: only if you accept, we load Google Analytics 4 (Google Ireland / Google LLC). It may use cookies or similar identifiers to measure visits. IP anonymization is enabled and advertising storage is denied by default.",
      privacy_p5: "Third-party embeds: the Listen section includes SoundCloud players. SoundCloud may set its own cookies when you play a track. External links (Beatport, YouTube, Instagram, Bandcamp) are outside our control.",
      privacy_p6: "Legal basis (GDPR): essential storage is based on our legitimate interest to display the site in your language. Analytics only run with your consent, which you can refuse. You may request access, correction or deletion by writing to equilibriorecs@gmail.com.",
      privacy_p7: "This policy may be updated. Last update: September 2026."
    },
    es: {
      nav_home: "Inicio",
      nav_about: "Nosotros",
      nav_listen: "Escuchar",
      nav_releases: "Lanzamientos",
      nav_sessions: "Sessions",
      nav_artists: "Artistas",
      nav_contact: "Contacto",
      hero_eyebrow: "SELLO INDEPENDIENTE DE MÚSICA ELECTRÓNICA",
      hero_btn_releases: "Explorar Lanzamientos",
      hero_btn_sessions: "Ver Sessions",
      about_label: "SOBRE EL SELLO",
      about_title: "Donde los opuestos se vuelven uno.",
      about_p1: "La música vive en el espacio entre los opuestos.",
      about_p2:
        "Equilibrio Records es un sello independiente de música electrónica que explora Organic House, Progressive House, Deep House y Downtempo a través de una filosofía de balance.",
      about_p3:
        "Entre la luz y la oscuridad, el ritmo y el silencio, la naturaleza y la tecnología, la emoción y el movimiento, creamos un espacio donde los artistas pueden expresar su propia identidad.",
      about_p4:
        "Más que un sello, Equilibrio es un punto de encuentro para la música, la energía y la conexión humana.",
      about_p5: "El equilibrio no es quietud. Es armonía en movimiento.",
      listen_label: "ESCUCHAR",
      listen_title: "Track Destacado",
      listen_intro: "Lanzamientos destacados del catálogo",
      catalog_label: "CATÁLOGO",
      catalog_title: "Últimos Lanzamientos",
      sessions_label: "EQUILIBRIO SESSIONS",
      sessions_title: "Artistas. Música. Identidad.",
      sessions_text:
        "Sessions exclusivas de DJ creadas por artistas de la escena electrónica internacional.",
      artists_label: "COMUNIDAD",
      artists_title: "Artistas",
      contact_label: "CONTACTO",
      contact_title: "Creemos algo con sentido.",
      contact_text: "Demos · Colaboraciones · Sessions · Prensa",
      contact_btn: "Contactar Equilibrio",
      cookie_text:
        "Usamos almacenamiento esencial para el idioma. Las cookies de analítica (Google Analytics) son opcionales y nos ayudan a entender las visitas. Puedes aceptar o rechazar.",
      cookie_accept: "Aceptar analítica",
      cookie_reject: "Solo esenciales",
      cookie_privacy: "Privacidad",
      footer_privacy: "Privacidad",
      privacy_label: "PRIVACIDAD",
      privacy_title: "Política de privacidad",
      privacy_p1: "Equilibrio Records (“nosotros”) opera este sitio para presentar el catálogo, artistas y sessions.",
      privacy_p2: "No hay cuentas de usuario ni formularios de contacto en el sitio. El botón de contacto abre tu cliente de correo (mailto). Ese mensaje no pasa por la web.",
      privacy_p3: "Almacenamiento esencial: guardamos tu idioma (EN/ES) en localStorage de tu dispositivo. No se usa para identificarte.",
      privacy_p4: "Analítica opcional: solo si aceptas, cargamos Google Analytics 4 (Google Ireland / Google LLC). Puede usar cookies o identificadores similares para medir visitas. La IP se anonimiza y el almacenamiento publicitario queda denegado por defecto.",
      privacy_p5: "Embebidos de terceros: la sección Escuchar incluye reproductores de SoundCloud. SoundCloud puede establecer sus propias cookies al reproducir un tema. Los enlaces externos (Beatport, YouTube, Instagram, Bandcamp) están fuera de nuestro control.",
      privacy_p6: "Base legal (RGPD): el almacenamiento esencial se basa en interés legítimo para mostrar el sitio en tu idioma. La analítica solo se activa con tu consentimiento, que puedes rechazar. Puedes pedir acceso, corrección o supresión en equilibriorecs@gmail.com.",
      privacy_p7: "Esta política puede actualizarse. Última actualización: septiembre 2026."
    }
  };

  function applyLanguage(lang) {
    var dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    safeStorageSet(LANG_KEY, lang);
  }

  (function initLang() {
    var lang = "en";
    var saved = safeStorageGet(LANG_KEY);
    if (saved === "es" || saved === "en") {
      lang = saved;
    } else if (
      navigator.language &&
      navigator.language.toLowerCase().indexOf("es") === 0
    ) {
      lang = "es";
    }
    applyLanguage(lang);

    var switcher = document.getElementById("langSwitch");
    if (switcher) {
      switcher.addEventListener("click", function (e) {
        var btn = e.target.closest(".lang-btn");
        if (!btn) return;
        var next = btn.getAttribute("data-lang");
        if (next === "en" || next === "es") applyLanguage(next);
      });
    }
  })();

  /* Google Analytics solo con consentimiento */
  function loadAnalytics() {
    if (window.__eqGaLoaded) return;
    window.__eqGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted"
    });
    window.gtag("config", GA_ID, { anonymize_ip: true });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    s.referrerPolicy = "strict-origin-when-cross-origin";
    document.head.appendChild(s);
  }

  function hideCookieBanner() {
    var banner = document.getElementById("cookieBanner");
    if (banner) banner.remove();
  }

  function showCookieBanner() {
    if (document.getElementById("cookieBanner")) return;
    var banner = document.createElement("div");
    banner.id = "cookieBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookies");

    var text = document.createElement("p");
    text.setAttribute("data-i18n", "cookie_text");

    var actions = document.createElement("div");
    actions.className = "cookie-actions";

    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "btn btn-primary";
    accept.setAttribute("data-i18n", "cookie_accept");

    var reject = document.createElement("button");
    reject.type = "button";
    reject.className = "btn btn-secondary";
    reject.setAttribute("data-i18n", "cookie_reject");

    var privacy = document.createElement("a");
    privacy.href = "privacidad.html";
    privacy.className = "cookie-privacy";
    privacy.setAttribute("data-i18n", "cookie_privacy");

    actions.appendChild(accept);
    actions.appendChild(reject);
    actions.appendChild(privacy);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);

    var lang = document.documentElement.lang === "es" ? "es" : "en";
    applyLanguage(lang);

    accept.addEventListener("click", function () {
      safeStorageSet(CONSENT_KEY, "granted");
      hideCookieBanner();
      loadAnalytics();
    });
    reject.addEventListener("click", function () {
      safeStorageSet(CONSENT_KEY, "denied");
      hideCookieBanner();
    });
  }

  var consent = safeStorageGet(CONSENT_KEY);
  if (consent === "granted") {
    loadAnalytics();
  } else if (consent !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showCookieBanner);
    } else {
      showCookieBanner();
    }
  }
})();

// EQUILIBRIO AI
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("aiForm");
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");
  const sendButton = document.getElementById("aiSend");

  if (!form || !input || !messages || !sendButton) return;

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "ai-message " + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "ai-message-user");

    input.value = "";
    sendButton.disabled = true;
    sendButton.textContent = "Thinking...";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      addMessage(
        data.reply || "No response received.",
        "ai-message-bot"
      );
    } catch (error) {
      console.error("Equilibrio AI error:", error);

      addMessage(
        "Sorry, Equilibrio AI is temporarily unavailable.",
        "ai-message-bot"
      );
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = "Send";
      input.focus();
    }
  });
});
