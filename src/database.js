
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

export function changeProperty(element, book) {
  element.addEventListener('click', function() {
    element.classList.toggle('active');

    // Update in-memory database
    database.readingProgress[book][element.textContent] = !database.readingProgress[book][element.textContent];

    // Save the updated database via main process
    window.api.saveDatabase(database);
    console.log(database)
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

