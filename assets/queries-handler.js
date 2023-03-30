const searchTitle = document.querySelector('#search-title');
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');

if (searchTitle) {
  searchTitle.innerHTML = query;
}
