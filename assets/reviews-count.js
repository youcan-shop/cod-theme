async function fetchReviewsForProduct(productId, closetParent) {
  const generalReviewsContainers = document.querySelectorAll(`${closetParent} .yc-general-review`);
  const generalReviewsWrappers = document.querySelectorAll(`${closetParent} .yc-general-review-wrapper`);

  const noDataSetter = (element) => {
    generalReviewsContainers.forEach(container => container.remove());
  };

  try {
    const totalReviews = await youcanjs.product.fetchReviews(productId).data();
    const reviewCount = totalReviews.length;

    generalReviewsContainers.forEach(container => container.style.display = 'block');
    generalReviewsWrappers.forEach(wrapper => wrapper.innerHTML = `
      <li class='rating-stars'>
        <div class="yc-reviews-stars" style="--rating: ${calculateAverageRating(totalReviews)};" aria-label="Rating of this product is ${calculateAverageRating(totalReviews)} out of 5"></div>
      </li>
      <li class='general-count'>
        (${reviewCount} ${ratings})
      </li>
    `);

    if (reviewCount === 0) {
      noDataSetter();
    }
  } catch (error) {
    noDataSetter();
  }
};

function calculateAverageRating(totalReviews) {
  if (!totalReviews || !totalReviews.length) {
    return 0;
  }

  const totalRating = totalReviews.reduce((sum, review) => {
    return sum + review.ratings;
  }, 0);

  return totalRating / totalReviews.length;
}
