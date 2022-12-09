async function addToCart() {
  const variantId = document.getElementById('variantId')?.value
  const quantity = document.getElementById('quantity')?.value
  const uploadedImageLink = document.querySelector('#yc-upload-link');

  if (!variantId) return notify('Please select a variant', 'error')
  if (!quantity) return notify('Please select a quantity', 'error')
  
  try {
    load('#loading__checkout')
    const response = await youcanjs.cart.addItem({ productVariantId: variantId, attachedImage: uploadedImageLink, quantity })
    if(response.error) throw new Error(response.error)
    stopLoad('#loading__checkout')
    notify(response.message, 'success')
  }
  catch (err) {
    console.log(err)
    stopLoad('#loading__checkout')
    notify(err.message, 'error')
  }
}
