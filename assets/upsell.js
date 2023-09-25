document.getElementById("upsell-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const answer = event.submitter.value;
  formData.set("answer", answer);

  const yesButton = document.querySelector(".upsell-submit-yes");
  const noButton = document.querySelector(".upsell-submit-no");
  const buttonText = event.submitter.querySelector(".button-text");
  const spinnerLoader = event.submitter.querySelector(".spinner");

  yesButton.disabled = true;
  noButton.disabled = true;
  buttonText.style.display = "none";
  spinnerLoader.style.display = "inline-block";

  const upsellParams = {
    upsell_id: formData.get("upsell_id"),
    answer: answer,
    order_id: formData.get("order_id"),
    product_offers: {}
  };

  formData.forEach((value, key) => {
    if (key.startsWith("product_offers")) {
      const productId = key;
      upsellParams.product_offers[productId] = value;
    }
  });

  try {
    const response = await youcanjs.upsell.answer(upsellParams);

    if (response.error) throw new Error(response.error);

    window.location.href = "/checkout/thankyou";
  } catch (error) {
    yesButton.disabled = false;
    noButton.disabled = false;
    buttonText.style.display = "inline";
    spinnerLoader.style.display = "none";

    notify(error, "error");
  }
});
