'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Selection = require('d3-selection');

var _d3Scale = require('d3-scale');

var _d3Axis = require('d3-axis');

var _d3Format = require('d3-format');

var _d3Color = require('d3-color');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {

  target: '#chart',

  width: 640,

  height: 480,

  margin: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 40
  },

  mouseover: function mouseover() {},
  mouseout: function mouseout() {}

};

var HittingEfficiency = function () {
  function HittingEfficiency(config) {
    _classCallCheck(this, HittingEfficiency);

    Object.assign(this, defaults, config);
    this.init();
  }

  _createClass(HittingEfficiency, [{
    key: 'init',
    value: function init() {
      var target = this.target,
          width = this.width,
          height = this.height,
          margin = this.margin;

      this.w = width - margin.left - margin.right;
      this.h = height - margin.top - margin.bottom;

      this.chart = (0, _d3Selection.select)(target).attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      this.x = (0, _d3Scale.scaleBand)().rangeRound([0, this.w]).padding(0.25);

      this.y = (0, _d3Scale.scaleLinear)().domain([0, 1]).rangeRound([this.h, 0]);

      this.xAxis = (0, _d3Axis.axisBottom)(this.x);

      this.yAxis = (0, _d3Axis.axisLeft)(this.y).tickFormat((0, _d3Format.format)('.3f')).ticks(5);

      this.chart.append('g').attr('class', 'y grid');

      this.chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + this.h + ')');

      this.chart.append('g').attr('class', 'y axis');

      this.color = (0, _d3Scale.scaleOrdinal)(_d3Scale.schemeCategory20c);
    }
  }, {
    key: 'renderGrid',
    value: function renderGrid() {
      this.chart.selectAll('.y.grid').call((0, _d3Axis.axisLeft)(this.y).ticks(5).tickSizeInner(-this.w).tickSizeOuter(0).tickFormat(''));
    }
  }, {
    key: 'renderAxis',
    value: function renderAxis() {
      var chart = this.chart,
          xAxis = this.xAxis,
          yAxis = this.yAxis;


      chart.select('.x.axis').call(xAxis);

      chart.select('.y.axis').call(yAxis);
    }
  }, {
    key: 'renderChart',
    value: function renderChart(data) {
      var _this = this;

      var x = this.x,
          y = this.y,
          chart = this.chart,
          h = this.h,
          mouseover = this.mouseover,
          mouseout = this.mouseout;


      chart.selectAll('.bar').data(data).enter().append('rect').attr('class', function (d, i) {
        return 'bar bar--' + i;
      }).style('fill', function () {
        return _this.color(0);
      })
      // save color as backup for blur event
      .attr('data-fill', function () {
        return _this.color(0);
      }).attr('x', function (d) {
        return x(d.desc);
      }).attr('y', function (d) {
        return y(d.value);
      }).attr('width', x.bandwidth()).attr('height', function (d) {
        return h - y(d.value);
      }).on('mouseover', function (d, i, n) {
        _this.focus(i);
        mouseover(d, i, n);
      }).on('mouseout', function (d, i, n) {
        _this.blur(i);
        mouseout(d, i, n);
      });
    }
  }, {
    key: 'render',
    value: function render(data) {
      var x = this.x;

      // update x scale

      x.domain(data.map(function (d) {
        return d.desc;
      }));

      this.renderGrid();
      this.renderAxis();
      this.renderChart(data);
    }
  }, {
    key: 'focus',
    value: function focus(index) {
      var _this2 = this;

      this.chart.select('.bar.bar--' + index).style('fill', function (d) {
        return (0, _d3Color.color)(_this2.color(0)).brighter(0.5).toString();
      });
    }
  }, {
    key: 'blur',
    value: function blur(index) {
      this.chart.select('.bar.bar--' + index).style('fill', function () {
        return (0, _d3Selection.select)(this).attr('data-fill');
      });
    }
  }]);

  return HittingEfficiency;
}();

exports.default = HittingEfficiency;