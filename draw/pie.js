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

  let pieCenter = s.center || []
  pieCenter = [cw * parsePercent(pieCenter[0]), ch * parsePercent(pieCenter[1])]
  console.log(pieCenter)
}