(() => {
  // Materials cover the installed area; the tile cutting allowance is separate.
  window.mcQuoteMaterials = (value) => {
    const parsed = Number(value);
    const area = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    const adhesive = Math.ceil(area);
    const grout = Math.ceil(area / 5);
    return [
      { name: "Pegamento para Mosaico", quantity: adhesive + (adhesive === 1 ? " bolsa" : " bolsas") },
      { name: "Pastina Gris", quantity: grout + (grout === 1 ? " bolsa de 5 kg" : " bolsas de 5 kg") },
      { name: "Impermeabilizante", quantity: "1 bolsa" },
    ];
  };
  // Recalculate saved selections too, so old fixed quantities never reach a quote.
  window.mcNormalizeQuoteItem = (item) => ({ ...item, extras: item.includeExtras ? window.mcQuoteMaterials(item.area) : [] });
})();
