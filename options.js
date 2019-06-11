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

options.seriesColor = [
  '#7cb5ec',
  '#434348',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
]