const paginateBtnPrev = document.querySelector('.paginate-btn-prev');
const paginateBtnNext = document.querySelector('.paginate-btn-next');
const paginateBtnCurrent = document.querySelectorAll('.paginate-btn');
const searchTitle = document.querySelector('#search-title');
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
const sortField = urlParams.get('sort_field');
const sortOrder = urlParams.get('sort_order');
const sortSelect = document.querySelector('.sort-select');
let page = +urlParams.get('page[cod]');

const updateUrl = (key, value, url) => {
  if (url.searchParams.has(key)) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.append(key, value);
  }
};

const convertUrl = (key, value) => {
  const url = new URL(window.location.href);

  updateUrl(key, value, url);

  return url;
};

const convertUrlWithMultipleQuery = (keys, values) => {
  const url = new URL(window.location.href);

  keys.forEach((key, i) => updateUrl(key, values[i], url));

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

if (searchTitle) {
  searchTitle.innerHTML = query;
}
// dropdown select
function setupDropdown(dropdownContent, convertUrlWithMultipleQuery) {
  // Handle the click event for the options in the dropdown
  dropdownContent.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedValue = event.target.getAttribute('data-value');
    const [newSortField, newSortOrder] = selectedValue.split('-');

    window.location.href = convertUrlWithMultipleQuery(['sort_field', 'sort_order'], [newSortField, newSortOrder]);
  });
}

function filterProduct() {
  const productFiltring = document.querySelector('#productDropdownFiltring');
  const filterDropdownBtn = productFiltring?.querySelector('.dropbtn');
  const filterDropdownContent = productFiltring?.querySelector('.dropdown-content');

  if (productFiltring) {
    const sortField = urlParams.get('sort_field') || 'price';
    const sortOrder = urlParams.get('sort_order') || 'asc';

    // Get the selected option from the URL parameters
    const selectedOption = filterDropdownContent.querySelector(`[data-value="${sortField}-${sortOrder}"]`);

    // Update the dropdown button text with the selected option
    filterDropdownBtn.innerHTML = `<span class='order-by'>${selectedOption.textContent} </span>`;

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'chevron-down-outline');
    icon.classList.add('dropdown-icon');
    filterDropdownBtn.appendChild(icon);

    selectedOption.style.fontWeight = 'bold';

    setupDropdown(filterDropdownContent, convertUrlWithMultipleQuery);
  }
}

filterProduct();
