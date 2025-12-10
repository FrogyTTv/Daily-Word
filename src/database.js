


export async function loadDatabase() {
  const response = await fetch('./database.json'); // relative to the HTML file
  const database = await response.json();
  return database;
}

// loadData().then(database => console.log(database));

// loadData().then(database => {
//   console.log(database)
//   console.log(database.username)
// })
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

// generateBookStack('Frede', 67);
