// Regions plugin

import WaveSurfer from '/dist/index.js'
import RegionsPlugin from '/dist/plugins/regions.js'

// Create an instance of WaveSurfer
const ws = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
  url: 'https://wavesurfer-js.org/example/media/demo.wav'
})

// Initialize the Regions plugin
const wsRegions = ws.registerPlugin(RegionsPlugin)

// Give regions a random color when they are created
const random = (min, max) => Math.random() * (max - min) + min
wsRegions.on('region-created', ({ region }) => {
  wsRegions.setRegionColor(region, `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`)
})

// Create some regions at specific time ranges
ws.on('ready', () => {
  wsRegions.addRegionAtTime(4, 7, 'First region')
  wsRegions.addRegionAtTime(9, 10, 'Middle region')
  wsRegions.addRegionAtTime(12, 17, 'Last region')
})

// Loop a region on click
let loop = true
let activeRegion = null

wsRegions.on('region-clicked', ({ region }) => {
  ws.seekTo(region.startTime)
  ws.play()
  activeRegion = region
})

// Track the time
ws.on('audioprocess', ({ currentTime }) => {
  // When the end of the region is reached
  if (activeRegion && ws.isPlaying() && (currentTime >= activeRegion.endTime)) {
    if (loop) {
      // If looping, jump to the start of the region
      ws.seekTo(activeRegion.startTime)
    } else {
      // Otherwise, stop playing
      ws.pause()
      ws.seekTo(activeRegion.endTime)
      activeRegion = null
    }
  }
})

// Toggle looping with a checkbox
const p = document.createElement('p')
p.innerHTML = `
  <label>
    <input type="checkbox" checked="${loop}" style="vertical-align: text-top" />
    Loop regions on click
  </label>
`
document.body.appendChild(p)
document.querySelector('input').onclick = (e) => { loop = e.target.checked }
