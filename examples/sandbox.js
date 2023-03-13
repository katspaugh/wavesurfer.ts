/**
  * Hello there! This is your sandbox.
  * You can play around with the code here and preview the result.
  * The code will be automatically saved, so you can refresh the page,
  * or open other examples.
  */
import WaveSurfer from '/dist/index.js'

const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav'
})
