import { QR_EDGE_IMAGES, QR_BODY_IMAGES } from "./qrShapeAssets";
import { BODY_SHAPES, CORNER_SHAPES } from "../../utils/qrConstants";

function QrStyleShapeTab({ dotsType, setDotsType, cornersType, setCornersType }) {
  const bodyShapes = BODY_SHAPES;
  const cornerShapes = CORNER_SHAPES;

  return (
    <div className="vstack gap-4">
      <div className="qr-shape-section">
        <label className="form-label fw-semibold mb-4">סוג גוף</label>
        <div className="d-flex flex-wrap gap-3">
          {bodyShapes.map((shape, index) => (
            <button
              type="button"
              className={`edge-select-btn ${dotsType === shape.id ? "selected" : ""}`}
              onClick={() => setDotsType(shape.id)}
              title={shape.name}
              aria-label={`סוג גוף QR: ${shape.name}`}
              aria-pressed={dotsType === shape.id}
              key={shape.id}
            >
              <img
                src={QR_BODY_IMAGES[index + 1]}
                alt={shape.name}
                className="edge-preview-img"
              />
            </button>
          ))}
        </div>
      </div>

      <hr className="my-2" />

      <div className="qr-shape-section">
        <label className="form-label fw-semibold mb-4">פינות</label>
        <div className="d-flex flex-wrap gap-3">
          {cornerShapes.map((shape, index) => {
            const imageNum = index + 1;
            return (
              <button
                type="button"
                className={`edge-select-btn ${cornersType === shape.id ? "selected" : ""}`}
                onClick={() => setCornersType(shape.id)}
                title={shape.name}
                aria-label={`צורת פינות QR: ${shape.name}`}
                aria-pressed={cornersType === shape.id}
                key={shape.id}
              >
                <img
                  src={QR_EDGE_IMAGES[imageNum]}
                  alt={shape.name}
                  className="edge-preview-img"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QrStyleShapeTab;
