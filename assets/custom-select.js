function formatOptions(str) {
  const arr = JSON.parse(str.slice(1, -1));
  const arabicArr = arr.map((elem) => {
    return elem.replace(/\\u([\dA-F]{4})/gi, function (match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
  });
  return arabicArr;
}

const updateUrl = (key, value, url) => {
  if (url.searchParams.has(key)) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.append(key, value);
  }
};

const convertUrlWithMultipleQuery = (keys, values) => {
  const url = new URL(window.location.href);

  keys.forEach((key, i) => updateUrl(key, values[i], url));

  return url;
};

function setCustomSelect(select_id, select_options, handlerFunction) {
  const select = document.querySelector(`#custom-select-${select_id} select`);
  const list = document.querySelector(`#custom-select-${select_id} .dropdown-list`);

  const options = format
    ? formatOptions(select_options).map((option) => ({ label: option, value: option }))
    : select_options;

  options.forEach(option => {
    const selectOption = document.createElement('option');
    selectOption.value = option.value;
    selectOption.text = option.label;
    select.appendChild(selectOption);

    const dropdownOption = document.createElement('div');
    dropdownOption.classList.add('dropdown-option');
    dropdownOption.dataset.value = option.value;
    dropdownOption.textContent = option.label;
    list.appendChild(dropdownOption);
  });

  select.addEventListener('click', event => {
    event.preventDefault();
    list.classList.toggle('show');
  });

  list.addEventListener('click', event => {
    if (event.target.classList.contains('dropdown-option')) {
      const selectedValue = event.target.dataset.value;
      select.value = selectedValue;
      list.classList.remove('show');
  
      if (handlerFunction) {
        handlerFunction(select_id, selectedValue);
      }
    }
  });
  
  if (handlerFunction) {
    handlerFunction(select_id);
  }
}  

function selectSortValue(select_id, selectedValue) {
  const select = document.querySelector(`#custom-select-${select_id} select`);

  // Set the default selected value in the .selected-option element
  const currentSortField = new URL(window.location.href).searchParams.get('sort_field') || 'price';
  const currentSortOrder = new URL(window.location.href).searchParams.get('sort_order') || 'asc';
  const currentSelectedValue = `${currentSortField}-${currentSortOrder}`;

  // Update the selected value in the dropdown
  select.value = currentSelectedValue;

  // Handle sorting functionality
  const updateUrlOnSelect = document.querySelector(`#custom-select-${select_id}`).closest('.sort-select');
  if (updateUrlOnSelect && selectedValue) {
    const [newSortField, newSortOrder] = selectedValue.split('-');
    window.location.href = convertUrlWithMultipleQuery(['sort_field', 'sort_order'], [newSortField, newSortOrder]);
  }
}
