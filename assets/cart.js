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

function updateDOM(cartItemId, productVariantId, quantity) {
  const inputHolder = document.getElementById(cartItemId);
  const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
  input.value = quantity;
  const decrease = input.previousElementSibling;
  const increase = input.nextElementSibling;

  decrease
    .querySelector('button')
    .setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`);
  increase
    .querySelector('button')
    .setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`);
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
}

async function updateOnchange(cartItemId, productVariantId) {
  const inputHolder = document.getElementById(cartItemId);
  const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
  const quantity = input.value;

  await updateQuantity(cartItemId, productVariantId, quantity);
  updateDOM(cartItemId, productVariantId, quantity);
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
    await youcanjs.cart.removeItem({ cartItemId, productVariantId });
    document.getElementById(cartItemId).remove();

    const cartItemsBadge = document.getElementById('cart-items-badge');

    const cartItems = document.querySelectorAll('.cart__item');

    if (cartItemsBadge) {
      cartItemsBadge.innerText = parseInt(cartItemsBadge.innerText) + 1;
    }

    if (cartItems.length === 0) {
      if (cartItemsBadge) {
        cartItemsBadge.innerText = 0;
      }
      document.querySelector('.cart-table').remove();
      document.querySelector('.empty-cart').classList.remove('hidden');
    }
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
}

function moveQuantityWrapper() {
  const cartItemsTable = document.querySelector('.cart-items-table');
  const cartItemsTableWidth = cartItemsTable ? cartItemsTable.offsetWidth : 0;

  const mobileBreakpoint = 768;

  const quantityWrapper = document.querySelector('.quantity-wrapper');
  const quantityOnDesktop = document.querySelector('.quantity-on-desktop');
  const quantityOnMobile = document.querySelector('.quantity-on-mobile');

  if (window.innerWidth > mobileBreakpoint || cartItemsTableWidth > 500) {
    quantityOnDesktop.appendChild(quantityWrapper);

    if (quantityOnMobile.contains(quantityWrapper)) {
      quantityOnMobile.removeChild(quantityWrapper);
    }

    if (cartItemsTable.classList.contains('mobile')) {
      cartItemsTable.classList.remove('mobile');
    }

    if (!cartItemsTable.classList.contains('desktop')) {
      cartItemsTable.classList.add('desktop');
    }
  }
  if (window.innerWidth < mobileBreakpoint || cartItemsTableWidth < 500) {
    quantityOnMobile.appendChild(quantityWrapper);

    if (quantityOnDesktop.contains(quantityWrapper)) {
      quantityOnDesktop.removeChild(quantityWrapper);
    }

    if (!cartItemsTable.classList.contains('mobile')) {
      cartItemsTable.classList.add('mobile');
    }

    if (cartItemsTable.classList.contains('desktop')) {
      cartItemsTable.classList.remove('desktop');
    }
  }
}

moveQuantityWrapper();
window.addEventListener('resize', moveQuantityWrapper);
