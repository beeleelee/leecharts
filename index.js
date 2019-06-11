import * as d3 from 'd3'

import defaultOptions from './options'
import {
  getBoundingRect,
  d3Augment,
  deepExtend,
  isInBound,
} from './utils'
import {
  isArray,
  isFunction,
} from 'mytoolkit'

import drawAxisX from './draw/axisX'
import drawAxisY from './draw/axisY'
import drawGridX from './draw/gridX'
import drawGridY from './draw/gridY'
import drawLine from './draw/line'
import drawBar from './draw/bar'
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

    this.init()
    this.drawChart()

  }
  drawChart() {
    drawAxisX(this)
    drawAxisY(this)
    drawGridX(this)
    drawGridY(this)
    this.drawSeries()
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
          default:
        }

      })

  }
  drawGridY() {
    let {
      containerWidth: cw,
      containerHeight: ch,
      options: {
        grid
      },
      sections: {
        gridY,
        axisY,
      },
      scaleY,
    } = this
    let tickValues = []
    axisY.selectAll('g.tick')
      .selectAll('text')
      .each(function () {
        let v = d3.select(this).text()
      })

    // gridX.selectAll('line')
    //   .data(['name1', 'name2', 'name3', 'name4', 'name5', 'name6'])
    //   .join('line')
    //   .attrs({
    //     fill: 'none',
    //     stroke: '#ddd',
    //     'stroke-dasharray': [4, 4],
    //     y1: grid.top
    //   })
    //   .attr('x1', d => {
    //     return scaleX(d) + bandWidth / 2
    //   })
    //   .attr('x2', d => scaleX(d) + bandWidth / 2)
    //   .attr('y2', ch - grid.top)

  }
  drawGridX() {
    let {
      containerWidth: cw,
      containerHeight: ch,
      options: {
        grid,
      },
      sections: {
        gridX
      },
    } = this
    let scaleX = d3.scaleBand()
      .domain(['name1', 'name2', 'name3', 'name4', 'name5', 'name6'])
      .range([grid.left, cw - grid.right])
    let bandWidth = scaleX.bandwidth()
    gridX.selectAll('line')
      .data(['name1', 'name2', 'name3', 'name4', 'name5', 'name6'])
      .join('line')
      .attrs({
        fill: 'none',
        stroke: '#ddd',
        'stroke-dasharray': [4, 4],
        y1: grid.top
      })
      .attr('x1', d => {
        return scaleX(d) + bandWidth / 2
      })
      .attr('x2', d => scaleX(d) + bandWidth / 2)
      .attr('y2', ch - grid.top)

  }
  drawAxisY() {

  }
  init() {
    if (!this.container) return
    if (this.container.empty && this.container.empty()) return

    let chart = this
    let {
      width,
      height
    } = getBoundingRect(this.container.node())

    this.containerWidth = width
    this.containerHeight = height

    this.paper = this.container.append('svg.lc-root')
      .attrs({ width: this.containerWidth, height: this.containerHeight })
      .on('mousemove', function () {
        chart.__onMousemove()
      })

    this.sections.desc = this.paper.append('desc')
    this.sections.defs = this.paper.append('defs')

    this.sections.gridX = this.paper.append('g.lc-grid-x')

    this.sections.gridY = this.paper.append('g.lc-grid-y')

    this.sections.axisX = this.paper.append('g.lc-axis-x')
    this.sections.axisY = this.paper.append('g.lc-axis-y')
    this.sections.linePointer = this.paper.append('line.lc-line-pointer')
    this.sections.shadowPointer = this.paper.append('rect.lc-shadow-pointer')

    this.sections.series = this.paper.append('g.lc-series')

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
      activeCategroryIndex,
    } = this
    let {
      offsetX: x,
      offsetY: y,
    } = d3.event
    let gridBound = [[grid.left, grid.top], [cw - grid.right, ch - grid.bottom]]
    let bandWidth = scaleX.bandwidth()

    if (isInBound(gridBound, x, y)) {
      let i = Math.ceil((x - grid.left) / bandWidth) - 1
      i = Math.max(0, i)
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