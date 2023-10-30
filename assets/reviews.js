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

document.addEventListener('DOMContentLoaded', () => {

  const reviewForm = document.getElementById('reviewForm');
  const thankYouMessage = document.querySelector('.thank-you-message');

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reviewForm);

    reviewData.content = formData.get('content');
    reviewData.email = formData.get('email');
    reviewData.ratings = Number(formData.get('ratings'));
    reviewData.first_name = formData.get('first_name');
    reviewData.last_name = formData.get('last_name');
    reviewData.images = formData.get('images');

    try {
      console.log('Review Data before submission:', reviewData);
      const response = await youcanjs.product.submitReview(reviewsProductId, reviewData);
            if (response) {
        alert('Review submitted successfully!');
        reviewForm.reset();
        reviewForm.style.display = 'none';
        thankYouMessage.style.display = 'block';
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  });

  const modal = document.getElementById("reviewModal");
  const btn = document.getElementById("addReviewBtn");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  span.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
  setupReviews();
});

function uploadReviewImage(element) {
  const parentSection = element.closest('.yc-review-form');
  const uploadInput = document.createElement('input');
  uploadInput.type = 'file';
  uploadInput.accept = 'image/*';
  uploadInput.multiple = true;
  uploadInput.style.display = 'none';
  document.body.appendChild(uploadInput);

  uploadInput.click();

  uploadInput.addEventListener('change', async function() {
    if (this.files && this.files.length) {
      for (let file of this.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener("load", async () => {
          const base64 = reader.result;

          try {
            const res = await youcanjs.product.upload(file);
            const uploadedImageUrl = res.link;

            const imagePreviewSection = document.createElement('div');
            imagePreviewSection.className = 'yc-upload-wrapper';

            const imagePreview = document.createElement('div');
            imagePreview.className = 'yc-image-preview';

            const previewImage = document.createElement('img');
            previewImage.src = uploadedImageUrl;

            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.innerHTML = '<ion-icon name="close-outline" style="zoom:2.0;"></ion-icon>';
            closeButton.addEventListener('click', function() {
              imagePreviewSection.remove();
              const index = reviewData.images.indexOf(uploadedImageUrl);
              if (index > -1) {
                reviewData.images.splice(index, 1);
              }
            });

            imagePreview.appendChild(previewImage);
            imagePreviewSection.appendChild(imagePreview);
            imagePreviewSection.appendChild(closeButton);

            parentSection.querySelector('.yc-upload-preview').appendChild(imagePreviewSection);

            reviewData.images.push(uploadedImageUrl);
            console.log("Current images:", reviewData.images);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        });
      }
    }
  });
}
