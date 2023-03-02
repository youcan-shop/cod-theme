function previewProductImage(element) {
  const parentSection = element.closest('.yc-single-product');
  const thumbnail = parentSection.querySelector('.main-image');

  thumbnail.src = element.firstElementChild.src;
  setElementActive(element);
}

/**
 * Upload image input handler
 * @param {HTMLElement} element
 */
function uploadImage(element) {
  const parentSection = element.closest('.yc-single-product');
  const uploadInput = parentSection.querySelector('#yc-upload');
  let uploadedImageLink = parentSection.querySelector('#yc-upload-link');

  uploadInput.click();

  uploadInput.addEventListener('change', async function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);

      reader.onload = function () {
        const base64 = reader.result;

        const previews = parentSection.querySelectorAll(
          '.yc-upload-preview img'
        );
        previews.forEach((preview) => {
          preview.remove();
        });

        const uploadArea = parentSection.querySelector('.yc-upload');
        uploadArea.style.display = 'none';

        const preview = document.createElement('img');
        preview.src = base64;

        preview.addEventListener('click', function () {
          uploadArea.style.display = 'flex';
          uploadInput.value = '';
          preview.remove();
        });
        parentSection.querySelector('.yc-upload-preview').appendChild(preview);
      };

      const res = await youcanjs.product.upload(this.files[0]);
      if (res.error) return notify(res.error, 'error');

      uploadedImageLink.value = res.link;
    }
  });
}

(function productImageHoverZoomer() {
  const singleProductImagesPreview = document.querySelectorAll(
    '.product-images-container'
  );

  if (!singleProductImagesPreview || !singleProductImagesPreview.length) return;

  singleProductImagesPreview.forEach((imagesPreview) => {
    const imgZoomer = imagesPreview.querySelector('#img-zoomer-box');

    if (!imgZoomer) return;

    function eventHandler(e) {
      const original = $('.main-image');
      const magnified = $('#magnified-image');

      x = (e.offsetX / original.offsetWidth) * 100;
      y = (e.offsetY / original.offsetHeight) * 100;

      magnified.style.backgroundPosition = x + '% ' + y + '%';
      magnified.style.backgroundImage = 'url(' + original.src + ')';
      magnified.style.inset = '0px';
    }

    imgZoomer.addEventListener('mousemove', eventHandler, false);
  });
})();

/**
 * Sets active class to an element
 * @param {HTMLElement} element
 * @returns {void}
 */
function setElementActive(element) {
  const siblings = element.parentNode.children;

  for (let i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove('active');
  }
  element.classList.add('active');
}

/**
 * Sets default options for a product
 * @param {HTMLElement} parentSection
 */
function selectDefaultOptions(parentSection) {
  const options = parentSection.querySelectorAll('.product-options > div');

  if (!options || !options.length) {
    return setVariant(parentSection, variants[0]?.id);
  }

  options.forEach((option) => {
    const optionType = option.id.split('-')[2];

    switch (optionType) {
      case 'dropdown':
        option.querySelector('select').value =
          option.querySelector('select').options[0].value;
        break;
      case 'textual_buttons':
        option.querySelector('.yc-options-item').classList.add('active');
        break;
      case 'radio_buttons':
        option.querySelector('input').checked = true;
        break;
      case 'image_based_buttons':
        option.querySelector('.yc-image-options-item').classList.add('active');
        break;
      case 'upload_image_zone':
        $('#yc-upload').value = '';
        break;
      case 'color_base_buttons':
        option.querySelector('.color-item').classList.add('active');
        break;
    }
  });

  const selectedVariant = getSelectedVariant(parentSection);

  setVariant(parentSection, selectedVariant.id);
}

/**
 * Gets selected options for a product
 * @param {HTMLElement} parentSection
 * @returns {Object} selected options
 */
function getSelectedOptions(parentSection) {
  const options = parentSection.querySelectorAll('.product-options > div');

  if (!options || !options.length) return null;

  const selectedOptions = {};
  options.forEach((option) => {
    const optionName = option.id.split('-')[1];
    const optionType = option.id.split('-')[2];

    switch (optionType) {
      case 'dropdown':
        selectedOptions[optionName] = option.querySelector('select')?.value;
        break;
      case 'textual_buttons':
        selectedOptions[optionName] = option.querySelector(
          '.yc-options-item.active'
        )?.innerText;
        break;
      case 'radio_buttons':
        selectedOptions[optionName] =
          option.querySelector('input:checked')?.value;
        break;
      case 'image_based_buttons':
        selectedOptions[optionName] = option.querySelector(
          '.yc-image-options-item.active img'
        )?.alt;
        break;
      case 'upload_image_zone':
        selectedOptions[optionName] = 'upload-zone';
        break;
      case 'color_base_buttons':
        selectedOptions[optionName] =
          option.querySelector('.color-item.active')?.innerText;
        break;
    }
  });
  return selectedOptions;
}

