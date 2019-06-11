import {
  isSet,
} from 'mytoolkit'
import {
  parsePercent
} from '../utils'

export default function drawPie(chart, layer, s, index) {
  let {
    emitter,
    defaultOptions,
    d3,
    containerWidth: cw,
    containerHeight: ch,
    containerCenter: cc,
  } = chart
  let data = s.data
  if (!data || !data.length) return

  let pieCenter = s.center || [0.5, 0.5]
  pieCenter = [cw * parsePercent(pieCenter[0]), ch * parsePercent(pieCenter[1])]
  let radius = s.radius || [0, 0.7]
  let innerRadius = Math.min(cw, ch) * parsePercent(radius[0]) * 0.5
  let outerRadius = Math.min(cw, ch) * parsePercent(radius[1]) * 0.5
  let arcs = d3.pie()(data.map(item => item.value))
  let d3arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
  console.log(innerRadius, outerRadius, arcs)
  layer.attr('transform', `translate(${pieCenter[0]}, ${pieCenter[1]})`)
  layer.selectAll('path.lc-arc')
    .data(arcs)
    .join('path.lc-arc')
    .attr('d', d3arc)
    .attr('fill', (d, i) => {

    })
}