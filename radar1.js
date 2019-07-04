import React from 'react'
import leecharts from '../leecharts'


export default class Radar1 extends React.Component {
  constructor(options) {
    super(options)
    this.onResize = this.onResize.bind(this)
  }
  componentDidMount() {
    this.chart = leecharts(this.chartContainer, {
      tooltip: {
        show: true,
        formatter: (data) => {
          console.log(data)
          return `
            <div class="tt">
              ${data.data}
            </div>
          `
        }
      },
      legend: {
        show: true,
        layout: 'horizontal',
        align: 'right',
        data: [{
          icon: 'custom',
          name: 'type1',
          drawIcon: () => {

            return `<rect stroke="none" fill="#ff0000" width="20" height="5" />`
          }
        }, {
          icon: 'custom',
          name: 'type2',
          drawIcon: (d, i) => {
            return `<rect stroke="none" fill="#ff0000" width="20" height="5" />`
          }
        }],
        iconSize: 30,
        top: 20,
        right: 20
      },

      series: [
        {
          name: '',
          type: 'radar',
          center: [0.3, 0.4],
          radius: '70%',
          focusAnimation: true,
          indicator: [
            { color: '#ffffff', text: 'name1' },
            { color: '#ffffff', text: 'name2' },
            { color: '#ffffff', text: 'name3' },
            { color: '#ffffff', text: 'name4' },
            { color: '#ffffff', text: 'name5' },
            { color: '#ffffff', text: 'name6' },
          ],
          radar: {
            splitNumber: 4,
            splitArea: {
              colors: []
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true
            },
            plots: {
              attr: {
                r: 10
              },
              style: {
                opacity: 0
              }
            }
          },
          data: [
            {
              name: 'group 1',
              size: 2,
              areaStyle: {
                show: false,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(67,67,72,.6)'
                  }, {
                    offset: 1, color: 'rgba(67,67,72,.2)'
                  }]
                }
              },
              data: [50, 30, 40, 56, 60, 78]

            },
            {
              name: 'group 2',
              size: 2,
              areaStyle: {
                show: false,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(67,67,72,.6)'
                  }, {
                    offset: 1, color: 'rgba(67,67,72,.2)'
                  }]
                }
              },
              data: [37, 29, 53, 36, 23, 78]

            }
          ]
        }
      ]
    })
    window.addEventListener('resize', this.onResize)

  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  onResize() {
    this.chart.resize()
  }
  render() {
    return (
      <div
        ref={node => this.chartContainer = node}
        className="chart-container" >

      </div>
    )
  }
}