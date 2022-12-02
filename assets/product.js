function previewProductImage(url) {
  const thumbnail = document.querySelector('#img-1')
  thumbnail.src = url
}

function uploadImage() {
  const uploadInput = document.querySelector('#yc-upload')
  uploadInput.click()
}


let zoomer = function() {
  const imgZoomer = document.querySelector('#img-zoomer-box');
  if (imgZoomer) {
    imgZoomer.addEventListener('mousemove', function(e) {
      let original = document.querySelector('#img-1'),
        magnified = document.querySelector('#img-2'),
        style = magnified.style,
        x = e.pageX - this.offsetLeft,
        y = e.pageY - this.offsetTop,
        imgWidth = original.offsetWidth,
        imgHeight = original.offsetHeight,
        xperc = ((x / imgWidth) * 100),
        yperc = ((y / imgHeight) * 100);

      if (x > (.01 * imgWidth)) {
        xperc += (.15 * xperc);
      };

      if (y >= (.01 * imgHeight)) {
        yperc += (.15 * yperc);
      };

      style.backgroundPositionX = (xperc - 9) + '%';
      style.backgroundPositionY = (yperc - 9) + '%';

      style.left = (x - 180) + 'px';
      style.top = (y - 180) + 'px';

      style.backgroundImage = 'url(' + original.src + ')';
    }, false);
  }
}();


function setElementActive(element) {
  const siblings = element.parentNode.children
  for (let i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove('active')
  }
  element.classList.add('active')
}

function getSelectedOptions() {
  const options = document.querySelectorAll('.product-options > div')
  if (!options) return null;
		const selectedOptions = {}
		options.forEach((option) => {
			const optionName = option.id.split('-')[1]
			const optionType = option.id.split('-')[2]

			switch (optionType) {
				case 'dropdown':
					selectedOptions[optionName] = option.querySelector('select')?.value
					break
				case 'textual_buttons':
					selectedOptions[optionName] = option.querySelector('.yc-options-item.active')?.innerText
					break
				case 'radio_buttons':
					selectedOptions[optionName] = option.querySelector('input:checked')?.value
					break
				case 'image_based_buttons':
					selectedOptions[optionName] = option.querySelector('.yc-image-options-item.active')?.innerText
					break
				case 'upload_image_zone':
					selectedOptions[optionName] = option.querySelector('input')?.value
					break
				case 'color_base_buttons':
					selectedOptions[optionName] = option.querySelector('.color-item.active')?.innerText
					break
			}
    })
  return selectedOptions
	}

function getSelectedVariant() {
  console.log(variants)
  const selectedOptions = getSelectedOptions()
  
  return variants.find((variant) => {
    if(JSON.stringify(variant.variations) === JSON.stringify(selectedOptions)) {
      return variant.id
    }
    return null
  })
}

const productDetails = document.querySelector('.product-details')

if (productDetails) {

  console.log(productDetails)
  const observer = new MutationObserver((mutations) => {
    const selectedVariant = getSelectedVariant()
    console.log(selectedVariant)
  })
    
  observer.observe(productDetails, { attributes: true, childList: true, subtree: true })
}

    



