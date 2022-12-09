function previewProductImage(element) {
  const thumbnail = document.querySelector('#main-image')
  thumbnail.src = element.src
  setElementActive(element)
}

async function uploadImage() {
  const uploadInput = document.querySelector('#yc-upload')
  let uploadedImageLink = document.querySelector('#yc-upload-link');
  uploadInput.click()

  uploadInput.addEventListener('change', async function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader()
      reader.readAsDataURL(this.files[0])

      reader.onload = function () {
        const base64 = reader.result

        const previews = document.querySelectorAll('.yc-upload-preview img')
        previews.forEach((preview) => {
          preview.remove()
        })

        const uploadArea = document.querySelector('.yc-upload')
        uploadArea.style.display = 'none'

        const preview = document.createElement('img')
        preview.src = base64

        preview.addEventListener('click', function () {
          uploadArea.style.display = 'flex'
          uploadInput.value = ''
          preview.remove()
        })
        document.querySelector('.yc-upload-preview').appendChild(preview)
      }

      const res = await youcanjs.product.upload(this.files[0])
      if (res.error) return notify(res.error, 'error')
      
      uploadedImageLink.value = res.link   
    }
  }
  )
}

let zoomer = function() {
  const imgZoomer = document.querySelector('#img-zoomer-box');

  if (imgZoomer) {
    imgZoomer.addEventListener('mousemove', function (e) {
      let original = document.querySelector('#main-image'),
        magnified = document.querySelector('#magnified-image'),
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

      style.backgroundPositionX = (xperc - 15) + '%';
      style.backgroundPositionY = (yperc - 15) + '%';
      style.inset = 0 + 'px'

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

function selectDefaultOptions() {
  const options = document.querySelectorAll('.product-options > div')
  if (!options) return null;
  options.forEach((option) => {
    const optionName = option.id.split('-')[1]
    const optionType = option.id.split('-')[2]
    switch (optionType) {
      case 'dropdown':
        option.querySelector('select').value = option.querySelector('select').options[0].value
        break
      case 'textual_buttons':
        option.querySelector('.yc-options-item').classList.add('active')
        break
      case 'radio_buttons':
        option.querySelector('input').checked = true
        break
      case 'image_based_buttons':
        option.querySelector('.yc-image-options-item').classList.add('active')
        break
      case 'upload_image_zone':
        document.querySelector('#yc-upload').value = ''
        break
      case 'color_base_buttons':
        option.querySelector('.color-item').classList.add('active')
        break
    }
  })
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
					selectedOptions[optionName] = option.querySelector('.yc-image-options-item.active img')?.alt
					break
				case 'upload_image_zone':
					selectedOptions[optionName] = "upload-zone"
					break
				case 'color_base_buttons':
					selectedOptions[optionName] = option.querySelector('.color-item.active')?.innerText
					break
			}
    })
  return selectedOptions
	}

function getSelectedVariant() {
  const selectedOptions = getSelectedOptions()
  return variants.find((variant) => {
    if(JSON.stringify(variant.variations) === JSON.stringify(selectedOptions)) {
      return variant.id
    }
    return null
  })
}

const productDetails = document.querySelector('.product-options')

if (productDetails) {
  const observer = new MutationObserver(() => {
    const selectedVariant = getSelectedVariant()
    const variantIdInput = document.querySelector('#variantId')
    variantIdInput.value = selectedVariant.id
    console.log(variantIdInput)
  })
    
  observer.observe(productDetails, { attributes: true, childList: true, subtree: true })
}

selectDefaultOptions()
