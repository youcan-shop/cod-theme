function previewProductImage(element) {
  const parentSection = element.closest('.yc-single-product');
  const thumbnail = parentSection.querySelector('#main-image');

  thumbnail.src = element.src;
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

        const previews = parentSection.querySelectorAll('.yc-upload-preview img');
        previews.forEach((preview) => {
          preview.remove();
        });

        const uploadArea = parentSection.querySelector('.yc-upload');
        uploadArea.style.display = 'none';

        const preview = parentSection.createElement('img');
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

let zoomer = (function () {
  const imgZoomer = document.querySelector('#img-zoomer-box');

  if (imgZoomer) {
    imgZoomer.addEventListener(
      'mousemove',
      function (e) {
        let original = document.querySelector('#main-image'),
          magnified = document.querySelector('#magnified-image'),
          style = magnified.style,
          x = e.pageX - this.offsetLeft,
          y = e.pageY - this.offsetTop,
          imgWidth = original.offsetWidth,
          imgHeight = original.offsetHeight,
          xperc = (x / imgWidth) * 100 - 10,
          yperc = (y / imgHeight) * 100 - 10;

        style.backgroundPositionX = xperc + '%';
        style.backgroundPositionY = yperc + '%';
        style.inset = 0 + 'px';

        style.backgroundImage = 'url(' + original.src + ')';
      },
      false,
    );
  }
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

  if (!options) return;

  options.forEach((option) => {
    const optionType = option.id.split('-')[2];

    switch (optionType) {
      case 'dropdown':
        option.querySelector('select').value = option.querySelector('select').options[0].value;
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
        document.querySelector('#yc-upload').value = '';
        break;
      case 'color_base_buttons':
        option.querySelector('.color-item').classList.add('active');
        break;
    }
  });

  const selectedVariant = getSelectedVariant(parentSection);

  if (!selectedVariant) {
    setVariant(parentSection, variants[0]?.id);
  }

  setVariant(parentSection, selectedVariant.id);
}

/**
 * Gets selected options for a product
 * @param {HTMLElement} parentSection
 * @returns {Object} selected options
 */
function getSelectedOptions(parentSection) {
  const options = parentSection.querySelectorAll('.product-options > div');

  if (!options) return null;
  const selectedOptions = {};
  options.forEach((option) => {
    const optionName = option.id.split('-')[1];
    const optionType = option.id.split('-')[2];

    switch (optionType) {
      case 'dropdown':
        selectedOptions[optionName] = option.querySelector('select')?.value;
        break;
      case 'textual_buttons':
        selectedOptions[optionName] = option.querySelector('.yc-options-item.active')?.innerText;
        break;
      case 'radio_buttons':
        selectedOptions[optionName] = option.querySelector('input:checked')?.value;
        break;
      case 'image_based_buttons':
        selectedOptions[optionName] = option.querySelector('.yc-image-options-item.active img')?.alt;
        break;
      case 'upload_image_zone':
        selectedOptions[optionName] = 'upload-zone';
        break;
      case 'color_base_buttons':
        selectedOptions[optionName] = option.querySelector('.color-item.active')?.innerText;
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
    if (JSON.stringify(variant.variations) === JSON.stringify(selectedOptions)) {
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
function updateProductDetails(parentSection, image, price) {
  if (image) {
    const mainImg = parentSection.querySelector('#main-image');

    if (!mainImg) return;

    mainImg.src = image;
  }

  if (price) {
    const productPrice = parentSection.querySelector('.product-price');

    if (!productPrice) return;

    productPrice.innerHTML = `${String(productPrice.innerHTML).split(' ')[0]} ${price}`;
  }
}

/**
 * Set sticky product image on scroll
 * @param {HTMLElement} parentSection
 */
// function setStickyProductImage(parentSection) {
//   const imagesHolder = parentSection.querySelector('.product-images-container');

//   const stickyImagesHandler = () => {
//     const rect = parentSection.getBoundingClientRect();
//     const imagesRect = imagesHolder.getBoundingClientRect();

//     if (imagesRect.bottom >= rect.bottom) {
//       if (imagesRect.top > 0) {
//         imagesHolder.style.transform = `translateY(${-rect.top}px)`;
//       }
//     } else if (rect.top < 0) {
//       imagesHolder.style.transform = `translateY(${-rect.top}px)`;
//     }
//   };

//   if (window.innerWidth > 768 && imagesHolder && parentSection) {
//     stickyImagesHandler();
//     window.addEventListener('scroll', stickyImagesHandler);
//   }
// }

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

        updateProductDetails(section, selectedVariant.image, selectedVariant.price);
      });

      observer.observe(productDetails, { attributes: true, childList: true, subtree: true });
    }

    selectDefaultOptions(section);
  });
}

setup();
