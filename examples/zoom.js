// Zooming the waveform

import WaveSurfer from '/dist/index.js'

const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav',
  minPxPerSec: 10,
})

// Create a simple slider
/*
<html>
  <input type="range" min="10" max="1000" />
</html>
*/
const slider = document.querySelector('input')

// Update the zoom level on slider change
wavesurfer.on('ready', () => {
  slider.addEventListener('input', function () {
    const minPxPerSec = Number(this.value)
    wavesurfer.zoom(minPxPerSec)
  })
})
