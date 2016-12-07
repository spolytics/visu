
import {select} from 'd3-selection'
import {axisBottom, axisLeft} from 'd3-axis'
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale'
import {keys, values} from 'd3-collection'
import {range, max} from 'd3-array'

const defaults = {

  target: '#chart',

  width: 640,

  height: 480,

  margin: {
    top: 10,
    right: 10,
    bottom: 30,
    left: 70
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
      .rangeRound([0, this.w])
      .padding(0.1)

    this.x1 = scaleBand()

    this.y = scaleLinear()
      .range([this.h, 0])

    this.xAxis = axisBottom(this.x0)

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`)

    this.yAxis = axisLeft(this.y)

    this.chart.append('g')
      .attr('class', 'y axis')

    this.color = scaleOrdinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])
  }

  render () {
    const data = [
      {
        'Fuzhou': [2704659, 4499890, 2159981, 3853788, 10604510, 8819342, 4114496]
      },
      {
        'Klagenfurt': [2027307, 3277946, 1420518, 2454721, 7017731, 5656528, 2472223]
      },
      {
        'Rio': [1208495, 2141490, 1058031, 1999120, 5355235, 5120254, 2607672]
      },
      {
        'Gstaad': [1140516, 1938695, 925060, 1607297, 4782119, 4746856, 3187797]
      },
      {
        'Hamburg': [894368, 1558919, 725973, 1311479, 3596343, 3239173, 1575308]
      },
      {
        'Berlin': [737462, 1345341, 679201, 1203944, 3157759, 3414001, 1910571]
      }
    ]

    const keyNames = data.map(d => keys(d))

    this.x0
      .domain(keyNames)

    this.chart.select('.x.axis')
      .call(this.xAxis)

    this.x1
      .domain(range(0, 7))
      .rangeRound([0, this.x0.bandwidth()])

    this.y.domain([0, max(data, function (c) {
      return max(values(c)[0])
    })])

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
  }

}
