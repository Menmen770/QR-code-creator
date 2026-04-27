import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiClock,
  FiCopy,
  FiCornerUpLeft,
  FiDownload,
  FiEdit2,
  FiExternalLink,
  FiFolder,
  FiLink,
  FiTrash2,
} from "react-icons/fi";
import { API_BASE } from "../config";
import { QR_TYPES_MAIN, QR_TYPES_MORE } from "../utils/qrConstants";
import { effectiveSavedQrEncodedText } from "../utils/qrEncodedText";
import {
  downloadDataUrlPng,
  getSavedQrPreviewDataUrl,
} from "../utils/savedQrPreview";
import SimpleTextModal from "./SimpleTextModal";
import SavedQrStyleEditModal from "./SavedQrStyleEditModal";

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
  onOpenEditor,
  onDuplicateStub,
  onDelete,
  onStubNotice,
  onSavedQrFromApi,
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
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameBusy, setRenameBusy] = useState(false);
  const [styleEditOpen, setStyleEditOpen] = useState(false);
  const [activeBusy, setActiveBusy] = useState(false);

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

  const handleOpenDestination = useCallback(() => {
    const t = effectiveSavedQrEncodedText(row);
    if (/^https?:\/\//i.test(t)) {
      window.open(t, "_blank", "noopener,noreferrer");
      return;
    }
    onOpenEditor(row);
  }, [row, onOpenEditor]);

  const handleRenameConfirm = useCallback(
    async (name) => {
      const trimmed = String(name || "").trim();
      if (!trimmed) {
        onStubNotice("נא להזין שם.");
        return false;
      }
      setRenameBusy(true);
      try {
        const res = await fetch(`${API_BASE}/api/saved-qrs/${row._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: trimmed }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "עדכון השם נכשל");
        }
        const saved = data?.saved;
        if (saved) {
          onSavedQrFromApi(saved);
        }
        window.dispatchEvent(new Event("qr-saved-updated"));
        return true;
      } catch (e) {
        onStubNotice(e.message || "עדכון השם נכשל");
        return false;
      } finally {
        setRenameBusy(false);
      }
    },
    [row._id, onSavedQrFromApi, onStubNotice],
  );

  const typeLabel = QR_TYPE_LABELS.get(row.qrType) || row.qrType;
  const currentFolderId =
    assignedFolderId == null || assignedFolderId === ""
      ? null
      : String(assignedFolderId);

  const pickFolder = (folderIdOrNull) => {
    onAssignFolder(row._id, folderIdOrNull);
    setMoveOpen(false);
  };

  const renameDefault = String(row?.displayName || "").trim();
  const isActive = row.isActive !== false;

  const handleActiveChange = useCallback(
    async (e) => {
      const next = e.target.checked;
      setActiveBusy(true);
      try {
        const res = await fetch(`${API_BASE}/api/saved-qrs/${row._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: next }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "עדכון מצב פעיל נכשל");
        }
        if (data?.saved) {
          onSavedQrFromApi(data.saved);
        }
        window.dispatchEvent(new Event("qr-saved-updated"));
      } catch (err) {
        onStubNotice(err.message || "עדכון נכשל");
      } finally {
        setActiveBusy(false);
      }
    },
    [row._id, onSavedQrFromApi, onStubNotice],
  );

  return (
    <article className="card shadow-sm border-0 dashboard-qr-card mb-3">
      <SavedQrStyleEditModal
        open={styleEditOpen}
        onClose={() => setStyleEditOpen(false)}
        row={row}
        onSaved={onSavedQrFromApi}
        onError={onStubNotice}
      />

      <SimpleTextModal
        open={renameOpen}
        onClose={() => !renameBusy && setRenameOpen(false)}
        title="שינוי שם הקוד"
        description="השם מופיע בדף «הקודים שלי» ובחיפוש."
        label="שם לקוד"
        placeholder="למשל: קמפיין אביב"
        confirmLabel="שמור שם"
        busy={renameBusy}
        defaultValue={renameDefault}
        maxLength={120}
        minLength={1}
        onConfirm={handleRenameConfirm}
      />

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

        <div className="dashboard-qr-col-meta flex-grow-1 min-w-0 d-flex flex-column">
          <div className="d-flex align-items-center gap-2 text-muted small mb-1">
            <FiLink aria-hidden />
            <span>{typeLabel}</span>
          </div>
          <div className="dashboard-qr-title-group d-inline-flex align-items-center gap-2 flex-wrap mb-2">
            <h2 className="h6 fw-bold mb-0 dashboard-qr-card-title">
              {cardTitle(row)}
            </h2>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-secondary dashboard-qr-title-edit-btn"
              title="שנה שם"
              aria-label="שנה שם"
              onClick={() => setRenameOpen(true)}
            >
              <FiEdit2 size={18} aria-hidden />
            </button>
          </div>
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
          <div className="small text-muted mb-2 d-flex align-items-center gap-1">
            <FiClock aria-hidden />
            {formatSavedDate(row.createdAt)}
          </div>

          <div className="dashboard-qr-active-row d-flex align-items-center gap-2 flex-wrap mb-3">
            <span className="dashboard-qr-active-label">פעיל</span>
            <span dir="ltr" className="d-inline-flex align-items-center">
              <label className="dashboard-qr-toggle-mini mb-0">
                <span className="visually-hidden">
                  הפעלה או השבתה של הקוד השמור
                </span>
                <input
                  type="checkbox"
                  className="dashboard-qr-toggle-mini-input"
                  checked={isActive}
                  disabled={activeBusy}
                  onChange={handleActiveChange}
                />
                <span className="dashboard-qr-toggle-mini-track" aria-hidden="true" />
              </label>
            </span>
          </div>

          <div
            className="dashboard-qr-folder-row position-relative mb-3 w-100"
            ref={moveWrapRef}
          >
            <div className="dashboard-qr-folder-trigger d-inline-flex align-items-center gap-2 flex-wrap">
              <FiFolder className="text-muted flex-shrink-0" aria-hidden />
              <span className="small text-muted">
                {folderDisplayName || "ללא תיקייה"}
              </span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-secondary dashboard-qr-folder-edit-btn"
                title="בחירת תיקייה"
                aria-label="בחירת תיקייה"
                aria-expanded={moveOpen}
                onClick={() => setMoveOpen((o) => !o)}
              >
                <FiEdit2 size={16} aria-hidden />
              </button>
            </div>
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
                    אין תיקיות — צור תיקייה בסרגל הצד
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="dashboard-qr-card-actions d-flex flex-wrap gap-2 justify-content-lg-end mt-auto pt-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm dashboard-qr-action-labeled d-inline-flex align-items-center gap-1"
              onClick={handleOpenDestination}
            >
              <FiExternalLink size={16} aria-hidden />
              פתח
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm dashboard-qr-action-labeled d-inline-flex align-items-center gap-1"
              onClick={() => setStyleEditOpen(true)}
            >
              <FiEdit2 size={16} aria-hidden />
              שינוי
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm dashboard-qr-action-labeled d-inline-flex align-items-center gap-1"
              onClick={() => onDuplicateStub()}
            >
              <FiCopy size={16} aria-hidden />
              שכפל
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm dashboard-qr-action-labeled d-inline-flex align-items-center gap-1"
              onClick={handleDelete}
              disabled={deleting}
            >
              <FiTrash2 size={16} aria-hidden />
              מחק
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
