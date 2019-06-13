import * as d3 from 'd3'

import defaultOptions from './options'
import {
  getBoundingRect,
  d3Augment,
  deepExtend,
  isInBound,
  getData,
} from './utils'
import {
  isSet,
  debounce,
  groupBy,
} from 'mytoolkit'

import drawAxisX from './draw/axisX'
import drawAxisY from './draw/axisY'
import drawLine from './draw/line'
import drawBar from './draw/bar'
import drawPie from './draw/pie'
import drawLinePointer from './draw/linepointer'
import emitter from './emitter'

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
    this.previousOptions = null
    this.sections = {}
    this.maxValue = 0
    this.firstRender = true

    let resize = this.resize.bind(this)
    this.resize = debounce(resize, 100)
    this.init()
    this.drawChart()

  }
  drawChart() {
    drawAxisX(this)
    drawAxisY(this)
    this.drawSeries()
    this.firstRender = false
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

    let lineCharts = series.filter(s => s.type === 'line')
    let barCharts = series.filter(s => s.type === 'bar')

    let lineHasStack = lineCharts.filter(s => !!s.stack)
    let barHasStack = barCharts.filter(s => !!s.stack)

    // line has stack 
    if (lineHasStack.length) {
      let lineStackGroups = groupBy(lineHasStack, 'stack')
      Object.keys(lineStackGroups)
        .forEach(k => {
          let group = lineStackGroups[k]
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
    }
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


    // this.sections.linePointer = this.paper.append('line.lc-line-pointer')
    this.sections.shadowPointer = this.paper.append('rect.lc-shadow-pointer')

    this.sections.scrollXView = this.paper.append('g.lc-scroll-x-view')
    this.sections.axisX = this.sections.scrollXView.append('g.lc-axis-x')
    this.sections.series = this.sections.scrollXView.append('g.lc-series')
    this.sections.linePointer = this.sections.scrollXView.append('line.lc-line-pointer')
    this.sections.plotGroup = this.sections.scrollXView.append('g.lc-plot-group')

    this.sections.labels = this.paper.append('g.lc-labels')
    this.sections.title = this.paper.append('text.lc-title')
    this.sections.subtitle = this.paper.append('text.lc-subtitle')

    this.sections.tooltip = this.paper.append('g.lc-tooltip')

    this.emitter.on('axisChange', (...args) => {
      drawLinePointer(this, ...args)
    })
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

    let gridBound = [[grid.left, grid.top], [cw - grid.right, ch - grid.bottom]]
    let bandWidth = scaleCategory.bandwidth()

    if (isInBound(gridBound, x, y)) {
      let i, l, scaleRange
      scaleRange = scaleCategory.range()
      l = Math.round(Math.abs(scaleRange[0] - scaleRange[1]) / bandWidth)
      if (orient === 'h') {
        i = Math.ceil((x - grid.left) / bandWidth) - 1
      } else {
        i = Math.ceil((y - grid.bottom) / bandWidth) - 1
      }
      i = Math.max(0, i)
      i = orient === 'v' ? l - i - 1 : i
      if (i !== activeCategroryIndex) {
        this.activeCategroryIndex = i
        emitter.emit('axisChange', i)
      }
    } else {
      if (activeCategroryIndex !== null) {
        this.activeCategroryIndex = null
        emitter.emit('axisChange', null)
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