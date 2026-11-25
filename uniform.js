// Design-your-uniform enquiry form.
// Set FORM_ENDPOINT (for example a Formspree or WordPress form URL) to send enquiries from this page.
// While it is empty, the form builds the brief and shows it with a copy button and the contact page link.
const FORM_ENDPOINT = "";
const LIB = window.NAME_LIBRARY || null;
const form = document.getElementById("uform");
const sel = document.getElementById("u-sport");
if (LIB && sel) {
  for (const c of Object.values(LIB.cats)) {
    const g = document.createElement("optgroup"); g.label = c.label;
    for (const s of c.sports) { const o = document.createElement("option"); o.value = LIB.sports[s].label; o.textContent = LIB.sports[s].label; g.append(o); }
    sel.append(g);
  }
}
const done = document.getElementById("udone"), doneText = document.getElementById("udoneText"), err = document.getElementById("uerr");
form.addEventListener("submit", async e => {
  e.preventDefault();
  err.textContent = "";
  const d = Object.fromEntries(new FormData(form).entries());
  if (d.website) return; // spam trap
  const brief = [
    "Team uniform enquiry", "",
    "Name: " + d.name, "Email: " + d.email, "Phone / WhatsApp: " + (d.phone || "-"),
    "Team or club: " + d.team, "Sport: " + (d.sport || "-"), "Pieces needed: " + (d.qty || "-"),
    "Colors: " + (d.colors || "-"), "Needed by: " + (d.date || "-"), "",
    "Notes: " + (d.notes || "-")
  ].join("\n");
  if (FORM_ENDPOINT) {
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
    try {
      const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error("bad status");
    } catch (x) { err.textContent = "Sorry, the message could not be sent. Please use the Contact us page instead."; btn.disabled = false; return; }
    btn.disabled = false;
    doneText.textContent = "Thank you. We have your details and will reply with a first design idea.";
    document.getElementById("ucopy").hidden = true;
  } else {
    doneText.textContent = brief;
  }
  form.hidden = true; done.hidden = false; done.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.getElementById("ucopy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(doneText.textContent); document.getElementById("ucopy").textContent = "Copied"; } catch (x) { err.textContent = "Select the text and copy it by hand."; }
});
