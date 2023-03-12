import WaveSurfer from '/dist/index.js'

const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav',
  minPxPerSec: 10,
})

const slider = document.createElement('input')
slider.type = 'range'
slider.min = 10
slider.max = 1000
document.body.appendChild(slider)

wavesurfer.once('ready', () => {
  slider.addEventListener('input', function () {
    wavesurfer.zoom(Number(this.value))
  })
})
