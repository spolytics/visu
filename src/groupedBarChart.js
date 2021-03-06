
import {select} from 'd3-selection'
import {axisBottom, axisLeft} from 'd3-axis'
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale'
import {keys} from 'd3-collection'
import {range} from 'd3-array'
import {color} from 'd3-color'
import {schemeCategory10} from 'd3-scale-chromatic'

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
  maxSetCount: 3,

  mouseover: () => {},
  mouseout: () => {}

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

    this.color = scaleOrdinal(schemeCategory10)
  }

  render (data) {
    const {maxSetCount, mouseover, mouseout} = this

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
      .attr('class', (d, i) => `state state--${i}`)
      .attr('transform', d => `translate(${this.x0(keys(d))}, 0)`)
      .on('mouseover', (d, i, n) => {
        this.focus(i)
        mouseover(d, i, n)
      })
      .on('mouseout', (d, i, n) => {
        this.blur(i)
        mouseout(d, i, n)
      })

    state.selectAll('rect')
      .data(d => d[keys(d)])
      .enter()
      .append('rect')
      .attr('data-fill', (d, i) => this.color(i))
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

  focus (index) {
    this.chart
      .select(`.state.state--${index}`)
      .selectAll('rect')
      .style('fill', (d, i) => color(this.color(i)).brighter(0.5).toString())
  }

  blur (index) {
    this.chart
      .select(`.state.state--${index}`)
      .selectAll('rect')
      .style('fill', function () { return select(this).attr('data-fill') })
  }

  resize (width) {
    const {chart, target, margin, x0, xAxis, x1} = this

    select(target)
      .attr('width', width)

    const w = width - margin.left - margin.right

    x0.rangeRound([0, w])

    x1.rangeRound([0, x0.bandwidth()])

    chart.select('.x.axis')
      .call(xAxis)

    const state = chart.selectAll('.state')
      .attr('transform', d => `translate(${x0(keys(d))}, 0)`)

    state.selectAll('rect')
      .attr('width', x1.bandwidth())
      .attr('x', (d, i) => x1(i))

    const legend = chart.selectAll('.legend')

    legend.select('rect')
      .attr('x', w - 18)

    legend.select('text')
      .attr('x', w - 24)
  }
}
