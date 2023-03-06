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

    reviewsContainer.style.display = 'block';
    reviews.forEach((review) => {
      const reviewItem = document.createElement('li');
      reviewItem.classList.add('review-item');
      reviewItem.innerHTML = `
        <div class='header'>
          <div class="profil">
            <img loading='lazy' class='image' src=${review.images_urls[0] || defaultAvatar} />
            <div class='info'>
              <span class='name'>${review.first_name || ''} ${review.last_name || ''}</span>
              <span class='created-at-date'>${review.created_at}</span>
            </div>
          </div>
          <div class='yc-reviews-stars'
              style="--rating: ${review.ratings};"
              aria-label="Rating of this product is ${review.ratings} out of 5"
          >
          </div>
        </div>
        <div class='content'>
          ${review.content === null ? '' : review.content}
        </div>
      `;
      reviewsWrapper.appendChild(reviewItem);
    });

    if(reviews) {
      convertDate();
      showMoreReviews();
    }

    if (reviews.length === 0) {
      noDataSetter();
    }
  } catch (error) {
    noDataSetter();
  }
})();

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

function showMoreReviews() {
  const reviewsWrapper = $('#reviews-wrapper');
  const showMoreButton = $('#show-more');

  for (let i = 0; i < 3; i++) {
    reviewsWrapper.children[i].classList.add("visible");
  }

  if(reviewsWrapper.children.length > 3) {
    showMoreButton.style.display = "block";
  }

  showMoreButton?.addEventListener("click", () => {

    for (let i = 3; i < reviewsWrapper.children.length; i++) {
      reviewsWrapper.children[i].classList.add("visible");
    }

    showMoreButton.style.display = "none";
  });
}
