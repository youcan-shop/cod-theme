document.getElementById('express-checkout-form').addEventListener('submit', async function (e) {
  e.preventDefault()

  const fields = Object.fromEntries(new FormData(e.target))

  load('#loading__checkout')
  try {
    const productVariantId = document.getElementById('variantId').value
    const quantity = document.getElementById('quantity').value
    const attachedImage = document.querySelector('#yc-upload-link')?.value;
    const response = await youcanjs.checkout.placeExpressCheckoutOrder({ productVariantId, attachedImage, quantity,  fields })

    response
      .onSuccess((data, redirectToThankyouPage) => {
        redirectToThankyouPage()
      })
      .onValidationErr((data) => {
        notify(data, 'error')
        console.warn('validation error', data)
      })
      .onSkipShippingStep((data, redirectToShippingPage) => {
        redirectToShippingPage()
      })
      .onSkipPaymentStep((data, redirectToPaymentPage) => {
        redirectToPaymentPage()
      })
      .catch((err) => {
        console.error(err)
      })
  } catch (e) {
    console.error(e)
    notify(e.message, 'error')
  } finally {
    stopLoad('#loading__checkout')
  }
})
