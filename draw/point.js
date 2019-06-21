import {
  isSet,
  isUnset,
  isArray,
  extend,
  randStr,
  encodeJSON,
  decodeJSON,
  isFunction,
} from 'mytoolkit'

export default function drawPoint(chart, layer, s, index) {
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
  let lineStyle = extend({}, defaultOptions.lineStyle, (s.lineStyle || {}))
  let color = lineStyle.color || defaultOptions.getColor(index)

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
  let rData = s.data || []
  let sData = rData = rData.map(item => item && item.value ? item.value : item)

  let customShape = s.customShape
  let currentPlotGroup

  currentPlotGroup = plotGroup.safeSelect(`g.lc-plot-group-${index}`)
  let plotSetting = extend({}, defaultOptions.plot, s.plot || {})
  let r = plotSetting.size / 2

  currentPlotGroup.on('click', () => {
    if (isSet(s.highlightAnimation) && !s.highlightAnimation) return

    chart.highlightIndex = chart.highlightIndex === index ? null : index
    emitter.emit('highlightChange', chart.highlightIndex)
  })
  let plots = currentPlotGroup.selectAll('g.lc-node-wrap')
    .data(sData)
    .join('g.lc-node-wrap')
  plots
    .each(function (d, i) {
      let wrap = d3.select(this)
      let node
      if (isFunction(customShape)) {
        let htmlString = customShape({ bandWidth })
        wrap.html(htmlString)
      } else {
        wrap.html('<circle r="5" />')
      }
      // node = wrap.safeSelect('circle.lc-node')


      // node.attrs({ r: d => d ? r : 0, fill: '#ffffff', stroke: color })
      //   .on('click', () => {
      //     // emitter.emit('clickItem', {
      //     //   value: d,
      //     //   seriesIndex: index,
      //     //   dataIndex: i,
      //     //   seriesData: s
      //     // })
      //   })
      if (!chart.firstRender) {
        wrap.transition()
          .duration(defaultOptions.changeAniDuraiton)
          .ease(defaultOptions.enterAniEase)
          .attr('transform', () => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
      } else {
        wrap.attr('transform', () => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
      }
    })

  // emitter.on('axisChange', (i) => {
  //   let n = currentPlotGroup.selectAll(`.lc-active-node`)
  //   !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', r)
  //   if (i !== null) {
  //     currentPlotGroup.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
  //       .classed('lc-active-node', true)
  //       .transition().duration(defaultOptions.focusAniDuration)
  //       .attr('r', r * 1.5)
  //   }
  // })

  // ini clip path animation 
  let clipPath, clipPathId, clipRect
  if (chart.firstRender) {
    clipPathId = 'lc-' + randStr(8)
    clipPath = defs.safeSelect(`clipPath#${clipPathId}`)
    clipRect = clipPath.safeSelect('rect')
    layer.attr('clip-path', `url(#${clipPathId})`)
    if (currentPlotGroup) {
      currentPlotGroup.attr('clip-path', `url(#${clipPathId})`)
    }
    if (orient === 'h') {
      clipRect.attrs({
        x: 0,
        y: 0,
        height: ch,
        width: 0
      })
        .transition()
        .duration(defaultOptions.enterAniDuration)
        .ease(defaultOptions.enterAniEase)
        .attr('width', cw)
        .on('end', () => {
          layer.attr('clip-path', null)
          currentPlotGroup && currentPlotGroup.attr('clip-path', null)
          clipPath.remove()
        })
    } else {
      clipRect.attrs({
        x: 0,
        y: ch,
        height: 0,
        width: cw
      })
        .transition()
        .duration(defaultOptions.enterAniDuration)
        .ease(defaultOptions.enterAniEase)
        .attr('height', ch)
        .attr('y', 0)
        .on('end', () => {
          layer.attr('clip-path', null)
          currentPlotGroup && currentPlotGroup.attr('clip-path', null)
          clipPath.remove()
        })
    }
  }

  layer.on('click', () => {
    if (isSet(s.highlightAnimation) && !s.highlightAnimation) return

    chart.highlightIndex = chart.highlightIndex === index ? null : index
    emitter.emit('highlightChange', chart.highlightIndex)
  })

  if (isUnset(s.highlightAnimation) || s.highlightAnimation) {
    emitter.on('highlightChange', (ci) => {
      if (ci === null || ci === index) {
        layer.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', 1)

        if (currentPlotGroup) {
          currentPlotGroup.transition()
            .duration(defaultOptions.focusAniDuration)
            .style('opacity', 1)
        }
      } else {
        layer.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', defaultOptions.highlightOtherOpacity)
        if (currentPlotGroup) {
          currentPlotGroup.transition()
            .duration(defaultOptions.focusAniDuration)
            .style('opacity', defaultOptions.highlightOtherOpacity)
        }
      }
    })
  }

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