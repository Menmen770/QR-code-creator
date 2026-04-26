import { useState } from "react";
import { FiFolder, FiPlus, FiTrash2 } from "react-icons/fi";
import { UNFILED_ORDER_KEY } from "../utils/dashboardFoldersStorage";
import SimpleTextModal from "./SimpleTextModal";

export default function DashboardSidebar({
  folders,
  selectedViewId,
  onSelectView,
  counts,
  onCreateFolderWithName,
  onDeleteFolder,
}) {
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  return (
    <aside className="dashboard-sidebar card border-0 shadow-sm" dir="rtl">
      <SimpleTextModal
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        title="תיקייה חדשה"
        description="הזן שם לתיקייה. אפשר יהיה לשייך אליה קודים מהדף הראשי."
        label="שם התיקייה"
        placeholder="למשל: לקוחות, אירועים…"
        confirmLabel="צור תיקייה"
        maxLength={80}
        minLength={1}
        defaultValue=""
        onConfirm={(name) => onCreateFolderWithName(name)}
      />

      <div className="card-body p-3 d-flex flex-column">
        <h2 className="h6 fw-bold text-secondary text-uppercase small mb-2">
          תיקיות
        </h2>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm w-100 mb-3 d-inline-flex align-items-center justify-content-center gap-1 rounded-3 fw-semibold"
          onClick={() => setFolderModalOpen(true)}
        >
          <FiPlus aria-hidden />
          צור תיקייה
        </button>

        <nav className="dashboard-sidebar-nav d-flex flex-column gap-1 flex-grow-1">
          <button
            type="button"
            className={`dashboard-sidebar-item w-100 text-start rounded-3 ${
              selectedViewId === "all" ? "is-active" : ""
            }`}
            onClick={() => onSelectView("all")}
          >
            <span className="fw-semibold">הכל</span>
            <span className="dashboard-sidebar-count">{counts.all}</span>
          </button>

          <button
            type="button"
            className={`dashboard-sidebar-item w-100 text-start rounded-3 ${
              selectedViewId === UNFILED_ORDER_KEY ? "is-active" : ""
            }`}
            onClick={() => onSelectView(UNFILED_ORDER_KEY)}
          >
            <span className="fw-semibold">ללא תיקייה</span>
            <span className="dashboard-sidebar-count">{counts.unfiled}</span>
          </button>

          {folders.map((f) => (
            <div
              key={f.id}
              className="dashboard-sidebar-folder-row position-relative"
            >
              <button
                type="button"
                className={`dashboard-sidebar-item dashboard-sidebar-item-folder w-100 text-start rounded-3 ${
                  selectedViewId === f.id ? "is-active" : ""
                }`}
                onClick={() => onSelectView(f.id)}
              >
                <FiFolder
                  className="me-2 text-secondary flex-shrink-0"
                  aria-hidden
                />
                <span className="fw-semibold text-truncate">{f.name}</span>
                <span className="dashboard-sidebar-count">
                  {counts.perFolder[f.id] ?? 0}
                </span>
              </button>
              <button
                type="button"
                className="btn btn-link btn-sm text-danger dashboard-sidebar-delete-folder p-0"
                title="מחיקת תיקייה (הקודים יעברו ל«ללא תיקייה»)"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(f.id, f.name);
                }}
              >
                <FiTrash2 aria-hidden />
              </button>
            </div>
          ))}
        </nav>

        <p className="small text-muted mt-3 mb-0">
          סדר ותיקיות נשמרים מקומית בדפדפן עד חיבור ל-MongoDB.
        </p>
      </div>
    </aside>
  );
}
