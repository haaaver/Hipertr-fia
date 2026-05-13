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

const dropdown = document.querySelector(".nav-dropdown");
const dropdownTrigger = document.querySelector(".nav-dropdown-trigger");
const dropdownLinks = document.querySelectorAll(".nav-dropdown-panel a");

if (dropdown && dropdownTrigger) {
  dropdownTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    dropdownTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      dropdown.classList.remove("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
      link.blur();
    });
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdown.classList.remove("is-open");
      dropdownTrigger.setAttribute("aria-expanded", "false");
    }
  });
}
