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
        display: 'none'
      })
      hide = true
    } else {
      tooltip.styles({
        display: 'block',

      })

    }
  }
  if (hide) return

  let threshold = 10, x = e.pageX, y = e.pageY, padding = 15
  let {
    width: ttWidth,
    height: ttHeight,
  } = tooltip.node().getBoundingClientRect()
  let remainWidth, remainHeight
  remainWidth = cw - e.offsetX
  remainHeight = ch - e.offsetY
  if (remainWidth + threshold < ttWidth) {
    x -= (ttWidth + padding)
  } else {
    x += padding
  }
  if (remainHeight + threshold < ttHeight) {
    y -= (ttHeight + padding)
  } else {
    y += padding
  }
  tooltip
    .transition()
    .duration(defaultOptions.focusAniDuration)
    .ease(defaultOptions.enterAniEase)
    .style('opacity', 1)
    .style('top', y + 'px')
    .style('left', x + 'px')
}