function generateVideoSrc(videoLink, videoType) {
  let videoId = ''
  let videoSrc = ''

  if (videoLink.includes('youtu.be')) {
    videoId = videoLink.split('youtu.be/')[1]
  } else {
    videoId = videoLink.split('v=')[1]
  }

  if (videoType == 'youtube') {
    videoSrc = 'https://www.youtube.com/embed/' + videoId
  } else if (videoType == 'facebook') {
    videoSrc = `https://www.facebook.com/plugins/video.php?href=${videoLink}`
  }

  return videoSrc
}

const videoSrc = generateVideoSrc(videoLink, videoType)

if (videoType == 'youtube') {
  const iframe = document.getElementById('youtube-video')
  iframe.src = videoSrc
  iframe.width = width
} else if (videoType == 'facebook') {
  const iframe = document.getElementById('facebook-video')
  console.log(videoSrc)
  iframe.src = videoSrc
  iframe.width = width
}
