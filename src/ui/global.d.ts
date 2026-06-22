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
    };
    electron: {
      invoke: (channel: string, data?: unknown) => Promise<unknown>;
    };
  }
}
