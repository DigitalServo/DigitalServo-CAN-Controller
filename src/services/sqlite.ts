import { useSqliteStore } from "@/stores/sqlite";

export async function initializeSqliteDb() {
  await useSqliteStore.getState().initDb();

  // const db = useSqliteStore.getState().db;
  // if (!db) return;

}

export async function closeSqliteDb() {
  await useSqliteStore.getState().closeDb();
}
