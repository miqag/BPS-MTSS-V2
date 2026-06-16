const sectionLinks = Array.from(document.querySelectorAll(".section-list a"));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveSection = () => {
  const current = sections.reduce((active, section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 140 ? section : active;
  }, sections[0]);

  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
};

document.addEventListener("scroll", setActiveSection, { passive: true });
setActiveSection();

const pathwayButtons = document.querySelectorAll("[data-pathway]");
pathwayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pathwayButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".pathway-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    document.querySelector(`#${button.dataset.pathway}-pathway`).classList.add("active");
  });
});

const literacyTabs = document.querySelectorAll("[data-literacy-tab]");
literacyTabs.forEach((button) => {
  button.addEventListener("click", () => {
    literacyTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    document.querySelectorAll(".literacy-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    document.querySelector(`#panel-literacy-${button.dataset.literacyTab}`).classList.add("active");
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const cards = Array.from(document.querySelectorAll(".intervention-card"));

const applyFilter = (filter) => {
  cards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const show = filter === "all" || tags.includes(filter);
    card.classList.toggle("hidden-by-filter", !show);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFilter(button.dataset.filter);
  });
});

document.querySelector("#resetFilters").addEventListener("click", () => {
  filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  applyFilter("all");
  document.querySelector("#guideSearch").value = "";
  document.querySelectorAll("[data-search], .intervention-card").forEach((item) => {
    item.classList.remove("hidden-by-search");
  });
});

document.querySelectorAll(".details-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const open = details.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Hide planning notes" : "View planning notes";
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const open = panel.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
  });
});

const plannerText = {
  academic:
    "Review STAR and classroom data, administer targeted diagnostics as needed, identify the specific subskill, match intervention, set progress monitoring, and document in Open Architect.",
  sel:
    "Review conduct, attendance, relationship, screening, staff, family, and student data. Confirm the target SEL skill, choose a 6-8 week support, define progress monitoring, and flag under-review decisions.",
  attendance:
    "Look for patterns by day, class, transition, and student connection. Pair family communication with a school-based engagement support and set a short review window.",
  mll:
    "Review language-development data, access to Tier 1 instruction, scaffolds already provided, and family language needs before deciding whether intervention is the right match."
};

const concernType = document.querySelector("#concernType");
const plannerOutput = document.querySelector("#plannerOutput");
concernType.addEventListener("change", () => {
  plannerOutput.textContent = plannerText[concernType.value];
});

const searchableItems = Array.from(document.querySelectorAll("[data-search], .intervention-card"));
document.querySelector("#guideSearch").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  searchableItems.forEach((item) => {
    const text = `${item.textContent} ${item.dataset.search || ""} ${item.dataset.tags || ""}`.toLowerCase();
    item.classList.toggle("hidden-by-search", Boolean(query) && !text.includes(query));
  });
});
