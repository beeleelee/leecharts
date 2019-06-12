import {
  isSet,
  extend,
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
      yAxis,
    },
    sections: {
      series,
    },
    scaleY,
    scaleX,
  } = chart
  let color = s.color || defaultOptions.getColor(index)

  let scaleCategory, scaleValue, orient

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

  let line = d3.line()
    .x((d, i) => position(d, i, true))
    .y((d, i) => position(d, i, false))
    .defined((d) => !!d)
  let sData = s.data || []
  sData.map(item => item && item.value ? item.value : item)

  let pd = line(sData)

  layer.safeSelect('path.lc-line')
    .attr('d', pd)
    .attrs({ stroke: color, fill: 'none' })

  let plotSetting = extend({}, defaultOptions.plot, s.plot || {})
  let r = plotSetting.size / 2

  layer.selectAll('circle.lc-node')
    .data(s.data)
    .join('circle.lc-node')
    .attrs({
      //cx: (d, i) => scaleCategory(xAxis.data[i]) + bandWidth / 2,
      //cy: d => scaleValue(d),
      cx: (d, i) => position(d, i, true),
      cy: (d, i) => position(d, i, false),
      r: d => d ? r : 0,
      fill: '#ffffff',
      stroke: color
    })
  emitter.on('axisChange', (i) => {
    let n = layer.selectAll(`.lc-active-node`)
    !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', r)
    if (i !== null) {
      layer.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
        .classed('lc-active-node', true)
        .transition().duration(defaultOptions.focusAniDuration)
        .attr('r', r * 1.5)
    }
  })
  function position(d, i, isX) {
    let td, scale, bw

    if (isX) {
      if (orient === 'h') {
        scale = scaleCategory
        td = xAxis.data[i]
        bw = bandWidth
      } else {
        scale = scaleValue
        td = d
        bw = 0
      }
    } else {
      if (orient === 'v') {
        scale = scaleCategory
        td = yAxis.data[i]
        bw = bandWidth
      } else {
        scale = scaleValue
        td = d
        bw = 0
      }
    }
    return scale(td) + bw / 2
  }
}