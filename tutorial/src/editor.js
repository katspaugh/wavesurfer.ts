let editor = null

const SESSION_KEY = 'LQ_editorContent'

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

export const sessionSave = () => {
  sessionStorage.setItem(SESSION_KEY, getContent())
}

export const sessionRestore = () => {
  const content = sessionStorage.getItem(SESSION_KEY)
  if (content) {
    setContent(content)
    return true
  }
  return false
}

export const initEditor = (onSetContent) => {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.0-dev.20211218/min/vs' } });

	require(['vs/editor/editor.main'], () => {
    let theme = 'vs'
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'vs-dark'
    }

	  const monacoEditor = monaco.editor.create(document.getElementById('editor'), {
		  language: 'javascript',
      automaticLayout: true,
      autoClosingBrackets: false,
      minimap: { enabled: false },
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
}
