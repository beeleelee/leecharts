import {
  isString,
  isFunction,
} from "mytoolkit"

export default function drawLegend(chart) {
  let {
    d3,
    emitter,
    defaultOptions,
    containerWidth: cw,
    contianerHeight: ch,
    options: {
      legend,
      series,
    },
    sections: {
      legend: legendLayer
    }
  } = chart
  let legendData = legend.data || []
  let filteredSeries = series.filter(s => s.type === 'line' || s.type === 'bar')
  if (!legendData.length) {
    legendData = filteredSeries.map((s, i) => s.name || `series ${1}`)
  }
  if (!legendData.length) {
    return
  }
  // prepare legend  
  legendData = legendData.map((l, i) => {
    let matchSeries = series[i] || {}
    isString(l) && (l = { name: l })
    return {
      icon: defaultOptions.legendIcon(matchSeries.type),
      ...l,
    }
  })

  // set legend layer invisiable 
  // legendLayer.style('opacity', 0)
  let fontSize = legend.fontSize
  let lineHeight = legend.lineHeight
  let iconSize = legend.iconSize
  let fontWeight = legend.fontWeight
  let legendWraps = []
  legendLayer.selectAll('g.lc-legend-item-wrap')
    .data(legendData)
    .join('g.lc-legend-item-wrap')
    .each(function (d, i) {
      let ele = d3.select(this)
      let html = '', x = iconSize + 6, formatter
      formatter = isFunction(d.formatter) ? d.formatter : () => d.name
      html += icon(d, i)
      if (d.icon === 'lineCircle') {
        x = iconSize * 1.8 + 6
      }
      html += `<text x=${x} y=${fontSize} style="cursor:pointer;font-size: ${fontSize}px;font-weight: ${fontWeight};">${formatter()}</text>`
      ele.html(html)

      let { width, height } = ele.node().getBBox()
      legendWraps[i] = {
        ele,
        width,
        height
      }
    })
    .on('click', (d, i) => {
      chart.highlightIndex = i === chart.highlightIndex ? null : i
      emitter.emit('highlightChange', chart.highlightIndex)
    })

  // legend layout 
  let layoutX = legend.left + legend.padding
  let layoutRight = cw - legend.right - legend.padding
  let layoutWidth = cw - legend.right - legend.padding - layoutX
  let penX, penY, leftSpace, rows = [[]], rowIndex = 0

  penX = layoutX
  penY = legend.top + lineHeight / 2
  if (legend.layout === 'horizontal') {
    leftSpace = layoutWidth

    for (let i = 0, l = legendWraps.length; i < l; i++) {
      let item = legendWraps[i]
      let row = rows[rowIndex]
      if (item.width <= leftSpace) {
        row.push(item)
        leftSpace -= (item.width + legend.padding)
      } else {
        rowIndex++
        row = rows[rowIndex] = []
        row.push(item)
        leftSpace = layoutWidth
      }
    }

    rows.forEach((row, rowIndex) => {
      let right = legend.align === 'right'
      right && (penX = layoutRight)
      for (let i = 0, l = row.length; i < l; i++) {
        let item
        if (right) {
          item = row[l - 1 - i]
          penX -= (item.width + legend.padding)
          item.ele.attr('transform', `translate(${penX},${penY})`)
        } else {
          item = row[i]
          item.ele.attr('transform', `translate(${penX},${penY})`)
          penX += (item.width + legend.padding)
        }
      }
      penY += lineHeight
    })
  } else {
    let maxItemWidth = Math.max.apply(this, legendWraps.map(l => l.width))
    legend.align === 'right' && (penX = layoutRight - maxItemWidth - legend.padding)
    for (let i = 0, l = legendWraps.length; i < l; i++) {
      let item = legendWraps[i]
      item.ele.attr('transform', `translate(${penX},${penY})`)
      penY += lineHeight
    }
  }

  emitter.on('highlightChange', i => {
    legendWraps.forEach((l, k) => {
      let targetOpacity = i !== null ? i == k ? 1 : defaultOptions.highlightOtherOpacity : 1
      l.ele
        .style('opacity', targetOpacity)
    })
  })


  function icon(d, i) {
    let r = ''
    let iconColor = d.color || defaultOptions.getColor(i)
    switch (d.icon) {
      case 'lineCircle':
        r += `<path stroke-width="2" stroke="${iconColor}" d="M0,${(fontSize + 2) / 2}L${iconSize * 1.8},${(fontSize + 2) / 2}"/>`
        r += `<circle stroke-width="2" stroke="${iconColor}" fill="#ffffff" cx="${iconSize * 0.9}" cy="${(fontSize + 2) / 2}" r="${iconSize / 2}"/>`
        return r
      case 'rect':
        r += `<rect stroke="none" fill="${iconColor}" y="${(iconSize + 1 - fontSize)}" width="${iconSize}" height="${iconSize}"/>`
        return r
      case 'circle':
        r += `<circle stroke="none" fill="${iconColor}" cy="${(fontSize + 2) / 2}" r="${iconSize / 2}"/>`
        return r
      default:
        return r
    }
  }
}

