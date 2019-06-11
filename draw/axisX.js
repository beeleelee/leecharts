export default function axisX(chart) {
  let {
    d3,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      grid,
      xAxis
    },
    sections: {
      axisX
    },
  } = chart

  let scaleX = d3.scaleBand()
    .domain(xAxis.data)
    .range([grid.left, cw - grid.right])
  //console.log(scaleX.bandwidth(), (cw - grid.right - grid.left) / 6)
  chart.scaleX = scaleX
  axisX.attr('transform', `translate(0, ${ch - grid.bottom})`)
    .call(d3.axisBottom(scaleX).tickSizeOuter(0))
}