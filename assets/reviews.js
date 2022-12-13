(async () => {
	const reviewsWrapper = document.querySelector('.yc-reviews-wrapper');
	const noDataSetter = (element) => {
		reviewsWrapper.innerHTML = `
        <div class='review-item__empty'>No reviews available</div>
      `;
	};

	try {
		const reviews = await youcanjs.product.fetchReviews(productId).data();

		reviews.forEach((review) => {
			const reviewItem = document.createElement('li');
			reviewItem.classList.add('review-item');
			reviewItem.innerHTML = `
        <div class='header'>
          <img class='image' src=${review.images_urls[0] || defaultAvatar} />
          <div class='name'>${review.first_name} ${review.last_name}</div>
        </div>
        <div class='content'>
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
		console.error(error);
	}
})();
