import { initEditor, setContent, getContent } from './editor.js'

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
  let currentLink = null

  document.addEventListener('click', (e) => {
    const url = e.target.href
    if (url && url.endsWith('.js')) {
      e.preventDefault()

      fetchContent(url).then(setContent)

      if (currentLink) {
        currentLink.classList.remove('active')
      }
      currentLink = e.target
      currentLink.classList.add('active')

      window.location.hash = e.target.pathname
    }
  })

  const { hash } = window.location
  let url = '/examples/basic.js'
  if (hash && /^#\/examples\/.+?\.js$/.test(hash)) {
    url = hash.slice(1)
  }
  document.querySelector(`a[href="${url}"]`).click()
}

initEditor(onSetContent)
init()
