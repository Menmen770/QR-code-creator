import thumb01 from "../../assets/stickers/thumbnails/thumb-01.png";
import thumb02 from "../../assets/stickers/thumbnails/thumb-02.png";
import thumb03 from "../../assets/stickers/thumbnails/thumb-03.png";
import thumb04 from "../../assets/stickers/thumbnails/thumb-04.png";
import thumb05 from "../../assets/stickers/thumbnails/thumb-05.png";
import thumb06 from "../../assets/stickers/thumbnails/thumb-06.png";
import thumb07 from "../../assets/stickers/thumbnails/thumb-07.png";
import thumb08 from "../../assets/stickers/thumbnails/thumb-08.png";

import overlay01 from "../../assets/stickers/overlays/frame-01.svg";
import overlay02 from "../../assets/stickers/overlays/frame-02.svg";
import overlay03 from "../../assets/stickers/overlays/frame-03.svg";
import overlay04 from "../../assets/stickers/overlays/frame-04.svg";
import overlay05 from "../../assets/stickers/overlays/frame-05.svg";
import overlay06 from "../../assets/stickers/overlays/frame-06.svg";
import overlay07 from "../../assets/stickers/overlays/frame-07.svg";
import overlay08 from "../../assets/stickers/overlays/frame-08.svg";

export const STICKER_FRAMES = [
  { id: "frame-01", name: "מסגרת 1", thumb: thumb01, overlay: overlay01 },
  { id: "frame-02", name: "מסגרת 2", thumb: thumb02, overlay: overlay02 },
  { id: "frame-03", name: "מסגרת 3", thumb: thumb03, overlay: overlay03 },
  { id: "frame-04", name: "מסגרת 4", thumb: thumb04, overlay: overlay04 },
  { id: "frame-05", name: "מסגרת 5", thumb: thumb05, overlay: overlay05 },
  { id: "frame-06", name: "מסגרת 6", thumb: thumb06, overlay: overlay06 },
  { id: "frame-07", name: "מסגרת 7", thumb: thumb07, overlay: overlay07 },
  { id: "frame-08", name: "מסגרת 8", thumb: thumb08, overlay: overlay08 },
];

export const STICKER_OPTIONS = [{ id: "none", name: "ללא" }, ...STICKER_FRAMES];

const OVERLAY_BY_ID = Object.fromEntries(
  STICKER_FRAMES.map((f) => [f.id, f.overlay]),
);

export function getStickerOverlayModule(stickerId) {
  return OVERLAY_BY_ID[stickerId] ?? null;
}
