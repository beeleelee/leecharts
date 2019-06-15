import {
  isString,
  delay
} from "mytoolkit"

export default function drawLegend(chart) {
  let {
    d3,
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
  console.log(legendData)
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
      let html = '', x = iconSize + 10
      html += icon(d, i)
      if (d.icon === 'lineCircle') {
        x = iconSize * 2 + 10
      }
      html += `<text x=${x} y=${fontSize} style="cursor:pointer;font-size: ${fontSize}px;font-weight: ${fontWeight};">${d.name}</text>`
      ele.html(html)

      let { width, height } = ele.node().getBBox()
      legendWraps[i] = {
        ele,
        width,
        height
      }
    })

  // legend layout 
  let layoutX = legend.left + legend.padding
  let layoutRight = cw - legend.right - legend.padding
  let layoutWidth = cw - legend.right - legend.padding - layoutX
  let penX, penY, leftSpace, rows = [[]], rowIndex = 0
  for (let i = 0, l = legendWraps.length; i < l; i++) {
    let item = legendWraps[i]
    let row = rows[rowIndex]
    if (item.width <= leftSpace) {
      row.push(item)
    } else {
      rowIndex++
      row = rows[rowIndex] = []
      row.push(item)
    }
  }
  console.log(rows)
  if (legend.layout === 'horizontal') {
    penX = layoutX
    penY = legend.top + lineHeight / 2
    leftSpace = layoutWidth

    if (legend.align === 'right') {
      let j = 0
      for (let i = 0, l = legendWraps.length; i < l; i++) {
        let item = legendWraps[i]
        if (item.width <= leftSpace) {
          leftSpace -= item.width - legend.padding
        } else {
          leftSpace = layoutWidth
          penX = layoutRight
          console.log(i)
          for (let k = i; k > j; k--) {
            penX -= item.width
            item.ele.attr('transform', `translate(${penX},${penY})`)
            penX -= legend.padding
          }
          j = i + 1
        }
      }
    } else {

      for (let i = 0, l = legendWraps.length; i < l; i++) {
        let item = legendWraps[i]
        if (item.width <= leftSpace) {
          item.ele.attr('transform', `translate(${penX},${penY})`)
        } else {
          penX = layoutX
          penY += lineHeight
          item.ele.attr('transform', `translate(${penX},${penY})`)
        }
        penX += item.width + legend.padding
        leftSpace -= item.width - legend.padding
      }
    }
  } else {

  }



  function icon(d, i) {
    let r = ''
    let iconColor = d.color || defaultOptions.getColor(i)
    switch (d.icon) {
      case 'lineCircle':
        r += `<path stroke-width="2" stroke="${iconColor}" d="M0,${(fontSize + 2) / 2}L${iconSize * 1.8},${(fontSize + 2) / 2}"/>`
        r += `<circle stroke-width="2" stroke="${iconColor}" fill="#ffffff" cx="${iconSize * 0.9}" cy="${(fontSize + 2) / 2}" r="${iconSize / 2}"/>`
        return r
      case 'rect':
        return r
      case 'circle':
        return r
      default:
        return r
    }
  }
}

