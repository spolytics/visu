
import {select} from 'd3-selection'
// import {axisBottom, axisLeft} from 'd3-axis'
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale'
import {keys} from 'd3-collection'
import {max} from 'd3-array'

const defaults = {

  target: '#chart',

  width: 640,

  height: 480,

  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }

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
      .rangeRound([0, width])
      .padding(0.1)

    this.x1 = scaleBand()
      .rangeRound([0, width])

    this.y = scaleLinear()
      .range([height, 0])

    // const xAxis = axisBottom(this.x0)

    // const yAxis = axisLeft(this.y)

    this.color = scaleOrdinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])
  }

  render () {
    const raw = '[{"State":"CA","Under 5 Years":"2704659","5 to 13 Years":"4499890","14 to 17 Years":"2159981","18 to 24 Years":"3853788","25 to 44 Years":"10604510","45 to 64 Years":"8819342","65 Years and Over":"4114496"},{"State":"TX","Under 5 Years":"2027307","5 to 13 Years":"3277946","14 to 17 Years":"1420518","18 to 24 Years":"2454721","25 to 44 Years":"7017731","45 to 64 Years":"5656528","65 Years and Over":"2472223"},{"State":"NY","Under 5 Years":"1208495","5 to 13 Years":"2141490","14 to 17 Years":"1058031","18 to 24 Years":"1999120","25 to 44 Years":"5355235","45 to 64 Years":"5120254","65 Years and Over":"2607672"},{"State":"FL","Under 5 Years":"1140516","5 to 13 Years":"1938695","14 to 17 Years":"925060","18 to 24 Years":"1607297","25 to 44 Years":"4782119","45 to 64 Years":"4746856","65 Years and Over":"3187797"},{"State":"IL","Under 5 Years":"894368","5 to 13 Years":"1558919","14 to 17 Years":"725973","18 to 24 Years":"1311479","25 to 44 Years":"3596343","45 to 64 Years":"3239173","65 Years and Over":"1575308"},{"State":"PA","Under 5 Years":"737462","5 to 13 Years":"1345341","14 to 17 Years":"679201","18 to 24 Years":"1203944","25 to 44 Years":"3157759","45 to 64 Years":"3414001","65 Years and Over":"1910571"}]'

    const data = JSON.parse(raw)

    var ageNames = keys(data[0]).filter(key => key !== 'State')

    data.forEach(function (d) {
      d.ages = ageNames.map(function (name) {
        return {
          name: name,
          value: +d[name]
        }
      })
    })

    this.x0.domain(data.map(d => d.State))

    this.x1.domain(ageNames).range([0, this.x0.bandwidth()])
    this.y.domain([0, max(data, function (c) {
      return max(c.ages, function (d) {
        return d.value
      })
    })])

    const state = this.chart.selectAll('.state')
      .data(data)
      .enter().append('g')
      .attr('class', 'state')
      .attr('transform', d => `translate(${this.x0(d.State)}, 0)`)

    state.selectAll('rect')
      .data(d => d.ages)
      .enter()
      .append('rect')
      .attr('width', this.x1.bandwidth())
      .attr('x', d => this.x1(d.name))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.h - this.y(d.value))
      .style('fill', d => this.color(d.name))
  }

}
