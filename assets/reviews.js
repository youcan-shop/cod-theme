/**
 * Converts date from yyyy-mm-dd to dd.mm.yyyy
 */
function convertDate() {
  const createdAtDate = document.querySelectorAll('.created-at-date');

  createdAtDate.forEach(date => {
    const originalDateString = date.textContent;
    const originalDate = new Date(originalDateString);
    const day = originalDate.getDate().toString().padStart(2, '0');
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const year = originalDate.getFullYear().toString();
    const formattedDate = `${day}.${month}.${year}`;
    date.textContent = formattedDate;
  });
}

/**
 * Creates a review template
 *
 * @param {Object} review - Review object.
 * @returns {String} - Review template.
 */
function reviewTemplate(review) {
  return `
    <div class='header'>
      <div class="profil">
        <img loading='lazy' class='image' src='${review.images_urls[0] || defaultAvatar}' />
        <div class='info'>
          <span class='name'>${review.first_name || ''} ${review.last_name || ''}</span>
          <span class='created-at-date'>${review.created_at}</span>
        </div>
      </div>
      <div class='yc-reviews-stars'
           style='--rating: ${review.ratings}'
           aria-label="Rating of this product is ${review.ratings} out of 5"
      ></div>
    </div>
    <div class='content'>
      ${review.content === null ? '' : review.content}
    </div>
  `;
}

const setupReviews = async () => {
  const reviewsContainer = $('.yc-product-reviews');
  const reviewsWrapper = $('.yc-reviews-wrapper');
  const showMoreButton = $('#show-more');
  let reviews = [];

  /**
   * This function is used to remove the reviews container if there is no data.
   *
   * @param {HTMLElement} element - The element you want to target
   */
  const removeReviewsIfNone = () => {
    if (reviewsContainer) {
      reviewsContainer.remove();
    }
  };

  /**
   * Creates a review item.
   *
   * @param {Object} review - Review object.
   * @returns {HTMLElement} - Review item.
   */
  const createReviewItem = (review) => {
    const reviewItem = document.createElement('li')
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = reviewTemplate(review);

    return reviewsWrapper.appendChild(reviewItem);
  }

  /**
   * Handling pagination by showing the show more button if there is more than one page.
   *
   * @param {Array} reviews - Array of reviews
   */
  const handelPagination = (data) => {
    const pagination = data.pagination();

    if (pagination.totalPages > 1) {
      showMoreButton.style.display = 'block';

      if (showMoreButton) {
        showMoreButton.addEventListener('click', async () => {
          const response = data.next();

          reviews = await response.data();
          addReviews(reviewsWrapper, reviews);

          if (pagination.totalPages >= pagination.currentPage) {
            showMoreButton.style.display = 'none';
          }
        });
      };

    }
  }

  /**
   * Append reviews to the reviewsWrapper.
   */
  const addReviews = (reviewsWrapper, reviews) => {
    reviewsWrapper.append(...reviews.map(review => createReviewItem(review)));
  }

  try {
    const res = youcanjs.product.fetchReviews(reviewsProductId, { limit: 3 });
    reviews = await res.data();

    addReviews(reviewsWrapper, reviews);
    handelPagination(res);

    if(reviews && reviews.length) {
      return convertDate();
    }

    return removeReviewsIfNone();

  } catch (error) {
    removeReviewsIfNone();
  }
};

const reviewData = {
  content: '',
  email: '',
  ratings: 0,
  first_name: '',
  last_name: '',
  images: []
};

const uploadedImagesHistory = [];

function setupEventListeners() {
  const reviewForm = document.getElementById('reviewForm');
  const modal = document.getElementById("reviewModal");
  const btn = document.getElementById("addReviewBtn");
  const span = document.querySelector(".close");
  const starRadios = document.querySelectorAll('.star-rating input[type="radio"]');

  reviewForm.addEventListener('submit', handleReviewFormSubmit);
  btn.addEventListener('click', showModal);
  span.addEventListener('click', hideModal);

  starRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const starCountSpan = document.querySelector('.review-stars-count');
      starCountSpan.textContent = `(${this.value} ${ratings})`;
    });
  });

  setupReviews();
}

async function handleReviewFormSubmit(e) {
  e.preventDefault();
  clearFieldErrors();

  const formData = new FormData(e.target);
  Object.assign(reviewData, {
    content: sanitizeInput(formData.get('content')),
    email: formData.get('email'),
    ratings: Number(formData.get('ratings')),
    first_name: sanitizeInput(formData.get('first_name')),
    last_name: sanitizeInput(formData.get('last_name'))
  });

  try {
      const response = await youcanjs.product.submitReview(reviewsProductId, reviewData);
      if (response) {
        notify(`${REVIEWS_TRANSLATED_TEXT.successMessage}`, 'success');
        e.target.reset();
        e.target.style.display = 'none';
        document.querySelector('.thank-you-message').style.display = 'flex';
        document.querySelector('.modal-title').style.display = 'none';
      } else {
        notify(`${REVIEWS_TRANSLATED_TEXT.errorMessage}`, 'error');
      }
  } catch (error) {
      handleReviewError(error);
  }
}

