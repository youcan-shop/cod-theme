function getBestThumbnailUrl(videoId) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      img.src = maxResUrl;

      img.onload = () => {
        resolve(maxResUrl);
      };

      img.onerror = () => {
        resolve(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
      };
    } catch (error) {
      const defaultImageUrl = defaulVideotImage;
      resolve(defaultImageUrl);
    }
  });
}

function extractYouTubeVideoId(url) {
  const regex = /(?:v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);

  return match ? match[1] : null;
}

async function initializeYouTubeVideo(youtubeVideo) {
  const spinner = document.querySelector('.spinner');

  const videoLink = youtubeVideo.dataset.videoLink;
  const videoId = extractYouTubeVideoId(videoLink);
  youtubeVideo.style.width = width + 'px';
  youtubeVideo.style.height = height + 'px';
  const youtubeThumbnail = youtubeVideo.querySelector('.youtube-thumbnail');
  const youtubePlayButton = youtubeVideo.querySelector('.youtube-play-button');

  const thumbnailUrl = await getBestThumbnailUrl(videoId);
  youtubeThumbnail.src = thumbnailUrl;

  const iframe = document.createElement('iframe');
  iframe.width = width;
  iframe.height = height;
  iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.style.display = 'none';
  youtubeVideo.appendChild(iframe);

  youtubeVideo.addEventListener('click', function () {
    youtubeThumbnail.style.display = 'none';
    youtubePlayButton.style.display = 'none';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
    iframe.style.display = 'block';
    spinner.style.display = 'block';

    iframe.addEventListener('load', function () {
      spinner.style.display = 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const youtubeVideo = document.getElementById('youtube-video');
  const facebookVideo = document.getElementById('facebook-video');
  
  if (youtubeVideo) {
    await initializeYouTubeVideo(youtubeVideo);
  } else if (facebookVideo) {
    facebookVideo.width = width;
    facebookVideo.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoLink)}`;
  }
});
