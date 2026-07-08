const JETFORM_ORDER_PAGE = "bespoke.html";
const JETFORM_ORDER_FORM_URL = "https://form.jotform.com/LudaSolutions/OrderForm";
const JETFORM_CONTACT_FORM_URL = "";
const ORDER_TRACKER_API_URL = "";

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
    label: "Order tracker",
    href: "order-tracker.html",
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
      </div>
    </header>`;
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const buttons = document.querySelectorAll(".nav-button");

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
    closeSubmenus();
  }

  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeSubmenus();
  });

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const item = button.closest(".nav-item");
      const isOpen = item?.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(Boolean(isOpen)));
      closeSubmenus(item);
    });
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
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

function setupHeroCarousels() {
  document.querySelectorAll(".js-carousel").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = carousel.querySelector(".carousel-dots");
    if (slides.length === 0 || !(dots instanceof HTMLElement)) return;
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
  function withCurrentProduct(url) {
    const product = new URLSearchParams(window.location.search).get("product");
    if (!product) return url;

    const formUrl = new URL(url, window.location.href);
    formUrl.searchParams.set("product", product);
    return formUrl.toString();
  }

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
      frame.src = withCurrentProduct(JETFORM_ORDER_FORM_URL);
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

function setupOrderTracker() {
  const form = document.querySelector("[data-order-tracker-form]");
  const result = document.querySelector("[data-order-tracker-result]");
  if (!(form instanceof HTMLFormElement) || !(result instanceof HTMLElement)) return;

  const statusTitle = result.querySelector("[data-order-status]");
  const message = result.querySelector("[data-order-message]");
  const orderNumberLabel = result.querySelector("[data-order-number]");
  const updatedLabel = result.querySelector("[data-order-updated]");
  const steps = Array.from(result.querySelectorAll("[data-status-step]"));
  const statusOrder = ["processing", "in production", "ready to ship", "shipped", "delivered"];

  function normalizeStatus(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setResult(data) {
    const status = normalizeStatus(data.status || "processing");
    const statusIndex = statusOrder.indexOf(status);
    const found = Boolean(data.found);

    result.hidden = false;
    result.classList.toggle("is-missing", !found);

    if (statusTitle) {
      statusTitle.textContent = found ? data.status || "Processing" : "Order not found";
    }
    if (message) {
      message.textContent =
        data.message ||
        (found
          ? "Your order status is shown below."
          : "Please check the order number and email, then try again.");
    }
    if (orderNumberLabel) {
      orderNumberLabel.textContent = data.orderNumber || "-";
    }
    if (updatedLabel) {
      updatedLabel.textContent = data.updatedAt || "-";
    }

    steps.forEach((step) => {
      const stepStatus = normalizeStatus(step.getAttribute("data-status-step"));
      const stepIndex = statusOrder.indexOf(stepStatus);
      const isKnownStatus = statusIndex !== -1;
      step.classList.toggle("is-complete", found && isKnownStatus && stepIndex < statusIndex);
      step.classList.toggle("is-current", found && isKnownStatus && stepIndex === statusIndex);
    });
  }

  function requestOrderStatus(orderNumber, email) {
    return new Promise((resolve, reject) => {
      if (!ORDER_TRACKER_API_URL) {
        reject(new Error("Order tracker is not connected yet."));
        return;
      }

      const callbackName = `ludaOrderTracker_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timer = window.setTimeout(() => {
        cleanup();
        reject(new Error("The tracker took too long to respond."));
      }, 12000);

      function cleanup() {
        window.clearTimeout(timer);
        delete window[callbackName];
        script.remove();
      }

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      const url = new URL(ORDER_TRACKER_API_URL, window.location.href);
      url.searchParams.set("order", orderNumber);
      url.searchParams.set("email", email);
      url.searchParams.set("callback", callbackName);
      script.src = url.toString();
      script.onerror = () => {
        cleanup();
        reject(new Error("The tracker could not connect. Please try again later."));
      };
      document.body.appendChild(script);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    const data = new FormData(form);
    const orderNumber = String(data.get("orderNumber") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!orderNumber || !email) {
      setResult({
        found: false,
        message: "Please enter both your order number and email.",
      });
      return;
    }

    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true;
      submit.textContent = "Checking...";
    }

    try {
      const response = await requestOrderStatus(orderNumber, email);
      setResult(response);
    } catch (error) {
      setResult({
        found: false,
        orderNumber,
        message: error instanceof Error ? error.message : "The tracker is not available right now.",
      });
    } finally {
      if (submit instanceof HTMLButtonElement) {
        submit.disabled = false;
        submit.textContent = "Check status";
      }
    }
  });
}

function runSafely(name, callback) {
  try {
    callback();
  } catch (error) {
    console.error(`Luda Atelier: ${name} failed`, error);
  }
}

function initSite() {
  runSafely("header", renderHeader);
  runSafely("navigation", setupNavigation);
  runSafely("hero carousels", setupHeroCarousels);
  runSafely("hover galleries", setupHoverGalleries);
  runSafely("color strips", setupColorStrips);
  runSafely("Jotform links", setupJetFormLinks);
  runSafely("kit filters", setupKitFilters);
  runSafely("size guide", setupSizeGuide);
  runSafely("order tracker", setupOrderTracker);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
