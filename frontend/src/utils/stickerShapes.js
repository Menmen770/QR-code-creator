/**
 * Sticker drawing - frame SURROUNDS the QR (outside it), not inside.
 * QR occupies (0,0) to (qrW, qrH). Frame extends OUTSIDE with outerPad.
 */

export const drawStickerFrame = (ctx, type, qrW, qrH, color = "#000000", options = {}) => {
  const { drawScanMe = true } = options;
  const outerPad = Math.max(28, qrW * 0.2);
  const lw = Math.max(4, qrW * 0.03);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;

  const left = -outerPad;
  const top = -outerPad;
  const right = qrW + outerPad;
  const bottom = qrH + outerPad;
  const frameW = qrW + outerPad * 2;
  const frameH = qrH + outerPad * 2;

  switch (type) {
    case "circle": {
      const r = Math.min(frameW, frameH) / 2;
      const cx = qrW / 2;
      const cy = qrH / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "rounded-square": {
      const r = Math.max(20, qrW * 0.08);
      ctx.beginPath();
      ctx.moveTo(left + r, top);
      ctx.lineTo(right - r, top);
      ctx.quadraticCurveTo(right, top, right, top + r);
      ctx.lineTo(right, bottom - r);
      ctx.quadraticCurveTo(right, bottom, right - r, bottom);
      ctx.lineTo(left + r, bottom);
      ctx.quadraticCurveTo(left, bottom, left, bottom - r);
      ctx.lineTo(left, top + r);
      ctx.quadraticCurveTo(left, top, left + r, top);
      ctx.stroke();
      break;
    }
    case "speech-bubble": {
      const r = Math.max(20, qrW * 0.08);
      ctx.beginPath();
      ctx.moveTo(left + r, top);
      ctx.lineTo(right - r, top);
      ctx.quadraticCurveTo(right, top, right, top + r);
      ctx.lineTo(right, bottom - r);
      ctx.quadraticCurveTo(right, bottom, right - r, bottom);
      ctx.lineTo(left + r, bottom);
      ctx.quadraticCurveTo(left, bottom, left, bottom - r);
      ctx.lineTo(left, top + r);
      ctx.quadraticCurveTo(left, top, left + r, top);
      ctx.stroke();
      break;
    }
    case "corner-brackets": {
      const lh = Math.min(outerPad * 0.8, Math.max(20, qrH * 0.12));
      // Top-left - at outer corner
      ctx.beginPath();
      ctx.moveTo(left, top + lh);
      ctx.lineTo(left, top);
      ctx.lineTo(left + lh, top);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(right - lh, top);
      ctx.lineTo(right, top);
      ctx.lineTo(right, top + lh);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(left, bottom - lh);
      ctx.lineTo(left, bottom);
      ctx.lineTo(left + lh, bottom);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(right - lh, bottom);
      ctx.lineTo(right, bottom);
      ctx.lineTo(right, bottom - lh);
      ctx.stroke();
      break;
    }
    case "heart": {
      const cx = qrW / 2;
      const cy = qrH / 2;
      const s = Math.min(frameW, frameH) * 0.4;
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.3);
      ctx.bezierCurveTo(cx, cy, cx - s, cy - s * 0.5, cx - s * 0.5, cy - s * 0.5);
      ctx.bezierCurveTo(cx, cy - s * 0.5, cx, cy + s * 0.2, cx, cy + s * 0.3);
      ctx.bezierCurveTo(cx, cy + s * 0.2, cx, cy - s * 0.5, cx + s * 0.5, cy - s * 0.5);
      ctx.bezierCurveTo(cx + s, cy - s * 0.5, cx, cy, cx, cy + s * 0.3);
      ctx.stroke();
      break;
    }
    case "star": {
      const cx = qrW / 2;
      const cy = qrH / 2;
      const r = Math.min(frameW, frameH) / 2;
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const rad = (i * Math.PI) / points - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.4;
        const x = cx + Math.cos(rad) * rr;
        const y = cy + Math.sin(rad) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "book": {
      // Path from reference - frame around QR (viewBox 42x61, QR at 1,9 size 40x40)
      const pathData = "M4.5 3.5a1 1 0 0 1 1-1h35a1 1 0 0 1 1 1h-37Zm0 2h37a1 1 0 0 1-1 1h-35a1 1 0 0 1-1-1ZM4 61a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h37a1 1 0 0 1 1 1H4a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h37a1 1 0 0 1 1 1v51a1 1 0 0 1-1 1H4ZM2 9a1 1 0 0 0-1 1v38a1 1 0 0 0 1 1h38a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H2Z";
      const path = new Path2D(pathData);
      const scale = Math.min(qrW / 40, qrH / 40);
      const pathW = 42 * scale;
      const pathH = 61 * scale;
      const offsetX = (qrW - pathW) / 2;
      const offsetY = (qrH - pathH) / 2;
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      ctx.fill(path, "evenodd");
      ctx.restore();
      break;
    }
    case "camera": {
      const cx = qrW / 2;
      const cy = qrH / 2;
      const lensR = Math.min(frameW, frameH) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, lensR * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "tag": {
      const r = Math.max(8, qrW * 0.03);
      const bx = left;
      const by = top;
      const bw = frameW;
      const bh = frameH;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + bw - r, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw * 0.7, by + bh);
      ctx.lineTo(bx, by + bh * 0.7);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.stroke();
      break;
    }
    case "badge": {
      const cx = qrW / 2;
      const cy = qrH / 2;
      const r = Math.min(frameW, frameH) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r - lw * 2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
};