/**
 * matches selected options with variants and returns the selected variant id
 * @param {HTMLElement} parentSection
 * @returns {Object | null} selected variant
 */
function getSelectedVariant(parentSection) {
  const selectedOptions = getSelectedOptions(parentSection);

  return variants.find((variant) => {
    if (
      JSON.stringify(variant.variations) === JSON.stringify(selectedOptions)
    ) {
      return variant.id;
    }
    return null;
  });
}

/**
 * Sets the variant id in the hidden input field of the product form
 * @param {HTMLElement} parentSection
 * @param {String} id variant id
 */
function setVariant(parentSection, id) {
  const variantIdInput = parentSection.querySelector('#variantId');

  variantIdInput.value = id;
}

/**
 * Updates product details after variant change
 * @param {HTMLElement} parentSection
 * @param {String} image
 * @param {String} price
 */
function updateProductDetails(parentSection, image, price, variations) {
  if (image) {
    const mainImgs = parentSection.querySelectorAll('.main-image');

    mainImgs.forEach(mainImg => mainImg.src = image)
  }

  if (price) {
    const productPrices = parentSection.querySelectorAll('.product-price');

    productPrices.forEach(productPrice => {
      productPrice.innerHTML = `${
        String(productPrice.innerHTML).split(' ')[0]
      } ${price}`;
    })
  }

  if(variations) {
    const productVariations = parentSection.querySelectorAll('.product-variations');

    productVariations.forEach(el => {
      el.innerHTML = Object.values(variations).join(' - ')
    })
  }
}

/**
 * Teleport an element to another place
 * @param {HTMLElement} el
 * @param {string} to id of the element
 */
function teleport(el, to) {
  const toEl = $(to);
  toEl?.appendChild(el);
}

/**
 * Create a placeholder div with an ID
 * @param {string} id id of the element
 * @returns {HTMLElement} created placeholder div
 */
function createPlaceholderDiv(id) {
  const div = document.createElement('DIV');
  div.setAttribute('id', id);

  return div;
}

const expressCheckoutForm = $('#express-checkout-form');

teleport(expressCheckoutForm, '#checkout_step_2');

/**
 * Teleport variants and quantity to sticky checkout section
 * @param {HTMLElement} parentSection
 */
function teleportCheckoutElements(parentSection) {
  const quantity = parentSection.querySelector('.product-quantity');
  const options = parentSection.querySelector('.product-options');
  const expressCheckoutForm = parentSection.querySelector('#express-checkout-form');

  // Create placeholder for the teleported items
  const quantityPlaceholder = createPlaceholderDiv('quantity-placeholder');
  const optionsPlaceholder = createPlaceholderDiv('options-placeholder');
  quantity.parentElement.appendChild(quantityPlaceholder);
  options.parentElement.appendChild(optionsPlaceholder);

  // teleport elements
  teleport(options, '#checkout_step_1 .options');
  teleport(quantity, '#checkout_step_1 .options');
  teleport(expressCheckoutForm, '#checkout_step_2 .checkout-form');
}

function teleportProductName() {
  const elementContent = $('.product-name').textContent;

  document.getElementById('product--name').textContent = elementContent;
}

function teleportProductCard(step) {
  const productCard = $('.yc-product-card');

  switch (step) {
    case 1:
      teleport(productCard, '#checkout_step_1 .variant-card-1');
      break;
    case 2:
      teleport(productCard, '#checkout_step_2 .variant-card-2');
      break;
  }
}

function showStickyCheckout() {
  const stickyCheckout = $('#yc-sticky-checkout');

  // Show the background overlay
  showOverlay();
  overlay.style.zIndex = '9999';

  // Show the checkout
  stickyCheckout.style.visibility = 'visible';
  stickyCheckout.style.transform = 'translateY(0)';
}

function triggerCheckout(parentId) {
  $("body").style.overflow = "hidden";

  showStickyCheckout();

  goToCheckoutStep(1);

  teleportProductName();

  const parentSection = $(`#${parentId}`);
  teleportCheckoutElements(parentSection);

  overlay.addEventListener('click', () => {
    hideCheckout();
    teleportProductCard(1);
  });
}

