const searchTitle = document.querySelector('#search-title');
const urlParams = new URLSearchParams(window.location.search);
const paginateBtnPrev = document.querySelector('.paginate-btn-prev');
const paginateBtnNext = document.querySelector('.paginate-btn-next');
const paginateBtnCurrent = document.querySelectorAll('.paginate-btn');
const sortField = urlParams.get('sort_field');
const sortOrder = urlParams.get('sort_order');
const sortSelect = document.querySelector('.sort-select');
const customSelect = document.querySelector('.custom-select');
const dropdownBtn = customSelect.querySelector('.select-icon');
const dropdownContent = customSelect.querySelector('.dropdown-list');

let page = +urlParams.get('page[cod]');

const query = urlParams.get('q');

if (searchTitle) {
  searchTitle.innerHTML = query;
}

/**
 * pagination
 */
const convertUrl = (key, value) => {
  const url = new URL(window.location.href);

  updateUrl(key, value, url);

  return url;
};

if (page <= 1 || !page) {
  page = 1;
}

if (paginateBtnPrev) {
  paginateBtnPrev.setAttribute('href', convertUrl('page[cod]', page - 1));
}

if (paginateBtnNext) {
  paginateBtnNext.setAttribute('href', convertUrl('page[cod]', page + 1));
}

if (paginateBtnCurrent) {
  paginateBtnCurrent.forEach((btn) => btn.setAttribute('href', convertUrl('page[cod]', btn.dataset.index)));
}
