/**
 * Fills a canvas with the same background the user chose in the UI (solid / gradient / transparent).
 * Used for PNG export and sticker composite export.
 */
export function paintExportBackground(
  ctx,
  width,
  height,
  { bgColorMode, bgColor, bgEffect, getEffectBackground },
) {
  if (bgColorMode === "none") {
    ctx.clearRect(0, 0, width, height);
    return;
  }
  if (bgColorMode === "solid") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (bgColorMode === "effect") {
    if (bgEffect === "none") {
      ctx.fillStyle = getEffectBackground("none");
      ctx.fillRect(0, 0, width, height);
      return;
    }
    const gradientData = getEffectBackground(bgEffect);
    const gradientMatch = gradientData.match(
      /linear-gradient\((\d+)deg,\s*([^)]+)\)/,
    );
    if (gradientMatch) {
      const angle = parseInt(gradientMatch[1], 10);
      const colorStops = gradientMatch[2].split(/,\s*(?![^()]*\))/);
      const angleRad = (angle - 90) * (Math.PI / 180);
      const x0 = width / 2 - Math.cos(angleRad) * (width / 2);
      const y0 = height / 2 - Math.sin(angleRad) * (height / 2);
      const x1 = width / 2 + Math.cos(angleRad) * (width / 2);
      const y1 = height / 2 + Math.sin(angleRad) * (height / 2);
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      colorStops.forEach((stop) => {
        const match = stop.trim().match(/([#\w]+)\s+(\d+)%/);
        if (match) {
          const color = match[1];
          const position = parseInt(match[2], 10) / 100;
          gradient.addColorStop(position, color);
        }
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return;
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
}
