import {
  isObject,
  isUnset,
  randStr,
  toFixed,
  encodeJSON,
} from 'mytoolkit'


export default function drawGradient(chart, color, defaultColor) {
  let {
    sections: {
      defs
    },
    gradientPool
  } = chart
  if (isUnset(color)) {
    return defaultColor
  }
  if (isObject(color)) {
    let colorString = encodeJSON(color)
    let gradientObj = gradientPool.find(p => p.colorString === colorString)
    if (gradientObj) {
      return `url(#${gradientObj.id})`
    }


    let r = '', id = 'lc-gradient-' + randStr(6)
    if (color.type === 'linear') {
      color.colorStops.forEach(item => {
        r += `<stop offset="${toFixed(item.offset, 0, 100)}%" stop-color="${item.color}"/>`
      })
      defs.append('linearGradient')
        .attrs({
          id,
          x1: isUnset(color.x) ? 0 : color.x,
          x2: isUnset(color.x2) ? 0 : color.x2,
          y1: isUnset(color.y) ? 0 : color.y,
          y2: isUnset(color.y2) ? 1 : color.y2
        }).html(r)
      gradientPool.push({
        id,
        colorString
      })
      return `url(#${id})`
    } else if (color.type === 'radial') {
      color.colorStops.forEach(item => {
        r += `<stop offset="${toFixed(item.offset, 0, 100)}%" stop-color="${item.color}"/>`
      })
      defs.append('radialGradient')
        .attrs({
          id,
          cx: color.x,
          cy: color.y,
          r: color.r
        }).html(r)
      gradientPool.push({
        id,
        colorString
      })
      return `url(#${id})`
    }
    return r
  }
  return color
}
