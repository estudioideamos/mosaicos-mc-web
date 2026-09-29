(() => {
  window.mcMinimumArea = 10;
  window.mcValidQuoteArea = value => Number.isFinite(Number(value)) && Number(value) >= window.mcMinimumArea;
  window.mcValidQuoteCart = items => Array.isArray(items) && items.length > 0 && items.every(item => item && window.mcValidQuoteArea(item.area));
  window.mcQuoteMinimumWarning = items => items.some(item => !window.mcValidQuoteArea(item.area)) ? '<p class="quote-minimum-warning" role="alert">El mínimo es de 10 m² por modelo. Hay una selección anterior con una cantidad menor: eliminá esa selección y agregá el modelo nuevamente con al menos 10 m².</p>' : '';

  // Materials cover the installed area; the tile cutting allowance is separate.
  window.mcQuoteMaterials = (value) => {
    const parsed = Number(value);
    const area = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    const adhesive = Math.ceil(area);
    const grout = Math.ceil(area / 5);
    return [
      { name: "Pegamento para Mosaico", quantity: adhesive + (adhesive === 1 ? " bolsa" : " bolsas") },
      { name: "Pastina Gris", quantity: grout + (grout === 1 ? " bolsa de 5 kg" : " bolsas de 5 kg") },
    ];
  };
  // Recalculate saved selections too, so old fixed quantities never reach a quote.
  const text = value => typeof value === "string" ? value.slice(0, 500) : "";
  const number = value => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
  window.mcEscapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  // Only local product images may be loaded from persisted cart data.
  window.mcQuoteImage = value => {
    if (typeof value !== "string" || !value || value.length > 2000) return "";
    try {
      const root = new URL(window.document?.querySelector(".brand")?.getAttribute("href") || "./", window.location.href);
      const local = value.replace(/^(?:\.\.?\/)+(?=assets\/img\/)/, "");
      const url = new URL(local, local.startsWith("assets/img/") ? root : window.location.href);
      if (url.origin !== new URL(window.location.href).origin || url.username || url.password ||
          !/\/assets\/img\/[^?#]+\.(?:webp|png|jpe?g|avif)$/i.test(url.pathname)) return "";
      return url.href;
    } catch { return ""; }
  };
  window.mcNormalizeQuoteItem = item => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const clean = {};
    for (const key of ["id", "lineSlug", "productSlug", "lineName", "productName", "variantName"]) clean[key] = text(item[key]);
    for (const key of ["area", "waste", "totalArea", "units", "unitsPerM2"]) clean[key] = number(item[key]);
    clean.image = window.mcQuoteImage(item.image);
    clean.includeExtras = item.includeExtras === true;
    clean.extras = clean.includeExtras ? window.mcQuoteMaterials(clean.area) : [];
    return clean;
  };
  window.mcNormalizeQuoteCart = items => Array.isArray(items)
    ? items.slice(0, 200).map(window.mcNormalizeQuoteItem).filter(item => item && item.id && item.productName) : [];
  // Keep the current page usable when browser storage is denied or full.
  const pending = new Map();
  window.mcReadQuoteStorage = (key, fallback) => {
    if (pending.has(key)) return pending.get(key);
    try {
      const raw = window.localStorage.getItem(key);
      return raw && raw.length <= 1000000 ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  };
  window.mcWriteQuoteStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      pending.delete(key);
    } catch { pending.set(key, value); }
  };
})();
