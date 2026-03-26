import StickerPreview from "../StickerPreview";

function QrStyleStickerTab({ stickerOptions, stickerType, setStickerType }) {
  return (
    <div className="qr-sticker-section">
      <label className="form-label fw-bold mb-3">בחר סטיקר</label>
      <div className="qr-sticker-grid">
        {stickerOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`qr-sticker-btn ${stickerType === opt.id ? "selected" : ""}`}
            onClick={() => setStickerType(opt.id)}
            title={opt.name}
            aria-label={`מסגרת סטיקר: ${opt.name}`}
            aria-pressed={stickerType === opt.id}
          >
            {opt.thumbnail ? (
              <img
                src={opt.thumbnail}
                alt=""
                className="qr-sticker-thumb"
              />
            ) : (
              <StickerPreview type={opt.id} name={opt.name} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QrStyleStickerTab;
