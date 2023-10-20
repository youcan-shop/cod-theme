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
 * Sets inventory of product variant.
 * And disable add to cart button when inventory is not sufficient.
 * @param {HTMLElement} parentSection
 * @param {Number} inventory
 */
function setInventory(parentSection, inventory) {
  const inventoryInput = parentSection.querySelector('#_inventory');

  inventoryInput.value = globalProduct.isTrackingInventory ? inventory : null;

  /** @type {HTMLButtonElement} addToCartButton */
  const addToCartButton = parentSection.querySelector('.yc-btn');

  if (!addToCartButton) {
    return;
  }

  if (!addToCartButton.disabled && addToCartButton.getAttribute('data-text') === null) {
    addToCartButton.setAttribute('data-text', addToCartButton.innerHTML);
  }

  const isAddToCartDisabled = globalProduct.isTrackingInventory && inventory === 0;

  addToCartButton.disabled = isAddToCartDisabled;

  if (isAddToCartDisabled) {
    addToCartButton.innerHTML = TRANSLATED_TEXT.empty_inventory;
  } else {
    addToCartButton.innerHTML = addToCartButton.getAttribute('data-text');
  }
}

/**
 * Sets default options for a product
 * @param {HTMLElement} parentSection
 */
function selectDefaultOptions(parentSection) {
  const options = parentSection.querySelectorAll('.product-options > div');

  if (!options || !options.length) {
    setInventory(parentSection, defaultVariant?.inventory);

    return setVariant(parentSection, defaultVariant?.id);
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

  setInventory(parentSection, selectedVariant.inventory);
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

    if(productPrices.length === 0){
      if(showStickyCheckoutPrice) {
        showStickyCheckoutPrice.innerHTML = `${price} ${Dotshop.currency}`;
      }

      return;
    }

    productPrices.forEach(productPrice => {
      const displayValue = `${price} ${Dotshop.currency}`;

      productPrice.innerText = displayValue;

      if(showStickyCheckoutPrice) {
        showStickyCheckoutPrice.innerHTML = productPrice.innerHTML;
      }
    });
  }

  const variantCompareAtPrices = parentSection.querySelectorAll('.compare-price');

  if(compareAtPrice) {
    variantCompareAtPrices.forEach(variantComparePrice => {
      variantComparePrice.innerHTML = `<del> ${compareAtPrice} ${Dotshop.currency} </del>`;
    })
  } else {
    variantCompareAtPrices.forEach(variantComparePrice => {
      variantComparePrice.innerHTML = ``;
    })
  }

  goToCheckoutStep();
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

teleport(expressCheckoutForm, '#checkout_step_2 .checkout-form');

/**
 * Teleport variants and quantity to sticky checkout section
 * @param {HTMLElement} parentSection
 */
function teleportCheckoutElements(parentSection) {
  const quantity = parentSection.querySelector('.product-quantity');
  const options = parentSection.querySelector('.product-options');

  if(!quantity || !options){
    return;
  }

  // Create placeholder for the teleported items
  const quantityPlaceholder = createPlaceholderDiv('quantity-placeholder');
  const optionsPlaceholder = createPlaceholderDiv('options-placeholder');
  quantity.parentElement.appendChild(quantityPlaceholder);
  options.parentElement.appendChild(optionsPlaceholder);
}

function teleportProductName() {
  const elementContent = $('.product-name').textContent || globalProduct.name;

  $('#product-name').textContent = elementContent;
}

function teleportProductCard() {
  const productCard = $('.yc-product-card');

  teleport(productCard, '#checkout_step_2 .variant-card-2');
}

function showStickyCheckout() {
  const stickyCheckout = $('#yc-sticky-checkout');

  // Show the background overlay
  showOverlay();

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

  if (!window.matchMedia("(max-width: 768px)").matches) {
    goToCheckoutStep();
  }

  overlay.addEventListener('click', () => {
    hideCheckout();
  });

  window.addEventListener("resize", responsiveStickyCheckout);
}

function responsiveStickyCheckout() {
  goToCheckoutStep();
}

function hideCheckout() {
  const stickyCheckout = $('#yc-sticky-checkout');
  const options = stickyCheckout.querySelector('.product-options');
  const quantity = stickyCheckout.querySelector('.product-quantity');
  const optionsPlaceholder = $('#options-placeholder');
  const quantityPlaceholder = $('#quantity-placeholder');

  overlay.click();

  $("body").style.overflow = "auto";
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

// Show selected variants in checkout_step_2

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
        const radioButton = variant.querySelector('.yc-radio-buttons.active input[type="radio"]')?.value;
        variantOption = createAndSetText(variantName, radioButton).element;
      break;
      case 'dropdown':
        const dropDown = variant.querySelector('.dropdown-content li.selected')?.innerText;
        variantOption = createAndSetText(variantName, dropDown).element;
        break;
      case 'image_based_buttons':
        const imageBasedButton = variant.querySelector('.yc-image-options-item.active img')?.outerHTML;
        variantOption = createAndSetText(variantName, imageBasedButton, 'image-container').element;
        break;
      case 'upload_image_zone':
        const uploadImageZone = variant.querySelector('.yc-image-preview .yc-image img')?.outerHTML;
        variantOption = createAndSetText(variantName, uploadImageZone, 'image-container').element;
        break;
    }

    $('#selected-product-variants').appendChild(variantOption);
  });
}

// Show selected quantity in checkout_step_2

function showSelectedQuantity() {
  const quantityValue = $('.product-quantity input')?.value || 1;
  $('#variant_quantity').innerHTML = `<span class='quantity-value'>x${quantityValue}</span`;
}

// Sticky checkout steps conditions

function goToCheckoutStep(close = false) {
  if (!$('#checkout_step_2')) {
    return;
  }

  if (close) {
    hideCheckout();

    return;
  }

  $('#checkout_step_2').style.display = 'flex';
  $(' #express-checkout-form').style.display = 'block';
  teleportProductCard();
  showSelectedVariants();
  showSelectedQuantity();
}

function setup() {
  const singleProductSections = document.querySelectorAll('.yc-single-product');

  if (!singleProductSections) return;

  singleProductSections.forEach((section) => {
    const productDetails = section.querySelector('.product-options');
    const variant = defaultVariant;

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

        setInventory(section, selectedVariant.inventory);
      });

      observer.observe(productDetails, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    selectDefaultOptions(section);
  });

  goToCheckoutStep();
}

setup();
