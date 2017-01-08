'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Selection = require('d3-selection');

var _d3Axis = require('d3-axis');

var _d3Scale = require('d3-scale');

var _d3Collection = require('d3-collection');

var _d3Array = require('d3-array');

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
    left: 30
  },

  // max number of sets
  // e.g. best of 5
  maxSetCount: 3,

  mouseover: function mouseover() {},
  mouseout: function mouseout() {}

};

var ordinal = function ordinal(n) {
  var s = ['th', 'st', 'nd', 'rd'];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

var GroupedBarChart = function () {
  function GroupedBarChart(config) {
    _classCallCheck(this, GroupedBarChart);

    Object.assign(this, defaults, config);
    this.init();
  }

  _createClass(GroupedBarChart, [{
    key: 'init',
    value: function init() {
      var target = this.target,
          width = this.width,
          height = this.height,
          margin = this.margin;

      this.w = width - margin.left - margin.right;
      this.h = height - margin.top - margin.bottom;

      this.chart = (0, _d3Selection.select)(target).attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      this.x0 = (0, _d3Scale.scaleBand)().rangeRound([0, this.w]).padding(0.4);

      this.x1 = (0, _d3Scale.scaleBand)();

      this.y = (0, _d3Scale.scaleLinear)().range([this.h, 0]).domain([0, 1]);

      this.xAxis = (0, _d3Axis.axisBottom)(this.x0);

      this.chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + this.h + ')');

      this.yAxis = (0, _d3Axis.axisLeft)(this.y);

      this.chart.append('g').attr('class', 'y axis');

      this.color = (0, _d3Scale.scaleOrdinal)(_d3Scale.schemeCategory20c);
    }
  }, {
    key: 'render',
    value: function render(data) {
      var _this = this;

      var maxSetCount = this.maxSetCount,
          mouseover = this.mouseover,
          mouseout = this.mouseout;


      var keyNames = data.map(function (d) {
        return (0, _d3Collection.keys)(d);
      });

      this.x0.domain(keyNames);

      this.chart.select('.x.axis').call(this.xAxis);

      this.x1.domain((0, _d3Array.range)(maxSetCount)).rangeRound([0, this.x0.bandwidth()]);

      this.chart.select('.y.axis').call(this.yAxis);

      var state = this.chart.selectAll('.state').data(data).enter().append('g').attr('class', function (d, i) {
        return 'state state--' + i;
      }).attr('transform', function (d) {
        return 'translate(' + _this.x0((0, _d3Collection.keys)(d)) + ', 0)';
      }).on('mouseover', function (d, i, n) {
        _this.focus(i);
        mouseover(d, i, n);
      }).on('mouseout', function (d, i, n) {
        _this.blur(i);
        mouseout(d, i, n);
      });

      state.selectAll('rect').data(function (d) {
        return d[(0, _d3Collection.keys)(d)];
      }).enter().append('rect').attr('data-fill', function (d, i) {
        return _this.color(i);
      }).attr('width', this.x1.bandwidth()).attr('x', function (d, i) {
        return _this.x1(i);
      }).attr('y', function (d) {
        return _this.y(d);
      }).attr('height', function (d) {
        return _this.h - _this.y(d);
      }).style('fill', function (d, i) {
        return _this.color(i);
      });

      var legend = this.chart.selectAll('.legend').data(this.x1.domain()).enter().append('g').attr('class', 'legend').attr('transform', function (d, i) {
        return 'translate(0, ' + i * 20 + ')';
      });

      legend.append('rect').attr('x', this.w - 18).attr('width', 18).attr('height', 18).style('fill', this.color);

      legend.append('text').attr('x', this.w - 24).attr('y', 9)
      // move text a wee bit down since we do not have a letters like q or y
      // .attr('dy', '0.1em')
      .style('text-anchor', 'end').style('alignment-baseline', 'middle').text(function (d) {
        return ordinal(d + 1) + ' set';
      });
    }
  }, {
    key: 'focus',
    value: function focus(index) {
      var _this2 = this;

      this.chart.select('.state.state--' + index).selectAll('rect').style('fill', function (d, i) {
        return (0, _d3Color.color)(_this2.color(i)).brighter(0.5).toString();
      });
    }
  }, {
    key: 'blur',
    value: function blur(index) {
      this.chart.select('.state.state--' + index).selectAll('rect').style('fill', function () {
        return (0, _d3Selection.select)(this).attr('data-fill');
      });
    }
  }]);

  return GroupedBarChart;
}();

exports.default = GroupedBarChart;