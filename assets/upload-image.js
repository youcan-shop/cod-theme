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

    if (fileSizeInMB > 2) {
      source.src = '';
      source.style.height = "40px";
      imageName.style.color = "red";
      imageName.innerText = sizeBigMessage;
    }

    if (fileSizeInMB < 1) {
      return imageSize.innerText = fileSizeInKB.toFixed(2) + " Kb";
    } else {
      return imageSize.innerText = fileSizeInMB.toFixed(2) + " Mb";
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
