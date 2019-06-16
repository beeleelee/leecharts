(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('mytoolkit')) :
  typeof define === 'function' && define.amd ? define(['d3', 'mytoolkit'], factory) :
  (global.leecharts = factory(global.d3,global.mytoolkit));
}(this, (function (d3,mytoolkit) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var pi = Math.PI;

  function sinInOut(t) {
    return (1 - Math.cos(pi * t)) / 2;
  }

  var b1 = 4 / 11,
      b2 = 6 / 11,
      b3 = 8 / 11,
      b4 = 3 / 4,
      b5 = 9 / 11,
      b6 = 10 / 11,
      b7 = 15 / 16,
      b8 = 21 / 22,
      b9 = 63 / 64,
      b0 = 1 / b1 / b1;

  function bounceOut(t) {
    return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
  }

  var tau = 2 * Math.PI;

  function options() {
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
      series: []
    };
  }
  var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f'];
  var areaColors = ['rgba(124,181,236,.6)', 'rgba(67,67,72,.6)', 'rgba(144,237,125,.6)', 'rgba(247,163,92,.6)', 'rgba(128,133,233,.6)', 'rgba(241,92,128,.6)', 'rgba(228,211,84,.6)', 'rgba(43,144,143,.6)'];
  options.seriesColor = colors;

  options.getColor = function (i) {
    return colors[i % colors.length];
  };

  options.getAreaColor = function (i) {
    return areaColors[i % areaColors.length];
  };

  options.focusAniDuration = 300;
  options.focusRate = 1.1;
  options.focusPieEase = bounceOut;
  options.enterAniDuration = 2000;
  options.enterAniEase = sinInOut;
  options.tickNumber = 5;
  options.axisLineColor = '#ddd';
  options.axisTickSize = 6;
  options.axisLabel = {
    fontSize: 12,
    color: '#aaa',
    padding: 10,
    rotate: 0
  };
  options.strokeDasharray = "6 3";
  options.plot = {
    show: true,
    type: 'circle',
    size: 10
  };
  options.bgCircleOpacity = 0.4;
  options.areaStyle = {
    show: false
  };
  options.lineStyle = {
    show: true,
    curve: false
  };
  options.highlightOtherOpacity = 0.2;
  var ldicons = {
    'line': 'lineCircle',
    'bar': 'rect'
  };

  options.legendIcon = function (type) {
    return ldicons[type] || 'circle';
  };

  options.barStyle = {};

  function getData(arr, index) {
    var item = arr[index];
    return item && item.value ? item.value : item;
  }
  function parsePercent(p) {
    if (!/^\d+(\.\d+)?%$/.test(p)) return p;
    return parseFloat(p) / 100;
  }
  function isInBound(bound, x, y) {
    var bl = bound[0],
        br = bound[1];
    if (bl[0] - x > 0) return false;
    if (br[0] - x < 0) return false;
    if (bl[1] - y > 0) return false;
    if (br[1] - y < 0) return false;
    return true;
  }
  function deepExtend(source, target) {
    Object.keys(target).forEach(function (tk) {
      if (mytoolkit.isObject(source[tk]) && mytoolkit.isObject(target[tk])) {
        deepExtend(source[tk], target[tk]);
      } else {
        source[tk] = target[tk];
      }
    });
    return source;
  }
  function getBoundingRect(doc) {
    if (doc && doc.getBoundingClientRect) {
      return doc.getBoundingClientRect();
    }

    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
  }
  function d3Augment(d3$$1) {
    if (!d3$$1.selection.prototype.attrs) {
      var attrs = function attrs(name) {
        var _this = this;

        if (mytoolkit.isObject(name)) {
          Object.keys(name).forEach(function (k) {
            _this.attr(k, name[k]);
          });
        }

        return this;
      };

      d3$$1.selection.prototype.attrs = attrs;
    }

    if (!d3$$1.selection.prototype.styles) {
      var styles = function styles(name) {
        var _this2 = this;

        if (mytoolkit.isObject(name)) {
          Object.keys(name).forEach(function (k) {
            _this2.style(k, name[k]);
          });
        }

        return this;
      };

      d3$$1.selection.prototype.styles = styles;
    } // make selection.append can accept [tag][class] synctax , it can also accept an initial attributes, an initial styles


    var appendProto = d3$$1.selection.prototype.append;

    if (!appendProto.lc_extended) {
      var append = function append(name, attrs, styles) {
        var _name$split = name.split(/[.#]/),
            _name$split2 = _slicedToArray(_name$split, 2),
            tagName = _name$split2[0],
            className = _name$split2[1];

        var s = appendProto.call(this, tagName);

        if (className) {
          name.includes('#') && s.attr('id', className);
          name.includes('.') && s.classed(className, 'true');
        }

        mytoolkit.isObject(attrs) && s.attr(attrs);
        mytoolkit.isObject(styles) && s.style(styles);
        return s;
      };

      append.lc_extended = true;
      d3$$1.selection.prototype.append = append;
    }

    if (!d3$$1.selection.prototype.safeSelect) {
      d3$$1.selection.prototype.safeSelect = function (selector) {
        var s = this.select(selector);

        if (s.empty()) {
          s = this.append(selector);
        }

        return s;
      };
    }
  }

  function axisX(chart) {
    var d3$$1 = chart.d3,
        defaultOptions = chart.defaultOptions,
        cw = chart.containerWidth,
        ch = chart.containerHeight,
        _chart$options = chart.options,
        grid = _chart$options.grid,
        series = _chart$options.series,
        xAxis = _chart$options.xAxis,
        axisX = chart.sections.axisX,
        maxValue = chart.maxValue,
        maxValueFixed = chart.maxValueFixed;
    var showAxis = true;
    if (!xAxis.show) showAxis = false;
    if (series.length === 0) showAxis = false; // draw axis only when series contains line or bar

    if (series.filter(function (s) {
      return s.type === 'line' || s.type === 'bar';
    }).length === 0) showAxis = false;

    if (!showAxis) {
      axisX.html('');
      return;
    }

    var scaleX, domainData, max, tickNumber, tickIncrement, tickValues, category;

    if (xAxis.type !== 'value') {
      domainData = xAxis.data.map(function (item) {
        return item && item.value ? item.value : item;
      });
      scaleX = d3$$1.scaleBand().domain(domainData).range([grid.left, cw - grid.right]);
      tickValues = domainData;
      category = true;
    } else {
      max = maxValue;
      tickNumber = xAxis.tickNumber || defaultOptions.tickNumber;

      if (!maxValueFixed) {
        tickIncrement = d3$$1.tickIncrement(0, max, tickNumber);
        max = Math.ceil(max / tickIncrement) * tickIncrement;
      }

      scaleX = d3$$1.scaleLinear().domain([0, max]).range([grid.left, cw - grid.right]);
      tickValues = d3$$1.ticks(0, max, tickNumber);
      category = false;
    }

    chart.xAxisTickValues = tickValues;
    chart.scaleX = scaleX;
    axisX.attr('transform', "translate(0, ".concat(ch - grid.bottom, ")"));
    var lineColor = xAxis.lineColor || defaultOptions.axisLineColor,
        tickSize = xAxis.tickSize || defaultOptions.axisTickSize; // axis bar 

    axisX.safeSelect('line.domain').attrs({
      fill: 'none',
      stroke: lineColor,
      x1: scaleX.range()[0],
      x2: scaleX.range()[1]
    }); // axis ticks 

    axisX.selectAll('line.lc-axis-tick').data(tickValues).join('line.lc-axis-tick').attrs({
      fill: 'none',
      stroke: lineColor,
      y2: xAxis.tickInside ? -tickSize : tickSize,
      x1: function x1(d) {
        return scaleX(d);
      },
      x2: function x2(d) {
        return scaleX(d);
      }
    });
    var axisLabelSetting = mytoolkit.extend({}, defaultOptions.axisLabel, xAxis.axisLabel || {}); // axis label

    var labelPadding = axisLabelSetting.padding + (xAxis.tickInside ? 0 : tickSize);
    var labelgroup = axisX.selectAll('g.lc-axis-label-g').data(tickValues).join('g.lc-axis-label-g').attr('transform', function (d) {
      return "translate(".concat(scaleX(d) + (category ? scaleX.bandwidth() * 0.5 : 0), ", ").concat(labelPadding + axisLabelSetting.fontSize * 0.5, ")");
    });
    labelgroup.each(function (d, i) {
      d3$$1.select(this).safeSelect('text').text(function (d) {
        if (mytoolkit.isFunction(axisLabelSetting.formatter)) {
          return axisLabelSetting.formatter(d);
        }

        return mytoolkit.addComma(d);
      }).attrs({
        'text-anchor': 'middle',
        stroke: 'none',
        fill: axisLabelSetting.color,
        transform: "rotate(".concat(axisLabelSetting.rotate, ")")
      }).styles({
        'font-size': axisLabelSetting.fontSize
      });
    }); // split lines 

    var sls = xAxis.splitLine;
    if (!sls.show) return;
    var splitLines = axisX.safeSelect('g.lc-split-lines');
    splitLines.selectAll('line').data(tickValues.filter(function (v) {
      return v !== 0;
    })).join('line').attrs({
      fill: 'none',
      stroke: sls.color,
      'stroke-dasharray': sls.type === 'dashed' ? defaultOptions.strokeDasharray : 'none',
      x1: function x1(d) {
        return scaleX(d);
      },
      y2: -(ch - grid.bottom - grid.top),
      x2: function x2(d) {
        return scaleX(d);
      }
    });
  }

  function axisY(chart) {
    var d3$$1 = chart.d3,
        defaultOptions = chart.defaultOptions,
        cw = chart.containerWidth,
        ch = chart.containerHeight,
        _chart$options = chart.options,
        grid = _chart$options.grid,
        series = _chart$options.series,
        yAxis = _chart$options.yAxis,
        axisY = chart.sections.axisY,
        maxValue = chart.maxValue,
        maxValueFixed = chart.maxValueFixed;
    var showAxis = true;
    if (!yAxis.show) showAxis = false;
    if (series.length === 0) showAxis = false; // draw axis only when series contains line or bar

    if (series.filter(function (s) {
      return s.type === 'line' || s.type === 'bar';
    }).length === 0) showAxis = false;

    if (!showAxis) {
      axisY.html('');
      return;
    }

    var scaleY, domainData, max, tickNumber, tickIncrement, tickValues, category;

    if (yAxis.type === 'category' && yAxis.data && yAxis.data.length) {
      domainData = yAxis.data.map(function (item) {
        return item && item.value ? item.value : item;
      });
      scaleY = d3$$1.scaleBand().domain(domainData).range([ch - grid.bottom, grid.top]);
      tickValues = domainData;
      category = true;
    } else {
      max = maxValue;
      tickNumber = yAxis.tickNumber || defaultOptions.tickNumber;

      if (!maxValueFixed) {
        tickIncrement = d3$$1.tickIncrement(0, max, tickNumber);
        max = Math.ceil(max / tickIncrement) * tickIncrement;
      }

      scaleY = d3$$1.scaleLinear().domain([0, max]).range([ch - grid.bottom, grid.top]);
      tickValues = d3$$1.ticks(0, max, tickNumber);
      category = false;
    }

    chart.yAxisTickValues = tickValues;
    chart.scaleY = scaleY;
    axisY.attr('transform', "translate(".concat(grid.left, ", 0)"));
    var lineColor = yAxis.lineColor || defaultOptions.axisLineColor,
        tickSize = yAxis.tickSize || defaultOptions.axisTickSize; // axis bar 

    axisY.safeSelect('line.domain').attrs({
      fill: 'none',
      stroke: lineColor,
      y1: scaleY.range()[1],
      y2: scaleY.range()[0]
    }); // axis ticks 

    axisY.selectAll('line.lc-axis-tick').data(tickValues).join('line.lc-axis-tick').attrs({
      fill: 'none',
      stroke: lineColor,
      x1: yAxis.tickInside ? tickSize : -tickSize,
      y1: function y1(d) {
        return scaleY(d);
      },
      y2: function y2(d) {
        return scaleY(d);
      }
    });
    var axisLabelSetting = mytoolkit.extend({}, defaultOptions.axisLabel, yAxis.axisLabel || {}); // axis label

    var labelPadding = axisLabelSetting.padding + (yAxis.tickInside ? 0 : tickSize);
    var labelgroup = axisY.selectAll('g.lc-axis-label-g').data(tickValues).join('g.lc-axis-label-g').attr('transform', function (d) {
      return "translate(".concat(-labelPadding, ", ").concat((category ? scaleY.bandwidth() * 0.5 : 0) + scaleY(d) + axisLabelSetting.fontSize / 3, ")");
    });
    labelgroup.each(function (d, i) {
      d3$$1.select(this).safeSelect('text').text(function (d) {
        if (mytoolkit.isFunction(axisLabelSetting.formatter)) {
          return axisLabelSetting.formatter(d);
        }

        return mytoolkit.addComma(d);
      }).attrs({
        'text-anchor': 'end',
        stroke: 'none',
        fill: axisLabelSetting.color,
        transform: "rotate(".concat(axisLabelSetting.rotate, ")")
      }).styles({
        'font-size': axisLabelSetting.fontSize
      });
    }); // split lines 

    var sls = yAxis.splitLine;
    if (!sls.show) return;
    var splitLines = axisY.safeSelect('g.lc-split-lines');
    splitLines.selectAll('line').data(tickValues.filter(function (v) {
      return v !== 0;
    })).join('line').attrs({
      fill: 'none',
      stroke: sls.color,
      'stroke-dasharray': sls.type === 'dashed' ? defaultOptions.strokeDasharray : 'none',
      y1: function y1(d) {
        return scaleY(d);
      },
      x2: cw - grid.right - grid.left,
      y2: function y2(d) {
        return scaleY(d);
      }
    });
  }

  var gradientPool = [];
  function drawGradient(chart, color, defaultColor) {
    var defs = chart.sections.defs;

    if (mytoolkit.isUnset(color)) {
      return defaultColor;
    }

    if (mytoolkit.isObject(color)) {
      var colorString = mytoolkit.encodeJSON(color);
      var gradientObj = gradientPool.find(function (p) {
        return p.colorString === colorString;
      });

      if (gradientObj) {
        return "url(#".concat(gradientObj.id, ")");
      }

      var r = '',
          id = 'lc-gradient-' + mytoolkit.randStr(6);

      if (color.type === 'linear') {
        color.colorStops.forEach(function (item) {
          r += "<stop offset=\"".concat(mytoolkit.toFixed(item.offset, 0, 100), "%\" stop-color=\"").concat(item.color, "\"/>");
        });
        defs.append('linearGradient').attrs({
          id: id,
          x1: color.x || 0,
          x2: color.x2 || 0,
          y1: color.y || 0,
          y2: color.y2 || 1
        }).html(r);
        gradientPool.push({
          id: id,
          colorString: colorString
        });
        return "url(#".concat(id, ")");
      } else if (color.type === 'radial') {
        color.colorStops.forEach(function (item) {
          r += "<stop offset=\"".concat(mytoolkit.toFixed(item.offset, 0, 100), "%\" stop-color=\"").concat(item.color, "\"/>");
        });
        defs.append('radialGradient').attrs({
          id: id,
          cx: color.x,
          cy: color.y,
          r: color.r
        }).html(r);
        gradientPool.push({
          id: id,
          colorString: colorString
        });
        return "url(#".concat(id, ")");
      }

      return r;
    }

    return color;
  }

  function drawLine(chart, layer, s, index) {
    var emitter = chart.emitter,
        defaultOptions = chart.defaultOptions,
        d3$$1 = chart.d3,
        cw = chart.containerWidth,
        ch = chart.containerHeight,
        _chart$options = chart.options,
        grid = _chart$options.grid,
        xAxis = _chart$options.xAxis,
        yAxis = _chart$options.yAxis,
        _chart$sections = chart.sections,
        defs = _chart$sections.defs,
        series = _chart$sections.series,
        plotGroup = _chart$sections.plotGroup,
        scaleY = chart.scaleY,
        scaleX = chart.scaleX;
    var lineStyle = mytoolkit.extend({}, defaultOptions.lineStyle, s.lineStyle || {});
    var color = lineStyle.color || defaultOptions.getColor(index);
    var scaleCategory, scaleValue, orient;

    if (scaleX.bandwidth) {
      scaleCategory = scaleX;
      scaleValue = scaleY;
      orient = 'h';
    } else if (scaleY.bandwidth) {
      scaleCategory = scaleY;
      scaleValue = scaleX;
      orient = 'v';
    } else {
      scaleCategory = scaleX;
      scaleValue = scaleY;
      orient = 'h';
    }

    var bandWidth = scaleCategory && scaleCategory.bandwidth ? scaleCategory.bandwidth() : 0;
    var rData = s.data || [];
    var sData = rData = rData.map(function (item) {
      return item && item.value ? item.value : item;
    });
    var stacked = false;

    if (s.stackData) {
      stacked = true;
      sData = s.stackData;
    }

    var areaStyle = mytoolkit.extend({}, defaultOptions.areaStyle, s.areaStyle || {});

    if (areaStyle.show) {
      var area = d3$$1.area().x(function (d, i) {
        return position(d, i, true);
      }).y(function (d, i) {
        return position(d, i, false);
      }).defined(function (d) {
        return !!d;
      });
      lineStyle.curve && area.curve(d3$$1.curveCardinal);

      if (orient === 'h') {
        area.y1(function (d, i) {
          if (stacked) {
            return scaleValue(d[0]);
          } else {
            return ch - grid.bottom;
          }
        });
      } else {
        area.x1(function (d, i) {
          if (stacked) {
            return scaleValue(d[0]);
          } else {
            return grid.left;
          }
        });
      }

      var areaColor = areaStyle.color || null;
      areaColor = drawGradient(chart, areaColor, defaultOptions.getAreaColor(index));
      layer.safeSelect('path.lc-area').attr('d', area(sData)).attrs({
        stroke: 'none',
        fill: areaColor
      });
    }

    if (lineStyle.show) {
      var line = d3$$1.line().x(function (d, i) {
        return position(d, i, true);
      }).y(function (d, i) {
        return position(d, i, false);
      }).defined(function (d) {
        return !!d;
      });
      lineStyle.curve && line.curve(d3$$1.curveCardinal);
      layer.safeSelect('path.lc-line').attr('d', line(sData)).attrs({
        stroke: color,
        fill: 'none'
      });
    }

    var plotStyle = mytoolkit.extend({}, defaultOptions.plot, s.plotStyle || {});
    var currentPlotGroup;

    if (plotStyle.show) {
      currentPlotGroup = plotGroup.safeSelect("g.lc-plot-group-".concat(index));
      var plotSetting = mytoolkit.extend({}, defaultOptions.plot, s.plot || {});

      var _r = plotSetting.size / 2;

      currentPlotGroup.on('click', function () {
        if (mytoolkit.isSet(s.highlightAnimation) && !s.highlightAnimation) return;
        chart.highlightIndex = chart.highlightIndex === index ? null : index;
        emitter.emit('highlightChange', chart.highlightIndex);
      });
      currentPlotGroup.selectAll('g.lc-node-wrap').data(sData).join('g.lc-node-wrap').attr('transform', function (d, i) {
        return "translate(".concat(position(d, i, true), ", ").concat(position(d, i, false), ")");
      }).each(function (d, i) {
        var wrap = d3$$1.select(this);
        var bgCircle = wrap.safeSelect('circle.lc-bgcircle').attrs({
          r: _r * 3,
          stroke: 'none',
          fill: color,
          opacity: 0
        });
        var node = wrap.safeSelect('circle.lc-node');
        node.attrs({
          r: function r(d) {
            return d ? _r : 0;
          },
          fill: '#ffffff',
          stroke: color
        }).on('mouseover', function () {
          bgCircle.attr('opacity', defaultOptions.bgCircleOpacity);
        }).on('mouseout', function () {
          bgCircle.attr('opacity', 0);
        }).on('click', function () {
          emitter.emit('clickItem', {
            value: stacked ? rData[i] : d,
            seriesIndex: index,
            dataIndex: i,
            seriesData: s
          });
        });
      });
      emitter.on('axisChange', function (i) {
        var n = currentPlotGroup.selectAll(".lc-active-node");
        !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', _r);

        if (i !== null) {
          currentPlotGroup.selectAll('.lc-node').filter(function (d, idx) {
            return mytoolkit.isSet(d) && i === idx;
          }).classed('lc-active-node', true).transition().duration(defaultOptions.focusAniDuration).attr('r', _r * 1.5);
        }
      });
    } // ini clip path animation 


    var clipPath, clipPathId, clipRect;

    if (chart.firstRender) {
      clipPathId = 'lc-' + mytoolkit.randStr(8);
      clipPath = defs.safeSelect("clipPath#".concat(clipPathId));
      clipRect = clipPath.safeSelect('rect');
      layer.attr('clip-path', "url(#".concat(clipPathId, ")"));

      if (currentPlotGroup) {
        currentPlotGroup.attr('clip-path', "url(#".concat(clipPathId, ")"));
      }

      if (orient === 'h') {
        clipRect.attrs({
          x: 0,
          y: 0,
          height: ch,
          width: 0
        }).transition().duration(defaultOptions.enterAniDuration).ease(defaultOptions.enterAniEase).attr('width', cw).on('end', function () {
          layer.attr('clip-path', null);
          currentPlotGroup && currentPlotGroup.attr('clip-path', null);
          clipPath.remove();
        });
      } else {
        clipRect.attrs({
          x: 0,
          y: ch,
          height: 0,
          width: cw
        }).transition().duration(defaultOptions.enterAniDuration).ease(defaultOptions.enterAniEase).attr('height', ch).attr('y', 0).on('end', function () {
          layer.attr('clip-path', null);
          currentPlotGroup && currentPlotGroup.attr('clip-path', null);
          clipPath.remove();
        });
      }
    }

    layer.on('click', function () {
      if (mytoolkit.isSet(s.highlightAnimation) && !s.highlightAnimation) return;
      chart.highlightIndex = chart.highlightIndex === index ? null : index;
      emitter.emit('highlightChange', chart.highlightIndex);
    });

    if (mytoolkit.isUnset(s.highlightAnimation) || s.highlightAnimation) {
      emitter.on('highlightChange', function (ci) {
        if (ci === null || ci === index) {
          layer.transition().duration(defaultOptions.focusAniDuration).style('opacity', 1);

          if (currentPlotGroup) {
            currentPlotGroup.transition().duration(defaultOptions.focusAniDuration).style('opacity', 1);
          }
        } else {
          layer.transition().duration(defaultOptions.focusAniDuration).style('opacity', defaultOptions.highlightOtherOpacity);

          if (currentPlotGroup) {
            currentPlotGroup.transition().duration(defaultOptions.focusAniDuration).style('opacity', defaultOptions.highlightOtherOpacity);
          }
        }
      });
    }

    function position(d, i, isX) {
      var td, scale, bw;

      if (isX) {
        if (orient === 'h') {
          scale = scaleCategory;
          td = xAxis.data[i];
          bw = bandWidth;
        } else {
          scale = scaleValue;
          td = stacked ? d[1] : d;
          bw = 0;
        }
      } else {
        if (orient === 'v') {
          scale = scaleCategory;
          td = yAxis.data[i];
          bw = bandWidth;
        } else {
          scale = scaleValue;
          td = stacked ? d[1] : d;
          bw = 0;
        }
      }

      return scale(td) + bw / 2;
    }
  }

  function drawBar(chart, layer, s, index) {
    var emitter = chart.emitter,
        defaultOptions = chart.defaultOptions,
        d3$$1 = chart.d3,
        cw = chart.containerWidth,
        ch = chart.containerHeight,
        _chart$options = chart.options,
        grid = _chart$options.grid,
        xAxis = _chart$options.xAxis,
        yAxis = _chart$options.yAxis,
        _chart$sections = chart.sections,
        defs = _chart$sections.defs,
        series = _chart$sections.series,
        plotGroup = _chart$sections.plotGroup,
        scaleY = chart.scaleY,
        scaleX = chart.scaleX;
    console.log(s);
    var scaleCategory, scaleValue, orient, barWidth, barOffset;
    barWidth = s._barWidth;
    barOffset = s._barOffset;

    if (scaleX.bandwidth) {
      scaleCategory = scaleX;
      scaleValue = scaleY;
      orient = 'h';
    } else if (scaleY.bandwidth) {
      scaleCategory = scaleY;
      scaleValue = scaleX;
      orient = 'v';
    } else {
      scaleCategory = scaleX;
      scaleValue = scaleY;
      orient = 'h';
    }

    var bandWidth = scaleCategory && scaleCategory.bandwidth ? scaleCategory.bandwidth() : 0;
    var rData = s.data || [];
    var sData = rData = rData.map(function (item) {
      return item && item.value ? item.value : item;
    });
    var stacked = false;

    if (s.stackData) {
      stacked = true;
      sData = s.stackData;
    }

    var barStyle = mytoolkit.extend({}, defaultOptions.barStyle, s.barStyle || {});
    var barColor = drawGradient(chart, barStyle.color || null, defaultOptions.getColor(index));
    var bars = layer.selectAll('rect.lc-bar').data(sData).join('rect.lc-bar').attrs({
      x: function x(d, i) {
        if (orient === 'v') {
          return stacked ? scaleValue(d[0]) : grid.left;
        }

        return position(d, i, true) + barOffset;
      },
      y: function y(d, i) {
        if (orient === 'h') {
          return stacked ? scaleValue(d[0]) : ch - grid.bottom;
        }

        return position(d, i, false) + barOffset;
      },
      width: function width(d, i) {
        if (orient === 'h') {
          return barWidth;
        }

        return 0;
      },
      height: function height(d, i) {
        if (orient === 'v') {
          return barWidth;
        }

        return 0;
      },
      stroke: 'none',
      fill: barColor
    });

    if (orient === 'h') {
      bars.transition().duration(defaultOptions.enterAniDuration).ease(defaultOptions.enterAniEase).attr('height', function (d, i) {
        var y = position(d, i, false);
        return stacked ? scaleValue(d[0]) - y : ch - grid.bottom - y;
      }).attrTween('y', function (d, i) {
        var end = position(d, i, false);
        var start = stacked ? scaleValue(d[0]) : ch - grid.bottom;
        return d3$$1.interpolate(start, end);
      });
    } else {
      bars.transition().duration(defaultOptions.enterAniDuration).ease(defaultOptions.enterAniEase).attr('width', function (d, i) {
        var x = position(d, i, true);
        return stacked ? x - scaleValue(d[0]) : x - grid.left;
      });
    } // let plotStyle = extend({}, defaultOptions.plot, s.plotStyle || {})
    // let currentPlotGroup
    // if (plotStyle.show) {
    //   currentPlotGroup = plotGroup.safeSelect(`g.lc-plot-group-${index}`)
    //   let plotSetting = extend({}, defaultOptions.plot, s.plot || {})
    //   let r = plotSetting.size / 2
    //   currentPlotGroup.on('click', () => {
    //     if (isSet(s.highlightAnimation) && !s.highlightAnimation) return
    //     chart.highlightIndex = chart.highlightIndex === index ? null : index
    //     emitter.emit('highlightChange', chart.highlightIndex)
    //   })
    //   currentPlotGroup.selectAll('g.lc-node-wrap')
    //     .data(sData)
    //     .join('g.lc-node-wrap')
    //     .attr('transform', (d, i) => `translate(${position(d, i, true)}, ${position(d, i, false)})`)
    //     .each(function (d, i) {
    //       let wrap = d3.select(this)
    //       let bgCircle = wrap.safeSelect('circle.lc-bgcircle')
    //         .attrs({ r: r * 3, stroke: 'none', fill: color, opacity: 0 })
    //       let node = wrap.safeSelect('circle.lc-node')
    //       node.attrs({ r: d => d ? r : 0, fill: '#ffffff', stroke: color })
    //         .on('mouseover', () => {
    //           bgCircle
    //             .attr('opacity', defaultOptions.bgCircleOpacity)
    //         })
    //         .on('mouseout', () => {
    //           bgCircle
    //             .attr('opacity', 0)
    //         })
    //         .on('click', () => {
    //           emitter.emit('clickItem', {
    //             value: stacked ? rData[i] : d,
    //             seriesIndex: index,
    //             dataIndex: i,
    //             seriesData: s
    //           })
    //         })
    //     })
    //   emitter.on('axisChange', (i) => {
    //     let n = currentPlotGroup.selectAll(`.lc-active-node`)
    //     !n.empty() && n.classed('lc-active-node', false).transition().duration(defaultOptions.focusAniDuration).attr('r', r)
    //     if (i !== null) {
    //       currentPlotGroup.selectAll('.lc-node').filter((d, idx) => isSet(d) && i === idx)
    //         .classed('lc-active-node', true)
    //         .transition().duration(defaultOptions.focusAniDuration)
    //         .attr('r', r * 1.5)
    //     }
    //   })
    // }
    // layer.on('click', () => {
    //   if (isSet(s.highlightAnimation) && !s.highlightAnimation) return
    //   chart.highlightIndex = chart.highlightIndex === index ? null : index
    //   emitter.emit('highlightChange', chart.highlightIndex)
    // })
    // if (isUnset(s.highlightAnimation) || s.highlightAnimation) {
    //   emitter.on('highlightChange', (ci) => {
    //     if (ci === null || ci === index) {
    //       layer.transition()
    //         .duration(defaultOptions.focusAniDuration)
    //         .style('opacity', 1)
    //       if (currentPlotGroup) {
    //         currentPlotGroup.transition()
    //           .duration(defaultOptions.focusAniDuration)
    //           .style('opacity', 1)
    //       }
    //     } else {
    //       layer.transition()
    //         .duration(defaultOptions.focusAniDuration)
    //         .style('opacity', defaultOptions.highlightOtherOpacity)
    //       if (currentPlotGroup) {
    //         currentPlotGroup.transition()
    //           .duration(defaultOptions.focusAniDuration)
    //           .style('opacity', defaultOptions.highlightOtherOpacity)
    //       }
    //     }
    //   })
    // }


    function position(d, i, isX) {
      var td, scale;

      if (isX) {
        if (orient === 'h') {
          scale = scaleCategory;
          td = xAxis.data[i];
        } else {
          scale = scaleValue;
          td = stacked ? d[1] : d;
        }
      } else {
        if (orient === 'v') {
          scale = scaleCategory;
          td = yAxis.data[i];
        } else {
          scale = scaleValue;
          td = stacked ? d[1] : d;
        }
      }

      return scale(td);
    }
  }

  function drawPie(chart, layer, s, index) {
    var emitter = chart.emitter,
        defaultOptions = chart.defaultOptions,
        d3$$1 = chart.d3,
        cw = chart.containerWidth,
        ch = chart.containerHeight,
        cc = chart.containerCenter;
    var data = s.data;
    if (!data || !data.length) return;
    var focusAnimation = mytoolkit.isSet(s.focusAnimation) ? s.focusAnimation : true;
    var pieCenter = s.center || [0.5, 0.5];
    pieCenter = [cw * parsePercent(pieCenter[0]), ch * parsePercent(pieCenter[1])];
    var radius = s.radius || [0, 0.7];
    var innerRadius = Math.min(cw, ch) * parsePercent(radius[0]) * 0.5;
    var outerRadius = Math.min(cw, ch) * parsePercent(radius[1]) * 0.5;
    var arcs = d3$$1.pie()(data.map(function (item) {
      return item.value;
    }));
    var d3arc = d3$$1.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    layer.attr('transform', "translate(".concat(pieCenter[0], ", ").concat(pieCenter[1], ")"));
    var pieItems = layer.selectAll('path.lc-arc').data(arcs).join('path.lc-arc').attr('item-index', function (d, i) {
      return i;
    }).attr('fill', function (d, i) {
      var itemData = data[i];
      return drawGradient(chart, itemData.color, defaultOptions.getColor(i));
    }).on('click', function (d, i) {
      if (!mytoolkit.isSet(s.click) || s.click) {
        emitter.emit('clickItem', {
          value: d.data,
          seriesIndex: index,
          dataIndex: i,
          seriesData: s
        });
      }

      if (mytoolkit.isSet(s.clickHighlight) && !s.clickHighlight) return;
      var highlightIndex;

      if (i === chart.highlightIndex) {
        highlightIndex = null;
      } else {
        highlightIndex = i;
      }

      chart.highlightIndex = highlightIndex;
      emitter.emit('highlightChange', highlightIndex);
    }).on('mouseover', function (d, i) {
      if (!focusAnimation) return;
      var ele = d3$$1.select(this);
      var startOuter = outerRadius;
      var endOuter = outerRadius * defaultOptions.focusRate;
      ele.transition().duration(defaultOptions.focusAniDuration).ease(defaultOptions.focusPieEase).attrTween('d', function () {
        var d = arcs[i];
        var inter = d3$$1.interpolate(startOuter, endOuter);
        return function (t) {
          return d3$$1.arc().innerRadius(innerRadius).outerRadius(inter(t))(d);
        };
      });
    }).on('mouseout', function (d, i) {
      if (!focusAnimation) return;
      var ele = d3$$1.select(this);
      var startOuter = outerRadius * defaultOptions.focusRate;
      var endOuter = outerRadius;
      ele.transition().duration(defaultOptions.focusAniDuration).ease(defaultOptions.focusPieEase).attrTween('d', function () {
        var d = arcs[i];
        var inter = d3$$1.interpolate(startOuter, endOuter);
        return function (t) {
          return d3$$1.arc().innerRadius(innerRadius).outerRadius(inter(t))(d);
        };
      });
    });

    if (!mytoolkit.isSet(s.enterAnimation) || s.enterAnimation) {
      pieItems.transition().duration(defaultOptions.enterAniDuration).ease(defaultOptions.enterAniEase).attrTween('d', function (d, i) {
        var inter = d3$$1.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          return d3arc({
            startAngle: d.startAngle,
            endAngle: inter(t)
          });
        };
      });
    } else {
      pieItems.attr('d', d3arc);
    }

    if (!mytoolkit.isSet(s.clickHighlight) || s.clickHighlight) {
      emitter.on('highlightChange', function (i) {
        pieItems.each(function (d, idx) {
          var targetOpacity = i !== null ? i === idx ? 1 : defaultOptions.highlightOtherOpacity : 1;
          d3$$1.select(this).transition().duration(defaultOptions.focusAniDuration).style('opacity', targetOpacity);
        });
      });
    } // draw label 


    if (s.label && mytoolkit.isFunction(s.label.formatter)) {
      var label = layer.safeSelect('g.lc-pie-label');
      label.html(s.label.formatter(data));
    }
  }

  function drawLinePointer(chart, index) {
    var d3$$1 = chart.d3,
        defaultOptions = chart.defaultOptions,
        scaleX = chart.scaleX,
        scaleY = chart.scaleY,
        ch = chart.containerHeight,
        cw = chart.containerWidth,
        _chart$options = chart.options,
        xAxis = _chart$options.xAxis,
        yAxis = _chart$options.yAxis,
        grid = _chart$options.grid,
        linePointer = chart.sections.linePointer;
    var scaleCategory, orient;

    if (scaleX.bandwidth) {
      scaleCategory = scaleX;
      orient = 'h';
    } else if (scaleY.bandwidth) {
      scaleCategory = scaleY;
      orient = 'v';
    } else {
      scaleCategory = scaleX;
      orient = 'h';
    }

    var bandWidth = scaleCategory && scaleCategory.bandwidth ? scaleCategory.bandwidth() : 0;

    if (index === null) {
      linePointer.style('opacity', 0);
    } else {
      var x1, y1, x2, y2, cd;

      if (orient === 'h') {
        cd = getData(xAxis.data, index);
        x2 = x1 = scaleCategory(cd) + bandWidth * 0.5;
        y1 = grid.top;
        y2 = ch - grid.bottom;
      } else {
        cd = getData(yAxis.data, index);
        y1 = y2 = scaleCategory(cd) + bandWidth * 0.5;
        x1 = grid.left;
        x2 = cw - grid.right;
      }

      linePointer.style('opacity', 1).attrs({
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: '#aaa',
        'stroke-dasharray': defaultOptions.strokeDasharray,
        opacity: 1
      });
    }
  }

  function drawLegend(chart) {
    var d3$$1 = chart.d3,
        emitter = chart.emitter,
        defaultOptions = chart.defaultOptions,
        cw = chart.containerWidth,
        ch = chart.contianerHeight,
        _chart$options = chart.options,
        legend = _chart$options.legend,
        series = _chart$options.series,
        legendLayer = chart.sections.legend;
    var legendData = legend.data || [];
    var filteredSeries = series.filter(function (s) {
      return s.type === 'line' || s.type === 'bar';
    });

    if (!legendData.length) {
      legendData = filteredSeries.map(function (s, i) {
        return s.name || "series ".concat(1);
      });
    }

    if (!legendData.length) {
      return;
    } // prepare legend  


    legendData = legendData.map(function (l, i) {
      var matchSeries = series[i] || {};
      mytoolkit.isString(l) && (l = {
        name: l
      });
      return _objectSpread({
        icon: defaultOptions.legendIcon(matchSeries.type)
      }, l);
    }); // set legend layer invisiable 
    // legendLayer.style('opacity', 0)

    var fontSize = legend.fontSize;
    var lineHeight = legend.lineHeight;
    var iconSize = legend.iconSize;
    var fontWeight = legend.fontWeight;
    var legendWraps = [];
    legendLayer.selectAll('g.lc-legend-item-wrap').data(legendData).join('g.lc-legend-item-wrap').each(function (d, i) {
      var ele = d3$$1.select(this);
      var html = '',
          x = iconSize + 6;
      html += icon(d, i);

      if (d.icon === 'lineCircle') {
        x = iconSize * 1.8 + 6;
      }

      html += "<text x=".concat(x, " y=").concat(fontSize, " style=\"cursor:pointer;font-size: ").concat(fontSize, "px;font-weight: ").concat(fontWeight, ";\">").concat(d.name, "</text>");
      ele.html(html);

      var _ele$node$getBBox = ele.node().getBBox(),
          width = _ele$node$getBBox.width,
          height = _ele$node$getBBox.height;

      legendWraps[i] = {
        ele: ele,
        width: width,
        height: height
      };
    }).on('click', function (d, i) {
      chart.highlightIndex = i === chart.highlightIndex ? null : i;
      emitter.emit('highlightChange', chart.highlightIndex);
    }); // legend layout 

    var layoutX = legend.left + legend.padding;
    var layoutRight = cw - legend.right - legend.padding;
    var layoutWidth = cw - legend.right - legend.padding - layoutX;
    var penX,
        penY,
        leftSpace,
        rows = [[]],
        rowIndex = 0;
    penX = layoutX;
    penY = legend.top + lineHeight / 2;

    if (legend.layout === 'horizontal') {
      leftSpace = layoutWidth;

      for (var i = 0, l = legendWraps.length; i < l; i++) {
        var item = legendWraps[i];
        var row = rows[rowIndex];

        if (item.width <= leftSpace) {
          row.push(item);
          leftSpace -= item.width + legend.padding;
        } else {
          rowIndex++;
          row = rows[rowIndex] = [];
          row.push(item);
          leftSpace = layoutWidth;
        }
      }

      rows.forEach(function (row, rowIndex) {
        var right = legend.align === 'right';
        right && (penX = layoutRight);

        for (var _i = 0, _l = row.length; _i < _l; _i++) {
          var _item = void 0;

          if (right) {
            _item = row[_l - 1 - _i];
            penX -= _item.width + legend.padding;

            _item.ele.attr('transform', "translate(".concat(penX, ",").concat(penY, ")"));
          } else {
            _item = row[_i];

            _item.ele.attr('transform', "translate(".concat(penX, ",").concat(penY, ")"));

            penX += _item.width + legend.padding;
          }
        }

        penY += lineHeight;
      });
    } else {
      var maxItemWidth = Math.max.apply(this, legendWraps.map(function (l) {
        return l.width;
      }));
      legend.align === 'right' && (penX = layoutRight - maxItemWidth - legend.padding);

      for (var _i2 = 0, _l2 = legendWraps.length; _i2 < _l2; _i2++) {
        var _item2 = legendWraps[_i2];

        _item2.ele.attr('transform', "translate(".concat(penX, ",").concat(penY, ")"));

        penY += lineHeight;
      }
    }

    emitter.on('highlightChange', function (i) {
      legendWraps.forEach(function (l, k) {
        var targetOpacity = i !== null ? i == k ? 1 : defaultOptions.highlightOtherOpacity : 1;
        l.ele.style('opacity', targetOpacity);
      });
    });

    function icon(d, i) {
      var r = '';
      var iconColor = d.color || defaultOptions.getColor(i);

      switch (d.icon) {
        case 'lineCircle':
          r += "<path stroke-width=\"2\" stroke=\"".concat(iconColor, "\" d=\"M0,").concat((fontSize + 2) / 2, "L").concat(iconSize * 1.8, ",").concat((fontSize + 2) / 2, "\"/>");
          r += "<circle stroke-width=\"2\" stroke=\"".concat(iconColor, "\" fill=\"#ffffff\" cx=\"").concat(iconSize * 0.9, "\" cy=\"").concat((fontSize + 2) / 2, "\" r=\"").concat(iconSize / 2, "\"/>");
          return r;

        case 'rect':
          r += "<rect stroke=\"none\" fill=\"".concat(iconColor, "\" y=\"").concat(iconSize + 1 - fontSize, "\" width=\"").concat(iconSize, "\" height=\"").concat(iconSize, "\"/>");
          return r;

        case 'circle':
          r += "<circle stroke=\"none\" fill=\"".concat(iconColor, "\" cy=\"").concat((fontSize + 2) / 2, "\" r=\"").concat(iconSize / 2, "\"/>");
          return r;

        default:
          return r;
      }
    }
  }

  var emitter =
  /*#__PURE__*/
  function () {
    function emitter() {
      _classCallCheck(this, emitter);

      this.listeners = {};
    }

    _createClass(emitter, [{
      key: "on",
      value: function on(type, func) {
        var listenersByType = this.listeners[type];
        !listenersByType && (this.listeners[type] = listenersByType = []); // find previous func with same id 

        if (!listenersByType.find(function (l) {
          return l === func;
        })) {
          listenersByType.push(func);
        }
      }
    }, {
      key: "off",
      value: function off(type, func) {
        var listenersByType = this.listeners[type];

        if (listenersByType && mytoolkit.isFunction(func)) {
          listenersByType = listenersByType.filter(function (l) {
            return l !== func;
          });
        }
      }
    }, {
      key: "emit",
      value: function emit(type) {
        for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          arg[_key - 1] = arguments[_key];
        }

        var listenersByType = this.listeners[type];

        if (listenersByType) {
          listenersByType.forEach(function (l) {
            l.apply(void 0, arg);
          });
        }
      }
    }, {
      key: "clear",
      value: function clear(type) {
        if (mytoolkit.isUnset(type)) {
          this.listeners = {};
          return;
        }

        var listenersByType = this.listeners[type];

        if (listenersByType && listenersByType.length) {
          this.listeners[type] = [];
        }
      }
    }]);

    return emitter;
  }();

  d3Augment(d3);

  var chart =
  /*#__PURE__*/
  function () {
    function chart(selector, options$$1) {
      _classCallCheck(this, chart);

      //console.log(selector, options)
      //this.bind(['onMousemove'])
      this.d3 = d3;
      this.defaultOptions = options;
      this.emitter = new emitter();
      this.container = d3.select(selector);
      this.options = deepExtend(options(), options$$1);
      this.previousOptions = null;
      this.sections = {};
      this.maxValue = 0;
      this.firstRender = true;
      var resize = this.resize.bind(this);
      this.resize = mytoolkit.debounce(resize, 100);
      this.init();
      this.drawChart();
    }

    _createClass(chart, [{
      key: "drawChart",
      value: function drawChart() {
        this.emitter.clear('highlightChange');
        axisX(this);
        axisY(this);
        this.calculateBarOffset();
        this.drawSeries();
        drawLegend(this);
        this.firstRender = false;
      }
    }, {
      key: "drawSeries",
      value: function drawSeries() {
        var chart = this;
        var series = chart.options.series,
            seriesGroup = chart.sections.series;
        seriesGroup.selectAll('g.lc-layer').data(series).join(function (enter) {
          return enter.append('g.lc-layer');
        }, function (update) {
          return update;
        }, function (exit) {
          return exit.remove();
        }).each(function (s, i) {
          var layer = d3.select(this);
          layer.classed("lc-layer-".concat(i), true);

          switch (s.type) {
            case 'line':
              drawLine(chart, layer, s, i);
              break;

            case 'bar':
              drawBar(chart, layer, s, i);
              break;

            case 'pie':
              drawPie(chart, layer, s, i);

            default:
          }
        });
      }
    }, {
      key: "resize",
      value: function resize() {
        this.figureGeometry();
        this.drawChart();
      }
    }, {
      key: "figureGeometry",
      value: function figureGeometry() {
        var _getBoundingRect = getBoundingRect(this.container.node()),
            width = _getBoundingRect.width,
            height = _getBoundingRect.height;

        var cw = this.containerWidth = width;
        var ch = this.containerHeight = height;
        this.containerCenter = [cw / 2, ch / 2];
        this.paper.attrs({
          width: cw,
          height: ch
        });
      }
    }, {
      key: "calculateStackData",
      value: function calculateStackData() {
        var _this$options$series = this.options.series,
            series = _this$options$series === void 0 ? [] : _this$options$series;
        var types = ['line', 'bar'];
        types.forEach(function (type) {
          var chartsByType = series.filter(function (s) {
            return s.type === type;
          });
          var chartsByStack = chartsByType.filter(function (s) {
            return !!s.stack;
          });
          if (!chartsByStack.length) return;
          var stackGroups = mytoolkit.groupBy(chartsByStack, 'stack');
          Object.keys(stackGroups).forEach(function (k) {
            var group = stackGroups[k];
            var stackedData = [];
            group.forEach(function (item, idx) {
              if (stackedData.length === 0) {
                stackedData = Array.from({
                  length: item.data.length
                }).map(function () {
                  return 0;
                });
              }

              var itemStackData = Array.from({
                length: item.data.length
              }).map(function () {
                return [];
              });
              item.data.forEach(function (d, i) {
                d = mytoolkit.isSet(d) ? d.value ? d.value : d : 0;
                var isd = itemStackData[i];
                isd[0] = stackedData[i];
                isd[1] = stackedData[i] + d;
              });
              item.stackData = itemStackData;
              stackedData = itemStackData.map(function (item) {
                return item[1];
              });
            });
          });
        }); // set bar index 

        var barSeries = series.filter(function (s) {
          return s.type === 'bar';
        });
        var sgx = -1,
            stackName;

        for (var i = 0, l = barSeries.length; i < l; i++) {
          var s = barSeries[i];

          if (!mytoolkit.isSet(s.stack) || s.stack === '') {
            sgx++;
          } else if (s.stack !== stackName) {
            sgx++;
            stackName = s.stack;
          }

          s.stackGroupIndex = sgx;
        }

        barSeries.forEach(function (s) {
          s.stackGroupLength = sgx + 1;
        });
      }
    }, {
      key: "calculateBarOffset",
      value: function calculateBarOffset() {
        var defaultOptions = this.defaultOptions,
            d3$$1 = this.d3,
            series = this.options.series,
            scaleY = this.scaleY,
            scaleX = this.scaleX;
        var barSeries = series.filter(function (s) {
          return s.type === 'bar';
        });
        if (!barSeries.length) return;
        var scaleCategory, bandWidth;

        if (scaleX.bandwidth) {
          scaleCategory = scaleX;
        } else if (scaleY.bandwidth) {
          scaleCategory = scaleY;
        } else {
          // to do: dealing with charts without category for both xAxis and yAxis
          return;
        }

        bandWidth = scaleCategory.bandwidth();
        var b,
            groupIdx = -1,
            expectedBarWidth,
            groupLength,
            barWidth,
            barMinWidth,
            barMaxWidth,
            cache = [];
        groupLength = barSeries[0]['stackGroupLength'];
        expectedBarWidth = Math.max(1, bandWidth / groupLength - 8);

        for (var i = 0, l = barSeries.length; i < l; i++) {
          b = barSeries[i];

          if (b.stackGroupIndex > groupIdx) {
            if (b.barWidth) {
              cache.push(b.barWidth);
              break;
            }

            barMinWidth = b.barMinWidth || 0;
            barMaxWidth = b.barMaxWidth || expectedBarWidth;
            barWidth = Math.min(Math.max(barMinWidth, expectedBarWidth), barMaxWidth);
            cache.push(barWidth);
            groupIdx++;
          }
        }

        var space = Math.max(0, bandWidth - cache.reduce(function (a, b) {
          return a + b;
        })) / (groupLength + 1);
        barSeries.forEach(function (b) {
          var gIdx = b.stackGroupIndex;
          b._barOffset = space * (gIdx + 1) + cache.slice(0, gIdx).reduce(function (a, b) {
            return a + b;
          }, 0);
          b._barWidth = cache[gIdx];
        }); //console.log(barSeries, expectedBarWidth)
      }
    }, {
      key: "calculateMaxValue",
      value: function calculateMaxValue() {
        var _this = this;

        var _this$options = this.options,
            xAxis = _this$options.xAxis,
            yAxis = _this$options.yAxis,
            series = _this$options.series;

        if (xAxis.type === 'value' && xAxis.max) {
          this.maxValue = xAxis.max;
          this.maxValueFixed = true;
          return;
        }

        if (yAxis.type === 'value' && yAxis.max) {
          this.maxValue = yAxis.max;
          this.maxValueFixed = true;
          return;
        }

        var sArray = series.filter(function (s) {
          return s.type === 'bar' || s.type === 'line';
        });
        var maxValue = 0;
        sArray.forEach(function (s) {
          var d = s.data || [];

          if (s.stackData) {
            d = s.stackData.map(function (item) {
              return item[1];
            });
          }

          d = d.map(function (item) {
            return item && item.value ? item.value : item;
          });
          var max = Math.max.apply(_this, d);
          maxValue = Math.max(maxValue, max);
        });
        this.maxValue = maxValue;
        this.maxValueFixed = false;
      }
    }, {
      key: "init",
      value: function init() {
        var _this2 = this;

        if (!this.container) return;
        if (this.container.empty && this.container.empty()) return;
        var chart = this;
        this.highlightIndex = null;
        this.paper = this.container.append('svg.lc-root');
        this.figureGeometry();
        this.calculateStackData();
        this.calculateMaxValue();
        this.paper.on('mousemove', function () {
          chart.__onMousemove();
        });
        this.sections.desc = this.paper.append('desc');
        this.sections.defs = this.paper.append('defs');
        this.sections.axisY = this.paper.append('g.lc-axis-y');
        this.sections.shadowPointer = this.paper.append('rect.lc-shadow-pointer');
        this.sections.scrollXView = this.paper.append('g.lc-scroll-x-view');
        this.sections.axisX = this.sections.scrollXView.append('g.lc-axis-x');
        this.sections.series = this.sections.scrollXView.append('g.lc-series');
        this.sections.linePointer = this.sections.scrollXView.append('line.lc-line-pointer');
        this.sections.plotGroup = this.sections.scrollXView.append('g.lc-plot-group');
        this.sections.legend = this.paper.append('g.lc-legend');
        this.sections.labels = this.paper.append('g.lc-labels');
        this.sections.title = this.paper.append('text.lc-title');
        this.sections.subtitle = this.paper.append('text.lc-subtitle');
        this.sections.tooltip = this.paper.append('g.lc-tooltip');
        this.emitter.on('axisChange', function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          drawLinePointer.apply(void 0, [_this2].concat(args));
        });
      }
    }, {
      key: "__onMousemove",
      value: function __onMousemove() {
        var cw = this.containerWidth,
            ch = this.containerHeight,
            grid = this.options.grid,
            emitter$$1 = this.emitter,
            scaleX = this.scaleX,
            scaleY = this.scaleY,
            activeCategroryIndex = this.activeCategroryIndex;
        if (!scaleX || !scaleY) return;
        var scaleCategory, orient;

        if (scaleX.bandwidth) {
          scaleCategory = scaleX;
          orient = 'h';
        } else if (scaleY.bandwidth) {
          scaleCategory = scaleY;
          orient = 'v';
        }

        if (!scaleCategory) return;
        var _d3$event = d3.event,
            x = _d3$event.offsetX,
            y = _d3$event.offsetY;
        var gridBound = [[grid.left, grid.top], [cw - grid.right, ch - grid.bottom]];
        var bandWidth = scaleCategory.bandwidth();

        if (isInBound(gridBound, x, y)) {
          var i, l, scaleRange;
          scaleRange = scaleCategory.range();
          l = Math.round(Math.abs(scaleRange[0] - scaleRange[1]) / bandWidth);

          if (orient === 'h') {
            i = Math.ceil((x - grid.left) / bandWidth) - 1;
          } else {
            i = Math.floor((y - grid.bottom) / bandWidth) - 1;
          }

          i = orient === 'v' ? l - i - 1 : i;
          i = Math.max(0, i);

          if (i !== activeCategroryIndex) {
            this.activeCategroryIndex = i;
            emitter$$1.emit('axisChange', i);
          }
        } else {
          if (activeCategroryIndex !== null) {
            this.activeCategroryIndex = null;
            emitter$$1.emit('axisChange', null);
          }
        }
      } // bind(names) {
      //   if (isArray(names)) {
      //     names.forEach(n => {
      //       console.log(this, this[n])
      //       isFunction(this[n]) && this[n].bind(this)
      //     })
      //   }
      // }

    }]);

    return chart;
  }();

  function leecharts(selector, options$$1) {
    return new chart(selector, options$$1);
  }

  return leecharts;

})));
