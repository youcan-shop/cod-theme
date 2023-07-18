const promo = document.forms['promo'];
if (promo) {
  promo.addEventListener('submit', addPromo);
}

/**
 * Extract from a string only numbers
 * @param {string} str
 * @returns {number} number
 */
function extractNumbersFromString(str) {
  // Use a regular expression to match and remove non-numeric characters
  const numericPart = str.replace(/^[^0-9-]*(-?\d+(\.\d+)?)?.*$/, '$1');

  return parseFloat(numericPart);
}

async function addPromo(e) {
  e.preventDefault();
  const coupon = promo['coupon'].value;
  load('#loading__coupon');
  try {
    await youcanjs.checkout.applyCoupon(coupon);
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__coupon');
  }
}

function updateCart(item, quantity, totalPriceSelector, cartItemId, productVariantId) {
  const inputHolder = document.getElementById(item);
  const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
  input.value = quantity;
  const decrease = input.previousElementSibling;
  const increase = input.nextElementSibling;

  const productPrice = inputHolder.querySelector('.product-price').innerText;
  const price = extractNumbersFromString(productPrice);
  const totalPrice = inputHolder.querySelector(totalPriceSelector);

  decrease
    .querySelector('button')
    .setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`);
  increase
    .querySelector('button')
    .setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`);

  if (isNaN(quantity)) {
    totalPrice.innerText = 0;
  } else if (currencyCode && price) {
    totalPrice.innerText = `${price * quantity} ${currencyCode}`;
  }
}

function updateTotalPrice() {
  let calculateTotalPrice = 0;
  const itemPrices = document.querySelectorAll('.item-price');
  itemPrices.forEach(itemPrice => {
    const price = extractNumbersFromString(itemPrice.innerText);
    calculateTotalPrice += price;
  });

  const totalPriceElement = document.querySelector('.item-total-price');
  const totalPrice = calculateTotalPrice.toFixed(2);

  if (totalPriceElement) {
    totalPriceElement.innerText = `${totalPrice} ${currencyCode}`;
  }
}

function updateDOM(cartItemId, productVariantId, quantity) {
  updateCart(cartItemId, quantity, '.total-price', cartItemId, productVariantId);
  updateTotalPrice();
}

function updatePrice(cartItemUniqueId, productVariantId, quantity) {
  updateCart(`cart-item-${cartItemUniqueId}`, quantity, '.item-price', cartItemUniqueId, productVariantId);
}

async function updateQuantity(cartItemId, productVariantId, quantity) {
  load(`#loading__${cartItemId}`);
  try {
    await youcanjs.cart.updateItem({ cartItemId, productVariantId, quantity });
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
  updateDOM(cartItemId, productVariantId, quantity);
  updatePrice(cartItemId,productVariantId,quantity);
  updateTotalPrice();
}


async function updateOnchange(cartItemId, productVariantId) {
  const inputHolder = document.getElementById(cartItemId);
  const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
  const quantity = input.value;

  await updateQuantity(cartItemId, productVariantId, quantity);
  updateDOM(cartItemId, productVariantId, quantity);
  updatePrice(cartItemId,productVariantId,quantity);
  updateTotalPrice();
}

document.addEventListener('DOMContentLoaded', () => {
  updateTotalPrice();
});

async function decreaseQuantity(cartItemId, productVariantId, quantity) {
  if (quantity < 1) {
    return;
  }
  await updateQuantity(cartItemId, productVariantId, quantity);
}

async function increaseQuantity(cartItemId, productVariantId, quantity) {
  await updateQuantity(cartItemId, productVariantId, quantity);
}

async function removeItem(cartItemId, productVariantId) {
  load(`#loading__${cartItemId}`);
  try {
    await youcanjs.cart.removeItem({ cartItemId, productVariantId });
    document.getElementById(cartItemId).remove();
    document.getElementById(`cart-item-${cartItemId}`).remove();

    updateTotalPrice();
    await updateCartDrawer();

    const cartItemsBadge = document.getElementById('cart-items-badge');

    const cartItems = document.querySelectorAll('.cart__item');

    if (cartItemsBadge) {
      cartItemsBadge.innerText = parseInt(cartItemsBadge.innerText) - 1;
    }

    if (cartItems.length === 0) {
      if (cartItemsBadge) {
        cartItemsBadge.innerText = 0;
      }
      const cartTable = document.querySelector('.cart-table')
      const emptyCart = document.querySelector('.empty-cart');

      if (cartTable) {
        cartTable.remove();
      }

      if (emptyCart) {
        emptyCart.classList.remove('hidden');

        stickFooterAtBottom();
      }
    }
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
}

window.removeItem = removeItem;
