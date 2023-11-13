/**
 * @param {HTMLElement} element
 */
function showDropDownMenu(element) {
  element.classList.toggle('show');
}

/**
 * @param {HTMLElement} element
 * @param {Event} event
 */
function hideDropDownMenu(element, event)  {
  if (!event.target.matches('.dropbtn, .dropbtn *')) {
    element?.classList.remove('show');
  }
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} options
 * @param {Event} event
 */
function selectOption(element, options, event) {
  const selectedOption = event.target;

  options.forEach((option) => {
    option.classList.remove('selected');
  });

  selectedOption.classList.add('selected');
  element.firstElementChild.textContent = selectedOption.textContent;
}

function dropdownMenu() {
  const dropdownInputs = document.querySelectorAll('.dropdown-input');

  if(dropdownInputs.length === 0) {
    return;
  }

  dropdownInputs.forEach((dropDownInput) => {
    const selectInput = dropDownInput.querySelector('.dropbtn');
    const dropdownContent = dropDownInput.querySelector('.dropdown-content');

    selectInput.addEventListener('click', () => showDropDownMenu(dropdownContent));
    window.addEventListener('click', (event) => hideDropDownMenu(dropdownContent, event));

    const selectOptions = dropdownContent.querySelectorAll('li');

    if(selectOptions.length === 0) {
      return;
    }

    selectOptions.forEach((option) => {
      option.addEventListener('click', (event) => selectOption(selectInput, selectOptions, event));

      window.addEventListener('DOMContentLoaded', (event) => {
        if (option.classList.contains('selected')) {
          selectInput.firstElementChild.textContent = option.textContent;
        }
      });
    });
  });
}

dropdownMenu();
