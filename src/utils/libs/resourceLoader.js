export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.language = 'javascript'
    script.onload = resolve
    script.onerror = reject
    // const firstScript = document.getElementsByTagName('script')[0]
    // firstScript.parentNode.insertBefore(script, firstScript)
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
