import { loadData, getUsername } from "./database.js";

const title = document.getElementById('title')
const username = await getUsername();
title.textContent = `Hello, ${username} 👋`;
console.log(title)