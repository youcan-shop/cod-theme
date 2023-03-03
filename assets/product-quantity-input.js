// Increment or Decrement custom quantity input

function manipulateQuantity() {
  const decrementButton = $('.decrement-button');
  const incrementButton = $('.increment-button');
  const quantityInput = $('.quantity-input');

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
}

manipulateQuantity();
