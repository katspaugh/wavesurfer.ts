// SoundCloud-style bars

import WaveSurfer from '/dist/index.js'

const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav',

  // Set a bar width
  barWidth: 2,
  // Optionally, specify the spacing between bars
  barGap: 1,
  // And the bar radius
  barRadius: 2,
})

wavesurfer.on('seek', function () {
  wavesurfer.play()
})
