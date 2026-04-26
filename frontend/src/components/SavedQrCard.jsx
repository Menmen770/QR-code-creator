import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiClock,
  FiCopy,
  FiCornerUpLeft,
  FiDroplet,
  FiDownload,
  FiEdit2,
  FiFolder,
  FiInfo,
  FiLink,
  FiTrash2,
} from "react-icons/fi";
import { API_BASE } from "../config";
import { QR_TYPES_MAIN, QR_TYPES_MORE } from "../utils/qrConstants";
import {
  downloadDataUrlPng,
  getSavedQrPreviewDataUrl,
} from "../utils/savedQrPreview";

const QR_TYPE_LABELS = new Map(
  [...QR_TYPES_MAIN, ...QR_TYPES_MORE].map((t) => [t.value, t.label]),
);

function formatSavedDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function destinationSummary(row) {
  const v = String(row?.qrValue || "").trim();
  if (v) return v.length > 96 ? `${v.slice(0, 96)}…` : v;
  const inputs = row?.qrInputs;
  if (inputs && typeof inputs === "object") {
    const url = inputs.url || inputs.link;
    if (typeof url === "string" && url.trim()) {
      const u = url.trim();
      return u.length > 96 ? `${u.slice(0, 96)}…` : u;
    }
  }
  return "—";
}

function cardTitle(row) {
  const dn = String(row?.displayName || "").trim();
  if (dn) return dn.length > 48 ? `${dn.slice(0, 48)}…` : dn;
  const d = destinationSummary(row);
  if (d && d !== "—") return d.length > 48 ? `${d.slice(0, 48)}…` : d;
  return QR_TYPE_LABELS.get(row.qrType) || row.qrType || "קוד QR";
}

