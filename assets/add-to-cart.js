async function addToCart(snippetId) {
  const parentSection = document.querySelector(`#s-${snippetId}`);

  const variantId = parentSection.querySelector(`#variantId`)?.value || undefined;
  const quantity = parentSection.querySelector(`#quantity`)?.value || 1;
  const uploadedImageLink = parentSection.querySelector(`#yc-upload-link`)?.value || undefined;

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
      let cartBadgeBudge = Number(cart.innerHTML);

      cart.innerHTML = ++cartBadgeBudge;
    }

    stopLoad('#loading__cart');
    notify('Item has been added successfully', 'success');
  } catch (err) {
    stopLoad('#loading__cart');
    notify(err.message, 'error');
  }
}
