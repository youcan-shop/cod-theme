
function formatOptions(str) {
  const arr = JSON.parse(str.slice(1, -1));
  const arabicArr = arr.map((elem) => {
    return elem.replace(/\\u([\dA-F]{4})/gi, function (match, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    });
  });
  return arabicArr;
}

function setCustomSelect(select_id, select_options) {
  const select = document.querySelector(`#custom-select-${select_id} select`);
  const list = document.querySelector(`#custom-select-${select_id} .dropdown-list`);

  const options = format ? formatOptions(select_options).map(option => ({ label: option, value: option })) : select_options;

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
      select.value = event.target.dataset.value;
      list.classList.remove('show');
    }
  });
}
