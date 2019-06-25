import * as d3 from 'd3'

import defaultOptions from './options'
import {
  getBoundingRect,
  d3Augment,
  deepExtend,
  isInBound,
  maybePercentValue,
} from './utils'
import {
  isSet,
  debounce,
  groupBy,
  isFunction,
  isObject,
} from 'mytoolkit'

import drawAxisX from './draw/axisX'
import drawAxisY from './draw/axisY'
import drawLine from './draw/line'
import drawBar from './draw/bar'
import drawPie from './draw/pie'
import drawLinePointer from './draw/linepointer'
import drawLegend from './draw/legend'
import emitter from './emitter'
import drawShadowPointer from './draw/shadowpointer'
import drawTooltip from './draw/tooltip'
import drawPoint from './draw/point'
import drawCustom from './draw/custom'
import drawLabel from './draw/label'

d3Augment(d3)

class chart {
  constructor(selector, options) {
    //console.log(selector, options)
    //this.bind(['onMousemove'])
    this.d3 = d3
    this.defaultOptions = defaultOptions
    this.emitter = new emitter()
    this.container = d3.select(selector)
    this.options = deepExtend(defaultOptions(), options)
    this.preOptions = null
    this.previousOptions = null
    this.sections = {}
    this.maxValue = 0
    this.firstRender = true

    let resize = this.resize.bind(this)
    this.resize = debounce(resize, 100)
    let showTooltip = this.__showTooltip.bind(this)
    this.__showTooltip = debounce(showTooltip, 20)
    this.init()
    options && this.drawChart()

  }
  drawChart() {
    this.emitter.clear('highlightChange')
    drawAxisX(this)
    drawAxisY(this)
    this.calculateBarOffset()
    this.drawSeries()
    drawLegend(this)
    this.drawLabel()
    this.firstRender = false
  }
  drawLabel() {
    let chart = this
    let {
      options: {
        label = []
      },
      sections: {
        labels: labelGroup
      }
    } = chart
    if (isObject(label)) {
      label = [label]
    }
    if (label.length === 0) {
      return
    }
    labelGroup.selectAll('g.lc-label-g')
      .data(label)
      .join('g.lc-label-g')
      .each(function (d, i) {
        let layer = d3.select(this)
          .classed(`lc-label-g-${i}`, true)
        drawLabel(chart, layer, d, i)
      })
  }
  drawSeries() {
    let chart = this
    let {
      options: {
        series
      },
      sections: {
        series: seriesGroup
      }
    } = chart

    seriesGroup.selectAll('g.lc-layer')
      .data(series)
      .join(
        enter => enter.append('g.lc-layer'),
        update => update,
        exit => exit.remove()
      )
      .each(function (s, i) {
        let layer = d3.select(this)
        layer.classed(`lc-layer-${i}`, true)

        switch (s.type) {
          case 'line':
            drawLine(chart, layer, s, i)
            break
          case 'bar':
            drawBar(chart, layer, s, i)
            break
          case 'pie':
            drawPie(chart, layer, s, i)
            break
          case 'point':
            drawPoint(chart, layer, s, i)
            break
          case 'custom':
            drawCustom(chart, layer, s, i)
            break
          default:
        }

      })

  }
  resize() {
    this.figureGeometry()
    this.drawChart()
  }
  figureGeometry() {
    let {
      width,
      height
    } = getBoundingRect(this.container.node())
    let cw = this.containerWidth = width
    let ch = this.containerHeight = height
    this.containerCenter = [cw / 2, ch / 2]
    this.paper.attrs({ width: cw, height: ch })
  }
  calculateStackData() {
    let {
      options: {
        series = []
      }
    } = this
    let types = ['line', 'bar']
    types.forEach(type => {
      let chartsByType = series.filter(s => s.type === type)
      let chartsByStack = chartsByType.filter(s => !!s.stack)
      if (!chartsByStack.length) return

      let stackGroups = groupBy(chartsByStack, 'stack')
      Object.keys(stackGroups)
        .forEach(k => {
          let group = stackGroups[k]
          let stackedData = []
          group.forEach((item, idx) => {
            if (stackedData.length === 0) {
              stackedData = Array.from({ length: item.data.length }).map(() => 0)
            }
            let itemStackData = Array.from({ length: item.data.length }).map(() => [])
            item.data.forEach((d, i) => {
              d = isSet(d) ? (d.value ? d.value : d) : 0
              let isd = itemStackData[i]
              isd[0] = stackedData[i]
              isd[1] = stackedData[i] + d
            })
            item.stackData = itemStackData
            stackedData = itemStackData.map(item => item[1])
          })
        })
    })

    // set bar index 
    let barSeries = series.filter(s => s.type === 'bar')
    let sgx = -1, stackName
    for (let i = 0, l = barSeries.length; i < l; i++) {
      let s = barSeries[i]
      if (!isSet(s.stack) || s.stack === '') {
        sgx++
      } else if (s.stack !== stackName) {
        sgx++
        stackName = s.stack
      }
      s.stackGroupIndex = sgx
    }
    barSeries.forEach(s => {
      s.stackGroupLength = sgx + 1
    })
  }
  calculateBarOffset() {
    let {
      options: {
        series
      },
      scaleY,
      scaleX,
    } = this

    let barSeries = series.filter(s => s.type === 'bar')
    if (!barSeries.length) return

    let scaleCategory, bandWidth

    if (scaleX.bandwidth) {
      scaleCategory = scaleX
    } else if (scaleY.bandwidth) {
      scaleCategory = scaleY
    } else {
      // to do: dealing with charts without category for both xAxis and yAxis
      return
    }
    bandWidth = scaleCategory.bandwidth()
    let b, groupIdx = -1, expectedBarWidth, groupLength, barWidth, barMinWidth, barMaxWidth, cache = []
    groupLength = barSeries[0]['stackGroupLength']
    expectedBarWidth = Math.max(1, (bandWidth / groupLength) - 8)

    for (let i = 0, l = barSeries.length; i < l; i++) {
      b = barSeries[i]
      if (b.stackGroupIndex > groupIdx) {
        if (b.barWidth) {
          cache.push(b.barWidth)
          break
        }
        barMinWidth = b.barMinWidth || 0
        barMaxWidth = Math.min(b.barMaxWidth || expectedBarWidth, defaultOptions.barStyle.barMaxWidth)
        barWidth = Math.min(Math.max(barMinWidth, expectedBarWidth), barMaxWidth)
        cache.push(barWidth)
        groupIdx++
      }
    }
    let space = Math.max(0, bandWidth - cache.reduce((a, b) => a + b)) / (groupLength + 1)

    barSeries.forEach(b => {
      let gIdx = b.stackGroupIndex
      b._barOffset = space * (gIdx + 1) + cache.slice(0, gIdx).reduce((a, b) => a + b, 0)
      b._barWidth = cache[gIdx]
    })
    //console.log(barSeries, expectedBarWidth)
  }
  calculateMaxValue() {
    let {
      options: {
        xAxis,
        yAxis,
        series,
      }
    } = this
    if (xAxis.type === 'value' && xAxis.max) {
      this.maxValue = xAxis.max
      this.maxValueFixed = true
      return
    }
    if (yAxis.type === 'value' && yAxis.max) {
      this.maxValue = yAxis.max
      this.maxValueFixed = true
      return
    }
    let sArray = series.filter(s => s.type === 'bar' || s.type === 'line')
    let maxValue = 0
    sArray.forEach(s => {
      let d = s.data || []
      if (s.stackData) {
        d = s.stackData.map(item => item[1])
      }
      d = d.map(item => item && item.value ? item.value : item)
      let max = Math.max.apply(this, d)
      maxValue = Math.max(maxValue, max)
    })
    this.maxValue = maxValue
    this.maxValueFixed = false
  }
  setOptions(options) {
    if (!options) return

    this.preOptions = this.options
    this.options = deepExtend(this.preOptions, options)

    this.figureGeometry()
    this.calculateStackData()
    this.calculateMaxValue()
    this.drawChart()
  }
  init() {
    if (!this.container) return
    if (this.container.empty && this.container.empty()) return

    let chart = this

    this.highlightIndex = null

    this.paper = this.container.append('svg.lc-root')

    this.figureGeometry()
    this.calculateStackData()
    this.calculateMaxValue()


    this.paper
      .on('mousemove', function () {

        chart.__onMousemove()
      })

    this.sections.desc = this.paper.append('desc')
    this.sections.defs = this.paper.append('defs')

    this.sections.axisY = this.paper.append('g.lc-axis-y')

    this.sections.scrollXView = this.paper.append('g.lc-scroll-x-view')
    this.sections.axisX = this.sections.scrollXView.append('g.lc-axis-x')
    this.sections.shadowPointer = this.sections.scrollXView.append('rect.lc-shadow-pointer')
    this.sections.series = this.sections.scrollXView.append('g.lc-series')
    this.sections.linePointer = this.sections.scrollXView.append('line.lc-line-pointer')
    this.sections.plotGroup = this.sections.scrollXView.append('g.lc-plot-group')

    this.sections.legend = this.paper.append('g.lc-legend')
    this.sections.labels = this.paper.append('g.lc-labels')
    this.sections.title = this.paper.append('text.lc-title')
    this.sections.subtitle = this.paper.append('text.lc-subtitle')

    this.sections.tooltip = d3.select(document.body).safeSelect('div.lc-tooltip')
    this.sections.tooltip.styles({
      position: 'absolute',
      left: '-999999px',
      top: '-9999999px',
      opacity: 0,
    })

    this.emitter.on('axisChange', (...args) => {
      drawLinePointer(this, ...args)
      drawShadowPointer(this, ...args)
      if (isFunction(this.options.onAxisChange)) {
        this.options.onAxisChange(...args)
      }
    })

    this.emitter.on('showTooltip', this.__showTooltip)

  }
  __showTooltip(...args) {
    drawTooltip(this, ...args)
  }
  __onMousemove() {
    let {
      containerWidth: cw,
      containerHeight: ch,
      options: {
        grid
      },
      emitter,
      scaleX,
      scaleY,
      activeCategroryIndex,
    } = this
    if (!scaleX || !scaleY) return

    let scaleCategory, orient

    if (scaleX.bandwidth) {
      scaleCategory = scaleX
      orient = 'h'
    } else if (scaleY.bandwidth) {
      scaleCategory = scaleY
      orient = 'v'
    }
    if (!scaleCategory) return

    let {
      offsetX: x,
      offsetY: y,
    } = d3.event
    let gridLeft, gridRight, gridTop, gridBottom

    gridLeft = maybePercentValue(grid.left, cw)
    gridRight = maybePercentValue(grid.right, cw)
    gridTop = maybePercentValue(grid.top, ch)
    gridBottom = maybePercentValue(grid.bottom, ch)

    let gridBound = [[gridLeft, gridTop], [cw - gridRight, ch - gridBottom]]
    let bandWidth = scaleCategory.bandwidth()

    if (isInBound(gridBound, x, y)) {
      let i, l, scaleRange
      scaleRange = scaleCategory.range()
      l = Math.round(Math.abs(scaleRange[0] - scaleRange[1]) / bandWidth)
      if (orient === 'h') {
        i = Math.ceil((x - gridLeft) / bandWidth) - 1
      } else {
        i = Math.floor((y - gridBottom) / bandWidth) - 1
      }

      i = orient === 'v' ? l - i - 1 : i

      i = Math.max(0, i)
      if (i !== activeCategroryIndex) {
        this.activeCategroryIndex = i
        emitter.emit('axisChange', i)
      }
      emitter.emit('showTooltip', {
        type: 'axisPointer',
        activeIndex: i,
        event: d3.event
      })
    } else {
      if (activeCategroryIndex !== null) {
        this.activeCategroryIndex = null
        emitter.emit('axisChange', null)
        emitter.emit('showTooltip', {
          type: 'axisPointer',
          activeIndex: null
        })
      }
    }
  }
  // bind(names) {
  //   if (isArray(names)) {
  //     names.forEach(n => {
  //       console.log(this, this[n])
  //       isFunction(this[n]) && this[n].bind(this)
  //     })
  //   }
  // }
}

function leecharts(selector, options) {
  return new chart(selector, options)
}

export default leecharts