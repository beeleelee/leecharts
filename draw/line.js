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
import {
  getData,
} from '../utils'
import drawGradient from './gradient'

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
      onClick: clickHandle,
      lineStyle: ls,
      plotStyle: plts,
    },
    sections: {
      defs,
      series,
      plotGroup,
    },
    scaleY,
    scaleX,
    gridLeft,
    gridRight,
    gridTop,
    gridBottom,
  } = chart
  let lineStyle = extend({}, defaultOptions.lineStyle, (ls || {}), (s.lineStyle || {}))
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
  if (rData.length === 0) {
    layer.html('')
    plotGroup.safeSelect(`g.lc-plot-group-${index}`).html('')
    return
  }
  let sData = rData = rData.map(item => item && item.value ? item.value : item)

  sData = sData.map(d => {
    return Math.max(0.01, d)
  })
  let stacked = false, prevData
  if (s.stackData) {
    stacked = true
    sData = s.stackData
  }

  let areaStyle = extend({}, defaultOptions.areaStyle, s.areaStyle || {})
  if (areaStyle.show) {
    let area = d3.area()
      .x((d, i) => position(d, i, true))
      .y((d, i) => position(d, i, false))
      .defined((d) => !!d)
    lineStyle.curve && area.curve(d3.curveCardinal)

    if (orient === 'h') {
      area.y1((d, i) => {
        if (stacked) {

          return scaleValue(d[0])
        } else {
          return ch - gridBottom
        }
      })
    } else {
      area.x1((d, i) => {
        if (stacked) {
          return scaleValue(d[0])
        } else {
          return gridLeft
        }
      })
    }
    let areaColor = areaStyle.color || null
    areaColor = drawGradient(chart, areaColor, defaultOptions.getAreaColor(index))

    let areaEle = layer.safeSelect('path.lc-area')
      //.attr('d', area(sData))
      .attrs({ stroke: 'none', fill: areaColor })
    prevData = decodeJSON(areaEle.attr('prevData'))
    if (!prevData) {
      areaEle.attr('d', area(sData))
        .attr('prevData', encodeJSON(sData))
    } else {
      areaEle.transition()
        .duration(defaultOptions.changeAniDuraiton)
        .ease(defaultOptions.enterAniEase)
        .attrTween('d', function () {

          return t => {
            let interData = sData.map((p, i) => {
              let start0, end0, pd, inter0, inter1, start1, end1
              pd = prevData[i] || p
              if (isArray(p)) {
                start0 = isArray(pd) ? pd[0] : pd
                end0 = p[0]
                inter0 = start0 + (end0 - start0) * t
                start1 = isArray(pd) ? pd[1] : pd
                end1 = p[1]
                inter1 = start1 + (end1 - start1) * t

                return [inter0, inter1]
              } else {
                start1 = isArray(pd) ? pd[1] : pd
                end1 = p
                inter1 = start1 + (end1 - start1) * t

                return inter1
              }

            })

            return area(interData)
          }
        })
        .on('end', function () {
          d3.select(this).attr('prevData', encodeJSON(sData))
        })
    }

  }

  if (lineStyle.show) {
    let line = d3.line()
      .x((d, i) => position(d, i, true))
      .y((d, i) => position(d, i, false))
      .defined((d) => !!d)
    lineStyle.curve && line.curve(d3.curveCardinal)

    let lineEle = layer.safeSelect('path.lc-line')
      .attrs({ stroke: color, fill: 'none', 'stroke-width': lineStyle.width })

    prevData = decodeJSON(lineEle.attr('prevData'))
    if (!prevData) {
      lineEle.attr('d', line(sData))
        .attr('prevData', encodeJSON(sData))
    } else {
      lineEle.transition()
        .duration(defaultOptions.changeAniDuraiton)
        .ease(defaultOptions.enterAniEase)
        .attrTween('d', function () {

          return t => {
            let interData = sData.map((p, i) => {
              let start, end, pd, inter
              end = stacked ? p[1] : p
              pd = prevData[i] || p
              start = isArray(pd) ? pd[1] : pd
              inter = start + (end - start) * t

              return isArray(p) ? [p[0], inter] : inter
            })

            return line(interData)
          }
        })
        .on('end', function () {
          d3.select(this).attr('prevData', encodeJSON(sData))
        })
    }
  }

  let plotSetting = extend({}, defaultOptions.plot, (plts || {}), (s.plotStyle || {}))
  let currentPlotGroup
  if (plotSetting.show) {
    currentPlotGroup = plotGroup.safeSelect(`g.lc-plot-group-${index}`)
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
      //.attr('transform', (d, i) => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
      .each(function (d, i) {
        let wrap = d3.select(this)

        let bgCircle = wrap.safeSelect('circle.lc-bgcircle')
          .attrs({ r: r * 3, stroke: 'none', fill: color, opacity: 0 })


        let node = wrap.safeSelect('circle.lc-node')
        node.attrs({ r: d => d ? r : 0, fill: '#ffffff', stroke: color, 'stroke-width': plotSetting.lineWidth })
          .on('mouseover', () => {
            bgCircle
              .attr('opacity', defaultOptions.bgCircleOpacity)
          })
          .on('mouseout', () => {
            bgCircle
              .attr('opacity', 0)
          })
          .on('click', () => {
            emitter.emit('clickItem', {
              value: stacked ? rData[i] : d,
              seriesIndex: index,
              dataIndex: i,
              seriesData: s
            })
          })
        if (!chart.firstRender) {
          wrap.transition()
            .duration(defaultOptions.changeAniDuraiton)
            .ease(defaultOptions.enterAniEase)
            .attr('transform', () => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
        } else {
          wrap.attr('transform', () => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
        }
        wrap.on('click', function () {
          if (isFunction(clickHandle)) {
            clickHandle({
              type: 'itemClicked',
              data: rData[i],
              value: getData(rData, i),
              dataIndex: i,
              seriesIndex: index,
              series: s,
              seriesData: s.data
            })
          }
        })
      })

    emitter.on('axisChange', (i) => {
      let n = currentPlotGroup.selectAll(`.lc-active-node`)
      !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', r)
      if (i !== null) {
        currentPlotGroup.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
          .classed('lc-active-node', true)
          .transition().duration(defaultOptions.focusAniDuration)
          .attr('r', r * 1.5)
      }
    })
  }
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
        td = stacked ? d[1] : d
        bw = 0
      }
    } else {
      if (orient === 'v') {
        scale = scaleCategory
        td = yAxis.data[i]
        bw = bandWidth
      } else {
        scale = scaleValue
        td = stacked ? d[1] : d
        bw = 0
      }
    }
    return scale(td) + bw / 2
  }
}