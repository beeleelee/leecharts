
export default function axisY(chart) {
  let {
    d3,
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
  let scaleY, domainData, matchSeries, matchData

  if (yAxis.type === 'category' && yAxis.data && yAxis.data.length) {
    domainData = yAxis.data.map(item => item.value ? item.value : item)
    scaleY = d3.scaleBand().domain(domainData).range([ch - grid.bottom, grid.top])
  } else {
    matchSeries = series.find(s => s.type === 'line' || s.type === 'bar')
    matchData = matchSeries.data || []
    matchData = matchData.map(item => item.value ? item.value : item)

  }
  scaleY = d3.scaleLinear()
    .domain([0, 9982])
    .range([ch - grid.bottom, grid.top])
  chart.scaleY = scaleY
  axisY.attr('transform', `translate(${grid.left}, 0)`)
    .call(d3.axisLeft(scaleY).ticks(9).tickSizeOuter(0).tickSizeInner(4).tickPadding(5).tickFormat(d => {
      return d
    }))
}