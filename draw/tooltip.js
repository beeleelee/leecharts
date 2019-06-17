import {
  getData
} from '../utils'

export default function drawTooltip(chart, opts) {
  let {
    d3,
    defaultOptions,
    scaleX,
    scaleY,
    containerHeight: ch,
    containerWidth: cw,
    options: {
      xAxis,
      yAxis,
      grid,
      axisPointer,
    },
    sections: {
      tooltip,
    }
  } = chart
  let e = opts.event || {}
  let hide = false
  if (opts.type === 'axisPointer') {
    if (opts.activeIndex === null) {
      tooltip.styles({
        opacity: 0,
        top: "-99999px",
        left: "-99999px"
      })
      hide = true
    } else {
      tooltip.styles({
        opacity: 1,
        top: `${opts.event.pageY + 20}px`,
        left: `${opts.event.pageX + 20}px`
      })
      console.log(cw, ch, e.offsetX, e.offsetY, e.pageX, e.pageY)
    }
  }
  if (hide) return

  let {
    width: ttWidth,
    height: ttHeight,
  } = tooltip.node().getBoundingClientRect()
  let remainWidth, remainHeight
  remainWidth = cw - e.offsetX
  remainHeight = ch - e.offsetY
  console.log(ttWidth, ttHeight, remainWidth, remainHeight)
}