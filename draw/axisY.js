import {
  isFunction,
  extend,
  addComma,
} from 'mytoolkit'

export default function axisY(chart) {
  let {
    d3,
    defaultOptions,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      grid,
      series,
      yAxis
    },
    sections: {
      axisY
    },
    maxValue,
    maxValueFixed,
  } = chart
  let showAxis = true
  if (!yAxis.show) showAxis = false
  if (series.length === 0) showAxis = false
  // draw axis only when series contains line or bar
  if (series.filter(s => s.type === 'line' || s.type === 'bar').length === 0) showAxis = false

  if (!showAxis) {
    axisY.html('')
    return
  }
  let scaleY, domainData, max, tickNumber, tickIncrement, tickValues

  if (yAxis.type === 'category' && yAxis.data && yAxis.data.length) {
    domainData = yAxis.data.map(item => item && item.value ? item.value : item)
    scaleY = d3.scaleBand().domain(domainData).range([ch - grid.bottom, grid.top])
  } else {
    max = maxValue
    tickNumber = yAxis.tickNumber || defaultOptions.tickNumber
    if (!maxValueFixed) {
      tickIncrement = d3.tickIncrement(0, max, tickNumber)
      max = Math.ceil(max / tickIncrement) * tickIncrement
    }
    scaleY = d3.scaleLinear()
      .domain([0, max])
      .range([ch - grid.bottom, grid.top])

    tickValues = d3.ticks(0, max, tickNumber)
    console.log(tickValues)
    chart.yAxisTickValues = tickValues
  }

  chart.scaleY = scaleY
  axisY.attr('transform', `translate(${grid.left}, 0)`)

  let lineColor = yAxis.lineColor || defaultOptions.axisLineColor, tickSize = yAxis.tickSize || defaultOptions.axisTickSize

  // axis bar 
  axisY.safeSelect('line.domain')
    .attrs({
      fill: 'none',
      stroke: lineColor,
      y1: scaleY.range()[1],
      y2: scaleY.range()[0],
    })
  // axis ticks 
  let ticks = axisY.selectAll('line.lc-axis-tick')
    .data(tickValues)
    .join('line.lc-axis-tick')
    .attrs({
      fill: 'none',
      stroke: lineColor,
      x1: yAxis.tickInside ? tickSize : -tickSize,
      y1: d => scaleY(d),
      y2: d => scaleY(d)
    })
  let axisLabelSetting = extend({}, defaultOptions.axisLabel, yAxis.axisLabel || {})
  // axis label
  let labelPadding = axisLabelSetting.padding + (yAxis.tickInside ? 0 : tickSize)
  axisY.selectAll('text.lc-axis-label')
    .data(tickValues)
    .join('text.lc-axis-label')
    .text(d => {
      if (isFunction(axisLabelSetting.formatter)) {
        return axisLabelSetting.formatter(d)
      }
      return addComma(d)
    })
    .attrs({
      'text-anchor': 'end',
      x: -labelPadding,
      y: d => scaleY(d) + axisLabelSetting.fontSize / 3,
      stroke: 'none',
      fill: axisLabelSetting.color,
      transform: `rotate(${axisLabelSetting.rotate})`
    })
    .styles({
      'font-size': axisLabelSetting.fontSize
    })
}