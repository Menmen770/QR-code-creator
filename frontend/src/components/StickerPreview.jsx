import React from "react";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function MiniQr({ x = 17, y = 17, s = 14 }) {
  const u = s / 7;
  const finder = (fx, fy) => (
    <>
      <rect
        x={fx}
        y={fy}
        width={u * 3}
        height={u * 3}
        rx={u * 0.4}
        {...STROKE}
      />
      <rect
        x={fx + u}
        y={fy + u}
        width={u}
        height={u}
        rx={u * 0.2}
        fill="currentColor"
      />
    </>
  );

  return (
    <g>
      {finder(x, y)}
      {finder(x + u * 4, y)}
      {finder(x, y + u * 4)}
      <rect
        x={x + u * 4.2}
        y={y + u * 4.2}
        width={u * 0.8}
        height={u * 0.8}
        rx={u * 0.15}
        fill="currentColor"
      />
      <rect
        x={x + u * 5.4}
        y={y + u * 4.2}
        width={u * 0.8}
        height={u * 0.8}
        rx={u * 0.15}
        fill="currentColor"
      />
      <rect
        x={x + u * 4.2}
        y={y + u * 5.4}
        width={u * 0.8}
        height={u * 0.8}
        rx={u * 0.15}
        fill="currentColor"
      />
      <rect
        x={x + u * 5.4}
        y={y + u * 5.4}
        width={u * 0.8}
        height={u * 0.8}
        rx={u * 0.15}
        fill="currentColor"
      />
    </g>
  );
}

const ICONS = {
  none: (
    <>
      <rect x="10" y="10" width="28" height="28" rx="8" {...STROKE} />
      <path d="M14 14 34 34" {...STROKE} />
    </>
  ),
  circle: (
    <>
      <circle cx="24" cy="24" r="16" {...STROKE} />
      <MiniQr x={17} y={17} s={14} />
    </>
  ),
  "rounded-square": (
    <>
      <rect x="9" y="9" width="30" height="30" rx="9" {...STROKE} />
      <MiniQr x={17} y={17} s={14} />
    </>
  ),
  "speech-bubble": (
    <>
      <path
        d="M10 12h28a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H23l-7 6v-6h-6a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z"
        {...STROKE}
      />
      <MiniQr x={18} y={17} s={12} />
    </>
  ),
  "corner-brackets": (
    <>
      <path d="M10 19V10h9" {...STROKE} />
      <path d="M38 19V10h-9" {...STROKE} />
      <path d="M10 29v9h9" {...STROKE} />
      <path d="M38 29v9h-9" {...STROKE} />
      <MiniQr x={17} y={17} s={14} />
    </>
  ),
  book: (
    <>
      <path
        d="M12 12h19a4 4 0 0 1 4 4v20H16a4 4 0 0 0-4 4V16a4 4 0 0 1 4-4Z"
        {...STROKE}
      />
      <path d="M16 12v24" {...STROKE} />
      <MiniQr x={20} y={18} s={10} />
    </>
  ),
  heart: (
    <>
      <path
        d="M24 38s-12-7.7-12-15.9c0-4.7 3.5-8.1 8-8.1 2.4 0 4.2 1 5 2.7.8-1.7 2.6-2.7 5-2.7 4.5 0 8 3.4 8 8.1C38 30.3 26 38 26 38h-2Z"
        {...STROKE}
      />
      <MiniQr x={19} y={20} s={10} />
    </>
  ),
  star: (
    <>
      <path
        d="m24 9.5 4.5 9 9.9 1.5-7.2 7 1.7 10-8.9-4.7-8.9 4.7 1.7-10-7.2-7 9.9-1.5 4.5-9Z"
        {...STROKE}
      />
      <MiniQr x={19} y={19} s={10} />
    </>
  ),
  camera: (
    <>
      <rect x="9" y="14" width="30" height="20" rx="5" {...STROKE} />
      <path d="M17 14l2-4h10l2 4" {...STROKE} />
      <circle cx="24" cy="24" r="7" {...STROKE} />
      <MiniQr x={20.5} y={20.5} s={7} />
    </>
  ),
  tag: (
    <>
      <path d="M11 18v13l13 7 14-14V11H25L11 18Z" {...STROKE} />
      <circle cx="29" cy="17" r="1.9" fill="currentColor" />
      <MiniQr x={18} y={21} s={10} />
    </>
  ),
  badge: (
    <>
      <circle cx="24" cy="20.5" r="11" {...STROKE} />
      <circle cx="24" cy="20.5" r="7.7" {...STROKE} />
      <path d="M18 30v8l6-3 6 3v-8" {...STROKE} />
      <MiniQr x={20.5} y={17} s={7} />
    </>
  ),
};

export default function StickerPreview({ type, name }) {
  const icon = ICONS[type] || ICONS.none;

  return (
    <div className="sticker-preview-icon" aria-label={name || type}>
      <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
        {icon}
      </svg>
    </div>
  );
}
