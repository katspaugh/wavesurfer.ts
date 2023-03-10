class Fetcher {
  public async load(url: string): Promise<ArrayBuffer> {
    return fetch(url).then((response) => response.arrayBuffer())
  }
}

export default Fetcher
