const GIST_PARAM = 'gist'

export const getQueryParam = (param) => {
  return new URL(location.href).searchParams.get(param)
}

export const clearQueryParam = (param) => {
  const path = location.pathname + location.search.replace(new RegExp(`\\b${param}=\\w+`), '').replace(/\?$/, '')
  history.pushState({}, '', path)
}

export const getUrlGistId = () => {
  return getQueryParam(GIST_PARAM)
}

export const setUrlGistId = (id) => {
  const path = `${location.pathname}?${GIST_PARAM}=${encodeURIComponent(id)}`
  history.pushState({}, '', path)
}

export const clearUrlGistId = () => {
  clearQueryParam(GIST_PARAM)
}


