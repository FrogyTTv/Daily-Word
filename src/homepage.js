import { loadDatabase } from "./database.js";

const title = document.getElementById('title')
const database = await loadDatabase();


console.log(database.username)
title.textContent = `Hello, ${database.username} 👋`;
console.log(title)