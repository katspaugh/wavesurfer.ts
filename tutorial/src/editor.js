let editor = null

export const getContent = () => {
  return editor ? editor.getModel().getValue() : ''
}

export const setContent = (newContent) => {
  if (!editor) {
    setTimeout(() => setContent(newContent), 10)
  } else {
    editor.getModel().setValue(newContent)
  }
}

const fetchCode = async (url) => {
  return fetch(url).then((res) => res.text())
}

export const initEditor = (onSetContent) => {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.0-dev.20211218/min/vs' } });

	require(['vs/editor/editor.main'], () => {
    let theme = 'vs'
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'vs-dark'
    }

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      lib: [ 'DOM', 'ES2016' ],
      allowJs: true,
      allowNonTsExtensions: true,
      baseUrl: window.location.origin,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
    })

    const libs = [
      '/dist/index.d.ts',
      '/dist/plugins/regions.d.ts',
    ]

    Promise.all(
      libs.map(url => fetchCode(url))
    ).then((codes) => {
      codes.forEach((code, index) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(code, libs[index])
      })
    }).then(() => {
	    const monacoEditor = monaco.editor.create(document.getElementById('editor'), {
		    language: 'typescript',
        automaticLayout: true,
        autoClosingBrackets: false,
        minimap: { enabled: false },
        tabSize: 2,
        theme
	    });

      let debounce
      const model = monacoEditor.getModel()
      model.onDidChangeContent(() => {
        if (debounce) clearTimeout(debounce)
        debounce = setTimeout(onSetContent, 300)
      })

      // Export
      editor = monacoEditor
    })
  })
}