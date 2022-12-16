document.getElementById('express-checkout-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  let fields = Object.fromEntries(new FormData(e.target));

  load('#loading__checkout');
  try {
    const productVariantId = document.getElementById('variantId').value;
    const quantity = document.getElementById('quantity').value || 1;
    const attachedImage = document.querySelector('#yc-upload-link')?.value;
    fields = { ...fields, attachedImage };

    const response = await youcanjs.checkout.placeExpressCheckoutOrder({ productVariantId, quantity, fields });

    response
      .onSuccess((data, redirectToThankyouPage) => {
        redirectToThankyouPage();
      })
      .onValidationErr((data) => {
        notify(data, 'error');
      })
      .onSkipShippingStep((data, redirectToShippingPage) => {
        redirectToShippingPage();
      })
      .onSkipPaymentStep((data, redirectToPaymentPage) => {
        redirectToPaymentPage();
      })
      .catch((err) => {
        notify(err.message, 'error');
      });
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__checkout');
  }
});
