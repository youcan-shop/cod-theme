function previewProductImage(element) {
  const thumbnail = document.querySelector('#main-image');

  thumbnail.src = element.src;
  setElementActive(element);
}

function uploadImage() {
  const uploadInput = document.querySelector('#yc-upload');
  let uploadedImageLink = document.querySelector('#yc-upload-link');

  uploadInput.click();

  uploadInput.addEventListener('change', async function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);

      reader.onload = function () {
        const base64 = reader.result;

        const previews = document.querySelectorAll('.yc-upload-preview img');
        previews.forEach((preview) => {
          preview.remove();
        });

        const uploadArea = document.querySelector('.yc-upload');
        uploadArea.style.display = 'none';

        const preview = document.createElement('img');
        preview.src = base64;

        preview.addEventListener('click', function () {
          uploadArea.style.display = 'flex';
          uploadInput.value = '';
          preview.remove();
        });
        document.querySelector('.yc-upload-preview').appendChild(preview);
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

function setElementActive(element) {
  const siblings = element.parentNode.children;

  for (let i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove('active');
  }
  element.classList.add('active');
}

function selectDefaultOptions() {
  const options = document.querySelectorAll('.product-options > div');

  if (!options) return null;
  options.forEach((option) => {
    const optionName = option.id.split('-')[1];
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

  const selectedVariant = getSelectedVariant();

  if (!selectedVariant) {
    setDefaultVariant(variants[0]?.id);
  }

  setDefaultVariant(selectedVariant.id);
}

function getSelectedOptions() {
  const options = document.querySelectorAll('.product-options > div');

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

function getSelectedVariant() {
  const selectedOptions = getSelectedOptions();

  return variants.find((variant) => {
    if (JSON.stringify(variant.variations) === JSON.stringify(selectedOptions)) {
      return variant.id;
    }
    return null;
  });
}

function setDefaultVariant(id) {
  const variantIdInput = document.querySelector('#variantId');

  variantIdInput.value = id;
}

function updateProductDetails(image, price) {
  if (image) {
    const mainImg = document.querySelector('#main-image');

    if (!mainImg) return;

    mainImg.src = image;
  }

  if (price) {
    const productPrice = document.querySelector('.product-price');

    if (!productPrice) return;

    productPrice.innerHTML = `${String(productPrice.innerHTML).split(' ')[0]} ${price}`;
  }
}

const productDetails = document.querySelector('.product-options');

if (productDetails) {
  const observer = new MutationObserver(() => {
    const selectedVariant = getSelectedVariant();
    const variantIdInput = document.querySelector('#variantId');

    variantIdInput.value = selectedVariant.id;

    updateProductDetails(selectedVariant.image, selectedVariant.price);
  });

  observer.observe(productDetails, { attributes: true, childList: true, subtree: true });
}

selectDefaultOptions();

/* ----------------------------------- */
/* ----- sticky images on scroll ----- */
/* ----------------------------------- */
const productWrapper = document.querySelector('.yc-product-card');
const imagesHolder = document.querySelector('.product-images-container');

const stickyImagesHandler = () => {
  const rect = productWrapper.getBoundingClientRect();
  const imagesRect = imagesHolder.getBoundingClientRect();

  if (imagesRect.bottom >= rect.bottom) {
    if (imagesRect.top > 0) {
      imagesHolder.style.transform = `translateY(${-rect.top}px)`;
    }
  } else if (rect.top < 0) {
    imagesHolder.style.transform = `translateY(${-rect.top}px)`;
  }
};

if (window.innerWidth > 768) {
  stickyImagesHandler();
  window.addEventListener('scroll', stickyImagesHandler);
}
