async function fetchReviewsForProduct(productId, closetParent, averageRating) {
  const generalReviewsContainers = document.querySelectorAll(`${closetParent} .yc-general-review`);
  const generalReviewsWrappers = document.querySelectorAll(`${closetParent} .yc-general-review-wrapper`);

  const noDataSetter = (element) => {
    generalReviewsContainers.forEach(container => container.remove());
  };

  try {
    const totalReviews = await youcanjs.product.fetchReviews(productId).data();

    generalReviewsContainers.forEach(container => container.style.display = 'block');
    generalReviewsWrappers.forEach(wrapper => wrapper.innerHTML = `
      <li class='rating-stars'>
        <div class="yc-reviews-stars" style="--rating: ${averageRating};" aria-label="Rating of this product is ${averageRating} out of 5"></div>
      </li>
      <li class='general-count'>
        (${totalReviews.length} ${ratings})
      </li>
    `);
  } catch (error) {
    noDataSetter();
  }
};
