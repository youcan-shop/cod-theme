function previewProductImage(url) {
  const thumbnail = document.querySelector('#thumbnail')
  thumbnail.src = url
}


function uploadImage() {
  const uploadInput = document.querySelector('#yc-upload')
  uploadInput.click()
}
