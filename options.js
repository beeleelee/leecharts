import {
  easeBounce,
  easeSinInOut
} from 'd3-ease'

export default function options() {
  return {
    grid: {
      left: 40,
      top: 80,
      right: 40,
      bottom: 30
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    axisPointer: {
      type: 'line',
      color: '#ddd'
    },
    yAxis: {
      type: 'value',
      show: true,
      splitLine: {
        show: true,
        color: '#ddd',
        type: 'dashed'
      }
    },
    xAxis: {
      type: 'category',
      show: true,
      data: [],
      splitLine: {
        show: false,
        color: '#ddd',
        type: 'solid'
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      left: 10,
      right: 10,
      top: 0,
      bottom: 0,
      padding: 15,
      fontSize: 12,
      fontWeight: 555,
      lineHeight: 20,
      iconSize: 12
    },
    series: [],
  }
}

let colors = [
  '#7cb5ec',
  '#434348',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
  '#f15c80',
  '#e4d354',
  '#2b908f'
]
let areaColors = [
  'rgba(124,181,236,.6)',
  'rgba(67,67,72,.6)',
  'rgba(144,237,125,.6)',
  'rgba(247,163,92,.6)',
  'rgba(128,133,233,.6)',
  'rgba(241,92,128,.6)',
  'rgba(228,211,84,.6)',
  'rgba(43,144,143,.6)',
]

options.seriesColor = colors


options.getColor = i => {
  return colors[i % colors.length]
}
options.getAreaColor = i => {
  return areaColors[i % areaColors.length]
}

options.focusAniDuration = 300
options.focusRate = 1.1
options.focusPieEase = easeBounce
options.enterAniDuration = 2000
options.enterAniEase = easeSinInOut
options.changeAniDuraiton = 800

options.tickNumber = 5
options.axisLineColor = '#ddd'
options.axisTickSize = 6
options.axisLabel = {
  fontSize: 12,
  color: '#aaa',
  padding: 10,
  rotate: 0
}
options.strokeDasharray = "6 3"

options.plot = {
  show: true,
  type: 'circle',
  size: 10
}

options.bgCircleOpacity = 0.4

options.areaStyle = {
  show: false
}
options.lineStyle = {
  show: true,
  curve: false
}

options.highlightOtherOpacity = 0.2

let ldicons = {
  'line': 'lineCircle',
  'bar': 'rect',
}
options.legendIcon = (type) => {
  return ldicons[type] || 'circle'
}

options.barStyle = {
  barMaxWidth: 80
}

options.shadowPointerColor = 'rgba(125,125,125, 0.6)'