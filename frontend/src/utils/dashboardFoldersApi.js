import { API_BASE } from "../config";
import { createEmptyFolderState } from "./dashboardFoldersStorage";

function normalizeFolderState(data) {
  const empty = createEmptyFolderState();
  if (!data || typeof data !== "object") return empty;
  const folders = Array.isArray(data.folders)
    ? data.folders.filter(
        (f) =>
          f &&
          typeof f === "object" &&
          typeof f.id === "string" &&
          typeof f.name === "string",
      )
    : [];
  const assignments =
    data.assignments && typeof data.assignments === "object"
      ? { ...data.assignments }
      : {};
  const globalOrder = Array.isArray(data.globalOrder)
    ? data.globalOrder.map(String)
    : [];
  const folderOrders =
    data.folderOrders && typeof data.folderOrders === "object"
      ? { ...data.folderOrders }
      : {};
  return { ...empty, folders, assignments, globalOrder, folderOrders };
}

/**
 * @returns {{ ok: true, state: object } | { ok: false, unauthorized?: boolean, error?: string }}
 */
export async function fetchDashboardFoldersState() {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard/folders`, {
      credentials: "include",
    });
    if (res.status === 401) {
      return { ok: false, unauthorized: true };
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data?.error === "string" ? data.error : "טעינה נכשלה",
      };
    }
    const state = normalizeFolderState(data);
    return { ok: true, state };
  } catch {
    return { ok: false, error: "רשת או שרת לא זמינים" };
  }
}

export async function putDashboardFoldersState(state) {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard/folders`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data?.error === "string" ? data.error : "שמירה נכשלה",
      };
    }
    return { ok: true, state: normalizeFolderState(data) };
  } catch {
    return { ok: false, error: "רשת או שרת לא זמינים" };
  }
}
