
import { create } from 'zustand';
import Database from '@tauri-apps/plugin-sql';

interface DbStore {
  db: Database | null;
  isInitialized: boolean;
  initDb: () => Promise<void>;
  closeDb: () => Promise<void>;
}

const DATABASE: string = "sqlite:recipe.db";

export const useSqliteStore = create<DbStore>((set, get) => ({
  db: null,
  isInitialized: false,

  initDb: async () => {
    if (get().isInitialized) return;

    try {
      const db = await Database.load(DATABASE);
      set({ db, isInitialized: true });
      console.log('Sqlx database initialized');
    } catch (error) {
      console.error('Failed to init sqlx database:', error);
    }
  },

  closeDb: async () => {
    const { db, isInitialized } = get();
    if (!isInitialized || !db) return;

    try {
      const success = await db.close();
      if (success) {
        set({ db: null, isInitialized: false });
        console.log('Sqlx database closed successfully');
      } else {
        console.warn('Sqlx database close returned false');
      }
    } catch (error) {
      console.error('Failed to close sqlx database:', error);
    }
  },
}));
