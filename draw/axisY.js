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
  let scaleY, domainData, max, tickNumber, tickIncrement, tickValues, category

  if (yAxis.type === 'category' && yAxis.data && yAxis.data.length) {
    domainData = yAxis.data.map(item => item && item.value ? item.value : item)
    scaleY = d3.scaleBand().domain(domainData).range([ch - grid.bottom, grid.top])
    tickValues = domainData
    category = true
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
    category = false
  }

  chart.yAxisTickValues = tickValues
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
  axisY.selectAll('line.lc-axis-tick')
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

  let labelgroup = axisY.selectAll('g.lc-axis-lable-g')
    .data(tickValues)
    .join('g.lc-axis-label-g')
    .attr('transform', d => `translate(${-labelPadding}, ${(category ? scaleY.bandwidth() * 0.5 : 0) + scaleY(d) + axisLabelSetting.fontSize / 3})`)
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
        'text-anchor': 'end',
        stroke: 'none',
        fill: axisLabelSetting.color,
        transform: `rotate(${axisLabelSetting.rotate})`
      })
      .styles({
        'font-size': axisLabelSetting.fontSize
      })
  })

  // split lines 
  let sls = yAxis.splitLine
  if (!sls.show) return


  let splitLines = axisY.safeSelect('g.lc-split-lines')
  splitLines.selectAll('line')
    .data(tickValues.filter(v => v !== 0))
    .join('line')
    .attrs({
      fill: 'none',
      stroke: sls.color,
      'stroke-dasharray': sls.type === 'dashed' ? defaultOptions.strokeDasharray : 'none',
      y1: d => scaleY(d),
      x2: cw - grid.right - grid.left,
      y2: d => scaleY(d)
    })
}