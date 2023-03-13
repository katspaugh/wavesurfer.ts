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
const slider = document.createElement('input')
slider.type = 'range'
slider.min = 10
slider.max = 1000
document.body.appendChild(slider)

// Update the zoom level on slider change
wavesurfer.on('ready', () => {
  slider.addEventListener('input', function () {
    const zoomLevel = Number(this.value)
    wavesurfer.zoom(zoomLevel)
  })
})
