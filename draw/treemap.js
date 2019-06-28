import {
  isSet,
  isUnset,
  isArray,
  extend,
  randStr,
  encodeJSON,
  decodeJSON,
  isFunction,
} from 'mytoolkit'
import drawGradient from './gradient'

export default function drawLine(chart, layer, s, index) {
  let {
    d3,
    emitter,
    defaultOptions,
    containerWidth: cw,
    containerHeight: ch,
    gridTop,
    gridBottom,
    gridLeft,
    gridRight,
  } = chart

  let backgroundColor = s.bgColor || '#ffffff'
  let foregroundColor = s.itemColor || defaultOptions.getColor(0)
  let labelColor = s.labelColor || '#ffffff'
  let labelSize = s.labelSize || 12
  let treeData = s.data || []
  let root = d3.hierarchy(treeData)
  let treemapLayout = d3.treemap()
  treemapLayout.size([cw - gridLeft - gridRight, ch - gridTop - gridBottom])
    .paddingInner(2)
  root.sum(function (d) {
    return d.value
  })
  treemapLayout(root)
  console.log(root.descendants())
  layer.attr('transform', `translate(${gridLeft},${gridLeft})`)
  layer
    .selectAll('g.lc-map-node')
    .data(root.descendants())
    .join('g.lc-map-node')
    .attr('transform', d => `translate(${d.x0},${d.y0})`)
    .each(function (d, i) {
      let g = d3.select(this)
      let id = `mapnode-${index}-${i}`
      let clipId = `mapnode-clip-${index}-${i}`

      g.safeSelect('rect')
        .attrs({
          id,
          width: function (d) { return d.x1 - d.x0; },
          height: function (d) { return d.y1 - d.y0; },
          stroke: 'none',
          fill: () => {
            return i === 0 ? backgroundColor : foregroundColor
          }
        })
      g.safeSelect('clip-path')
        .html('')
        .attr("id", clipId)
        .append("use")
        .attr("xlink:href", `#${id}`)

      g.safeSelect('text')
        .text(d.data.name)
        .attrs({
          'clip-path': `url(#${clipId})`,
          fill: labelColor,
          stroke: 'none',
          x: 15,
          y: 20
        })
        .styles({
          'font-size': labelSize
        })

    })

}