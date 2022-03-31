import axios from 'axios'
export async function parseM3u8Url(url) {
  const urlObj = new window.URL(url)
  console.assert(url, 'url must exists')
  if (/\.m3u8/.test(url)) {
    const { data: resData } = await axios.get(url)
    if (/#EXT-X-STREAM-INF/.test(resData)) {
      const lines = resData.split('\n').filter(i => i)
      const existsLine = lines.find(line => /^#EXT-X-STREAM-INF/.test(line))
      const existsIndex = lines.indexOf(existsLine)
      //console.log(3.5, existsIndex, lines)
      if (lines.length === existsIndex + 2) {
        return `${urlObj.origin}${lines[existsIndex + 1]}`
      }
    }
  }
  return url
}