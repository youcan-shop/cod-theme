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
  const uploadArea = parentSection.querySelector('.yc-upload');
  const imagePreview = parentSection.querySelector('.yc-upload-preview');
  const imageWrapper = imagePreview.querySelector('.yc-image-preview');
  const progressContainer =  imagePreview.querySelector('.progress-container');
  const imageName = $('.yc-image-info .image-name');
  const imageSize = $('.yc-image-info .image-size');
  const closePreviewButton = $('#close-preview');
  let uploadedImageLink = parentSection.querySelector('#yc-upload-link');

  uploadInput.click();

  uploadInput.addEventListener('change', async function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);

      reader.addEventListener("load", () => {
        const base64 = reader.result;
        const previews = parentSection.querySelectorAll('.yc-image-preview .yc-image img');

        previews.forEach((preview) => {
          preview.remove();
        });

        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        imageWrapper.style.opacity = 0.4;
        imageName.innerText = this.files[0].name;
        progressContainer.style.display = "block";

        const preview = document.createElement('img');
        preview.src = base64;
        parentSection.querySelector('.yc-image-preview .yc-image').appendChild(preview);

        closePreviewButton.addEventListener('click', function () {
          uploadArea.style.display = 'flex';
          imagePreview.style.display = 'none';
          uploadInput.value = '';
          preview.remove();
        });

        getFileSize(this.files[0], preview);
        smoothProgressBar();
      });

      const res = await youcanjs.product.upload(this.files[0]);
      if (res.error) return notify(res.error, 'error');

      uploadedImageLink.value = res.link;
    }
  });

  function getFileSize(file, source) {
    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;

    if(fileSizeInMB > 2) {
      source.src = '';
      source.style.height = "40px";
      imageName.style.color = "red";
      imageName.innerText = sizeBigMessage;
      imageSize.innerText = fileSizeInMB.toFixed(2) + " Mb";
    } else if(fileSizeInMB < 1) {
      imageName.style.color = "inherit";
      imageSize.innerText = fileSizeInKB.toFixed(2) + " Kb";
    } else {
      imageName.style.color = "inherit";
      imageSize.innerText = fileSizeInMB.toFixed(2) + " Mb";
    }
  }

  function smoothProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    progressBar.style.width = progress;
    const interval = setInterval(() => {
      if (progress >= 100) {
        setTimeout(() => {
          progressContainer.style.display = 'none';
          imageWrapper.style.opacity = 1;
        }, 1000);
        clearInterval(interval);
        return;
      }
      progress += 10;
      progressBar.style.width = `${progress}%`;
    }, 200);

    progressBar.style.transition = 'width 1s ease-in-out';
  }
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
 * Sets the variant id in the hidden input field of the product form
 * @param {HTMLElement} parentSection
 * @param {String} id variant id
 */
