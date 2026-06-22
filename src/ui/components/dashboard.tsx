import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [dailyVerse, setDailyVerse] = useState({ text: "", reference: "" });
  const DAILYVERSEAPI =
    "https://beta.ourmanna.com/api/v1/get/?format=json&order=daily";

  const DVColors = ["#D8E0E8", "#DEEAD6", "#FDF5C8", "#E8DDF5"];

  useEffect(() => {
    // Fetch Pokemons
    fetchDailyVerse();
  }, []);

  async function fetchDailyVerse() {
    try {
      const response = await fetch(DAILYVERSEAPI);
      const data = await response.json();

      const { text, reference } = data?.verse?.details || {};

      setDailyVerse({
        text: text ?? "",
        reference: reference ?? "",
      });
      // console.log(text);
      // console.log(reference);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <h1 style={{ padding: 0 }}>Hello, Elias 👋</h1>
      <h2>Quick Stats</h2>
      <h2>Daily Verse</h2>
      <div
        className="dv-text"
        style={{
          backgroundColor: `${DVColors[Math.floor(Math.random() * 4)]}`,
        }}
      >
        <h4>
          {dailyVerse.text
            ? `"${dailyVerse.text}"`
            : "Daily Verse is Loading..."}
        </h4>
        <p>{dailyVerse.reference}</p>
      </div>
    </>
  );
};

export default Dashboard;
