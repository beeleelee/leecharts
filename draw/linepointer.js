import {
  getData
} from '../utils'

export default function drawLinePointer(chart, index) {
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
      axisPointer,
    },
    sections: {
      linePointer,
    }
  } = chart

  if (axisPointer.type !== 'line') return

  let scaleCategory, scaleValue, orient

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
    linePointer
      .style('opacity', 0)
  } else {
    let x1, y1, x2, y2, cd

    if (orient === 'h') {
      cd = getData(xAxis.data, index)
      x2 = x1 = scaleCategory(cd) + bandWidth * 0.5
      y1 = grid.top
      y2 = ch - grid.bottom
    } else {
      cd = getData(yAxis.data, index)
      y1 = y2 = scaleCategory(cd) + bandWidth * 0.5
      x1 = grid.left
      x2 = cw - grid.right
    }

    linePointer
      .style('opacity', 1)
      .attrs({
        x1,
        y1,
        x2,
        y2,
        stroke: '#aaa',
        'stroke-dasharray': defaultOptions.strokeDasharray,
        opacity: 1
      })
  }

}