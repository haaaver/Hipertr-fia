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
const fatThemeTargets = document.querySelectorAll(".fat-nav, .fat-loss-zone");

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

fatThemeTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => document.body.classList.add("fat-theme"));
  target.addEventListener("mouseleave", () => document.body.classList.remove("fat-theme"));
  target.addEventListener("focusin", () => document.body.classList.add("fat-theme"));
  target.addEventListener("focusout", () => document.body.classList.remove("fat-theme"));
});
