/**
 * Increment or Decrement custom quantity input
 */
function manipulateQuantity() {
  const decrementButton = $('.decrement-button');
  const incrementButton = $('.increment-button');
  const quantityInput = $('.quantity-input');

  /**
   * Decreases quantity value by 1 when decrement button is clicked
   */
  decrementButton?.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  /**
   * Increases quantity value by 1 when increment button is clicked
   */
  incrementButton?.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
}

manipulateQuantity();
