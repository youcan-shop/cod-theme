const currencyCode = window.Dotshop.currency.code;

async function addToCart(snippetId) {
  const parentSection = document.querySelector(`#s-${snippetId}`);
  const variantId = parentSection.querySelector(`#variantId`)?.value || undefined;
  const quantity = parentSection.querySelector(`#quantity`)?.value || 1;
  const uploadedImageLink = parentSection.querySelector(`#yc-upload-link`)?.value || undefined;

  if (!variantId) {
    return notify(ADD_TO_CART_EXPECTED_ERRORS.select_variant, 'error');
  }

  if (quantity < 1) {
    return notify(ADD_TO_CART_EXPECTED_ERRORS.quantity_smaller_than_zero, 'error');
  }

  try {
    load('#loading__cart');

    const response = await youcanjs.cart.addItem({
      productVariantId: variantId,
      attachedImage: uploadedImageLink,
      quantity,
    });

    if (response.error) throw new Error(response.error);

    const cart = document.querySelector('#cart-items-badge');
    const cartDrawer = document.querySelector('.cart-drawer');

    if (cart) {
      let cartBadgeBudge = response.count;
      cart.innerHTML = cartBadgeBudge;
      
      // Update the cart drawer
      if (cartDrawer) {
        await updateCartDrawer();
      }
    }

    stopLoad('#loading__cart');
    notify(ADD_TO_CART_EXPECTED_ERRORS.product_added, 'success');
    toggleCartDrawer();
  } catch (err) {
    stopLoad('#loading__cart');
    notify(err.message, 'error');
  }
}

function attachRemoveItemListeners() {
  document.querySelectorAll('.remove-item-btn').forEach((btn) =>
    btn.addEventListener('click', async (event) => {
      const cartItemId = event.target.getAttribute('data-cart-item-id');
      const productVariantId = event.target.getAttribute('data-product-variant-id');

      await removeCartItem(cartItemId, productVariantId);
      
      // Update the cart drawer after removing an item
      await updateCartDrawer();
      
      // Update the total number of items in the cart badge
      const cartBadge = document.querySelector('#cart-items-badge');
      
      if (cartBadge) {
        const updatedCount = Number(cartBadge.innerHTML) - 1;
        cartBadge.innerHTML = updatedCount;
      }
    })
  );
}

async function removeCartItem(cartItemId, productVariantId) {
  // Get the remove button and spinner elements for this cartItemId
  const removeButton = document.querySelector(`[data-cart-item-id="${cartItemId}"]`);
  const spinner = document.querySelector(`[data-spinner-id="${cartItemId}"]`);

  try {
    // Hide the remove button and show the spinner
    if (removeButton) {
      removeButton.style.display = 'none';
    }
    if (spinner) {
      spinner.style.display = 'block';
    }

    const response = await youcanjs.cart.removeItem({
      cartItemId,
      productVariantId,
    });
  } catch (error) {
    notify(error.message, 'error');
  } finally {
    if (spinner) {
      spinner.style.display = 'none';
      updateCartDrawer();
     }
   }
}

function cartTemplate(item) {
  // Loop through variations
  const variationsArray = [];
  for (const key in item.productVariant.variations) {
    if (item.productVariant.variations.hasOwnProperty(key)) {
      variationsArray.push(`${key}: ${item.productVariant.variations[key]}`);
    }
  }
  const variationsString = variationsArray.join('&nbsp;&nbsp;');
  const variationsCheck = variationsString === 'default: default' ? '' : variationsString;

  // Check if there's an image URL available
  const imageUrl = item.productVariant.product.images.length > 0 ? item.productVariant.product.images[0].url : defaultImage;
  return `
    <li class="cart-item">
      <div class="item-body">
        ${imageUrl && `<img src="${imageUrl}" />`}
        <div class="item-details">
          <p class="product-name">${item.productVariant.product.name}</p>
          <div class="variants">
          ${CART_DRAWER_TRANSLATION.quantityVariant}:${item.quantity} &nbsp;${variationsCheck}
          </div>
          <div class="product-price">
            <span class="compare-price">${item.productVariant.compare_at_price ? item.productVariant.compare_at_price : ''}</span>
            <span class="compare-price-currency">${currencyCode}</span>
            <div class="currency-wrapper">
              <span class="price">${item.productVariant.price}</span>
              <span class="currency-code">${currencyCode}</span>
            </div>
          </div>
          <button class="remove-item-btn">
            <ion-icon data-cart-item-id="${item.id}" data-product-variant-id="${item.productVariant.id}" name="trash-outline"></ion-icon>
          </button>
          <div class="spinner" data-spinner-id="${item.id}" style="display: none;"></div>
        </div>
      </div>
    </li>
  `;
}

