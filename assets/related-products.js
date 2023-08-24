class SliderInstance {
  /**
   * 
   * @param {HTMLElement[]} images 
   * @param {?Element} navRight 
   * @param {?Element} navLeft 
   * @param {{imagesPerView: Number, imagesAspectRatio: string, rtl: Boolean, step: Number}} options
   */
  constructor(images, navRight, navLeft, options) {
    this.images = images;
    this.navRight = navRight;
    this.navLeft = navLeft;
    this.options = options;

    this.pool = new Array(options.imagesPerView).fill().map((_, i) => i);

    this.#init();
  }

  #init() {
    /**
     * 
     */
    this.#setImagesSizes();

    /**
     * 
     */
    this.navRight && this.navRight.addEventListener('click', () => this.#navigationHandler(this.options.step));
    this.navLeft && this.navLeft.addEventListener('click', () => this.#navigationHandler(-this.options.step));
  }

  #setImagesSizes() {
    const width = 1 / this.options.imagesPerView * 100;

    this.images.forEach(image => {
      image.style.width = `${width}%`;
      image.style.aspectRatio = this.options.aspectRatio;
    });
  }

  /**
   * 
   * @param {Number} directionalStep 
   */
  #navigationHandler(directionalStep) {
    const feedback = this.#from(directionalStep);

      this.images[this.pool[0]].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
  }

  #from(directionalStep) {
    const startPosition = this.pool[0] + directionalStep;
    const finishPosition = this.pool[this.pool.length - 1] + directionalStep;
    const rightBoundLeftover = Math.abs(finishPosition) - this.images.length;

    const isInTheNegative = startPosition < 0;
    const isOutOfRightBound = startPosition >= this.images.length;
    this.pool = [];

    /**
     * 1. From left - Go to end
     * 2. From right - Go to end
     */
    if (
      (isInTheNegative && Math.abs(startPosition) >= this.options.step)
      || (isOutOfRightBound && rightBoundLeftover < this.options.step)
    ) {
      const startingPoint = this.images.length - this.options.step - 1;

      for (let i = startingPoint; i < Math.min(startingPoint + this.options.imagesPerView, this.images.length); i++) {
        this.pool.push(i);
      }

      return 1;
    }

    /**
     * 1. From left - Back to start
     * 2. From right - Back to start
     */

    if (
      (isInTheNegative && Math.abs(startPosition) < this.options.step)
      || (isOutOfRightBound && rightBoundLeftover >= this.options.step)
    ) {
      for (let i = 0; i < this.options.imagesPerView; i++) {
        this.pool.push(i);
      }

      return 0;
    }

    console.log(startPosition, startPosition + this.options.imagesPerView)
    for (let i = startPosition; i < startPosition + this.options.imagesPerView; i++) {
      console.log('-->', i)
      this.pool.push(i);
    }

    return -1;
  }
}

/**
 * 
 * @param {String} container 
 * @param {{imagesPerView: Number, imagesAspectRatio: string, rtl: Boolean, step: Number}} options
 * 
 * @returns {SliderInstance}
 */
function sliderFactory(container, options = {}) {
  const sliderBlock = document.querySelector(container);

  if (!sliderBlock) {
    throw Error('Slider container not found');
  }

  const imagesContainer = sliderBlock.querySelector('[data-slider-images]');

  if (!imagesContainer || imagesContainer.children.length === 0) {
    throw Error('No images to slide through');
  }

  const navRight = sliderBlock.querySelector('[data-slider-right]');
  const navLeft = sliderBlock.querySelector('[data-slider-left]');

  /**
   * 
   */

  if (
    !options.imagesAspectRatio
    || /^[0-9]+\/[0-9]+$/.test(options.imagesAspectRatio) === false
  ) {
    options.imagesAspectRatio = '1/1';
  }

  /**
   * 
   */

  if (!options.step) {
    options.step = 1;
  }

  return new SliderInstance(
    Array.from(imagesContainer.children),
    navRight,
    navLeft,
    options
  );
}

(() => {
  const instance = sliderFactory('#related-products', {
    imagesPerView: 2,
    step: 1,
    aspectRatio: '326/338'
  });

  console.log(instance.pool)
})();
