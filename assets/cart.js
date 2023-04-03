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

function extractCurrencyAndPrice(innerText) {
  let currency = '';
  let price = '';

  innerText.split(' ').forEach((element) => {
    if (isNaN(Number(element))) {
      currency += element;
    } else {
      price += element;
    }
  });

  return { currency, price };
}

function updateCart(item, quantity, totalPriceSelector, cartItemId, productVariantId) {
   const inputHolder = document.getElementById(item);
   const input = inputHolder.querySelector(`input[id="${productVariantId}"]`);
   input.value = quantity;
  
   const decrease = input.previousElementSibling.querySelector('button');
   const increase = input.nextElementSibling.querySelector('button');

   const productPriceElement = inputHolder.querySelector('.product-price');
   const { currency, price } = extractCurrencyAndPrice(productPriceElement.innerText);

   const totalPriceElement = inputHolder.querySelector(totalPriceSelector);

   decrease.setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`);
  
   increase.setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`);

  
    if (isNaN(quantity)) {
      totalPriceElement.innerText = `${currency} ${0}`;
    } else if (currency && price) {
      totalPriceElement.innerText = `${currency} ${price * quantity}`;
    }
}

function updateTotalPrice() {
  let totalPrice = 0;
  let currency;
  
  const itemPricesElements = document.querySelectorAll('.item-price');
  
  itemPricesElements.forEach(itemPriceElement => {
    const { currency: currentCurrency, price } = extractCurrencyAndPrice(itemPriceElement.innerText);

    currency = currentCurrency;
    totalPrice += Number(price);
  });

  const totalPriceElement = document.querySelector('.item-total-price');
  totalPriceElement.innerText = `${currency} ${totalPrice}`;
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
        cartItemsBadge.innerText = 0;
      }
      const cartTable = document.querySelector('.cart-table')
      const emptyCart = document.querySelector('.empty-cart');

      if (cartTable) {
        cartTable.remove();
      }

      if (emptyCart) {
        emptyCart.classList.remove('hidden');
      }
    }
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad(`#loading__${cartItemId}`);
  }
}

window.removeItem = removeItem;
