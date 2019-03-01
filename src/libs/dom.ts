let nativeScrollBarSize: false | number = false

export function getNativeScrollBarSize () {
  if (nativeScrollBarSize !== false) {
    return nativeScrollBarSize
  }

  const div = document.createElement('div')

  div.style.position = 'absolute'
  div.style.top = '-9999px'
  div.style.height = '100px'
  div.style.width = '100px'
  div.style.overflow = 'scroll'

  document.body.appendChild(div)
  nativeScrollBarSize = div.offsetWidth - div.clientWidth
  document.body.removeChild(div)

  return nativeScrollBarSize
}
