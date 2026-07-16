import { useEffect, useState } from "react";
import type { Database } from "../global";

const QuickStat = ({ title, value, bg }: any) => {
  return (
    <div style={{ backgroundColor: bg }}>
      <h4>{value}</h4>
      <p>{title}</p>
    </div>
  );
};

const Dashboard = () => {
  const [dailyVerse, setDailyVerse] = useState({ text: "", reference: "" });

  const BGColors = ["#D8E0E8", "#DEEAD6", "#FDF5C8", "#E8DDF5"];
  const [randomDVColor, setRandomDVColor] = useState("");
  const [database, setDatabase] = useState<Database | null>(null);

  useEffect(() => {
    setRandomDVColor(BGColors[Math.floor(Math.random() * 4)]);
    window.api.loadDatabase().then(setDatabase);
    window.api.loadBibleVerse().then(setDailyVerse);
  }, []);

  let numberOfChapter = 0;
  let readChapters = 0;
  let completedBooks = 0;

  for (const book in database?.readingProgress) {
    const chapters = database.readingProgress[book];

    let allChaptersRead = true;

    for (const chapter in chapters) {
      numberOfChapter++;
      if (chapters[chapter] === true) {
        readChapters++;
      }
      if (chapters[chapter] !== true) {
        allChaptersRead = false;
      }
    }

    if (allChaptersRead === true) {
      completedBooks++;
    }
  }

  const biblePercentage = (readChapters / numberOfChapter) * 100;
  const roundedBiblePercentage = Math.round(biblePercentage * 100) / 100;

  return (
    <>
      <h1 style={{ padding: 0 }}>Hello, {database?.username} 👋</h1>
      <h2>Quick Stats</h2>
      <div className="bible-stats">
        <QuickStat
          bg={BGColors[0]}
          title={"Bible Read"}
          value={`${roundedBiblePercentage}%`}
        />
        <QuickStat bg={BGColors[1]} title={"Reading Streak"} value={"7 day"} />
        <QuickStat
          bg={BGColors[2]}
          title={"Chapters read"}
          value={readChapters}
        />
        <QuickStat
          bg={BGColors[3]}
          title={"Books read"}
          value={completedBooks}
        />
      </div>
      <h2>Daily Verse</h2>
      <div
        className="dv-text"
        style={{
          backgroundColor: `${randomDVColor}`,
        }}
      >
        <h4>
          {dailyVerse.text ? `${dailyVerse.text}` : "Daily Verse is Loading..."}
        </h4>
        <p>{dailyVerse.reference ? `${dailyVerse.reference}` : "Loading..."}</p>
      </div>
    </>
  );
};

export default Dashboard;
