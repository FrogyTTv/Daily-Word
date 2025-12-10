const nav_dashboard = document.getElementById("dashboard")
const nav_notes = document.getElementById("notes&highlights")
const nav_chapters = document.getElementById("chapters")
const nav_analytics = document.getElementById("analytics")
const nav_support = document.getElementById("support")
const nav_settings = document.getElementById("settings")

// Makes the client enter the search input when pressing Command + F

window.addEventListener('keydown', (event) => {
  const isCmdF = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f';
  if (isCmdF) {
    event.preventDefault(); // prevent default browser find
    const input = document.getElementById('search_input');
    if (input) {
      input.focus();
      // Optionally, select the content:
      input.select();
    }
  }
});

nav_dashboard.addEventListener('click', function() {
  window.location.replace('./index.html')
});
nav_notes.addEventListener('click', function() {
  window.location.replace('./notes_highlights.html')
});