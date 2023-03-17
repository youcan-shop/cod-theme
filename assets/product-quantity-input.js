/**
 * Increment or Decrement custom quantity input
 */
function manipulateQuantity() {
  const quantityFields = document.querySelectorAll('.quantity-field')

  quantityFields.forEach(field => {
    const decrementButton = field.querySelector('.decrement-button');
    const incrementButton = field.querySelector('.increment-button');
    const quantityInput = field.querySelector('.quantity-input');

    decrementButton?.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    incrementButton?.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
  })
}

manipulateQuantity();
