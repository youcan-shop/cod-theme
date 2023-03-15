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
  const progressBar =  imagePreview.querySelector('.progress-bar');
  const closePreviewButton = $('#close-preview');
  let uploadedImageLink = parentSection.querySelector('#yc-upload-link');

  uploadInput.click();

  uploadInput.addEventListener('change', async function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(this.files[0]);

      reader.addEventListener("loadstart", () => {
        console.log('file start uploading');
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        imageWrapper.style.opacity = 0.4;
        progressBar.style.display = "block";
      });

      reader.addEventListener("load", () => {
        console.log('File loaded successfully');
        const base64 = reader.result;
        const previews = parentSection.querySelectorAll('.yc-image-preview .yc-image img');

        previews.forEach((preview) => {
          preview.remove();
        });
        imageWrapper.style.opacity = 1;
        progressBar.style.display = "none";

        const preview = document.createElement('img');
        preview.src = base64;
        parentSection.querySelector('.yc-image-preview .yc-image').appendChild(preview);

        closePreviewButton.addEventListener('click', function () {
          uploadArea.style.display = 'flex';
          imagePreview.style.display = 'none';
          uploadInput.value = '';
          preview.remove();
        });
      });

      reader.addEventListener("progress", (event) => {
        console.log('Progress event fired');
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          progressBar.setAttribute("value", percent);
        }
      });

      const res = await youcanjs.product.upload(this.files[0]);
      if (res.error) return notify(res.error, 'error');

      uploadedImageLink.value = res.link;
    }
  });
}



