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
    contianerHeight: ch,

  } = chart

  let html = opts.html
  if (isUnset(html) || html === '') return

  let align, left, top, right, bottom
  align = opts.align || 'left'
  left = opts.left || 0
  top = opts.top || 0
  right = opts.right || 0
  bottom = opts.bottom || 0

  layer.html(html)

  let { width, height } = layer.node().getBBox()

  if (align === 'left') {
    layer.attr('transform', `translate(${left}, ${top})`)
  } else {
    layer.attr('transform', `translate(${cw - right - width},${top})`)
  }








}

