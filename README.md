# wavesurfer.ts

An experimental rewrite of [wavesufer.js](https://github.com/wavesurfer-js/wavesurfer.js) to play around with new ideas.

## Goals

 * TypeScript API
 * Better architecture
 * Minimize the available options and provide sensible defaults
 * Improve the decoding and rendering performance

## Non-goals

Keeping backwards compatibility with earlier versions of wavesurfer.js.

## Architecture

Principles:
 * Modular and event-driven
 * Allow swapping the decoding, rendering and playback mechanisms
 * Extensible with plugins

![diagram](https://user-images.githubusercontent.com/381895/222349436-38b550e5-24dc-4143-9cdb-efbe00540213.png)

## Development

Install dev dependencies:

```
yarn
```

Start the TypeScript compiler in watch mode:

```
yarn build -w
```

Run an HTTP server to view the examples:

```
python3 -m http.server --cgi 8080
```

Open http://localhost:8080/examples/basic/ in your browser.
There's no hot reload yet, so you'll need to reload the page manually on every change.

## Feedback

See https://github.com/wavesurfer-js/wavesurfer.js/discussions/2684
