const LS_KEY = 'WS_lastCode'

export const getLastCode = () => {
  return localStorage.getItem(LS_KEY) || ''
}

export const setLastCode = (code) => {
  localStorage.setItem(LS_KEY, code)
}
