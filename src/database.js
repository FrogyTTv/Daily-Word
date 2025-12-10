
export async function loadData() {
  const response = await fetch('./database.json'); // relative to the HTML file
  const database = await response.json();
  return database;
}

// loadData().then(database => console.log(database));

loadData().then(database => {
  console.log(database)
  console.log(database.username)
})