function hideCheckout() {
  const stickyCheckout = $('#yc-sticky-checkout');
  const options = stickyCheckout.querySelector('.product-options');
  const quantity = stickyCheckout.querySelector('.product-quantity');
  const optionsPlaceholder = $('#options-placeholder');
  const quantityPlaceholder = $('#quantity-placeholder');

  overlay.click();

  $("body").style.overflow = "auto";
  overlay.style.zIndex = '95';
  optionsPlaceholder?.replaceWith(options);
  quantityPlaceholder?.replaceWith(quantity);

  stickyCheckout.style.visibility = 'hidden';
  stickyCheckout.style.transform = 'translateY(100%)';
  // stickyCheckout.style.opacity = '0';
}

// Show selected variants in checkout_step_2

function createAndSetText(tagType = '', tagValue = '', cssClass = '') {
  const element = document.createElement('div');
  element.innerHTML = `<span>${tagType} :</span>
                      <span class=${cssClass}>${tagValue}</span>
                      `;
  return { element: element };
}

function getSelectedVariants() {
  const variants = document.querySelectorAll('.product-options > div');

  if (!variants || !variants.length) return null;

  document.querySelector('#selected-product-variants').innerHTML = '';

  variants.forEach((variant) => {
    const variantType = variant.id.split('-')[2];
    const variantName = variant.id.split('-')[1];

    const variantValues = [
      variant.querySelector('.yc-options-item.active')?.textContent,
      variant.querySelector('.color-item.active .preview')?.outerHTML,
      variant.querySelector('input:checked')?.value,
      variant.querySelector('select')?.value,
      variant.querySelector('.yc-image-options-item.active img')?.alt,
    ];

    const createdElements = [
      createAndSetText(variantName, variantValues[0], 'yc-textual-item'),
      createAndSetText(variantName, variantValues[1], 'colored-button'),
      createAndSetText(variantName, variantValues[2]),
      createAndSetText(variantName, variantValues[3]),
      createAndSetText(variantName, variantValues[4]),
    ]

    let variantOption = document.createElement('div');

    switch (variantType) {
      case 'textual_buttons':
        variantOption = createdElements[0].element;
      break;
      case 'color_base_buttons':
        variantOption = createdElements[1].element;;
        break;
      case 'radio_buttons':
        variantOption = createdElements[2].element;
      break;
      case 'dropdown':
        variantOption = createdElements[3].element;
        break;
      case 'image_based_buttons':
        variantOption = createdElements[4].element;
        break;
      case 'upload_image_zone':
        // newParents[5].innerHTML = `<span>${variantValues[5]}</span`;
        // 'upload-zone';
        break;
    }

    document.querySelector('#selected-product-variants').appendChild(variantOption);
  });
}

// Show selected quantity in checkout_step_2

function getSelectedQuantity() {
  const quantityValue = $('.product-quantity input')?.value;
  $('#variant_quantity').innerHTML = `<span class='quantity-value'>x${quantityValue}</span`;
}

// Clear selected variants if the user return back to checkout_step_1

function clearSelectedVariants() {
  const variantElems = document.querySelectorAll('[id*="variant_"]');

  variantElems.forEach(elem => {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  });
}

function goToCheckoutStep(step) {
  $('#checkout_step_1').style.display = 'none';
  $('#checkout_step_2').style.display = 'none';

  switch (step) {
    case 1:
      $('#checkout_step_1').style.display = 'flex';
      teleportProductCard(1);
      clearSelectedVariants();
      break;
    case 2:
      $('#checkout_step_2').style.display = 'flex';
      $(' #express-checkout-form').style.display = 'block';
      teleportProductCard(2);
      getSelectedVariants();
      getSelectedQuantity();
      break;
    default:
      hideCheckout();
      break;
  }
}

function setup() {
  const singleProductSections = document.querySelectorAll('.yc-single-product');

  if (!singleProductSections) return;

  singleProductSections.forEach((section) => {
    const productDetails = section.querySelector('.product-options');

    if (productDetails) {
      const observer = new MutationObserver(() => {
        const selectedVariant = getSelectedVariant(section);
        const variantIdInput = section.querySelector('#variantId');

        variantIdInput.value = selectedVariant.id;

        updateProductDetails(
          section,
          selectedVariant.image,
          selectedVariant.price,
          selectedVariant.variations
        );
      });

      observer.observe(productDetails, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    selectDefaultOptions(section);
  });
}

setup();

// Increment or Decrement custom quantity input

function manipulateQuantity() {
  const decrementButton = $('.decrement-button');
  const incrementButton = $('.increment-button');
  const quantityInput = $('.quantity-input');

  decrementButton?.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  incrementButton?.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
}

manipulateQuantity();


// Desktop checkout

function desktopStickyCheckout() {
  if(window.innerWidth >= 768) {
    const closeButton = $('#checkout_step_1 .close-icon');
    goToCheckoutStep(2);
    teleportProductCard(2);
    $('#checkout_step_2 .back-icon').replaceWith(closeButton);
  }
}
