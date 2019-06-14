import {
  isSet,
  isFunction,
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
  } = chart
  let data = s.data
  if (!data || !data.length) return

  let focusAnimation = isSet(s.focusAnimation) ? s.focusAnimation : true

  let pieCenter = s.center || [0.5, 0.5]
  pieCenter = [cw * parsePercent(pieCenter[0]), ch * parsePercent(pieCenter[1])]
  let radius = s.radius || [0, 0.7]
  let innerRadius = Math.min(cw, ch) * parsePercent(radius[0]) * 0.5
  let outerRadius = Math.min(cw, ch) * parsePercent(radius[1]) * 0.5
  let arcs = d3.pie()(data.map(item => item.value))
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
    .on('click', function (d, i) {
      if (!isSet(s.click) || s.click) {
        emitter.emit('clickItem', {
          value: d.data,
          seriesIndex: index,
          dataIndex: i,
          seriesData: s
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

      let curEle = d3.select(this)
      let otherPieItems = pieItems.filter((d, index) => index !== i)

      if (highlightIndex === null) {
        otherPieItems.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', 1)

      } else {
        otherPieItems.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', 0.4)
        curEle.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', 1)
      }

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

    })
  if (!isSet(s.enterAnimation) || s.enterAnimation) {
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
  } else {
    pieItems.attr('d', d3arc)
  }

  // draw label 
  if (s.label && isFunction(s.label.formatter)) {
    let label = layer.safeSelect('g.lc-pie-label')

    label.html(s.label.formatter(data))
  }
}