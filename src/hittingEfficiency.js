
import {select} from 'd3-selection'
import {scaleBand, scaleLinear} from 'd3-scale'
import {axisBottom, axisLeft} from 'd3-axis'
import {format} from 'd3-format'
import {interpolateHcl} from 'd3-interpolate'

const defaults = {

  target: '#chart',

  width: 640,

  height: 480,

  margin: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 40
  }

}

export default class HittingEfficiency {

  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  init () {
    const {target, width, height, margin} = this
    this.w = width - margin.left - margin.right
    this.h = height - margin.top - margin.bottom

    this.chart = select(target)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.x = scaleBand()
      .rangeRound([0, this.w])
      .padding(0.25)

    this.y = scaleLinear()
      .domain([0, 1])
      .rangeRound([this.h, 0])

    this.xAxis = axisBottom(this.x)

    this.yAxis = axisLeft(this.y)
      .tickFormat(format('.3f'))
      .ticks(5)

    this.chart.append('g')
      .attr('class', 'y grid')

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`)

    this.chart.append('g')
      .attr('class', 'y axis')
  }

  renderGrid () {
    this.chart
      .selectAll('.y.grid')
      .call(
        axisLeft(this.y)
          .ticks(5)
          .tickSizeInner(-this.w)
          .tickSizeOuter(0)
          .tickFormat('')
      )
  }

  renderAxis () {
    const {chart, xAxis, yAxis} = this

    chart.select('.x.axis')
      .call(xAxis)

    chart.select('.y.axis')
      .call(yAxis)
  }

  renderLabels (data) {
    const {chart, x, y} = this

    chart.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('x', d => x(d.desc) + (x.bandwidth() / 2))
      .attr('y', d => y(d.value))
      .attr('dy', '20px')
      .text(d => format('.3f')(d.value))
  }

  renderChart (data) {
    const {x, y, chart, h} = this

    // http://uigradients.com/#EasyMed
    const color = scaleLinear()
      .domain([0, 1])
      .range(['#DCE35B', '#45B649'])
      .interpolate(interpolateHcl)

    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .style('fill', d => color(d.value))
      .attr('x', d => x(d.desc))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => h - y(d.value))
  }

  render (data) {
    const {x} = this

    // update x scale
    x.domain(data.map(d => d.desc))

    this.renderGrid()
    this.renderAxis()
    this.renderChart(data)
    this.renderLabels(data)
  }

}
