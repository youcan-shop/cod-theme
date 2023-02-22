(async () => {
  const reviewsContainer = document.querySelector('.yc-general-review');
  const reviewsWrapper = document.querySelector('.yc-general-review-wrapper');
  const noDataSetter = (element) => {
    if (reviewsContainer) {
      reviewsContainer.remove();
    }
  };

  try {
    const reviews = await youcanjs.product.fetchReviews(productId).data();
    const reviewCount = reviews.length;

    reviewsContainer.style.display = 'block';
    reviewsWrapper.innerHTML = `
      <li class='rating-stars'>
        <div class="yc-reviews-stars" style="--rating: ${calculateAverageRating(reviews)};" aria-label="Rating of this product is ${calculateAverageRating(reviews)} out of 5"></div>
      </li>
      <li class='general-count'>
        (${reviewCount} ${ratings})
      </li>
    `;

    if (reviewCount === 0) {
      noDataSetter();
    }
  } catch (error) {
    noDataSetter();
  }
})();

function calculateAverageRating(reviews) {
  if (!reviews || !reviews.length) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => {
    return sum + review.ratings;
  }, 0);

  return totalRating / reviews.length;
}