function setVariant(parentSection, id) {
  const variantIdInput = parentSection.querySelector('#variantId');

  variantIdInput.value = id;
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
        option.querySelector('.dropdown-content li:first-child').classList.add('selected');
        break;
      case 'textual_buttons':
        option.querySelector('.yc-options-item').classList.add('active');
        break;
      case 'radio_buttons':
        const radioLabel = option.querySelector('.yc-radio-buttons');
        radioLabel.classList.add('active');
        radioLabel.querySelector('input[type="radio"]').checked = true;
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
        selectedOptions[optionName] = option.querySelector('.dropdown-content li.selected')?.innerText;
        break;
      case 'textual_buttons':
        selectedOptions[optionName] = option.querySelector(
          '.yc-options-item.active'
        )?.innerText;
        break;
      case 'radio_buttons':
        selectedOptions[optionName] =
          option.querySelector('.yc-radio-buttons.active input[type="radio"]')?.value;
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
 * Get the currency Symbol
 * @param {HTMLElement} parentSection
 * @return {String} currency symbol
 */
function currencySymbol(parentElement) {
  const currentParent = parentElement.querySelector('.product-price');
  const priceContent = currentParent.innerText;
  const currencySymbol = priceContent.replace(/[0-9.,]/g, "").trim();

  return currencySymbol;
}

/**
 * Updates product details after variant change
 * @param {HTMLElement} parentSection
 * @param {String} image
 * @param {String} price
 * @param {String} compareAtPrice
 */
function updateProductDetails(parentSection, image, price, compareAtPrice) {
  if (image) {
    const mainImgs = parentSection.querySelectorAll('.main-image');

    mainImgs.forEach(mainImg => mainImg.src = image)
  }

  if (price) {
    const productPrices = parentSection.querySelectorAll('.product-price');
    const showStickyCheckoutPrice = $('#sticky-price');

    productPrices.forEach(productPrice => {
      const displayValue = `${price} ${currencySymbol(parentSection)}`;

      productPrice.innerText = displayValue;

      if(showStickyCheckoutPrice) {
        showStickyCheckoutPrice.innerHTML = productPrice.innerHTML;
      }
    })
  }

  const variantCompareAtPrices = parentSection.querySelectorAll('.compare-price');

  if(compareAtPrice) {
    variantCompareAtPrices.forEach(variantComparePrice => {
      variantComparePrice.innerHTML = `<del> ${compareAtPrice} ${currencySymbol(parentSection)} </del>`;
    })
  } else {
    variantCompareAtPrices.forEach(variantComparePrice => {
      variantComparePrice.innerHTML = ``;
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

teleport(expressCheckoutForm, '#checkout_step_1 .checkout-form');

/**
 * Teleport variants and quantity to sticky checkout section
 * @param {HTMLElement} parentSection
 */
function teleportCheckoutElements(parentSection) {
  const quantity = parentSection.querySelector('.product-quantity');
  const options = parentSection.querySelector('.product-options');

  // Create placeholder for the teleported items
  const quantityPlaceholder = createPlaceholderDiv('quantity-placeholder');
  const optionsPlaceholder = createPlaceholderDiv('options-placeholder');
  quantity.parentElement.appendChild(quantityPlaceholder);
  options.parentElement.appendChild(optionsPlaceholder);

  // teleport elements
  if (window.matchMedia("(max-width: 768px)").matches) {
    teleport(options, '#checkout_step_1 .options');
    teleport(quantity, '#checkout_step_1 .options');
  }
}

function teleportProductName() {
  const elementContent = $('.product-name');

  if (elementContent) {
    const targetElement = $('#product-name');

    if (targetElement) {
      targetElement.textContent = elementContent.textContent;
    } else {
      console.error("Target element with id 'product-name' not found.");
    }
  } else {
    console.error("Element with class 'product-name' not found.");
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

  const parentSection = $(`#${parentId}`);
  teleportCheckoutElements(parentSection);

  teleportProductName();

  goToCheckoutStep(1);

  overlay.addEventListener('click', () => {
    hideCheckout();
  });

  window.addEventListener("resize", responsiveStickyCheckout);
}

function responsiveStickyCheckout() {
  const quantity = $('.product-quantity');
  const options = $('.product-options');

  if(window.innerWidth >= 768) {
    goToCheckoutStep(2);
  } else if (window.innerWidth < 768) {
    goToCheckoutStep(1);
    teleport(options, '#checkout_step_1 .options');
    teleport(quantity, '#checkout_step_1 .options');
  }
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
  window.removeEventListener('resize', responsiveStickyCheckout);

  if (options && quantity) {
    optionsPlaceholder?.replaceWith(options);
    quantityPlaceholder?.replaceWith(quantity);
  }

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

// Show selected quantity
function showSelectedQuantity() {
  const quantityValue = $('.product-quantity input')?.value;
  $('#variant_quantity').innerHTML = `<span class='quantity-value'>x${quantityValue}</span>`;
}

function goToCheckoutStep(step) {
  $('#checkout_step_1').style.display = 'none';

  switch (step) {
    case 1:
      $('#checkout_step_1').style.display = 'flex';
      $('#express-checkout-form').style.display = 'flex';
      showSelectedQuantity();
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
    const variant = variants[0];

    updateProductDetails(
      section,
      variant.image,
      variant.price,
      variant.compare_at_price
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
          selectedVariant.compare_at_price
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
