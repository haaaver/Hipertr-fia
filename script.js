const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -70px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const dropdowns = document.querySelectorAll(".nav-dropdown");
const fatNav = document.querySelector(".fat-nav");
const fatLossZone = document.querySelector(".fat-loss-zone");
let isPointerOnFatTheme = false;

const isFatHash = () =>
  window.location.hash === "#zsiregetes" || window.location.hash.startsWith("#fat-");

const setFatTheme = (enabled) => {
  document.body.classList.toggle("fat-theme", enabled);
};

const syncFatTheme = () => {
  setFatTheme(isPointerOnFatTheme || isFatHash());
};

const closeDropdown = (dropdown) => {
  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  dropdown.classList.remove("is-open");
  trigger?.setAttribute("aria-expanded", "false");
};

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  const links = dropdown.querySelectorAll(".nav-dropdown-panel a");

  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        closeDropdown(item);
      }
    });
    const isOpen = dropdown.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (dropdown.classList.contains("fat-nav")) {
        setFatTheme(true);
      }
      closeDropdown(dropdown);
      link.blur();
    });
  });
});

document.addEventListener("click", (event) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdowns.forEach(closeDropdown);
  }
});

document.querySelectorAll(".nav-links a:not(.fat-dropdown-panel a)").forEach((link) => {
  link.addEventListener("click", () => {
    if (!link.getAttribute("href")?.startsWith("#fat-")) {
      isPointerOnFatTheme = false;
      setFatTheme(false);
    }
  });
});

[fatNav, fatLossZone].forEach((target) => {
  target?.addEventListener("mouseenter", () => {
    isPointerOnFatTheme = true;
    syncFatTheme();
  });
  target?.addEventListener("mouseleave", () => {
    isPointerOnFatTheme = false;
    syncFatTheme();
  });
});

window.addEventListener("hashchange", syncFatTheme);
syncFatTheme();
