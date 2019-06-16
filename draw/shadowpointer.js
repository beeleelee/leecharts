import {
  getData
} from '../utils'
import drawGradient from './gradient'

export default function drawShadowPointer(chart, index) {
  let {
    d3,
    defaultOptions,
    scaleX,
    scaleY,
    containerHeight: ch,
    containerWidth: cw,
    options: {
      xAxis,
      yAxis,
      grid,
      axisPointer
    },
    sections: {
      shadowPointer,
    }
  } = chart

  if (axisPointer.type !== 'shadow') return

  let scaleCategory, scaleValue, orient, color
  color = drawGradient(chart, axisPointer.color, defaultOptions.shadowPointerColor)
  if (scaleX.bandwidth) {
    scaleCategory = scaleX
    scaleValue = scaleY
    orient = 'h'
  } else if (scaleY.bandwidth) {
    scaleCategory = scaleY
    scaleValue = scaleX
    orient = 'v'
  } else {
    scaleCategory = scaleX
    scaleValue = scaleY
    orient = 'h'
  }
  let bandWidth = scaleCategory && scaleCategory.bandwidth ? scaleCategory.bandwidth() : 0

  if (index === null) {
    shadowPointer
      .style('opacity', 0)
  } else {
    let x, y, width, height, cd

    if (orient === 'h') {
      cd = getData(xAxis.data, index)
      x = scaleCategory(cd)
      y = grid.top
      width = bandWidth
      height = ch - grid.bottom - grid.top
    } else {
      cd = getData(yAxis.data, index)
      y = scaleCategory(cd)
      x = grid.left
      height = bandWidth
      width = cw - grid.right
    }

    shadowPointer
      .style('opacity', 1)
      .attrs({
        x,
        y,
        width,
        height,
        stroke: 'none',
        fill: color
      })
  }

}