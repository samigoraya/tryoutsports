// ---- Header menu: sport categories drop-down and the phone menu button.
(function () {
  const site = document.querySelector(".site");
  if (!site) return;
  const item = site.querySelector(".nav-item.has-menu");
  const toggle = item && item.querySelector(".nav-toggle");
  const burger = site.querySelector(".nav-burger");
  const setMenu = open => { if (!item) return; item.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open)); };
  if (toggle) toggle.addEventListener("click", e => { e.stopPropagation(); setMenu(!item.classList.contains("open")); });
  if (burger) burger.addEventListener("click", () => {
    const open = !site.classList.contains("open");
    site.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", e => { if (item && !item.contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); if (toggle) toggle.focus(); } });
})();
