// Waveform for a video

// Create a video element
/*
<html>
  <video src="https://wavesurfer-js.org/example/media/nasa.mp4" crossOrigin="anonymous" controls width="100%" />
</html>
*/

// Initialize wavesurfer.js
import WaveSurfer from '/dist/index.js'

const ws = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  // Pass the video element in the `media` param
  media: document.querySelector('video'),
})
