import { initEditor, setContent, getContent } from './editor.js'
import { getLastCode, setLastCode } from './storage.js'

const onSetContent = () => {
  const code = getContent()
  document.getElementById('preview').srcdoc = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Preview</title>
    <style>
      html, body {
        background-color: transparent;
        margin: 0;
        padding: 0;
      }
      body {
        padding: 1rem;
      }
    </style>
  </head>
  <body>
    <script type="module">
      ${code}
    </script>
  </body>
</html>
<body>
</body>
`
}

const fetchContent = async (url) => {
  return fetch(url).then(res => res.text())
}

const init = () => {
  const sandboxUrl = '/examples/sandbox.js'
  const introUrl = '/examples/intro.js'

  const saveCode = () => {
    const { hash } = window.location
    if (hash === `#${sandboxUrl}`) {
      setLastCode(getContent())
    }
  }

  // Load the example code on menu click
  let currentLink = null
  document.addEventListener('click', (e) => {
    const url = e.target.pathname

    if (url && url.endsWith('.js')) {
      e.preventDefault()

      if (url === sandboxUrl) {
        const saved = getLastCode()
        if (saved) {
          setContent(saved)
        } else {
          fetchContent(url).then(setContent)
        }
      } else {
        saveCode()
        fetchContent(url).then(setContent)
      }

      if (currentLink) {
        currentLink.classList.remove('active')
      }
      currentLink = e.target
      currentLink.classList.add('active')

      window.location.hash = url
    }
  })

  // Open the example from the URL hash, or the default one
  const { hash } = window.location
  let initialUrl = introUrl
  if (hash && /^#\/examples\/.+?\.js$/.test(hash)) {
    initialUrl = hash.slice(1)
  }
  document.querySelector(`a[href="${initialUrl}"]`).click()

  // Save the code on window unload
  window.addEventListener('unload', saveCode)

  // Init the Monaco editor
  initEditor(onSetContent)
}

init()
