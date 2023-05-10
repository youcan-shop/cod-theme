/**
 * set the height of the page to fit the screen resolution
 */
function setHeightPage() {
  const htmlPageHeight = document.documentElement.clientHeight;
  const bodyHeight = document.body.offsetHeight;
  const emptyCart =  $('.empty-cart');
  const emptySpaceHeight = htmlPageHeight - bodyHeight;

  emptyCart.style.height = `${emptyCart.offsetHeight + emptySpaceHeight}px`;
}

setHeightPage();

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

  const productPrice = inputHolder.querySelector('.product-price').innerText;
  const currency = productPrice.split(' ')[0];
  const price = productPrice.split(' ')[1];
  const totalPrice = inputHolder.querySelector(totalPriceSelector);

  decrease
    .querySelector('button')
    .setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`);
  increase
    .querySelector('button')
    .setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`);

  if (isNaN(quantity)) {
    totalPrice.innerText = 0;
  } else if (currency && price) {
    totalPrice.innerText = `${currency} ${price * quantity}`;
  }
}

function updateTotalPrice() {
  let totalPrice = 0;
  let currency;
  const itemPrices = document.querySelectorAll('.item-price');
  itemPrices.forEach(itemPrice => {
    currency = itemPrice.innerText.split(' ')[0];
    const price = itemPrice.innerText.split(' ')[1];
    totalPrice += Number(price);
  });

  const totalPriceElement = document.querySelector('.item-total-price');

  if (totalPriceElement) {
    totalPriceElement.innerText = `${currency} ${totalPrice}`;
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
    const response = await youcanjs.cart.removeItem({ cartItemId, productVariantId });
    document.getElementById(cartItemId).remove();
    document.getElementById(`cart-item-${cartItemId}`).remove();

    updateTotalPrice();

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

        setHeightPage();
      }
    }
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
}

