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

  // TODO: check the case when the product doesn't require an image
  // if (!uploadedImageLink) {
  //   return notify(ADD_TO_CART_EXPECTED_ERRORS.upload_image, 'error');
  // }

  try {
    load('#loading__cart');

    const response = await youcanjs.cart.addItem({
      productVariantId: variantId,
      attachedImage: uploadedImageLink,
      quantity,
    });

    if (response.error) throw new Error(response.error);

    const cart = document.querySelector('#cart-items-badge');

    if (cart) {
      cart.innerHTML = response.count || 0;
    }

    stopLoad('#loading__cart');
    notify(ADD_TO_CART_EXPECTED_ERRORS.product_added, 'success');
    openDrawer('.cart-drawer');
    setupCartDrawer();
  } catch (err) {
    stopLoad('#loading__cart');
    notify(err.message, 'error');
  }
}
