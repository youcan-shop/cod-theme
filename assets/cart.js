/**
 * Set the currency symbol in the dom for each element
 */
function setCurrencySymbol() {
  const elements = document.querySelectorAll('.product-currency');

  elements.forEach((element) => {
    element.innerText = currencyCode;
  })
}

const promo = document.forms['promo'];
if (promo) {
  promo.addEventListener('submit', addPromo);
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

  const productPrice = inputHolder.querySelector('.product-price');
  const price = productPrice.innerText;
  const totalPrice = inputHolder.querySelector(totalPriceSelector);

  decrease
    .querySelector('button')
    .setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`);
  increase
    .querySelector('button')
    .setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`);

  if (isNaN(quantity)) {
    totalPrice.innerText = 0;
  } else if (price) {
    totalPrice.innerText = isFloat(Number(price) * quantity);
  }

  setupCartDrawer();
}

function updateDOM(cartItemId, productVariantId, quantity) {
  updateCart(cartItemId, quantity, '.total-price', cartItemId, productVariantId);
}

function updatePrice(cartItemUniqueId, productVariantId, quantity) {
  updateCart(`cart-item-${cartItemUniqueId}`, quantity, '.item-price', cartItemUniqueId, productVariantId);
}

async function updateTotalPrice() {
  try {
    const cartObject = await youcanjs.cart.fetch();

    if (!cartObject) return;

    const totalPriceElement = document.querySelector('.item-total-price');

    if (totalPriceElement) {
      totalPriceElement.innerHTML = `${isFloat(cartObject.sub_total)} ${currencyCode}`;
    }
  } catch (e) {
    notify(e.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setCurrencySymbol();
  await updateTotalPrice();
});

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
  updatePrice(cartItemId, productVariantId, quantity);
  await updateTotalPrice();
  setupCartDrawer();
}

async function updateOnchange(cartItemId, productVariantId) {
  const inputHolder = document.getElementById(cartItemId);
  const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
  const quantity = input.value;

  await updateQuantity(cartItemId, productVariantId, quantity);
}

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
    const response = await youcanjs.cart.removeItem({ cartItemId, productVariantId });
    document.getElementById(cartItemId).remove();
    document.getElementById(`cart-item-${cartItemId}`).remove();

    await updateTotalPrice();

    const cartItemsCount = document.getElementById('cart-items-count');
    const cartItemsBadge = document.getElementById('cart-items-badge');

    const cartItems = document.querySelectorAll('.cart__item');

    cartItemsCount.innerText = response.count;
    cartItemsBadge.innerText = response.count;

    if (cartItems.length === 0) {
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

    setupCartDrawer();
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
}
