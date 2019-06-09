export default function drawLinePointer(chart, index) {
  let {
    d3,
    scaleX,
    containerHeight: ch,
    options: {
      xAxis,
      grid,
    },
    sections: {
      linePointer,
    }
  } = chart
  if (index === null) {
    linePointer
      .style('opacity', 0)
  } else {
    let cat = xAxis.data
    let x = scaleX(cat[index]) + scaleX.bandwidth() / 2

    linePointer
      .style('opacity', 1)
      .attrs({
        x1: x,
        y1: grid.top,
        x2: x,
        y2: ch - grid.top,
        stroke: '#ddd',
        'stroke-dasharray': "4 4",
        opacity: 1
      })
  }

}