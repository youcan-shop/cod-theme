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
      cart.innerHTML = response.items.length;

      addCartItemToDrawerDOM(response.items);
      openDrawer('.cart-drawer');
    }

    stopLoad('#loading__checkout');
    notify('Item has been added successfully', 'success');
  } catch (err) {
    stopLoad('#loading__checkout');
    notify(err.message, 'error');
  }
}

function addCartItemToDrawerDOM(cartItems) {
  const cartItemsTable = document.querySelector('.cart-items-table');
  const cartItemsTableBody = cartItemsTable.querySelector('tbody');
  const cartItemTemplate = document.querySelector('.cart__item');
  const cartItemClone = cartItemTemplate.cloneNode(true);

  cartItemsTableBody.innerHTML = '';

  cartItems.forEach((cartItem) => {
    const cartItemName = cartItemClone.querySelector('.cart__item-name');
    const cartItemPrice = cartItemClone.querySelector('.cart__item-price');
    const quantityWrapper = cartItemClone.querySelector('.quantity-wrapper');
    const cartItemImage = cartItemClone.querySelector('img');

    cartItemClone.id = cartItem.id;
    cartItemImage.setAttribute(
      'src',
      cartItem.productVariant.image.url || cartItem.productVariant.product.images[0].url,
    );

    cartItemName.innerText = cartItem.productVariant.product.name;
    console.log(cartItem);
    cartItemName.setAttribute('href', cartItem.url);

    cartItemPrice.innerText = cartItem.price;

    quantityWrapper.innerHTML = `
        <div class='decrease'>
          <button onclick="decreaseQuantity('${cartItem.id}',
            '${cartItem.productVariant.id}',
            '${(cartItem.quantity <= 0 ? 1 : cartItem.quantity) - 1}')"
          >
            -
          </button>
        </div>
        <input
          onchange="updateOnchange('${cartItem.id}', '${cartItem.productVariant.id}')"
          type='text'
          value='${cartItem.quantity}'
          id='6baf66d1-b440-41b8-97b4-56daaaf96e94'>
        <div class='increase'>
          <button onclick="increaseQuantity('${cartItem.id}',
            '${cartItem.productVariant.id}',
            '${cartItem.quantity + 1}')"
          >
            +
          </button>
        </div>
      `;

    cartItemsTableBody.appendChild(cartItemClone);
  });
}
