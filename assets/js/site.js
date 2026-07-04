const JETFORM_ORDER_PAGE = "bespoke.html";
const JETFORM_ORDER_FORM_URL = "";
const JETFORM_CONTACT_FORM_URL = "";

const navItems = [
  { label: "Home", href: "index.html" },
  {
    label: "All Bags",
    href: "all-bags.html",
    submenu: [
      { label: "Bag styles", href: "all-bags.html#bag-styles" },
      { label: "Ready bag kits", href: "ready-bag-kits.html" },
    ],
  },
  {
    label: "Bespoke",
    href: "bespoke.html",
  },
  {
    label: "Guide",
    href: "fabric-guide.html",
    submenu: [
      { label: "Fabric guide", href: "fabric-guide.html" },
      { label: "Size guide", href: "size-guide.html" },
      { label: "Color palette", href: "color-palette.html" },
      { label: "Order process", href: "order-process.html" },
      { label: "Delivery & Duty", href: "delivery-duty.html" },
    ],
  },
  {
    label: "About Us",
    href: "about-us.html",
    submenu: [
      { label: "Meet Owner", href: "about-us.html#meet-owner" },
      { label: "Contact Form", href: "about-us.html#contact-form" },
    ],
  },
];

function renderHeader() {
  const mount = document.querySelector("[data-header]");
  if (!mount) return;

  const current = location.pathname.split("/").pop() || "index.html";
  const nav = navItems
    .map((item) => {
      const isActive =
        current === item.href || item.submenu?.some((sub) => current === sub.href.split("#")[0]);
      if (!item.submenu) {
        return `<div class="nav-item ${isActive ? "is-current" : ""}">
          <a class="nav-link" href="${item.href}">${item.label}</a>
        </div>`;
      }
      return `<div class="nav-item ${isActive ? "is-current" : ""}">
        <button class="nav-button" type="button" aria-expanded="false">${item.label}</button>
        <div class="submenu">
          ${item.submenu.map((sub) => `<a href="${sub.href}">${sub.label}</a>`).join("")}
        </div>
      </div>`;
    })
    .join("");

  mount.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="Luda Atelier home">
          <img src="assets/images/logo-mark.png" alt="" aria-hidden="true">
          <span class="brand-text">
            <strong>Luda Atelier</strong>
            <span>by Luda Solutions</span>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" aria-label="Main navigation">${nav}</nav>
        <a class="cart-link" href="${JETFORM_ORDER_PAGE}" aria-label="Open order form">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M6.5 8.5h11l-1 10h-9l-1-10Z"></path>
            <path d="M9 8.5a3 3 0 0 1 6 0"></path>
          </svg>
        </a>
      </div>
    </header>`;
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const buttons = document.querySelectorAll(".nav-button");
  const header = document.querySelector(".site-header");

  function closeSubmenus(except = null) {
    document.querySelectorAll(".nav-item.is-open").forEach((item) => {
      if (item === except) return;
      item.classList.remove("is-open");
      item.querySelector(".nav-button")?.setAttribute("aria-expanded", "false");
    });
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    header?.classList.remove("is-hidden");
    closeSubmenus();
  }

  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    header?.classList.remove("is-hidden");
    if (!open) closeSubmenus();
  });

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const item = button.closest(".nav-item");
      const isOpen = item?.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(Boolean(isOpen)));
      header?.classList.remove("is-hidden");
      closeSubmenus(item);
    });
  });

  document.querySelectorAll(".main-nav a, .cart-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".nav-item") || target.closest(".nav-toggle")) return;
    if (document.body.classList.contains("menu-open")) {
      closeMenu();
      return;
    }
    closeSubmenus();
  });
}

function setupMobileHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const mobileQuery = window.matchMedia("(max-width: 1040px)");
  let lastScroll = window.scrollY;
  let ticking = false;

  function revealHeader() {
    header.classList.remove("is-hidden");
  }

  function updateHeader() {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;

    if (!mobileQuery.matches || document.body.classList.contains("menu-open") || currentScroll < 86) {
      revealHeader();
    } else if (delta > 8) {
      header.classList.add("is-hidden");
    } else if (delta < -8) {
      revealHeader();
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    },
    { passive: true }
  );

  const resetHeader = () => {
    revealHeader();
    lastScroll = window.scrollY;
  };

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", resetHeader);
  } else {
    mobileQuery.addListener(resetHeader);
  }
}

function setupHeroCarousels() {
  document.querySelectorAll(".js-carousel").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = carousel.querySelector(".carousel-dots");
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      timer = window.setInterval(() => show(index + 1), 5200);
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      start();
    }

    dots.innerHTML = slides
      .map((_, slideIndex) => `<button type="button" aria-label="Show slide ${slideIndex + 1}"></button>`)
      .join("");

    carousel.querySelector(".prev")?.addEventListener("click", () => {
      show(index - 1);
      restart();
    });

    carousel.querySelector(".next")?.addEventListener("click", () => {
      show(index + 1);
      restart();
    });

    dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        show(dotIndex);
        restart();
      });
    });

    show(0);
    start();
  });
}

function setupHoverGalleries() {
  document.querySelectorAll(".js-hover-gallery").forEach((card) => {
    const image = card.querySelector(".js-gallery-image");
    const gallery = card.getAttribute("data-gallery")?.split("|").filter(Boolean) || [];
    if (!(image instanceof HTMLImageElement) || gallery.length < 2) return;

    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + gallery.length) % gallery.length;
      image.src = gallery[index];
    }

    function start() {
      timer = window.setInterval(() => show(index + 1), 1050);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    card.addEventListener("mouseenter", start);
    card.addEventListener("mouseleave", () => {
      stop();
      show(0);
    });

    card.querySelector(".gallery-prev")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      stop();
      show(index - 1);
    });

    card.querySelector(".gallery-next")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      stop();
      show(index + 1);
    });
  });
}

function setupColorStrips() {
  document.querySelectorAll(".js-color-strip").forEach((wrap) => {
    const strip = wrap.querySelector(".color-strip");
    const prev = wrap.querySelector(".strip-prev");
    const next = wrap.querySelector(".strip-next");
    if (!(strip instanceof HTMLElement)) return;

    prev?.addEventListener("click", () => {
      strip.scrollBy({ left: -strip.clientWidth * 0.82, behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      strip.scrollBy({ left: strip.clientWidth * 0.82, behavior: "smooth" });
    });
  });
}

function setupJetFormLinks() {
  document.querySelectorAll("[data-jetform-order]").forEach((link) => {
    const product = link.getAttribute("data-product");
    const suffix = product ? `?product=${encodeURIComponent(product)}` : "";
    link.setAttribute("href", `${JETFORM_ORDER_PAGE}${suffix}`);
  });

  document.querySelectorAll("[data-jetform-contact]").forEach((link) => {
    link.setAttribute("href", "about-us.html#contact-form");
  });

  document.querySelectorAll("[data-jetform-order-frame]").forEach((frame) => {
    if (frame instanceof HTMLIFrameElement && JETFORM_ORDER_FORM_URL) {
      frame.src = JETFORM_ORDER_FORM_URL;
      frame.hidden = false;
      document.querySelectorAll("[data-jetform-order-placeholder]").forEach((placeholder) => {
        placeholder.hidden = true;
      });
    }
  });

  document.querySelectorAll("[data-jetform-contact-frame]").forEach((frame) => {
    if (frame instanceof HTMLIFrameElement && JETFORM_CONTACT_FORM_URL) {
      frame.src = JETFORM_CONTACT_FORM_URL;
      frame.hidden = false;
      document.querySelectorAll("[data-jetform-contact-placeholder]").forEach((placeholder) => {
        placeholder.hidden = true;
      });
    }
  });
}

function setupKitFilters() {
  const grid = document.querySelector("[data-kit-grid]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-categories]"));
  const buttons = Array.from(document.querySelectorAll("[data-kit-filter]"));
  const showMore = document.querySelector("[data-kit-show-more]");
  const nextPage = document.querySelector("[data-kit-next-page]");
  const countLabel = document.querySelector("[data-kit-count]");
  const pageSize = 8;
  let active = "all";
  let mode = "more";
  let page = 0;
  let visibleCount = pageSize;

  function matchingCards() {
    return cards.filter((card) => {
      const categories = card.getAttribute("data-categories")?.split(" ") || [];
      return active === "all" || categories.includes(active);
    });
  }

  function render() {
    const matches = matchingCards();
    cards.forEach((card) => {
      const matchIndex = matches.indexOf(card);
      const isMatch = matchIndex !== -1;
      const isVisible =
        mode === "page"
          ? matchIndex >= page * pageSize && matchIndex < (page + 1) * pageSize
          : matchIndex < visibleCount;
      card.hidden = !isMatch || !isVisible;
    });

    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-kit-filter") === active);
    });

    const shownCount =
      mode === "page"
        ? Math.max(0, Math.min(pageSize, matches.length - page * pageSize))
        : Math.min(visibleCount, matches.length);
    const hasMore = mode !== "page" && visibleCount < matches.length;
    const hasNextPage = (page + 1) * pageSize < matches.length;
    if (showMore instanceof HTMLButtonElement) {
      showMore.disabled = !hasMore;
      showMore.textContent = hasMore ? "View more" : "All visible";
    }
    if (nextPage instanceof HTMLButtonElement) {
      nextPage.disabled = !hasNextPage;
    }
    if (countLabel) {
      countLabel.textContent =
        mode === "page"
          ? `Showing page ${page + 1}: ${shownCount} of ${matches.length} kits`
          : `Showing ${shownCount} of ${matches.length} kits`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = button.getAttribute("data-kit-filter") || "all";
      mode = "more";
      page = 0;
      visibleCount = pageSize;
      render();
    });
  });

  showMore?.addEventListener("click", () => {
    mode = "more";
    visibleCount += pageSize;
    render();
  });

  nextPage?.addEventListener("click", () => {
    const matches = matchingCards();
    if ((page + 1) * pageSize >= matches.length) return;
    mode = "page";
    page += 1;
    visibleCount = pageSize;
    render();
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  render();
}

function setupSizeGuide() {
  const mainImage = document.querySelector("#size-main-image");
  const buttons = document.querySelectorAll("[data-size-image]");
  if (!(mainImage instanceof HTMLImageElement) || buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.getAttribute("data-size-image");
      const alt = button.getAttribute("data-size-alt") || "";
      if (!image) return;
      mainImage.src = image;
      mainImage.alt = alt;
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
}

renderHeader();
setupNavigation();
setupMobileHeaderScroll();
setupHeroCarousels();
setupHoverGalleries();
setupColorStrips();
setupJetFormLinks();
setupKitFilters();
setupSizeGuide();