export default function SavedQrCard({
  row,
  isActive,
  onToggleActive,
  onOpenEditor,
  onDuplicateStub,
  onStatisticsStub,
  onDelete,
  onStubNotice,
  folderDisplayName,
  foldersForSelect,
  assignedFolderId,
  onAssignFolder,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const moveWrapRef = useRef(null);

  useEffect(() => {
    if (!moveOpen) return;
    const close = (e) => {
      if (!moveWrapRef.current?.contains(e.target)) setMoveOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [moveOpen]);

  useEffect(() => {
    setMoveOpen(false);
  }, [row._id]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setPreviewLoading(true);
      setPreviewUrl("");
      try {
        const url = await getSavedQrPreviewDataUrl(row, API_BASE);
        if (!cancelled) setPreviewUrl(url || "");
      } catch {
        if (!cancelled) setPreviewUrl("");
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [row]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    const safeName = String(row._id || "qr").replace(/[^\w-]/g, "");
    downloadDataUrlPng(previewUrl, `qr-${safeName}.png`);
  }, [previewUrl, row._id]);

  const handleDelete = useCallback(async () => {
    if (
      !window.confirm(
        "למחוק את הקוד השמור? לא ניתן לשחזר את העיצוב מהשרת.",
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/saved-qrs/${row._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "מחיקה נכשלה");
      }
      onDelete(row._id);
      window.dispatchEvent(new Event("qr-saved-updated"));
    } catch (e) {
      onStubNotice(e.message || "מחיקה נכשלה");
    } finally {
      setDeleting(false);
    }
  }, [row._id, onDelete, onStubNotice]);

  const openEditor = () => onOpenEditor(row);

  const typeLabel = QR_TYPE_LABELS.get(row.qrType) || row.qrType;
  const currentFolderId =
    assignedFolderId == null || assignedFolderId === ""
      ? null
      : String(assignedFolderId);

  const pickFolder = (folderIdOrNull) => {
    onAssignFolder(row._id, folderIdOrNull);
    setMoveOpen(false);
  };

  return (
    <article className="card shadow-sm border-0 dashboard-qr-card mb-3">
      <div
        className="card-body dashboard-qr-card-body d-flex flex-column flex-lg-row gap-3 gap-lg-4 align-items-lg-stretch"
        dir="rtl"
      >
        <div className="dashboard-qr-col-preview d-flex flex-column align-items-center gap-2 flex-shrink-0">
          <div className="dashboard-qr-thumb d-flex align-items-center justify-content-center bg-light rounded-3 overflow-hidden">
            {previewLoading ? (
              <span
                className="spinner-border spinner-border-sm text-secondary"
                role="status"
              />
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="dashboard-qr-thumb-img"
              />
            ) : (
              <span className="small text-muted px-2 text-center">
                אין תצוגה מקדימה
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm dashboard-qr-download w-100"
            onClick={handleDownload}
            disabled={!previewUrl}
          >
            <FiDownload className="me-1" aria-hidden />
            הורדה
          </button>
        </div>

        <div className="dashboard-qr-col-metrics d-flex flex-column justify-content-center gap-2 flex-shrink-0">
          <div>
            <span className="dashboard-qr-metric-label">סריקות כוללות</span>
            <span className="dashboard-qr-metric-value d-block fw-bold fs-4">
              —
            </span>
            <span className="small text-muted">יתעדכן עם מעקב סריקות</span>
          </div>
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0 text-start dashboard-qr-stats-link"
            onClick={() => onStatisticsStub()}
          >
            סטטיסטיקות
            <FiChevronLeft className="ms-1" aria-hidden />
          </button>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small text-muted mb-0">סטטוס</span>
            <div className="form-check form-switch m-0 dashboard-qr-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={isActive}
                onChange={() => onToggleActive(row._id)}
                id={`active-${row._id}`}
                aria-checked={isActive}
              />
              <label
                className="form-check-label small fw-semibold"
                htmlFor={`active-${row._id}`}
              >
                {isActive ? "פעיל" : "מושהה"}
              </label>
            </div>
            <button
              type="button"
              className="btn btn-link p-0 text-muted dashboard-qr-info-btn"
              title="שינוי סטטוס יישמר בשרת אחרי עדכון מסד הנתונים"
              onClick={() =>
                onStubNotice(
                  "מצב פעיל/מושהה יישמר בשרת לאחר הוספת השדות למסד הנתונים.",
                )
              }
            >
              <FiInfo size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div className="dashboard-qr-col-meta flex-grow-1 min-w-0 d-flex flex-column">
          <div className="d-flex align-items-center gap-2 text-muted small mb-1">
            <FiLink aria-hidden />
            <span>{typeLabel}</span>
          </div>
          <h2 className="h6 fw-bold mb-2 dashboard-qr-card-title">
            {cardTitle(row)}
          </h2>
          <div className="small text-muted mb-1 d-flex align-items-start gap-1">
            <FiLink className="flex-shrink-0 mt-1" aria-hidden />
            <span>
              קישור דינמי:{" "}
              <em className="text-secondary">יתווסף בהמשך (MongoDB)</em>
            </span>
          </div>
          <div className="small mb-1 d-flex align-items-start gap-1 text-break">
            <FiCornerUpLeft className="flex-shrink-0 mt-1" aria-hidden />
            <span title={destinationSummary(row)}>
              {destinationSummary(row)}
            </span>
          </div>
          <div className="small text-muted mb-1 d-flex align-items-center gap-1">
            <FiClock aria-hidden />
            {formatSavedDate(row.createdAt)}
          </div>
          <div className="small text-muted mb-3 d-flex align-items-center gap-1">
            <FiFolder aria-hidden />
            {folderDisplayName || "ללא תיקייה"}
          </div>

          <div
            className="dashboard-qr-move-wrap position-relative w-100 mt-auto pt-2"
            ref={moveWrapRef}
          >
            <button
              type="button"
              className={`btn dashboard-qr-move-btn w-100 d-flex align-items-center ${
                moveOpen ? "is-open" : ""
              }`}
              aria-expanded={moveOpen}
              aria-haspopup="menu"
              onClick={() => setMoveOpen((o) => !o)}
            >
              <FiFolder className="flex-shrink-0 me-2" aria-hidden />
              <span className="flex-grow-1 text-truncate">העבר לתיקייה</span>
              <FiChevronDown
                className={`flex-shrink-0 ms-2 dashboard-qr-move-chevron ${
                  moveOpen ? "is-flipped" : ""
                }`}
                aria-hidden
              />
            </button>
            {moveOpen ? (
              <div className="dashboard-qr-move-panel" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={`dashboard-qr-move-panel-item ${
                    currentFolderId == null ? "is-current" : ""
                  }`}
                  onClick={() => pickFolder(null)}
                >
                  ללא תיקייה
                </button>
                {(foldersForSelect || []).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="menuitem"
                    className={`dashboard-qr-move-panel-item ${
                      currentFolderId === f.id ? "is-current" : ""
                    }`}
                    onClick={() => pickFolder(f.id)}
                  >
                    {f.name}
                  </button>
                ))}
                {!foldersForSelect?.length ? (
                  <div className="small text-muted px-3 py-2 text-center">
                    אין תיקיות — צור תיקייה בסרגל הימני
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="dashboard-qr-card-actions d-flex flex-wrap gap-2 justify-content-lg-end mt-2 pt-3">
            <button
              type="button"
              className="btn btn-light border dashboard-qr-icon-btn"
              title="עיצוב — במחולל"
              onClick={openEditor}
            >
              <FiDroplet aria-hidden />
            </button>
            <button
              type="button"
              className="btn btn-light border dashboard-qr-icon-btn"
              title="עריכה במחולל"
              onClick={openEditor}
            >
              <FiEdit2 aria-hidden />
            </button>
            <button
              type="button"
              className="btn btn-light border dashboard-qr-icon-btn"
              title="שכפול (בקרוב)"
              onClick={() => onDuplicateStub()}
            >
              <FiCopy aria-hidden />
            </button>
            <button
              type="button"
              className="btn btn-light border dashboard-qr-icon-btn text-danger"
              title="מחיקה"
              onClick={handleDelete}
              disabled={deleting}
            >
              <FiTrash2 aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
