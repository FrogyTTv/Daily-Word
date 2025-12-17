import { loadDatabase } from "./database.js";

const bibleReadDisplay = document.getElementById('BiblePercentageDisplay')
const streakDisplay = document.getElementById('StreakDisplay')
const chaptersReadDisplay = document.getElementById('ChaptersReadDisplay')
const booksReadDisplay = document.getElementById('BooksReadDisplay')

const database = await loadDatabase();
const title = document.getElementById('title')

console.log(database.username)
title.textContent = `Hello, ${database.username} 👋`;
console.log(title)

let readChapters = 0
let numberOfChapters = 0
let completedBooks = 0

for (const book in database.readingProgress) {
    const chapters = database.readingProgress[book]

    let allChaptersRead = true;

    for (const chapter in chapters) {
        numberOfChapters++;
        if (chapters[chapter] === true) {
            readChapters++;
        }
        if (chapters[chapter] !== true) {
            allChaptersRead = false;
        }
    }
    if (allChaptersRead === true) {
        completedBooks++
    }
}

console.log(completedBooks)
console.log(numberOfChapters)
console.log(readChapters)

let biblePercentage = (readChapters / numberOfChapters) * 100;
const roundedBiblePercentage = Math.round(biblePercentage * 100) / 100

bibleReadDisplay.textContent = `${roundedBiblePercentage}%`
chaptersReadDisplay.textContent = readChapters
booksReadDisplay.textContent = completedBooks