
import {select} from 'd3-selection'
import {axisBottom, axisLeft} from 'd3-axis'
import {scaleBand, scaleLinear, scaleOrdinal, schemeCategory20c} from 'd3-scale'
import {keys} from 'd3-collection'
import {range} from 'd3-array'

const defaults = {

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
  maxSetCount: 3

}

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default class GroupedBarChart {

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

    this.x0 = scaleBand()
      .rangeRound([0, this.w])
      .padding(0.4)

    this.x1 = scaleBand()

    this.y = scaleLinear()
      .range([this.h, 0])
      .domain([0, 1])

    this.xAxis = axisBottom(this.x0)

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`)

    this.yAxis = axisLeft(this.y)

    this.chart.append('g')
      .attr('class', 'y axis')

    this.color = scaleOrdinal(schemeCategory20c)
  }

  render (data) {
    const {maxSetCount} = this

    const keyNames = data.map(d => keys(d))

    this.x0
      .domain(keyNames)

    this.chart.select('.x.axis')
      .call(this.xAxis)

    this.x1
      .domain(range(maxSetCount))
      .rangeRound([0, this.x0.bandwidth()])

    this.chart.select('.y.axis')
      .call(this.yAxis)

    const state = this.chart.selectAll('.state')
      .data(data)
      .enter().append('g')
      .attr('class', 'state')
      .attr('transform', d => `translate(${this.x0(keys(d))}, 0)`)

    state.selectAll('rect')
      .data(d => d[keys(d)])
      .enter()
      .append('rect')
      .attr('width', this.x1.bandwidth())
      .attr('x', (d, i) => this.x1(i))
      .attr('y', d => this.y(d))
      .attr('height', d => this.h - this.y(d))
      .style('fill', (d, i) => this.color(i))

    const legend = this.chart.selectAll('.legend')
      .data(this.x1.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legend.append('rect')
      .attr('x', this.w - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', this.color)

    legend.append('text')
      .attr('x', this.w - 24)
      .attr('y', 9)
      // move text a wee bit down since we do not have a letters like q or y
      // .attr('dy', '0.1em')
      .style('text-anchor', 'end')
      .style('alignment-baseline', 'middle')
      .text(d => `${ordinal(d + 1)} set`)
  }

}
