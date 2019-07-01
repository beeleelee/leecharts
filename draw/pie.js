import {
  isSet,
  isObject,
  isFunction,
  decodeJSON,
  encodeJSON
} from 'mytoolkit'
import {
  parsePercent
} from '../utils'
import drawGradient from './gradient'

export default function drawPie(chart, layer, s, index) {
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
  let data = s.data
  if (!data || !data.length) {
    layer.html('')
      .attr('transform', null)
    return
  }


  let focusAnimation = isSet(s.focusAnimation) ? s.focusAnimation : true

  let pieCenter = s.center || [0.5, 0.5]
  pieCenter = [cw * parsePercent(pieCenter[0]), ch * parsePercent(pieCenter[1])]
  let radius = s.radius || [0, 0.7]
  let innerRadius = Math.min(cw, ch) * parsePercent(radius[0]) * 0.5
  let outerRadius = Math.min(cw, ch) * parsePercent(radius[1]) * 0.5
  let arcs = d3.pie()
  if (!s.sort) {
    arcs.sortValues(null)
  }
  let startAngle = s.startAngle || 0, endAngle = s.endAngle || Math.PI * 2
  arcs.startAngle(startAngle)
  arcs.endAngle(endAngle)
  arcs = arcs(data.map(item => item.value))

  let d3arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)


  layer.attr('transform', `translate(${pieCenter[0]}, ${pieCenter[1]})`)
  let pieItems = layer.selectAll('path.lc-arc')
    .data(arcs)
    .join('path.lc-arc')
    .attr('item-index', (d, i) => i)
    .attr('fill', (d, i) => {
      let itemData = data[i]
      return drawGradient(chart, itemData.color, defaultOptions.getColor(i))
    })
    .style('opacity', isSet(s.opacity) ? s.opacity : 1)
    .on('click', function (d, i) {
      if (!isSet(s.click) || s.click) {
        emitter.emit('clickItem', {
          value: d.data,
          seriesIndex: index,
          dataIndex: i,
          seriesData: s
        })
      }
      if (isFunction(clickHandle)) {
        clickHandle({
          type: 'itemClicked',
          data: {
            ...d,
            ...data[i]
          },
          dataIndex: i,
          series: s,
          seriesIndex: index,
          seriesData: s.data
        })
      }

      if (isSet(s.clickHighlight) && !s.clickHighlight) return

      let highlightIndex

      if (i === chart.highlightIndex) {
        highlightIndex = null
      } else {
        highlightIndex = i
      }

      chart.highlightIndex = highlightIndex
      emitter.emit('highlightChange', highlightIndex)
    })
    .on('mouseover', function (d, i) {
      if (!focusAnimation) return

      let ele = d3.select(this)

      let startOuter = outerRadius
      let endOuter = outerRadius * defaultOptions.focusRate
      ele.transition()
        .duration(defaultOptions.focusAniDuration)
        .ease(defaultOptions.focusPieEase)
        .attrTween('d', () => {
          let d = arcs[i]
          let inter = d3.interpolate(startOuter, endOuter)
          return t => {
            return d3.arc().innerRadius(innerRadius).outerRadius(inter(t))(d)
          }
        })

    })
    .on('mouseout', function (d, i) {
      if (!focusAnimation) return

      let ele = d3.select(this)

      let startOuter = outerRadius * defaultOptions.focusRate
      let endOuter = outerRadius
      ele.transition()
        .duration(defaultOptions.focusAniDuration)
        .ease(defaultOptions.focusPieEase)
        .attrTween('d', () => {
          let d = arcs[i]
          let inter = d3.interpolate(startOuter, endOuter)
          return t => {
            return d3.arc().innerRadius(innerRadius).outerRadius(inter(t))(d)
          }
        })

      if (isObject(s.tooltip) && !s.tooltip.show) return

      emitter.emit('showTooltip', {
        type: 'item',
        data: null,
      })
    })
    .on('mousemove', function (d, i) {
      if (isObject(s.tooltip) && !s.tooltip.show) return

      emitter.emit('showTooltip', {
        type: 'item',
        dataIndex: i,
        data: {
          ...d,
          ...data[i],
          seriesIndex: index,
        },
        seriesIndex: index,
        event: d3.event
      })
    })
  if (chart.firstRender && (!isSet(s.enterAnimation) || s.enterAnimation)) {
    pieItems
      .transition()
      .duration(defaultOptions.enterAniDuration)
      .ease(defaultOptions.enterAniEase)
      .attrTween('d', function (d, i) {
        let inter = d3.interpolate(d.startAngle, d.endAngle)
        return t => {
          return d3arc({ startAngle: d.startAngle, endAngle: inter(t) })
        }
      })
      .on('end', function (d, i) {
        d3.select(this).attr('prevData', encodeJSON(d))
      })
  } else {
    //pieItems.attr('d', d3arc)
    pieItems.transition()
      .duration(defaultOptions.changeAniDuraiton)
      .ease(defaultOptions.enterAniEase)
      .attrTween('d', function (d, i) {
        let ele = d3.select(this)
        let prevData = decodeJSON(ele.attr('prevData')) || d
        let interStart = d3.interpolate(prevData.startAngle, d.startAngle)
        let interEnd = d3.interpolate(prevData.endAngle, d.endAngle)
        return t => {
          return d3arc({ startAngle: interStart(t), endAngle: interEnd(t) })
        }
      })
      .on('end', function (d, i) {
        d3.select(this).attr('prevData', encodeJSON(d))
      })
  }

  if (!isSet(s.clickHighlight) || s.clickHighlight) {
    emitter.on('highlightChange', i => {
      pieItems.each(function (d, idx) {
        let targetOpacity = i !== null ? i === idx ? 1 : defaultOptions.highlightOtherOpacity : 1
        d3.select(this).transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', targetOpacity)
      })
    })
  }


  // draw label 
  let label = layer.safeSelect('g.lc-pie-label')
  label.html('')
  if (s.label && isFunction(s.label.formatter)) {
    label.html(s.label.formatter(data))
  }
}