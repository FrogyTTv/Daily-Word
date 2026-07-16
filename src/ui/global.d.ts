export type ReadingProgress = Record<string, Record<string, boolean>>;

export interface Database {
  username: string;
  readingProgress: ReadingProgress;
}

declare global {
  interface Window {
    api: {
      saveDatabase: (database: Database) => void;
      loadDatabase: () => Promise<Database>;
      loadBibleVerse: () => Promise<{ text: string; reference: string }>;
      onNavigate: (callback: (page: string) => void) => () => void;
      onFocusSearch: (callback: () => void) => () => void;
    };
    electron: {
      invoke: (channel: string, data?: unknown) => Promise<unknown>;
    };
  }
}
