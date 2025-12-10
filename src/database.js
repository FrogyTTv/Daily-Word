// database-system.js (used in renderer)
export async function loadData() {
  const response = await fetch('./database.json'); // relative to the HTML file
  const database = await response.json();
  return database;
}

// Example usage
loadData().then(database => console.log(database));