function handleReviewError(error) {
  notify(error.message, 'error');
  if (error) {
      for (const field in error.meta.fields) {
        const errorMsg = error.meta.fields[field][0];
        displayFieldError(field, errorMsg);
      }
  } else {
    notify(`${REVIEWS_TRANSLATED_TEXT.errorMessage}`, 'error');
  }
}

function displayFieldError(fieldName, errorMsg) {
  const inputElement = document.querySelector(`[name="${fieldName}"]`);
  if (inputElement) {
      const errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      errorElement.textContent = errorMsg;
      inputElement.parentElement.insertBefore(errorElement, inputElement.nextSibling);
  }
}

function clearFieldErrors() {
  const errorElements = document.querySelectorAll('.field-error');
  errorElements.forEach(el => el.remove());
}

function showModal() {
  const modal = document.getElementById("reviewModal");
  modal.style.display = "flex";
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  const modal = document.getElementById("reviewModal");
  modal.style.display = "none";
  document.body.style.overflow = '';
}

function sanitizeInput(input) {
  const div = document.createElement('div');
  div.innerHTML = input;
  return div.textContent || div.innerText || "";
}

function uploadReviewImage(container, event) {
  const targetElement = event.target;

  const imgElement = container.querySelector('.uploaded-image');
  if (imgElement && imgElement.style.display === 'block' && targetElement !== container.querySelector('.add-more')) {
      return;
  }

  const uploadInput = createUploadInput();
  uploadInput.addEventListener('change', handleFileChange);

  function createUploadInput() {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.click();

    return input;
  }

  function handleFileChange(event) {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await youcanjs.product.upload(file);
            if (res && res.link) {
              reviewData.images.push(res.link);
              uploadedImagesHistory.push(res.link);

              const imageUrl = reader.result;
              displayUploadedImg(container, imageUrl);
              appendImageToPreview(res.link, container.parentElement);
            }
            } catch (error) {
                if (error.status === 422) {
                    const imageErrors = error.meta.fields.image;
                    if (imageErrors && imageErrors.length > 0) {
                        notify(imageErrors[0], 'error');
                    } else {
                        notify(error.detail, 'error');
                    }
                } else {
                  notify(`${REVIEWS_TRANSLATED_TEXT.errorMessage}`, 'error');
                }
            }
        };
    }
  }
}

function displayUploadedImg(container, imageUrl) {
  const imgElement = container.querySelector('.uploaded-image');
  imgElement.src = imageUrl;
  imgElement.style.display = 'block';
  container.querySelector('.add-more').style.display = 'block';
  container.querySelector('.yc-upload').style.display = 'none';
}

function appendImageToPreview(imageUrl, parent) {
  let container = parent.querySelector('.yc-image-preview-container');
  const submitButton = parent.querySelector('.yc-btn');

  if (!container) {
    container = document.createElement('div');
    container.className = 'yc-image-preview-container';
    parent.insertBefore(container, submitButton);
  }

  const imagePreviewSection = document.createElement('div');
  const mainImage = document.querySelector('.uploaded-image');

  imagePreviewSection.className = 'yc-image-preview';

  const previewImage = document.createElement('img');
  previewImage.src = imageUrl;
  previewImage.onclick = function() {

  mainImage.src = imageUrl;
  mainImage.onclick = () => showExpandedImageView(mainImage);
  parent.querySelectorAll('.yc-image-preview img').forEach(img => img.classList.remove('selected-image'));
  previewImage.classList.add('selected-image');
};

  const deleteButton = createDeleteButton(imageUrl, imagePreviewSection);
  imagePreviewSection.appendChild(previewImage);
  imagePreviewSection.appendChild(deleteButton);
  container.appendChild(imagePreviewSection);
}

function createDeleteButton(imageUrl, parentElement) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'remove-button';
  button.innerHTML = 'X';

  button.addEventListener('click', function() {
    parentElement.remove();

    const index = reviewData.images.indexOf(imageUrl);
    if (index > -1) {
        reviewData.images.splice(index, 1);
        uploadedImagesHistory.splice(index, 1);
    }

    if (uploadedImagesHistory.length > 0) {
        const lastImage = uploadedImagesHistory[uploadedImagesHistory.length - 1];
        const mainImage = document.querySelector('.uploaded-image');
        mainImage.src = lastImage;
    } else {
        resetMainUploadContainerIfNoImages();
    }
  });
    return button;
}

function resetMainUploadContainerIfNoImages() {
  if (reviewData.images.length === 0) {
      const mainImage = document.querySelector('.uploaded-image');
      const container = mainImage.closest('.yc-upload-container');
      mainImage.src = '';
      mainImage.style.display = 'none';
      container.querySelector('.add-more').style.display = 'none';
      container.querySelector('.yc-upload').style.display = 'flex';
  }
}

function showExpandedImageView(imgElement) {
  const bigView = document.querySelector('.image-big-view');
  const bigImg = bigView.querySelector('img');
  bigImg.src = imgElement.src;
  bigView.style.display = 'flex';
}

function hideExpandedImageView(bigViewElement) {
  bigViewElement.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', setupEventListeners);
