import {
  isSet,
} from 'mytoolkit'
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
      axisPointer,
    },
    sections: {
      linePointer,
    },
    gridLeft,
    gridRight,
    gridTop,
    gridBottom,
  } = chart

  if (isSet(axisPointer.show) && !axisPointer.show || axisPointer.type !== 'line') {
    linePointer.style('opacity', 0)
    return
  }

  let scaleCategory, scaleValue, orient, color

  color = axisPointer.color || '#aaa'
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
      y1 = gridTop
      y2 = ch - gridBottom
    } else {
      cd = getData(yAxis.data, index)
      y1 = y2 = scaleCategory(cd) + bandWidth * 0.5
      x1 = gridLeft
      x2 = cw - gridRight
    }

    linePointer
      .style('opacity', 1)
      .attrs({
        x1,
        y1,
        x2,
        y2,
        stroke: color,
        'stroke-dasharray': defaultOptions.strokeDasharray,
        opacity: 1
      })
  }

}