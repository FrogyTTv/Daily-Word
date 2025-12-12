


export async function loadDatabase() {
  const response = await fetch('./database.json'); // relative to the HTML file
  const database = await response.json();
  return database;
}

const main_section = document.getElementById('main-nav-section')

const database = await loadDatabase();

console.log(database)

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
    // console.log(i)
  }
  
  // Append summary and content to the details element
  detailsElement.appendChild(summaryElement);
  detailsElement.appendChild(list)
  
  main_section.appendChild(detailsElement);
}

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



// Når listElementet lages så sjekker den om elementet inni er true eller false, så legger man på en eventlistner og en id.
// eventlisnern 