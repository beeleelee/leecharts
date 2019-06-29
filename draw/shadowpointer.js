import {
  isSet,
} from 'mytoolkit'
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
      axisPointer
    },
    sections: {
      shadowPointer,
    },
    gridLeft,
    gridRight,
    gridTop,
    gridBottom,
  } = chart

  if (isSet(axisPointer.show) && !axisPointer.show || axisPointer.type !== 'shadow') {
    shadowPointer
      .style('opacity', 0)
    return
  }

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
      y = gridTop
      width = bandWidth
      height = ch - gridBottom - gridTop
    } else {
      cd = getData(yAxis.data, index)
      y = scaleCategory(cd)
      x = gridLeft
      height = bandWidth
      width = cw - gridRight - gridLeft
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