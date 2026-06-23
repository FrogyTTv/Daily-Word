import { useEffect, useState } from "react";
import type { Database } from "../global";

// Percent of chapters read in a book, rounded to 2 decimals (matches the original app).
function bookPercentage(chapters: Record<string, boolean>): number {
  const values = Object.values(chapters);
  if (values.length === 0) {
    return 0;
  }
  const read = values.filter(Boolean).length;
  return Math.round((read / values.length) * 100 * 100) / 100;
}

function Registration() {
  const [database, setDatabase] = useState<Database | null>(null);

  // Pull the saved reading progress from the main process on mount.
  useEffect(() => {
    window.api.loadDatabase().then(setDatabase);
  }, []);

  // Flip a chapter's read-state, persist it, and update the UI.
  function toggleChapter(book: string, chapter: string) {
    setDatabase((prev) => {
      if (!prev) {
        return prev;
      }
      const next: Database = {
        ...prev,
        readingProgress: {
          ...prev.readingProgress,
          [book]: {
            ...prev.readingProgress[book],
            [chapter]: !prev.readingProgress[book][chapter],
          },
        },
      };
      window.api.saveDatabase(next);
      return next;
    });
  }

  if (!database) {
    return <h1>Register Chapters</h1>;
  }

  return (
    <div className="chapters-section">
      <h1>Register Chapters</h1>

      {/* Map over each book in the database */}
      {Object.entries(database.readingProgress).map(([book, chapters]) => {
        const percentage = bookPercentage(chapters);
        return (
          <details key={book} name="book">
            <summary>
              <span>{book}</span>
              <span
                style={{ padding: ".2rem" }}
                className={percentage === 100 ? "book_completed" : undefined}
              >
                {percentage}%
              </span>
            </summary>

            {/* Map over each chapter inside the current book */}
            <ul>
              {Object.entries(chapters).map(([chapter, isRead]) => (
                <li
                  key={chapter}
                  className={isRead ? "active" : undefined}
                  onClick={() => toggleChapter(book, chapter)}
                >
                  {chapter}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

export default Registration;
