import {
  getData
} from '../utils'
import {
  isFunction,
} from 'mytoolkit'

export default function drawTooltip(chart, opts) {
  let {
    d3,
    defaultOptions,
    containerHeight: ch,
    containerWidth: cw,
    options: {
      series,
      tooltip: tooltipOpts
    },
    sections: {
      tooltip,
    }
  } = chart
  if (!tooltipOpts || tooltipOpts.show === false) return
  if (!isFunction(tooltipOpts.formatter)) return // only support function type formatter 

  let formatter = tooltipOpts.formatter
  let e = opts.event || {}
  let hide = false
  let tooltipStyles = tooltipOpts.styles || {}

  tooltip.styles({ ...tooltipStyles })

  if (opts.type === 'axisPointer') {
    if (opts.activeIndex === null) {
      tooltip.styles({
        opacity: 0,
        display: 'none'
      })
      hide = true
    } else {
      let data = series.filter(s => s.type === 'bar' || s.type === 'line').map(s => {
        return {
          name: s.name,
          data: s.data[opts.activeIndex],
          value: getData(s.data, opts.activeIndex),
          dataIndex: opts.activeIndex
        }
      })
      tooltip.styles({
        display: 'block',

      }).html(formatter(data))

    }
  } else if (opts.type === 'item') {
    if (opts.data === null) {
      tooltip.styles({
        opacity: 0,
        display: 'none'
      })
      hide = true
    } else {
      tooltip.styles({
        display: 'block',

      }).html(formatter(opts.data))
    }
  }
  if (hide) return

  // dealing with tooltip position
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