async function addToCart() {
  const variantId = document.getElementById('variantId')?.value
  const quantity = document.getElementById('quantity')?.value
  const uploadedImageLink = document.querySelector('#yc-upload-link')?.value;

  if (!variantId)
    return notify('Please select a variant', 'error')
  
  if (!quantity)
    return notify('Please select a quantity', 'error')
  
  try {
    load('#loading__checkout')
    
    const response = await youcanjs.cart.addItem({ productVariantId: variantId, attachedImage: uploadedImageLink, quantity })
    if (response.error) throw new Error(response.error)
    
    stopLoad('#loading__checkout')
    notify("Item has been added successfully", 'success')
  }
  catch (err) {
    stopLoad('#loading__checkout')
    notify(err.message, 'error')
  }
}
