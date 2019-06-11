import {
  easeBounce,
  easeSinInOut
} from 'd3-ease'

export default function options() {
  return {
    grid: {
      left: 40,
      top: 30,
      right: 40,
      bottom: 30
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    yAxis: {
      type: 'value'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'middle'
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

options.seriesColor = colors


options.getColor = i => {
  return colors[i % colors.length]
}

options.focusAniDuration = 300
options.focusRate = 1.1
options.focusPieEase = easeBounce
options.enterAniDuration = 1000
options.enterAniEase = easeSinInOut