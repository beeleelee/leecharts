import {
  isSet,
  extend,
  randStr,
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
      defs,
      series,
      plotGroup,
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
  let sData = s.data || []
  sData.map(item => item && item.value ? item.value : item)

  let stacked = false
  if (s.stackData) {
    stacked = true
    sData = s.stackData
  }


  if (s.areaStyle) {
    let area = d3.area()
      .x((d, i) => position(d, i, true))
      .y((d, i) => position(d, i, false))
      .curve(d3.curveCardinal)
      .defined((d) => !!d)
    if (orient === 'h') {
      area.y1((d, i) => {
        if (stacked) {

          return scaleValue(d[0])
        } else {
          return ch - grid.bottom
        }
      })
    } else {
      area.x1((d, i) => {
        if (stacked) {
          return scaleValue(d[0])
        } else {
          return grid.left
        }
      })
    }
    let areaColor = s.areaStyle && s.areaStyle.color || defaultOptions.getAreaColor(index)
    layer.safeSelect('path.lc-area')
      .attr('d', area(sData))
      .attrs({ stroke: 'none', fill: areaColor })
  }

  let line = d3.line()
    .x((d, i) => position(d, i, true))
    .y((d, i) => position(d, i, false))
    .curve(d3.curveCardinal)
    .defined((d) => !!d)

  layer.safeSelect('path.lc-line')
    .attr('d', line(sData))
    .attrs({ stroke: color, fill: 'none' })

  let plotStyle = extend({}, defaultOptions.plot, s.plotStyle || {})
  let currentPlotGroup
  if (plotStyle.show) {
    currentPlotGroup = plotGroup.safeSelect(`g.lc-plot-group-${index}`)
    let plotSetting = extend({}, defaultOptions.plot, s.plot || {})
    let r = plotSetting.size / 2

    currentPlotGroup.selectAll('circle.lc-node')
      .data(sData)
      .join('circle.lc-node')
      .attrs({
        cx: (d, i) => position(d, i, true),
        cy: (d, i) => position(d, i, false),
        r: d => d ? r : 0,
        fill: '#ffffff',
        stroke: color
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