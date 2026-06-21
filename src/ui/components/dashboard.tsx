import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [dailyVerse, setDailyVerse] = useState({ text: "", reference: "" });
  const DAILYVERSEAPI =
    "https://beta.ourmanna.com/api/v1/get/?format=json&order=daily";

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
      <p>{dailyVerse.text}</p>
      <p>{dailyVerse.reference}</p>
    </>
  );
};

export default Dashboard;
