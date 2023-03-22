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
    const showStickyCheckoutPrice = $('#sticky-price');

    productPrices.forEach(productPrice => {
      productPrice.innerHTML = `${
        String(productPrice.innerHTML).split(' ')[0]
      } ${price}`;

      showStickyCheckoutPrice.innerHTML = productPrice.innerHTML;
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




function teleportProductName() {
  const elementContent = $('.product-name').textContent;

  $('#product-name').textContent = elementContent;
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

  teleportProductName();

  goToCheckoutStep(2)

  overlay.addEventListener('click', () => {
    hideCheckout();
  });
}

function hideCheckout() {
  const stickyCheckout = $('#yc-sticky-checkout');

  overlay.click();

  $("body").style.overflow = "auto";
  overlay.style.zIndex = '95';

  stickyCheckout.style.visibility = 'hidden';
  stickyCheckout.style.transform = 'translateY(100%)';
}

/**
 * Create div that has children with specific content
 * @param {string} tagType type name of selected variant
 * @param {string, HTMLElement} tagValue the value of the selected variant
 * @param {string} cssClass CSS styling class
 */

function createAndSetText(tagType = '', tagValue = '', cssClass = '') {
  const element = document.createElement('div');
  element.innerHTML = `<span>${tagType} :</span>
                      <span class=${cssClass}>${tagValue}</span>
                      `;
  return { element: element };
}

// Show selected variants in checkout_step

function showSelectedVariants() {
  const variants = document.querySelectorAll('.product-options > div');

  if (!variants || !variants.length) return null;

  $('#selected-product-variants').innerHTML = '';

  variants.forEach((variant) => {
    const variantType = variant.id.split('-')[2];
    const variantName = variant.id.split('-')[1];

    let variantOption = document.createElement('div');

    switch (variantType) {
      case 'textual_buttons':
        const textualButton =  variant.querySelector('.yc-options-item.active')?.textContent;
        variantOption = createAndSetText(variantName, textualButton, 'yc-textual-item').element;
      break;
      case 'color_base_buttons':
        const colorBaseButton = variant.querySelector('.color-item.active .preview')?.outerHTML;
        variantOption = createAndSetText(variantName, colorBaseButton, 'colored-button').element;
        break;
      case 'radio_buttons':
        const radioButton = variant.querySelector('input:checked')?.value;
        variantOption = createAndSetText(variantName, radioButton).element;
      break;
      case 'dropdown':
        const dropDown = variant.querySelector('select')?.value;
        variantOption = createAndSetText(variantName, dropDown).element;
        break;
      case 'image_based_buttons':
        const imageBasedButton = variant.querySelector('.yc-image-options-item.active img')?.outerHTML;
        variantOption = createAndSetText(variantName, imageBasedButton, 'image-container').element;
        break;
      case 'upload_image_zone':
        const uploadImageZone = variant.querySelector(' .yc-upload-preview img')?.outerHTML;
        variantOption = createAndSetText(variantName, uploadImageZone, 'image-container').element;
        break;
    }

    $('#selected-product-variants').appendChild(variantOption);
  });
}

// Sticky checkout steps conditions
function goToCheckoutStep(step) {
  $('#checkout_step').style.display = 'flex';
  $(' #express-checkout-form').style.display = 'block';
  const expressCheckoutForm = $('#express-checkout-form');

  teleport(expressCheckoutForm, '#checkout_step .checkout-form');
  showSelectedVariants();
}

function setup() {
  const singleProductSections = document.querySelectorAll('.yc-single-product');

  if (!singleProductSections) return;

  singleProductSections.forEach((section) => {
    const productDetails = section.querySelector('.product-options');
    const variant = variants[0]

    updateProductDetails(
      section,
      variant.image,
      variant.price,
      variant.variations
    );

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
