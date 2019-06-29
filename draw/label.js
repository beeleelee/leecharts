import {
  isString,
  isFunction,
  isUnset,
} from "mytoolkit"

export default function drawLabel(chart, layer, opts, i) {
  let {
    d3,
    emitter,
    defaultOptions,
    containerWidth: cw,
    containerHeight: ch,

  } = chart

  let html = opts.html
  if (isUnset(html) || html === '') {
    layer.html('')
    return
  }

  let align, left, top, right, bottom
  align = opts.align || 'left'
  left = opts.left || 0
  top = opts.top || 0
  right = opts.right || 0
  bottom = opts.bottom || 0

  layer.html(html)

  let { width, height } = layer.node().getBBox()

  if (align === 'middle') {
    layer.attr('transform', `translate(${(cw + left - right - width) / 2},${top})`)
  } else if (align == 'right') {
    layer.attr('transform', `translate(${cw - right - width},${top})`)
  } else {
    layer.attr('transform', `translate(${left}, ${top})`)
  }








}

