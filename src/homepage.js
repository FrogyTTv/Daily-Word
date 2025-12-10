import { loadData } from "./database.js";

const title = document.getElementById('title')
const database = await loadData();


title.textContent = `Hello, ${database.username} 👋`;
console.log(title)