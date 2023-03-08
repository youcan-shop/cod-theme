(async () => {
  const reviewsContainer = $('.yc-product-reviews');
  const reviewsWrapper = $('.yc-reviews-wrapper');
  const showMoreButton = $('#show-more');
  let reviews = [];

    const noDataSetter = (element) => {
      if (reviewsContainer) {
        reviewsContainer.remove();
      }
    };

  const createReviewItem = (review) => {
    const reviewItem = document.createElement('li');
    reviewItem.classList.add('review-item');
    createElement(reviewItem, review);
    return reviewsWrapper.appendChild(reviewItem);
  }

  try {
    const res = youcanjs.product.fetchReviews(productId, { limit: 3 });

    reviews = await res.data();

    reviewsWrapper.append(...reviews.map(review => createReviewItem(review)));
    const pagination = res.pagination();

    if (pagination.totalPages > 1) {
      showMoreButton.style.display = 'block';
      showMoreButton.addEventListener('click', async () => {
        const response = res.next();

        reviews = await response.data();

        reviewsWrapper.append(...reviews.map(review => createReviewItem(review)));

        if (pagination.totalPages >= pagination.currentPage) {
          showMoreButton.style.display = 'none';
        }
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
