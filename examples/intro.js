// Hi there!
// This is a set of live examples of how to use wavesufer.js.
// You can edit the code and see the result live.

// We'll start with the very basics.

// First, import the library.
// (Unless you are loading it via a script tag from a CDN).
import WaveSurfer from '/dist/index.js'

// Create an instance and pass different parameters
const wavesurfer = WaveSurfer.create({
  // The container where the waveform will be drawn.
  // This is the only required parameter.
  // We're passing `document.body` here,
  // but you can pass any DOM element or CSS selector.
  container: document.body,

  // The main waveform.
  // It can be any CSS color, e.g. hex colors or rgba.
  waveColor: 'rgb(200, 0, 200)',

  // This is color of the progress mask.
  // It should typically be darker or brighter than the waveColor.
  progressColor: 'rgb(100, 0, 100)',

  // Finally, pass a URL to the audio file.
  // Note: this URL has to support CORS.
  url: 'https://wavesurfer-js.org/example/media/demo.wav'
})

// Now, let's add some interaction.
// We'll add a play/pause button.

// First, create a button element
const button = document.createElement('button')
button.textContent = 'Play'
document.body.appendChild(button)

// Next, let's change the text on the button when the audio is playing.
wavesurfer.on('play', () => {
  button.textContent = 'Pause'
})
// And when it's paused.
wavesurfer.on('pause', () => {
  button.textContent = 'Play'
})

// Subscribe to wavesurfer's `canplay` event.
// It's fired when the audio is ready to play.
wavesurfer.on('canplay', () => {
  // Finally, inside the callback, we'll add a click listener to the button.
  button.addEventListener('click', () => {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause()
    } else {
      wavesurfer.play()
    }
  })
})
