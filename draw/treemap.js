import {
    isSet,
    isUnset,
    isObject,
    isArray,
    extend,
    randStr,
    encodeJSON,
    decodeJSON,
    isFunction,
} from 'mytoolkit'
import {
    getData,
} from '../utils'
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
        options: {
            onClick: clickHandle,
        },
    } = chart

    let backgroundColor = s.bgColor || '#ffffff'
    let foregroundColor = s.itemColor || defaultOptions.getColor(0)
    let labelColor = s.labelColor || '#ffffff'
    let labelSize = s.labelSize || 12
    let treeData = s.data || []
    if (treeData.length === 0) {
        layer.html('')
        return
    }
    let root = d3.hierarchy(treeData)
    let treemapLayout = d3.treemap()
    treemapLayout.size([cw - gridLeft - gridRight, ch - gridTop - gridBottom])
        .paddingInner(2)
    root.sum(function (d) {
        return d.value
    })
    treemapLayout(root)
    let maplayout = layer.safeSelect('g.lc-treemap-layout')
    maplayout.attr('transform', `translate(${gridLeft},${gridLeft})`)
    maplayout
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
                .on('click', () => {
                    if (isFunction(clickHandle)) {
                        clickHandle({
                            type: 'itemClicked',
                            data: d.data,
                            value: d.data.value,
                            dataIndex: i,
                            seriesIndex: index,
                            series: s,
                            seriesData: s.data
                        })
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
        .on('mousemove', function (d, i) {
            if (isObject(s.tooltip) && !s.tooltip.show) return

            emitter.emit('showTooltip', {
                type: 'item',
                dataIndex: i,
                data: d.data,
                event: d3.event
            })
        })
        .on('mouseout', function () {
            if (isObject(s.tooltip) && !s.tooltip.show) return

            emitter.emit('showTooltip', {
                type: 'item',
                data: null,
            })
        })
        .on('click', function (d, i) {
            if (!isSet(s.click) || s.click) {
                emitter.emit('clickItem', {
                    value: d.data,
                    seriesIndex: index,
                    dataIndex: i,
                    seriesData: s
                })
            }
        })

}