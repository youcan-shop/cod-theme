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
        const form = document.querySelector('#express-checkout-form');
        const formFields = Object.keys(err.meta.fields);

        if (!form || !formFields) return;

        formFields.forEach((field) => {
          const fieldName = field.indexOf('extra_fields') > -1 ? field.replace('extra_fields.', 'extra_fields[') + ']' : field;
          const input = form.querySelector(`input[name="${fieldName}"]`);
          const errorEl = form.querySelector(`.validation-error[data-error="${field}"]`);

          if (input) {
            input.classList.add('error');
          }

          if (errorEl) {
            errorEl.innerHTML = err.meta.fields[field][0];
          }

          input.addEventListener('input', () => {
            input.classList.remove('error');
            errorEl.innerHTML = '';
          });
        });

        notify(err.detail, 'error');

        const formTop = form.getBoundingClientRect().top;

        if(!document.querySelector('#yc-sticky-checkout')) {
          window.scrollBy({ top: formTop - window.innerHeight / 3, behavior: 'smooth' });
        }
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
