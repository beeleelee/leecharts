import {
  isSet,
  isUnset,
  extend,
  randStr,
} from 'mytoolkit'
import drawGradient from './gradient'

export default function drawBar(chart, layer, s, index) {
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
      defs,
      series,
      plotGroup,
    },
    scaleY,
    scaleX,
  } = chart

  let scaleCategory, scaleValue, orient, barWidth, barOffset
  barWidth = s._barWidth
  barOffset = s._barOffset

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
  let rData = s.data || []
  let sData = rData = rData.map(item => item && item.value ? item.value : item)

  let stacked = false
  if (s.stackData) {
    stacked = true
    sData = s.stackData
  }

  let barStyle = extend({}, defaultOptions.barStyle, s.barStyle || {})
  let barColor = drawGradient(chart, (barStyle.color || null), defaultOptions.getColor(index))

  let bars = layer.selectAll('rect.lc-bar')
    .data(sData)
    .join('rect.lc-bar')
    .attrs({
      x: (d, i) => {
        if (orient === 'v') {
          return grid.left
        }
        return position(d, i, true) + barOffset
      },
      y: (d, i) => {
        if (orient === 'h') {
          return ch - grid.bottom
        }
        return position(d, i, false) + barOffset
      },
      width: function (d, i) {
        if (orient === 'h') {
          return barWidth
        }

        return 0
      },
      height: function (d, i) {
        if (orient === 'v') {
          return barWidth
        }

        return 0
      },
      stroke: 'none',
      fill: barColor
    })

  if (orient === 'h') {
    bars.transition()
      .duration(defaultOptions.enterAniDuration)
      .ease(defaultOptions.enterAniEase)
      .attr('height', function (d, i) {
        let y = position(d, i, false)
        return ch - grid.bottom - y
      })
      .attrTween('y', function (d, i) {
        let end = position(d, i, false)
        let start = ch - grid.bottom

        return d3.interpolate(start, end)
      })
  } else {
    bars.transition()
      .duration(defaultOptions.enterAniDuration)
      .ease(defaultOptions.enterAniEase)
      .attr('width', function (d, i) {
        let x = position(d, i, true)
        return x - grid.left
      })
  }


  // let plotStyle = extend({}, defaultOptions.plot, s.plotStyle || {})
  // let currentPlotGroup
  // if (plotStyle.show) {
  //   currentPlotGroup = plotGroup.safeSelect(`g.lc-plot-group-${index}`)
  //   let plotSetting = extend({}, defaultOptions.plot, s.plot || {})
  //   let r = plotSetting.size / 2

  //   currentPlotGroup.on('click', () => {
  //     if (isSet(s.highlightAnimation) && !s.highlightAnimation) return

  //     chart.highlightIndex = chart.highlightIndex === index ? null : index
  //     emitter.emit('highlightChange', chart.highlightIndex)
  //   })
  //   currentPlotGroup.selectAll('g.lc-node-wrap')
  //     .data(sData)
  //     .join('g.lc-node-wrap')
  //     .attr('transform', (d, i) => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
  //     .each(function (d, i) {
  //       let wrap = d3.select(this)

  //       let bgCircle = wrap.safeSelect('circle.lc-bgcircle')
  //         .attrs({ r: r * 3, stroke: 'none', fill: color, opacity: 0 })


  //       let node = wrap.safeSelect('circle.lc-node')
  //       node.attrs({ r: d => d ? r : 0, fill: '#ffffff', stroke: color })
  //         .on('mouseover', () => {
  //           bgCircle
  //             .attr('opacity', defaultOptions.bgCircleOpacity)
  //         })
  //         .on('mouseout', () => {
  //           bgCircle
  //             .attr('opacity', 0)
  //         })
  //         .on('click', () => {
  //           emitter.emit('clickItem', {
  //             value: stacked ? rData[i] : d,
  //             seriesIndex: index,
  //             dataIndex: i,
  //             seriesData: s
  //           })
  //         })
  //     })
  //   emitter.on('axisChange', (i) => {
  //     let n = currentPlotGroup.selectAll(`.lc-active-node`)
  //     !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', r)
  //     if (i !== null) {
  //       currentPlotGroup.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
  //         .classed('lc-active-node', true)
  //         .transition().duration(defaultOptions.focusAniDuration)
  //         .attr('r', r * 1.5)
  //     }
  //   })
  // }


  // layer.on('click', () => {
  //   if (isSet(s.highlightAnimation) && !s.highlightAnimation) return

  //   chart.highlightIndex = chart.highlightIndex === index ? null : index
  //   emitter.emit('highlightChange', chart.highlightIndex)
  // })

  // if (isUnset(s.highlightAnimation) || s.highlightAnimation) {
  //   emitter.on('highlightChange', (ci) => {
  //     if (ci === null || ci === index) {
  //       layer.transition()
  //         .duration(defaultOptions.focusAniDuration)
  //         .style('opacity', 1)

  //       if (currentPlotGroup) {
  //         currentPlotGroup.transition()
  //           .duration(defaultOptions.focusAniDuration)
  //           .style('opacity', 1)
  //       }
  //     } else {
  //       layer.transition()
  //         .duration(defaultOptions.focusAniDuration)
  //         .style('opacity', defaultOptions.highlightOtherOpacity)
  //       if (currentPlotGroup) {
  //         currentPlotGroup.transition()
  //           .duration(defaultOptions.focusAniDuration)
  //           .style('opacity', defaultOptions.highlightOtherOpacity)
  //       }
  //     }
  //   })
  // }

  function position(d, i, isX) {
    let td, scale, bw

    if (isX) {
      if (orient === 'h') {
        scale = scaleCategory
        td = xAxis.data[i]
      } else {
        scale = scaleValue
        td = stacked ? d[1] : d
      }
    } else {
      if (orient === 'v') {
        scale = scaleCategory
        td = yAxis.data[i]
      } else {
        scale = scaleValue
        td = stacked ? d[1] : d
      }
    }
    return scale(td)
  }
}