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
const fatLossZone = document.querySelector(".fat-loss-zone");
const muscleZone = document.querySelector(".muscle-zone");
const programZone = document.querySelector(".program-zone");
let isPointerOnFatTheme = false;
let isPointerOnMuscleTheme = false;
let isPointerOnProgramTheme = false;
let activeTopicTheme = null;

const isFatHash = () =>
  window.location.hash === "#zsiregetes" || window.location.hash.startsWith("#fat-");
const isMuscleHash = () =>
  window.location.hash === "#izmok-mukodese" || window.location.hash.startsWith("#muscle-");
const isProgramHash = () => window.location.hash === "#programok";

const setPageTheme = (theme) => {
  document.body.classList.toggle("fat-theme", theme === "fat");
  document.body.classList.toggle("muscle-theme", theme === "muscle");
  document.body.classList.toggle("program-theme", theme === "program");
};

const syncPageTheme = () => {
  if (activeTopicTheme) {
    setPageTheme(activeTopicTheme);
    return;
  }
  if (isPointerOnProgramTheme || isProgramHash()) {
    setPageTheme("program");
    return;
  }
  if (isPointerOnMuscleTheme || isMuscleHash()) {
    setPageTheme("muscle");
    return;
  }
  if (isPointerOnFatTheme || isFatHash()) {
    setPageTheme("fat");
    return;
  }
  setPageTheme(null);
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
        setPageTheme("fat");
      }
      if (dropdown.classList.contains("muscle-nav")) {
        setPageTheme("muscle");
      }
      if (dropdown.classList.contains("program-nav")) {
        setPageTheme("program");
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
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#fat-") && !href.startsWith("#muscle-") && href !== "#programok") {
      isPointerOnFatTheme = false;
      isPointerOnMuscleTheme = false;
      isPointerOnProgramTheme = false;
      activeTopicTheme = null;
      setPageTheme(null);
    }
  });
});

if (fatLossZone) {
  fatLossZone.addEventListener("mouseenter", () => {
    isPointerOnFatTheme = true;
    syncPageTheme();
  });
  fatLossZone.addEventListener("mouseleave", () => {
    isPointerOnFatTheme = false;
    syncPageTheme();
  });
}

if (muscleZone) {
  muscleZone.addEventListener("mouseenter", () => {
    isPointerOnMuscleTheme = true;
    syncPageTheme();
  });
  muscleZone.addEventListener("mouseleave", () => {
    isPointerOnMuscleTheme = false;
    syncPageTheme();
  });
}

if (programZone) {
  programZone.addEventListener("mouseenter", () => {
    isPointerOnProgramTheme = true;
    syncPageTheme();
  });
  programZone.addEventListener("mouseleave", () => {
    isPointerOnProgramTheme = false;
    syncPageTheme();
  });
}

const topicTargets = document.querySelectorAll(".concept-panel, .muscle-card");

const topicObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    topicTargets.forEach((target) => target.classList.remove("current-topic"));
    visible.target.classList.add("current-topic");

    if (visible.target.closest(".fat-loss-zone")) {
      activeTopicTheme = "fat";
    } else if (visible.target.closest(".muscle-zone")) {
      activeTopicTheme = "muscle";
    } else if (visible.target.closest(".program-zone")) {
      activeTopicTheme = "program";
    } else {
      activeTopicTheme = null;
    }
    syncPageTheme();
  },
  {
    threshold: [0.28, 0.45, 0.62],
    rootMargin: "-20% 0px -34% 0px",
  }
);

topicTargets.forEach((target) => topicObserver.observe(target));

document.querySelectorAll(".muscle-card").forEach((card) => {
  card.addEventListener("toggle", () => {
    if (!card.open) {
      return;
    }
    document.querySelectorAll(".muscle-card").forEach((otherCard) => {
      if (otherCard !== card) {
        otherCard.open = false;
      }
    });
  });
});

let scrollThemeFrame = null;

const syncThemeFromViewport = () => {
  scrollThemeFrame = null;
  const focusLine = window.innerHeight * 0.42;
  const zones = [
    { element: fatLossZone, theme: "fat" },
    { element: muscleZone, theme: "muscle" },
    { element: programZone, theme: "program" },
  ];
  const activeZone = zones.find(({ element }) => {
    if (!element) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.top <= focusLine && rect.bottom >= focusLine;
  });

  activeTopicTheme = activeZone?.theme || null;
  syncPageTheme();
};

window.addEventListener("scroll", () => {
  if (!scrollThemeFrame) {
    scrollThemeFrame = window.requestAnimationFrame(syncThemeFromViewport);
  }
});

window.addEventListener("hashchange", syncPageTheme);
syncThemeFromViewport();
syncPageTheme();
