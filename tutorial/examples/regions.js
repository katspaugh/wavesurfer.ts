import WaveSurfer from '/dist/index.js'
import RegionsPlugin from '/dist/plugins/regions.js'

const ws = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav'
})

const wsRegions = ws.registerPlugin(RegionsPlugin)

ws.on('ready', () => {
  wsRegions.addRegionAtTime(4, 7, 'First region')
  wsRegions.addRegionAtTime(9, 10, 'Middle region')
  wsRegions.addRegionAtTime(12, 17, 'Last region')
})

let activeRegion = null

wsRegions.on('region-clicked', ({ region }) => {
  ws.seekTo(region.startTime)
  ws.play()
  activeRegion = region
})

ws.on('timeupdate', ({ currentTime }) => {
  if (activeRegion && (currentTime >= activeRegion.endTime)) {
    ws.pause()
    ws.seekTo(activeRegion.endTime)
    activeRegion = null
  }
})

const random = (min, max) => Math.random() * (max - min) + min
wsRegions.on('region-created', ({ region }) => {
  wsRegions.setRegionColor(region, `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`)
})
