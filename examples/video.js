import WaveSurfer from '/dist/index.js'

// Create a video element and add it to the DOM.
// The video can also be defined in HTML, in which case we just get it by a selector.
const video = document.createElement('video')
video.crossOrigin = 'anonymous'
video.controls = true
video.style.width = '100%'
video.src = 'https://wavesurfer-js.org/example/media/nasa.mp4'
document.body.appendChild(video)

// Initialize wavesurfer.js
const ws = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  // Pass the video element in the `media` param
  media: document.querySelector('video'),
})
