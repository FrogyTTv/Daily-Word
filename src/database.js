
export async function loadDatabase() {
  const response = await fetch('./database.json'); // relative to the HTML file
  const database = await response.json();
  return database;
}

const main_section = document.getElementById('main-nav-section')
const database = await loadDatabase();

console.log(database)
console.log('Hei')

export function generateBookStack(name, numberOfChapters) {
  const detailsElement = document.createElement('details');
  detailsElement.name = 'book';
  
  const summaryElement = document.createElement('summary');
  summaryElement.textContent = name;

  const list = document.createElement('ul');
  
  for (let i = 1; i < (numberOfChapters + 1); i++) {
    const listElement = document.createElement('li')
    listElement.textContent = i;
    list.appendChild(listElement)
  }
  
  // Append summary and content to the details element
  detailsElement.appendChild(summaryElement);
  detailsElement.appendChild(list)
  
  main_section.appendChild(detailsElement);
}

export function updatePercentage(book, percentageElement) {
  let chaptersInTheBook = 0;
  let readChapters = 0;
  let percentageOfBook;
  
  for (let chapter in database.readingProgress[book]) {
    chaptersInTheBook++;
    if (database.readingProgress[book][chapter] === true) {
      readChapters++;
    }
  }
  
  // console.log(chaptersInTheBook);
  // console.log(readChapters);
  percentageOfBook = (readChapters / chaptersInTheBook) * 100;
  const roundedPercentage = Math.round(percentageOfBook * 100) / 100
  
  if (roundedPercentage === 100) {
    percentageElement.classList.toggle('book_completed')
  } else {
    percentageElement.classList.remove('book_completed')
  }
  percentageElement.textContent = ` ${roundedPercentage}%`
}



// export function resetEntireDatabase() {
//   for (const book in database.readingProgress) {
//     const chapters = database.readingProgress[book]
//     for (const chapter in chapters) {
//         database.readingProgress[book][chapter] = false
//     }
//   }
//   console.log(database)
// }


export function changeProperty(element, book, percentageElement) {
  element.addEventListener('click', function() {
    element.classList.toggle('active');

    // Update in-memory database
    database.readingProgress[book][element.textContent] = !database.readingProgress[book][element.textContent];

    updatePercentage(book, percentageElement)

    // Save the updated database via main process
    window.api.saveDatabase(database);
    console.log('Saved to database')
  });
}



// export function changeProperty(element, book) {
//   element.addEventListener('click', function() {
//     element.classList.toggle('active');
//     console.log(book)
//     console.log(element.textContent)
//     database.readingProgress[book][element.textContent] = !database.readingProgress[book][element.textContent]
//     console.log(database.readingProgress[book][element.textContent])
//   })
// }

// Write the information from the database to the screen.

// for (let book in database.readingProgress) {
//   const detailsElement = document.createElement('details');
//   detailsElement.name = 'book';

//   const summaryElement = document.createElement('summary');
//   summaryElement.textContent = book;

//   const list = document.createElement('ul');

//   console.log(book)
//   for (let chapter in database.readingProgress[book]) {
//     const listElement = document.createElement('li')
//     listElement.textContent = chapter;
//     list.appendChild(listElement)
//     console.log(chapter)
//   }

//   // Append summary and content to the details element
//   detailsElement.appendChild(summaryElement);
//   detailsElement.appendChild(list)
  
//   main_section.appendChild(detailsElement);
// }

