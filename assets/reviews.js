(async () => {
  const reviewsContainer = document.querySelector('.yc-product-reviews');
  const reviewsWrapper = document.querySelector('.yc-reviews-wrapper');
  const noDataSetter = (element) => {
    if (reviewsContainer) {
      reviewsContainer.remove();
    }
  };

  try {
    const reviews = await youcanjs.product.fetchReviews(productId).data();
    const maxReviewsToShow = 3;

    reviewsContainer.style.display = 'block';

    for (let i = 0; i < maxReviewsToShow && i < reviews.length; i++) {
      const review = reviews[i];
      const reviewItem = document.createElement('li');

      reviewItem.classList.add('review-item');
      createElement(reviewItem, review);
      reviewsWrapper.appendChild(reviewItem);
    }

    if(reviews.length > maxReviewsToShow) {
      const showMoreButton = $('#show-more');

      showMoreButton.style.display = "block";
      showMoreButton?.addEventListener("click", () => {
        for (let i = maxReviewsToShow; i < reviews.length; i++) {
          const review = reviews[i];
          const reviewItem = document.createElement('li');

          reviewItem.classList.add('review-item');
          createElement(reviewItem, review);
          reviewsWrapper.appendChild(reviewItem);
        }

        showMoreButton.style.display = "none";
      });
    }

    if(reviews) {
      convertDate();
    }

    if (reviews.length === 0) {
      noDataSetter();
    }
  } catch (error) {
    noDataSetter();
  }
})();

function createElement(element, index) {
  element.innerHTML = `
        <div class='header'>
          <div class="profil">
            <img loading='lazy' class='image' src=${index.images_urls[0] || defaultAvatar} />
            <div class='info'>
              <span class='name'>${index.first_name || ''} ${index.last_name || ''}</span>
              <span class='created-at-date'>${index.created_at}</span>
            </div>
          </div>
          <div class='yc-reviews-stars'
              style="--rating: ${index.ratings};"
              aria-label="Rating of this product is ${index.ratings} out of 5"
          >
          </div>
        </div>
        <div class='content'>
          ${index.content === null ? '' : index.content}
        </div>
      `;
}

function convertDate() {
  const createdAtDate = document.querySelectorAll('.created-at-date');

  createdAtDate?.forEach(date => {
    const originalDateString = date.textContent;
    const originalDate = new Date(originalDateString);
    const day = originalDate.getDate().toString().padStart(2, '0');
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const year = originalDate.getFullYear().toString();
    const formattedDate = `${day}.${month}.${year}`;
    date.textContent = formattedDate;
  });
}
