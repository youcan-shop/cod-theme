function previewProductImage(url) {
  const thumbnail = document.querySelector('#img-1')
  thumbnail.src = url
}

function uploadImage() {
  const uploadInput = document.querySelector('#yc-upload')
  uploadInput.click()
}

let zoomer = function() {
  const imgZoomer = document.querySelector('#img-zoomer-box');
  if (imgZoomer) {
    imgZoomer.addEventListener('mousemove', function(e) {
      let original = document.querySelector('#img-1'),
        magnified = document.querySelector('#img-2'),
        style = magnified.style,
        x = e.pageX - this.offsetLeft,
        y = e.pageY - this.offsetTop,
        imgWidth = original.offsetWidth,
        imgHeight = original.offsetHeight,
        xperc = ((x / imgWidth) * 100),
        yperc = ((y / imgHeight) * 100);

      if (x > (.01 * imgWidth)) {
        xperc += (.15 * xperc);
      };

      if (y >= (.01 * imgHeight)) {
        yperc += (.15 * yperc);
      };

      style.backgroundPositionX = (xperc - 9) + '%';
      style.backgroundPositionY = (yperc - 9) + '%';

      style.left = (x - 180) + 'px';
      style.top = (y - 180) + 'px';

      style.backgroundImage = 'url(' + original.src + ')';
    }, false);
  }
}();
