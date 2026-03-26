import { FiFileText } from "react-icons/fi";

/**
 * שלב 3: תצוגה מקדימה והורדות.
 */
function QrPreviewPanel({
  qrType,
  pdfInputMode,
  pdfFile,
  qrInputs,
  previewImage,
  qrImage,
  loading,
  bgColorMode,
  bgEffect,
  bgColor,
  stickerType,
  downloadQR,
}) {
  const showPdfFileHint =
    qrType === "pdf" &&
    pdfInputMode === "file" &&
    pdfFile &&
    !qrInputs.pdf;

  const hideQrImageArea = showPdfFileHint;

  return (
    <div className="col-lg-5">
      <div className="card qr-card shadow-sm h-100">
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="qr-step">3</span>
            <h5 className="mb-0">קוד ה-QR שלך</h5>
          </div>

          <div
            className={`qr-preview mb-4 flex-grow-1 ${
              bgColorMode === "none"
                ? "transparent-bg"
                : bgColorMode === "effect" && bgEffect !== "none"
                  ? `effect-${bgEffect}`
                  : ""
            } ${stickerType !== "none" ? "qr-preview--with-sticker" : ""}`}
            style={
              bgColorMode === "effect" && bgEffect !== "none"
                ? {}
                : bgColorMode === "none"
                  ? {}
                  : { background: bgColor }
            }
          >
            {loading && (
              <div className="text-center">
                <div
                  className="spinner-border text-teal mb-3"
                  role="status"
                />
                <div className="text-muted">יוצר QR...</div>
              </div>
            )}
            {!loading && showPdfFileHint && (
              <div className="text-center" style={{ color: "#0a9396" }}>
                <FiFileText size={64} className="mb-3" />
                <h5 className="mb-3">קובץ נבחר בהצלחה!</h5>
                <div className="text-muted mb-2">
                  <p className="mb-2">
                    העלה את הקובץ לשירות אחסון (Google Drive, Dropbox וכו')
                  </p>
                  <p className="mb-2"> לחץ על &quot;הדבקת URL&quot; למעלה</p>
                  <p className="mb-0">הדבק את הקישור ליצירת QR code</p>
                </div>
              </div>
            )}
            {!loading && !hideQrImageArea && qrImage && (
              <img
                src={previewImage}
                alt="קוד QR שנוצר"
                className={`img-fluid qr-image ${stickerType !== "none" ? "qr-image--sticker" : ""}`}
              />
            )}
            {!loading && !hideQrImageArea && !qrImage && (
              <div className="text-center text-muted">
                <div className="display-6">QR</div>
                התחל להקליד כדי ליצור קוד QR.
              </div>
            )}
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <button
                type="button"
                className="btn btn-teal w-100"
                onClick={() => downloadQR("png")}
                disabled={!qrImage || loading}
              >
                הורד PNG
              </button>
            </div>
            <div className="col-md-6">
              <button
                type="button"
                className="btn btn-outline-teal w-100"
                onClick={() => downloadQR("svg")}
                disabled={!qrImage || loading}
              >
                הורד SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrPreviewPanel;
