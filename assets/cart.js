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

    await fetchCoupons();

    notify(`${CART_PAGE_CONTENT.coupon_applied}`, 'success');
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__coupon');
  }
}

async function fetchCoupons() {
  try {
    const coupons = await youcanjs.cart.fetch();

    const discount = document.querySelector('.discount-price');
    const discountText = document.querySelector('.discount-text');
    const couponApplied = document.querySelector('.coupon-applied');
    const totalPrice = document.querySelector('.item-total-price');

    if (totalPrice) {
      totalPrice.innerText = coupons.total ? `${coupons.total} ${currencyCode}` : '';
    }

    if (coupons.coupon && coupons.discountedPrice) {
      couponApplied.innerHTML = `<span>${CART_PAGE_CONTENT.coupon}: '${coupons.coupon.code}'  [${coupons.coupon.value}%] </span>
                                 <ion-icon class="close-search" id="remove-coupon" name="close-outline"></ion-icon>`;
      discount.innerText = coupons.discountedPrice + ' ' + currencyCode;

      const removeCouponElement = document.getElementById("remove-coupon");
      if (removeCouponElement) {
        removeCouponElement.addEventListener('click', removeCoupons);
      }

      discountText.classList.remove('hidden');
    } else {
      if (couponApplied) {
        couponApplied.innerHTML = '';
      }

      if (discount) {
        discount.innerText = '';
      }

      if (discountText) {
        discountText.classList.add('hidden');
      }
    }
  } catch (e) {
    notify(e.message, 'error');
  }
}


async function removeCoupons(e) {
  e.preventDefault();
  load('#loading__coupon');
   try {
    await youcanjs.checkout.removeCoupons();

    await fetchCoupons();

    notify(`${CART_PAGE_CONTENT.coupon_removed}`, 'success');
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
}

function updateTotalPrice() {
  let calculateTotalPrice = 0;
  const itemPrices = document.querySelectorAll('.item-price');

  itemPrices.forEach(itemPrice => {
    const price = itemPrice.innerText;
    calculateTotalPrice += Number(price);
  });

  const totalPriceElement = document.querySelector('.item-total-price');
  const totalPrice = isFloat(calculateTotalPrice);
  const discountPrice = document.querySelector('.coupon-applied');

  if (totalPriceElement && !discountPrice) {
    totalPriceElement.innerText = `${totalPrice} ${currencyCode}`;
  }

  if (discountPrice) {
    fetchCoupons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setCurrencySymbol();
  updateTotalPrice();
  fetchCoupons();
});

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

function updateCartItemCount(count) {
  const cartItemsCount = document.getElementById('cart-items-count');
  if (cartItemsCount) {
    cartItemsCount.textContent = count;
  }
}

async function removeItem(cartItemId, productVariantId) {
  load(`#loading__${cartItemId}`);
  try {
    await youcanjs.cart.removeItem({ cartItemId, productVariantId });
    document.getElementById(cartItemId).remove();
    document.getElementById(`cart-item-${cartItemId}`).remove();

    const updatedCart = await youcanjs.cart.fetch();
    updateCartItemCount(updatedCart.count);

    updateTotalPrice();
    await updateCartDrawer();

    const cartItemsBadge = document.getElementById('cart-items-badge');

    const cartItems = document.querySelectorAll('.cart__item');

    if (cartItemsBadge) {
      cartItemsBadge.innerText = parseInt(cartItemsBadge.innerText) - 1;
    }

    if (cartItems.length === 0) {
      if (cartItemsBadge) {
      }
      cartItemsBadge.innerText = 0;
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