async function updateCartDrawer() {
  const cartDrawerContent = document.querySelector('.cart-drawer__content');

  try {
    const cartData = await youcanjs.cart.fetch();

    document.querySelector('.cart-drawer__close').addEventListener('click', toggleCartDrawer);

    if (!cartDrawerContent) {
      console.error('Cart drawer content not found');
      return;
    }

    // Clear existing content
    cartDrawerContent.innerHTML = '';

    const headerContainer = `
      <div class="header">
        <h2 class="cart">${CART_DRAWER_TRANSLATION.cartName}<span> ${cartData.count}</span></h2>
      </div>
    `;
    
    cartDrawerContent.innerHTML += headerContainer;
    
    // Check if the cart has items
    if (cartData.count > 0) {
      const products = document.createElement('ul');

      for (const item of cartData.items) {
        products.innerHTML += cartTemplate(item);
      }
    
      cartDrawerContent.appendChild(products);
    
      // Attach event listeners to the newly added remove buttons
      attachRemoveItemListeners();
    
    } else {
      const p = document.createElement('p');
      p.classList.add('empty-cart');
      p.textContent = CART_DRAWER_TRANSLATION.emptyCart;
      cartDrawerContent.appendChild(p);
    }

    const footerContainerHTML = `
        <div class="footer">
          <div class="price-wrapper">
            <span class="total-price">${CART_DRAWER_TRANSLATION.totalAmount}</span>
            <div class="currency-wrapper">
              <span class="currency-value">${cartData.sub_total}</span>
              <span class="currency-code">${currencyCode}</span>
            </div>
          </div>
          <a href='${location.origin}/cart' class="yc-btn">${CART_DRAWER_TRANSLATION.checkoutPayment}</a>
        </div>
    `;

    // Create a DOM element for the footer container
    const footerContainer = document.createElement('div');
    footerContainer.innerHTML = footerContainerHTML;
    
    // Append the footer container to the cart drawer content
    cartDrawerContent.appendChild(footerContainer);

  } catch (error) {
    notify(error.message, 'error');
  }
}

function toggleCartDrawer() {
  const cartDrawer = document.querySelector('.cart-drawer');
  
  if (!cartDrawer) {
    console.error('Cart drawer not found');
    return;
  }

  if (cartDrawer.classList.contains('open')) {
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }

  // Toggle the 'open' class on the cart drawer
  cartDrawer.classList.toggle('open');
  document.querySelector('.cart-overlay').classList.toggle('open');
}

// Handle closing the cart drawer when clicking outside of it
document.addEventListener('DOMContentLoaded', async () => {
  // Attach click event listener to the navbar cart icon
  document.querySelector('#navbar-cart-icon').addEventListener('click', toggleCartDrawer);

  // Attach click event listener to the cart drawer close button
  document.querySelector('.cart-drawer__close').addEventListener('click', toggleCartDrawer);

  // Attach click event listener to the cart overlay
  document.querySelector('.cart-overlay').addEventListener('click', toggleCartDrawer);

  // Update Cart Drawer on page load
  await updateCartDrawer();
});

window.updateCartDrawer = updateCartDrawer;