export default function drawLegend(chart) {
  let {
    d3,
    defaultOptions,
    containerWidth: cw,
    contianerHeight: ch,
    options: {
      legend,
      series,
    },
    sections: {
      legend: legendLayer
    }
  } = chart
  let legendData = legend.data || []
  if (!legendData.length) {
    legendData = series.map((s, i) => s.name || `series ${1}`)
  }
  if (!legendData.length) {
    return
  }
  // prepare legend  
  legendData = legendData.map((l, i) => {

  })

}