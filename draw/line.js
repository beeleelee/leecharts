import {
  isSet,
} from 'mytoolkit'

export default function drawLine(chart, layer, s, index) {
  let {
    emitter,
    defaultOptions,
    d3,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      grid,
      xAxis,
    },
    sections: {
      series,
    },
    scaleY,
    scaleX,
  } = chart
  let color = s.color || defaultOptions.seriesColor[index] || '#00ff00'

  let bandWidth = scaleX.bandwidth()

  let line = d3.line()
    .x((d, i) => {

      return scaleX(xAxis.data[i]) + bandWidth / 2
    })
    .y((d, i) => {

      return scaleY(d)
    })
    .defined((d) => !!d)
  let pd = line(s.data)

  layer.safeSelect('path.lc-line')
    .attr('d', pd)
    .attrs({ stroke: color, fill: 'none' })

  let gnode = layer.selectAll('circle.lc-node')
    .data(s.data)
    .join('circle.lc-node')
    .attrs({
      cx: (d, i) => scaleX(xAxis.data[i]) + bandWidth / 2,
      cy: d => scaleY(d),
      r: d => d ? 5 : 0,
      fill: '#ffffff',
      stroke: color
    })
  emitter.on('axisChange', (i) => {
    let n = layer.selectAll(`.lc-active-node`)
    !n.empty() && n.classed('lc-active-node', false).transition().duration(300).attr('r', 5)
    if (i !== null) {
      layer.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
        .classed('lc-active-node', true)
        .transition().duration(300)
        .attr('r', 10)
    }
  })

}