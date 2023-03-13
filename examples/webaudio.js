// Web Audio MediaStreamAudioSourceNode

import WaveSurfer from '/dist/index.js'

const audio = new Audio()
audio.controls = true
audio.src = '/examples/audio.ogg'
document.body.appendChild(audio)

const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  backend: 'WebAudio',
  media: audio,
})
