async function placeOrder() {
  const expressCheckoutForm = document.querySelector('#express-checkout-form');
  let fields = Object.fromEntries(new FormData(expressCheckoutForm));

  load('#loading__checkout');
  try {
    const productVariantId = document.getElementById('variantId')?.value;
    const quantity = document.getElementById('quantity')?.value || 1;
    const attachedImage = document.querySelector('#yc-upload-link')?.value;

    if (attachedImage) {
      fields = { ...fields, attachedImage };
    }

    const response = await youcanjs.checkout.placeExpressCheckoutOrder({ productVariantId, quantity, fields });

    response
      .onSuccess((data, redirectToThankyouPage) => {
        redirectToThankyouPage();
      })
      .onValidationErr((err) => {
        displayValidationErrors(err);
      })
      .onSkipShippingStep((data, redirectToShippingPage) => {
        redirectToShippingPage();
      })
      .onSkipPaymentStep((data, redirectToPaymentPage) => {
        redirectToPaymentPage();
      });
  } catch (e) {
    notify(e.message, 'error');
  } finally {
    stopLoad('#loading__checkout');
  }
}

function displayValidationErrors(err) {
  const form = document.querySelector('#express-checkout-form');
  const errorDetails = err.meta.fields;

  if (!form || !Object.keys(errorDetails).length) return;

  form.querySelectorAll('.validation-error').forEach(el => {
    el.textContent = '';
    el.previousElementSibling?.classList.remove('error');
  });

  Object.entries(errorDetails).forEach(([field, messages]) => {
    const fieldName = `extra_fields[${field}]`;
    const input = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = form.querySelector(`.validation-error[data-error-for="${fieldName}"]`);

    if (input && errorEl) {
      input.classList.add('error');
      errorEl.textContent = messages[0];

      input.addEventListener('input', () => {
        input.classList.remove('error');
        errorEl.textContent = '';
      });
    } else {
      notify(messages[0], 'error');
    }
  });
}
