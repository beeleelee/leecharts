import {
  isSet,
  isUnset,
  isObject,
  isFunction,
  decodeJSON,
  encodeJSON,
  drawEquilateral,
  extend,
  deepCopy,
  deg2angle,
  toFixed,
} from 'mytoolkit'
import {
  parsePercent,
  deepExtend,
  getData,
} from '../utils'
import drawGradient from './gradient'

export default function drawRadar(chart, layer, s, index) {
  let {
    emitter,
    defaultOptions,
    d3,
    containerWidth: cw,
    containerHeight: ch,
    containerCenter: cc,
    options: {
      onClick: clickHandle
    },
  } = chart
  let indicator = s.indicator
  if (!indicator || !indicator.length) {
    layer.html('')
      .attr('transform', null)
    return
  }
  let data = s.data
  if (!data || !data.length) {
    layer.html('')
      .attr('transform', null)
    return
  }
  let maxValue = 0
  data.forEach(item => {
    let d = item.data || []
    for (let i = 0, l = d.length; i < l; i++) {
      maxValue = Math.max(maxValue, getData(d, i))
    }

  })
  maxValue = Math.round(maxValue * 1.2)
  maxValue = Math.ceil(maxValue / Math.pow(10, (String(maxValue).length - 1))) * Math.pow(10, (String(maxValue).length - 1))
  if (s.maxValue) {
    maxValue = Number(s.maxValue)
  }


  let focusAnimation = isSet(s.focusAnimation) ? s.focusAnimation : true

  let radarCenter = s.center || [0.5, 0.5]
  radarCenter = [cw * parsePercent(radarCenter[0]), ch * parsePercent(radarCenter[1])]
  let radius = s.radius || 0.7

  radius = Math.min(cw, ch) * parsePercent(radius) * 0.5
  let radarSettings = extend({}, deepExtend(deepCopy(defaultOptions.radar), (s.radar || {})))
  let startAngle = deg2angle(radarSettings.startAngle) + deg2angle(-90)
  let meanAngle = 2 * Math.PI / indicator.length
  let splitLength = radius / (radarSettings.splitNumber)

  let radarRoot = layer.safeSelect('g.lc-radar-root').attr('transform', `translate(${radarCenter[0]}, ${radarCenter[1]})`)
  let splitAreaColors = radarSettings.splitArea.colors || []
  splitAreaColors = splitAreaColors.slice(0, radarSettings.splitNumber + 1)
  let scaleRadius = d3.scaleLinear().domain([0, maxValue]).range([0, radius])


  // draw split area and lne
  radarRoot.selectAll('path.lc-radar-split-area')
    .data(d3.range(radarSettings.splitNumber + 1))
    .join('path.lc-radar-split-area')
    .attrs({
      stroke: radarSettings.splitArea.lineColor,
      fill: (d) => {
        let l = splitAreaColors.length
        if (l > 0) {
          return splitAreaColors[radarSettings.splitNumber - d - 1]
        } else {
          return 'none'
        }
      },
      d: (d) => {
        let r = splitLength * (radarSettings.splitNumber - d)

        return drawEquilateral({
          radius: r,
          startAngle,
          sidesNum: indicator.length
        })
      }
    })

  // draw axis 
  radarRoot.selectAll('g.lc-radar-axis')
    .data(d3.range(indicator.length))
    .join('g.lc-radar-axis')
    .each(function (d, i) {
      let g = d3.select(this)
      g.safeSelect('line')
        .attrs({
          stroke: radarSettings.axisLine.show ? radarSettings.axisLine.color : 'rgba(0,0,0,0)',
          fill: 'none',
          'stroke-dasharray': radarSettings.axisLine.type != 'dashed' ? [5, 2] : 'none',
          x2: d => radius * Math.cos(startAngle + d * meanAngle),
          y2: d => radius * Math.sin(startAngle + d * meanAngle)
        })
    })

  // draw indicator 
  radarRoot.selectAll('g.lc-radar-indicator')
    .data(d3.range(indicator.length))
    .join('g.lc-radar-indicator')
    .each(function (d) {
      let g = d3.select(this)
      let x, y, angle = startAngle + d * meanAngle, textAnchor = 'start'
      x = (radius + radarSettings.indicator.padding) * Math.cos(angle)
      y = (radius + radarSettings.indicator.padding) * Math.sin(angle)

      if (x < 0) {
        textAnchor = 'end'
      } else if (Math.round(x) == 0) {
        textAnchor = 'middle'
      }
      g.attr('transform', `translate(${x}, ${y})`)

      g.safeSelect('text')
        .text(indicator[d].text)
        .attrs({
          fill: radarSettings.indicator.color,
          'text-anchor': textAnchor,
          y: Math.round(x) == 0 && y > 0 ? radarSettings.indicator.padding : 0
        })
        .styles({
          'font-size': radarSettings.indicator.fontSize
        })
    })

  // draw axis label 
  let axisLabelGroup = radarRoot.safeSelect('g.lc-radar-axis-label-group')
  if (radarSettings.axisLabel.show) {
    axisLabelGroup.selectAll('text')
      .data(d3.range(radarSettings.splitNumber))
      .join('text')
      .text(d => {
        let v = scaleRadius.invert((d + 1) * splitLength)

        return toFixed(v, 0)
      })
      .attrs({
        y: d => -(d + 1) * splitLength - 5,
        fill: radarSettings.axisLabel.color,
        'text-anchor': 'middle',
      })
      .styles({
        'font-size': radarSettings.axisLabel.fontSize
      })
  } else {
    axisLabelGroup.remove()
  }

  let sectionGroups = radarRoot.selectAll('g.lc-radar-section')
    .data(data)
    .join('g.lc-radar-section')
    .each(function (sd, si) {
      let section = d3.select(this)
      let sdData = []
      sdData = indicator.map((_, i) => {
        return getData((sd.data || []), i)
      })
      let plotPoints = sdData.map((v, i) => {
        let r = scaleRadius(v)
        let angle = startAngle + i * meanAngle
        return [r * Math.cos(angle), r * Math.sin(angle)]
      })
      let color = sd.color || defaultOptions.getColor(si)
      let areaColor = 'none'
      if (sd.areaStyle && sd.areaStyle.show) {
        areaColor = drawGradient(chart, sd.areaStyle.color, defaultOptions.getAreaColor(si))
      }

      section.safeSelect('path')
        .attrs({
          stroke: color,
          fill: areaColor,
        })
        .transition()
        .duration(defaultOptions.changeAniDuraiton)
        .ease(defaultOptions.enterAniEase)
        .attrTween('d', function () {
          let prevData = decodeJSON(d3.select(this).attr('prevData'))
          return t => {
            let ps
            if (!prevData || prevData.length !== plotPoints.length) {
              ps = plotPoints.map(item => [item[0] * t, item[1] * t])
            } else {
              ps = plotPoints.map((item, k) => {
                let prevItem = prevData[k]
                let x = t * plotPoints[0] + (1 - t) * prevItem[0]
                let y = t * plotPoints[1] + (1 - t) * prevItem[1]
                return [x, y]
              })
            }

            return d3.line()(ps) + 'Z'
          }
        })
        .on('end', function () {
          d3.select(this).attr('prevData', encodeJSON(plotPoints))
        })

      let plots = section.selectAll('g.lc-radar-plot-group')
        .data(plotPoints)
        .join('g.lc-radar-plot-group')
      if (radarSettings.plots.show) {
        plots.each(function (d, i) {
          let g = d3.select(this)
          g.safeSelect('circle')
            .attrs({
              stroke: color,
              fill: '#ffffff',
              ...radarSettings.plots.attr
            })
            .styles({
              ...radarSettings.plots.style
            })
        })
          .on('mousemove', function (d, i) {
            if (isObject(s.tooltip) && !s.tooltip.show) return

            emitter.emit('showTooltip', {
              type: 'item',
              dataIndex: i,
              data: {
                value: sdData[i],
                data: sdData[i],
                indicator: indicator[i],
                dataIndex: i,
                seriesIndex: si,
                seriesData: sd
              },
              seriesIndex: index,
              event: d3.event
            })
          })
          .on('mouseout', function (d, i) {
            if (isObject(s.tooltip) && !s.tooltip.show) return

            emitter.emit('showTooltip', {
              type: 'item',
              data: null,
            })
          })
        plots.transition()
          .duration(defaultOptions.changeAniDuraiton)
          .ease(defaultOptions.enterAniEase)
          .attr('transform', d => `translate(${d[0]}, ${d[1]})`)

      } else {
        plots.remove()
      }

      section.on('click', () => {
        if (isSet(s.highlightAnimation) && !s.highlightAnimation) return

        chart.highlightIndex = chart.highlightIndex === si ? null : si
        emitter.emit('highlightChange', chart.highlightIndex)
      })

      if (isUnset(s.highlightAnimation) || s.highlightAnimation) {
        emitter.on('highlightChange', (ci) => {
          if (ci === null || ci === si) {
            section.transition()
              .duration(defaultOptions.focusAniDuration)
              .style('opacity', 1)

          } else {
            section.transition()
              .duration(defaultOptions.focusAniDuration)
              .style('opacity', defaultOptions.highlightOtherOpacity)

          }
        })
      }
    })



}