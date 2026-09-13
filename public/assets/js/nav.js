const LABELS = {
  quick: "A. Quick math for business and everyday life",
  stakeholder:
    "B. Business and entrepreneurship stakeholder discussion and planning math",
};

export function initNav() {
  const nav = document.querySelector(".site-nav");
  const sentinel = document.querySelector(".site-nav__sentinel");
  if (!nav) return;
  const caption = nav.querySelector(".site-nav__caption");
  const text = nav.querySelector(".site-nav__caption-text");
  const active = nav.querySelector("a.is-current")?.dataset.track ?? null;
  let hovered = null;

  const show = () => {
    const id = hovered ?? active;
    nav.dataset.caption = id ? "true" : "false";
    if (caption) caption.dataset.visible = id ? "true" : "false";
    if (text) text.textContent = id ? LABELS[id] : "\u00A0";
  };

  nav.querySelectorAll("[data-track]").forEach((link) => {
    const id = link.dataset.track;
    link.addEventListener("mouseenter", () => {
      hovered = id;
      show();
    });
    link.addEventListener("mouseleave", () => {
      hovered = null;
      show();
    });
    link.addEventListener("focus", () => {
      hovered = id;
      show();
    });
    link.addEventListener("blur", () => {
      hovered = null;
      show();
    });
  });

  if (sentinel && typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;
        nav.classList.toggle("is-stuck", stuck);
        nav.dataset.stuck = stuck ? "true" : "false";
      },
      { threshold: [1] },
    );
    observer.observe(sentinel);
  }
}
