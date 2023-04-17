/**
 * Converts date from yyyy-mm-dd to dd.mm.yyyy
 */
function convertDate(dateString) {
  const originalDate = new Date(dateString);
  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const year = originalDate.getFullYear().toString();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
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
        </div>
      </div>

      <div class='yc-reviews-stars'
           style='--rating: ${review.ratings}'
           aria-label="Rating of this product is ${review.ratings} out of 5"
      ></div>
    </div>

    ${review.content ? `<div class='content'>${review.content}</div>` : ''}

    <div class='created-at-date'>${convertDate(review.created_at)}</div>
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

document.addEventListener('DOMContentLoaded', () => {
  setupReviews();
});
