async function addToCart() {
  const variantId = document.getElementById('variantId')?.value || undefined;
  const quantity = document.getElementById('quantity')?.value || 1;
  const uploadedImageLink = document.querySelector('#yc-upload-link')?.value || undefined;

  try {
    load('#loading__checkout');

    const response = await youcanjs.cart.addItem({
      productVariantId: variantId,
      attachedImage: uploadedImageLink,
      quantity,
    });

    if (response.error) throw new Error(response.error);

    const cart = document.querySelector('#cart-items-badge');

    if (cart) {
      let cartBadgeBudge = Number(cart.innerHTML);
      const newAddedItem = response.items.find((item) => item.productVariant.id === variantId);

      cart.innerHTML = ++cartBadgeBudge;

      addCartitemToDOM(newAddedItem);
    }

    stopLoad('#loading__checkout');
    notify('Item has been added successfully', 'success');
  } catch (err) {
    stopLoad('#loading__checkout');
    notify(err.message, 'error');
  }
}

function addCartitemToDOM(cartItem) {
  const cartItemsTable = document.querySelector('.cart-items-table');
  const cartItemsTableBody = cartItemsTable.querySelector('tbody');
  const cartItemsBadge = document.getElementById('cart-items-badge');

  const cartItemTemplate = document.querySelector('.cart__item');
  const cartItemClone = cartItemTemplate.cloneNode(true);

  cartItemClone.classList.remove('hidden');
  cartItemClone.classList.remove('cart__item');
  cartItemClone.id = cartItem.id;

  const cartItemName = cartItemClone.querySelector('.cart__item-name');
  cartItemName.innerText = cartItem.productVariant.product.name;
  console.log(cartItem);
  cartItemName.setAttribute('href', cartItem.url);

  const cartItemPrice = cartItemClone.querySelector('.cart__item-price');
  cartItemPrice.innerText = cartItem.price;

  const quantityWrapper = cartItemClone.querySelector('.quantity-wrapper');
  quantityWrapper.innerHTML = `
  <div class='decrease'>
    <button onclick="decreaseQuantity('${cartItem.id}', '${cartItem.productVariantId}', '${cartItem.quantity - 1}')">
      -
    </button>
  </div>
  <input
    onchange="updateOnchange('${cartItem.id}', '${cartItem.productVariantId}')"
    type='text'
    value='1'
    id='6baf66d1-b440-41b8-97b4-56daaaf96e94'>
  <div class='increase'>
    <button onclick="increaseQuantity('${cartItem.id}', '${cartItem.productVariantId}', '${cartItem.quantity + 1}')">
      +
    </button>
  </div>
  `;

  cartItemsTableBody.appendChild(cartItemClone);
}
