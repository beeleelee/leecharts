import {
  isSet,
  isUnset,
  extend,
  randStr,
  isFunction,
} from 'mytoolkit'
import {
  getData,
  maybePercentValue,
} from '../utils'
import drawGradient from './gradient'

export default function drawBar(chart, layer, s, index) {
  let {
    emitter,
    defaultOptions,
    d3,
    containerWidth: cw,
    containerHeight: ch,
    options: {
      xAxis,
      yAxis,
      onClick: clickHandle
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
  if (rData.length === 0) {
    layer.html('')
    return
  }

  let sData = rData = rData.map(item => item && item.value ? item.value : item)

  let stacked = false
  if (s.stackData) {
    stacked = true
    sData = s.stackData
  }

  let barStyle = extend({}, defaultOptions.barStyle, s.barStyle || {})
  let barColor = drawGradient(chart, (barStyle.color || null), defaultOptions.getColor(index))
  let tDuration = 500

  let barWrap = layer.selectAll('g.lc-bar-wrap')
    .data(sData)
    .join('g.lc-bar-wrap')
    .each(function (d, i) {
      let bar = d3.select(this)
      let x, y, y1, x1, width, height
      let barColorByData = s.data[i].color || barColor
      let barTween = bar.transition()
        .duration(chart.firstRender ? 0 : tDuration)
        .ease(defaultOptions.enterAniEase)
      if (stacked) {
        if (orient === 'h') {
          x = scaleCategory(getData(xAxis.data, i)) + barOffset + barWidth * 0.5
          y = scaleValue(d[1])
          y1 = scaleValue(d[0])
          width = barWidth
          height = y1 - y
          barTween.attr('transform', `translate(${x}, ${y + height * 0.5})`)
        } else {
          x = scaleValue(d[1])
          y = scaleCategory(getData(yAxis.data, i)) + barOffset + barWidth * 0.5
          x1 = scaleValue(d[0])
          width = x - x1
          height = barWidth
          barTween.attr('transform', `translate(${x - width * 0.5}, ${y})`)
        }
      } else {
        if (orient === 'h') {
          x = scaleCategory(getData(xAxis.data, i)) + barOffset + barWidth * 0.5
          y = scaleValue(d)
          y1 = ch - gridBottom
          width = barWidth
          height = y1 - y
          barTween.attr('transform', `translate(${x}, ${y + height * 0.5})`)
        } else {
          x = scaleValue(d)
          y = scaleCategory(getData(yAxis.data, i)) + barOffset + barWidth * 0.5
          x1 = gridLeft
          width = x - x1
          height = barWidth
          barTween.attr('transform', `translate(${x - width * 0.5}, ${y})`)
        }
      }

      let barRect = bar.safeSelect('rect')

      let barRectTween = barRect.transition()
        .duration(chart.firstRender ? defaultOptions.enterAniDuration : tDuration)
        .ease(defaultOptions.enterAniEase)

      barRect.attrs({
        x: () => {
          return width * -0.5
        },
        stroke: 'none',
        fill: barColorByData
      })
      if (orient === 'h') {
        if (chart.firstRender) {
          barRect.attrs({
            y: height * 0.5,
            width,
            height: 0
          })
        }
        barRectTween
          .attr('width', width)
          .attr('height', height)
          .attr('y', -0.5 * height)
          .on('start', function () {
            d3.select(this).attr('tweening', 1)
          })
          .on('end', function () {
            d3.select(this).attr('tweening', null)
          })

      } else {
        if (chart.firstRender) {
          barRect.attrs({
            y: height * -0.5,
            width: 0,
            height
          })
        }
        barRectTween
          .attr('height', height)
          .attr('width', function (d, i) {
            let x = position(d, i, true)
            return stacked ? x - scaleValue(d[0]) : x - gridLeft
          })
          .on('start', function () {
            barRect.attr('tweening', 1)
          })
          .on('end', function () {
            barRect.attr('tweening', null)
          })
      }
      barRect.on('mouseover', function () {
        if (barRect.attr('tweening') == '1') return

        if (orient === 'h') {
          barRect.transition()
            .duration(defaultOptions.focusAniDuration)
            .ease(defaultOptions.enterAniEase)
            .attr('transform', 'scale(1.1, 1)')
        } else {
          barRect.transition()
            .duration(defaultOptions.focusAniDuration)
            .ease(defaultOptions.enterAniEase)
            .attr('transform', 'scale(1, 1.1)')
        }
      }).on('mouseout', function () {
        if (barRect.attr('tweening') == '1') return

        if (orient === 'h') {
          barRect.transition()
            .duration(defaultOptions.focusAniDuration)
            .ease(defaultOptions.enterAniEase)
            .attr('transform', 'scale(1)')
        } else {
          barRect.transition()
            .duration(defaultOptions.focusAniDuration)
            .ease(defaultOptions.enterAniEase)
            .attr('transform', 'scale(1)')
        }
      }).on('click', function () {
        if (isFunction(clickHandle)) {
          clickHandle({
            type: 'itemClicked',
            data: rData[i],
            value: getData(rData, i),
            dataIndex: i,
            seriesIndex: index,
            seriesData: s.data,
            series: s
          })
        }
      })

      let labelStyle = extend({}, s.labelStyle || {})
      let label, padding, textStyle
      if (labelStyle.show) {
        padding = labelStyle.padding || 10
        textStyle = labelStyle.textStyle || {}
        label = bar.safeSelect('text.lc-bar-label')

        label
          .attrs({
            'text-anchor': () => {
              return orient === 'h' ? 'middle' : 'start'
            },
            x: () => {
              return orient === 'v' ? 0.5 * width + padding : 0
            },
            y: () => {
              return orient === 'h' ? -0.5 * height - padding : barWidth
            },
            fill: textStyle.color || '#000'
          })
          .text(function () {
            return stacked ? d[1] : d
          })
          .styles({
            ...textStyle
          })

      }

    })





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

      } else {
        layer.transition()
          .duration(defaultOptions.focusAniDuration)
          .style('opacity', defaultOptions.highlightOtherOpacity)

      }
    })
  }

  function position(d, i, isX) {
    let td, scale

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