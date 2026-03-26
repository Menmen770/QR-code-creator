/**
 * node-canvas בשרת לא תמיד מצליח לטעון SVG מורכבים — מרסטרים בדפדפן ל-PNG לפני POST.
 * גודל אמיתי נגזר מ־viewBox (דפדפנים לעיתים מדווחים 300×150 או 0×0 ל־SVG).
 */
const SVG_DATA_RE = /^data:image\/svg\+xml/i;

export function isSvgDataUrl(url) {
  return typeof url === "string" && SVG_DATA_RE.test(url);
}

function decodeSvgDataUrl(svgDataUrl) {
  const comma = svgDataUrl.indexOf(",");
  if (comma === -1) return "";
  const header = svgDataUrl.slice(0, comma);
  const rest = svgDataUrl.slice(comma + 1);
  if (header.includes("base64")) {
    try {
      return atob(rest.replace(/\s/g, ""));
    } catch {
      return "";
    }
  }
  try {
    return decodeURIComponent(rest);
  } catch {
    return "";
  }
}

/** מחזיר { w, h } מ־viewBox או מ־width/height על שורש ה־SVG */
function parseSvgDimensions(svgMarkup) {
  if (!svgMarkup) return null;
  const vb = svgMarkup.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (vb) {
    const nums = vb[1]
      .trim()
      .split(/[\s,]+/)
      .map((n) => parseFloat(n, 10));
    if (nums.length >= 4 && nums[2] > 0 && nums[3] > 0) {
      return { w: nums[2], h: nums[3] };
    }
  }
  const wM = svgMarkup.match(/\bwidth\s*=\s*["']([^"'%]+)/i);
  const hM = svgMarkup.match(/\bheight\s*=\s*["']([^"'%]+)/i);
  const w = wM ? parseFloat(wM[1], 10) : 0;
  const h = hM ? parseFloat(hM[1], 10) : 0;
  if (w > 0 && h > 0) return { w, h };
  return null;
}

/**
 * @param {string} svgDataUrl
 * @param {{ insetScale?: number }} [options] — פחות מ־1 מקטין את הלוגו במרכז הקנבס (שוליים שקופים)
 * @returns {Promise<string>} data:image/png;base64,...
 */
export function rasterizeSvgDataUrlToPng(svgDataUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const svgMarkup = decodeSvgDataUrl(svgDataUrl);
    const parsed = parseSvgDimensions(svgMarkup);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      void (async () => {
        try {
          if (typeof img.decode === "function") {
            await img.decode();
          }
        } catch {
          /* ignore */
        }

        let w = img.naturalWidth;
        let h = img.naturalHeight;
        const badChromeDefault = w === 300 && h === 150;

        if (parsed) {
          w = parsed.w;
          h = parsed.h;
        } else if (!w || !h || badChromeDefault) {
          w = w || 512;
          h = h || 512;
        }

        const maxDim = 512;
        const scale = Math.min(maxDim / w, maxDim / h);
        const tw = Math.max(1, Math.round(w * scale));
        const th = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement("canvas");
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas 2d"));
          return;
        }
        /* רקע שקוף — רקע האתר/הגרדיאנט ייראה דרך אזורים שקופים בלוגו */
        ctx.clearRect(0, 0, tw, th);
        const insetScale = Math.min(
          1,
          Math.max(0.1, Number(options.insetScale) || 1)
        );
        if (insetScale < 1) {
          const dw = tw * insetScale;
          const dh = th * insetScale;
          const dx = (tw - dw) / 2;
          const dy = (th - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
        } else {
          ctx.drawImage(img, 0, 0, tw, th);
        }
        resolve(canvas.toDataURL("image/png"));
      })();
    };
    img.onerror = () =>
      reject(new Error("לא ניתן לטעון את ה-SVG לתצוגה"));
    img.src = svgDataUrl;
  });
}
