import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import { API_BASE } from "../config";
import SavedQrCard from "../components/SavedQrCard";
import DashboardSidebar from "../components/DashboardSidebar";
import {
  UNFILED_ORDER_KEY,
  assignQrToFolder,
  createFolder,
  deleteFolder,
  folderCounts,
  getOrderedQrIds,
  loadFolderState,
  pruneQrFromFolderState,
  saveFolderState,
  syncFolderStateWithItems,
} from "../utils/dashboardFoldersStorage";

function DashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const noticeTimerRef = useRef(null);
  const [activeById, setActiveById] = useState(() => ({}));
  const [folderState, setFolderState] = useState(() => loadFolderState());
  const [selectedViewId, setSelectedViewId] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedNameSearch, setDebouncedNameSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedNameSearch(nameSearch.trim()), 350);
    return () => clearTimeout(t);
  }, [nameSearch]);

  const showNotice = useCallback((message) => {
    setNotice(message);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimerRef.current = null;
    }, 4500);
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      qs.set("limit", "50");
      if (debouncedNameSearch) {
        qs.set("q", debouncedNameSearch);
      }
      const res = await fetch(
        `${API_BASE}/api/saved-qrs?${qs.toString()}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "טעינה נכשלה");
      }
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(list);
    } catch (e) {
      setError(e.message || "טעינה נכשלה");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedNameSearch]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (loading) return;
    setFolderState((prev) => {
      const synced = syncFolderStateWithItems(items, prev);
      saveFolderState(synced);
      return synced;
    });
  }, [items, loading]);

  const counts = useMemo(
    () => folderCounts(items, folderState),
    [items, folderState],
  );

  const displayItems = useMemo(() => {
    const ids = getOrderedQrIds(items, selectedViewId, folderState);
    const byId = Object.fromEntries(items.map((r) => [String(r._id), r]));
    return ids.map((id) => byId[id]).filter(Boolean);
  }, [items, selectedViewId, folderState]);

  const countLabel = useMemo(() => {
    if (loading) return "טוען…";
    if (selectedViewId === "all") return `כל (${items.length})`;
    if (selectedViewId === UNFILED_ORDER_KEY) {
      return `ללא תיקייה (${counts.unfiled})`;
    }
    const f = folderState.folders.find((x) => x.id === selectedViewId);
    const n = counts.perFolder[selectedViewId] ?? 0;
    return `${f?.name || "תיקייה"} (${n})`;
  }, [loading, items.length, selectedViewId, counts, folderState.folders]);

  const openInEditor = useCallback(
    (row) => {
      navigate("/create", {
        state: {
          loadSavedQr: {
            qrType: row.qrType,
            qrValue: row.qrValue || "",
            qrInputs: row.qrInputs || {},
            style: row.style || {},
          },
        },
      });
    },
    [navigate],
  );

  const getEffectiveActive = useCallback(
    (id) => {
      const sid = String(id);
      if (Object.prototype.hasOwnProperty.call(activeById, sid)) {
        return Boolean(activeById[sid]);
      }
      return true;
    },
    [activeById],
  );

  const handleToggleActive = useCallback(
    (id) => {
      const sid = String(id);
      setActiveById((prev) => ({
        ...prev,
        [sid]: !getEffectiveActive(sid),
      }));
      showNotice(
        "שינוי סטטוס מוצג כאן בלבד — יישמר בשרת אחרי הרחבת סכמת MongoDB.",
      );
    },
    [getEffectiveActive, showNotice],
  );

  const handleAssignFolder = useCallback((qrId, folderIdOrNull) => {
    setFolderState((prev) => {
      const next = assignQrToFolder(prev, qrId, folderIdOrNull);
      saveFolderState(next);
      return next;
    });
  }, []);

  const handleDelete = useCallback((id) => {
    setItems((prev) => prev.filter((r) => r._id !== id));
    setFolderState((prev) => {
      const next = pruneQrFromFolderState(prev, id);
      saveFolderState(next);
      return next;
    });
  }, []);

  const handleCreateFolderWithName = useCallback(
    (name) => {
      const trimmed = String(name || "").trim();
      if (!trimmed) {
        showNotice("שם התיקייה לא יכול להיות ריק.");
        return false;
      }
      setFolderState((prev) => {
        const next = createFolder(prev, trimmed);
        saveFolderState(next);
        return next;
      });
    },
    [showNotice],
  );

  const handleDeleteFolder = useCallback(
    (folderId, folderName) => {
      if (
        !window.confirm(
          `למחוק את התיקייה "${folderName}"? הקודים שבה יסומנו כללא תיקייה (מקומית).`,
        )
      ) {
        return;
      }
      setFolderState((prev) => {
        const next = deleteFolder(prev, folderId);
        saveFolderState(next);
        return next;
      });
      setSelectedViewId((v) => (v === folderId ? "all" : v));
    },
    [],
  );

  const handleStatisticsStub = useCallback(() => {
    showNotice(
      "סטטיסטיקות סריקות ופילוח גיאוגרפי — אחרי שכבת המעקב והשדות בשרת.",
    );
  }, [showNotice]);

  const handleDuplicateStub = useCallback(() => {
    showNotice("שכפול קוד לרשומה חדשה — אחרי הרחבת ה-API והמודל ב-MongoDB.");
  }, [showNotice]);

  const folderNameForRow = useCallback(
    (row) => {
      const fid = folderState.assignments[String(row._id)];
      if (!fid) return "ללא תיקייה";
      const f = folderState.folders.find((x) => x.id === fid);
      return f?.name || "תיקייה";
    },
    [folderState.assignments, folderState.folders],
  );

  const listSection = loading ? (
    <div className="dashboard-loading text-center text-muted py-5">
      טוען את הרשימה…
    </div>
  ) : items.length === 0 ? (
    <div className="card shadow-sm border-0 dashboard-empty-card">
      <div className="card-body text-center py-5 px-4">
        {debouncedNameSearch ? (
          <>
            <h2 className="h5 fw-bold mb-2">לא נמצאו קודים בשם הזה</h2>
            <p className="text-muted mb-4">
              נסו מילה אחרת או נקו את החיפוש כדי לראות את כל הקודים.
            </p>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setNameSearch("")}
            >
              נקה חיפוש
            </button>
          </>
        ) : (
          <>
            <h2 className="h5 fw-bold mb-2">עדיין אין קודים שמורים</h2>
            <p className="text-muted mb-4">
              כשתשמור קוד מהמחולל, הוא יופיע כאן. תוכל לחזור אליו לעריכה בכל עת.
            </p>
            <Link to="/create" className="btn btn-teal">
              <FiPlus className="me-2" aria-hidden />
              ליצירת QR ראשון
            </Link>
          </>
        )}
      </div>
    </div>
  ) : displayItems.length === 0 ? (
    <div className="card shadow-sm border-0 dashboard-empty-card">
      <div className="card-body text-center py-5 px-4">
        <p className="text-muted mb-3">אין קודים בתצוגה הזו.</p>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setSelectedViewId("all")}
        >
          חזרה להכל
        </button>
      </div>
    </div>
  ) : (
    <ul className="list-unstyled dashboard-list mb-0">
      {displayItems.map((row) => (
        <li key={row._id}>
          <SavedQrCard
            row={row}
            isActive={getEffectiveActive(row._id)}
            onToggleActive={handleToggleActive}
            onOpenEditor={openInEditor}
            onDuplicateStub={handleDuplicateStub}
            onStatisticsStub={handleStatisticsStub}
            onDelete={handleDelete}
            onStubNotice={showNotice}
            folderDisplayName={folderNameForRow(row)}
            foldersForSelect={folderState.folders}
            assignedFolderId={folderState.assignments[String(row._id)] ?? null}
            onAssignFolder={handleAssignFolder}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="dashboard-page py-4 py-md-5" dir="rtl">
      <div className="container-fluid dashboard-layout px-3 px-md-4">
        <div className="dashboard-toolbar d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center mb-3 mb-md-4">
          <div className="min-w-0 flex-grow-1">
            <h1 className="dashboard-title mb-1">הקודים שלי</h1>
            <p className="dashboard-subtitle text-muted mb-2 mb-md-2">
              ניהול הקודים השמורים — יצירה, עריכה והמשך עבודה במחולל.
            </p>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="dashboard-count-badge">{countLabel}</span>
              <div className="input-group input-group-sm dashboard-name-search flex-grow-1" style={{ maxWidth: "22rem" }}>
                <span className="input-group-text bg-white border-end-0 text-secondary">
                  <FiSearch aria-hidden />
                </span>
                <input
                  type="search"
                  className="form-control border-start-0"
                  placeholder="חיפוש לפי שם הקוד…"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  aria-label="חיפוש לפי שם"
                />
              </div>
            </div>
          </div>
          <Link
            to="/create"
            className="btn btn-teal btn-lg dashboard-create-btn align-self-stretch align-self-lg-auto"
          >
            <FiPlus className="me-2" aria-hidden />
            יצירת QR חדש
          </Link>
        </div>

        {notice && (
          <div
            className="alert alert-info py-2 px-3 mb-3"
            role="status"
            dir="rtl"
          >
            {notice}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4 g-lg-5 justify-content-center dashboard-body-row">
          <div className="col-12 col-sm-10 col-md-8 col-lg-4 col-xl-3 dashboard-sidebar-col">
            <DashboardSidebar
              folders={folderState.folders}
              selectedViewId={selectedViewId}
              onSelectView={setSelectedViewId}
              counts={counts}
              onCreateFolderWithName={handleCreateFolderWithName}
              onDeleteFolder={handleDeleteFolder}
            />
          </div>
          <div className="col-12 col-lg col-xl-9 col-xxl-8 dashboard-main-col">
            {listSection}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
