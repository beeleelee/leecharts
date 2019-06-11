
export default function axisY(chart) {
  let {
    d3,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      grid,
      series,
    },
    sections: {
      axisY
    },
  } = chart
  if (series.length === 0) return
  // draw axis only when series contains line or bar
  if (series.filter(s => s.type === 'line' || s.type === 'bar').length === 0) return

  let scaleY = d3.scaleLinear()
    .domain([0, 200000])
    .range([ch - grid.bottom, grid.top])
  chart.scaleY = scaleY
  axisY.attr('transform', `translate(${grid.left}, 0)`)
    .call(d3.axisLeft(scaleY).ticks(5).tickSizeOuter(0).tickSizeInner(4).tickPadding(5).tickFormat(d => {
      return d
    }))
}