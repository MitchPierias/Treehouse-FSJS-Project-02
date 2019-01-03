/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

const studentListElement = document.getElementsByClassName('student-list')[0];
const studentElements = Array.from(studentListElement.children);
let currentPage = 0;
let itemCount = 10;
let query = '';

/**
 * Show page
 * @desc Renders a filtered collection of student elements for the specified page
 * @param {number} page - The page number to render
 */
function showPage(page=currentPage) {
   // Filter student items for query
   const studentItems = (query == '') ? studentElements : studentElements.slice().filter((elem) => {
      const name = elem.querySelector('h3').innerHTML;
      const queryFilter = new RegExp(query,'gi');
      return queryFilter.test(name);
   });
   // Filter query results for page
   if (studentItems.length/itemCount < page) page = Math.floor(studentItems.length/itemCount);
   const visibleItems = studentItems.filter((elem, idx) => {
      return (idx >= (page*itemCount) && idx < ((page+1)*itemCount));
   });
   // Update the student list and links
   studentListElement.innerHTML = (visibleItems.length <= 0) ? `Oops... Looks like there's nobody by the name ${query}` : "";
   visibleItems.forEach(elem => studentListElement.appendChild(elem));
   const totalPages = Math.ceil(studentItems.length/itemCount);
   appendPageLinks(studentListElement, totalPages);
}

/**
 * Append Search Form
 * @desc Constructs an interactive search form and appends to the `page-header`
 */
function appendSearchForm() {
   // Fetch and create form elements
   const headerElem = document.getElementsByClassName('page-header')[0];
   const searchContainer = document.createElement('div');
   const searchInput = document.createElement('input');
   const searchButton = document.createElement('button');
   // Setup form elements and listeners
   searchContainer.className = 'student-search';
   searchInput.placeholder = 'Search for students...';
   searchButton.innerHTML = 'Search';
   searchButton.addEventListener('click', didSubmitSearch);
   searchInput.addEventListener('keyup', didChangeSearchInput);
   // Construct form and append to header
   searchContainer.appendChild(searchInput);
   searchContainer.appendChild(searchButton);
   headerElem.appendChild(searchContainer);
}

/**
 * Append Pagination
 * @desc Builds pagination elements and appends to the provided element
 * @param {HTMLElement} toElement - Element to append pagination too
 * @param {Number} totalPages - Number of available pages
 */
function appendPageLinks(toElement, totalPages) {
   // Create and configure elements
   const paginationElem = document.createElement('div');
   const listContainer = document.createElement('ul');
   const selectedPage = (totalPages < currentPage) ? totalPages-1 : currentPage;
   paginationElem.innerHTML = '';
   paginationElem.className = 'pagination';
   listContainer.addEventListener('click', didSelectPage);
   // Generate page links
   for (let idx=0;idx<totalPages;idx++) {
      let listItem = document.createElement('li');
      let linkItem = document.createElement('a');
      linkItem.className = (idx === selectedPage) ? 'active' : null;
      linkItem.innerHTML = idx+1;
      linkItem.href = '#';
      listItem.appendChild(linkItem);
      listContainer.appendChild(listItem);
   }
   // Add pagination elements
   paginationElem.appendChild(listContainer);
   toElement.appendChild(paginationElem);
}

/***************
   USER EVENTS
***************/

/**
 * Selected Page
 * @desc Handles the page link clicks, updates and reloads the page
 * @param {HTMLEvent} event - Page link clicked event
 */
function didSelectPage(event) {
   event.preventDefault();
   // Update the current page index and reload
   currentPage = Number(event.target.text)-1;
   showPage(currentPage);
}
/**
 * Search Input Changed
 * @desc Updates the query string and manages form control accessability
 * @param {HTMLFormEvent} event - Search input's on `keyup` event 
 */
function didChangeSearchInput(event) {
   // Update query string
   query = event.target.value;
   // Manage the search button accessability
   const headerElem = document.getElementsByClassName('page-header')[0];
   const searchButton = headerElem.querySelector('button');
   searchButton.disabled = (!query || query == '');
   // Force update page
   showPage();
}

/**
 * Submit Search
 * @desc Forces a page reload
 * @param {HTMLFormEvent} event - Search button clicked event 
 */
function didSubmitSearch(event) {
   event.preventDefault();
   if (!query || query == '') alert('Please tell us what you\'d like to find');
   showPage();
}

showPage();
appendSearchForm();