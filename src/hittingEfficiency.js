
import {select} from 'd3-selection'
import {scaleBand, scaleLinear, scaleOrdinal, schemeCategory20c} from 'd3-scale'
import {axisBottom, axisLeft} from 'd3-axis'
import {format} from 'd3-format'
import {color} from 'd3-color'

const defaults = {

  target: '#chart',

  width: 640,

  height: 480,

  margin: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 40
  },

  mouseover: () => {},
  mouseout: () => {}

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

    this.color = scaleOrdinal(schemeCategory20c)
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

  renderChart (data) {
    const {x, y, chart, h, mouseover, mouseout} = this

    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', (d, i) => `bar bar--${i}`)
      .style('fill', () => this.color(0))
      // save color as backup for blur event
      .attr('data-fill', () => this.color(0))
      .attr('x', d => x(d.desc))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => h - y(d.value))
      .on('mouseover', (d, i, n) => {
        this.focus(i)
        mouseover(d, i, n)
      })
      .on('mouseout', (d, i, n) => {
        this.blur(i)
        mouseout(d, i, n)
      })
  }

  render (data) {
    const {x} = this

    // update x scale
    x.domain(data.map(d => d.desc))

    this.renderGrid()
    this.renderAxis()
    this.renderChart(data)
  }

  focus (index) {
    this.chart.select(`.bar.bar--${index}`)
      .style('fill', d => color(this.color(0)).brighter(0.5).toString())
  }

  blur (index) {
    this.chart.select(`.bar.bar--${index}`)
      .style('fill', function () { return select(this).attr('data-fill') })
  }
}
