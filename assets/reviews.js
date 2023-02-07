(async () => {
  const reviewsContainer = document.querySelector('.yc-product-reviews');
  const reviewsWrapper = document.querySelector('.yc-reviews-wrapper');
  const noDataSetter = (element) => {
    reviewsContainer.remove();
  };

  try {
    const reviews = await youcanjs.product.fetchReviews(productId).data();

    reviews.forEach((review) => {
      const reviewItem = document.createElement('li');
      reviewItem.classList.add('review-item');
      reviewItem.innerHTML = `
        <div class='header'>
          <img loading='lazy' class='image' src=${review.images_urls[0] || defaultAvatar} />
          <div class='name'>${review.first_name || ''} ${review.last_name || ''}</div>
          </div>
        <div class='content'>
          <div class="yc-reviews-stars" style="--rating: ${review.ratings};" aria-label="Rating of this product is ${
        review.ratings
      } out of 5"></div>
          ${review.content}
        </div>
      `;
      reviewsWrapper.appendChild(reviewItem);
    });

    if (reviews.length === 0) {
      noDataSetter();
    }
  } catch (error) {
    noDataSetter();
  }
})();
