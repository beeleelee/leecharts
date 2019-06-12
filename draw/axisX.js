import {
  isFunction,
  extend,
  addComma,
} from 'mytoolkit'

export default function axisX(chart) {
  let {
    d3,
    defaultOptions,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      grid,
      series,
      xAxis
    },
    sections: {
      axisX
    },
    maxValue,
    maxValueFixed,
  } = chart
  let showAxis = true
  if (!xAxis.show) showAxis = false
  if (series.length === 0) showAxis = false
  // draw axis only when series contains line or bar
  if (series.filter(s => s.type === 'line' || s.type === 'bar').length === 0) showAxis = false

  if (!showAxis) {
    axisX.html('')
    return
  }
  let scaleX, domainData, max, tickNumber, tickIncrement, tickValues, category

  if (xAxis.type !== 'value') {
    domainData = xAxis.data.map(item => item && item.value ? item.value : item)
    scaleX = d3.scaleBand().domain(domainData).range([grid.left, cw - grid.right])
    tickValues = domainData
    category = true
  } else {
    max = maxValue
    tickNumber = xAxis.tickNumber || defaultOptions.tickNumber
    if (!maxValueFixed) {
      tickIncrement = d3.tickIncrement(0, max, tickNumber)
      max = Math.ceil(max / tickIncrement) * tickIncrement
    }
    scaleX = d3.scaleLinear()
      .domain([0, max])
      .range([grid.left, cw - grid.right])

    tickValues = d3.ticks(0, max, tickNumber)
    category = false
  }

  chart.xAxisTickValues = tickValues
  chart.scaleX = scaleX
  axisX.attr('transform', `translate(0, ${ch - grid.bottom})`)

  let lineColor = xAxis.lineColor || defaultOptions.axisLineColor, tickSize = xAxis.tickSize || defaultOptions.axisTickSize

  // axis bar 
  axisX.safeSelect('line.domain')
    .attrs({
      fill: 'none',
      stroke: lineColor,
      x1: scaleX.range()[0],
      x2: scaleX.range()[1],
    })

  // axis ticks 
  axisX.selectAll('line.lc-axis-tick')
    .data(tickValues)
    .join('line.lc-axis-tick')
    .attrs({
      fill: 'none',
      stroke: lineColor,
      y2: xAxis.tickInside ? -tickSize : tickSize,
      x1: d => scaleX(d),
      x2: d => scaleX(d)
    })
  let axisLabelSetting = extend({}, defaultOptions.axisLabel, xAxis.axisLabel || {})
  // axis label
  let labelPadding = axisLabelSetting.padding + (xAxis.tickInside ? 0 : tickSize)

  let labelgroup = axisX.selectAll('g.lc-axis-lable-g')
    .data(tickValues)
    .join('g.lc-axis-label-g')
    .attr('transform', d => `translate(${scaleX(d) + (category ? scaleX.bandwidth() * 0.5 : 0)}, ${labelPadding + axisLabelSetting.fontSize * 0.5})`)
  labelgroup.each(function (d, i) {
    d3.select(this)
      .safeSelect('text')
      .text(d => {
        if (isFunction(axisLabelSetting.formatter)) {
          return axisLabelSetting.formatter(d)
        }
        return addComma(d)
      })
      .attrs({
        'text-anchor': 'middle',
        stroke: 'none',
        fill: axisLabelSetting.color,
        transform: `rotate(${axisLabelSetting.rotate})`
      })
      .styles({
        'font-size': axisLabelSetting.fontSize
      })
  })

  // split lines 
  let sls = xAxis.splitLine
  if (!sls.show) return


  let splitLines = axisX.safeSelect('g.lc-split-lines')
  splitLines.selectAll('line')
    .data(tickValues.filter(v => v !== 0))
    .join('line')
    .attrs({
      fill: 'none',
      stroke: sls.color,
      'stroke-dasharray': sls.type === 'dashed' ? defaultOptions.strokeDasharray : 'none',
      x1: d => scaleX(d),
      y2: -(ch - grid.bottom - grid.top),
      x2: d => scaleX(d)
    })
}