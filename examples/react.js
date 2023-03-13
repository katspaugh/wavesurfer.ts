/*
Load React:
<html>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</html>
 */

// Import WaveSurfer
import WaveSurfer from '/dist/index.js'
// Import React stuff
const { createElement: jsx, useRef, useState, useEffect, useCallback } = React

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
const WaveSurferComponent = (props) => {
  const containerRef = useRef()
  const wavesurferRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // On play button click
  const onPlayClick = useCallback(() => {
    const wavesurfer = wavesurferRef.current
    if (!wavesurfer) return
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
  }, [wavesurferRef])

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return

    const wavesurfer = WaveSurfer.create({
      ...props,
      container: containerRef.current,
    })

    wavesurferRef.current = wavesurfer

    setCurrentTime(0)
    setIsPlaying(false)

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('audioprocess', ({ currentTime }) => setCurrentTime(currentTime))
    ]

    return () => {
      subscriptions.forEach(unsub => unsub())
      wavesurfer.destroy()
    }
  }, [props, containerRef])

  return jsx(
    'div', { ref: containerRef },
    jsx('button', { onClick: onPlayClick }, isPlaying ? 'Pause' : 'Play'),
    jsx('p', null, `Seconds played: ${currentTime}`)
  )
}

// Another React component that will render two wavesurfers
const App = () => {
  const urls = [
    'https://wavesurfer-js.org/example/media/demo.wav',
    'https://wavesurfer-js.org/example/media/stereo.mp3',
  ]
  const [audioUrl, setAudioUrl] = useState(urls[0])

  // Swap the audio URL
  const onUrlChange = useCallback(() => {
    urls.reverse()
    setAudioUrl(urls[0])
  }, [])

  // Render the wavesurfer component
  // and a button to load a different audio file
  return jsx(
    'div', null,

    jsx(WaveSurferComponent, {
      height: 100,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      // Changing the URL, which is a React prop,
      // will re-render the wavesurfer component
      url: audioUrl,
    }),

    jsx('button', { onClick: onUrlChange }, 'Load another audio'),
  )
}

// Create a React root and render the app
const root = ReactDOM.createRoot(document.body)
root.render(jsx(App))
