
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
      // .rangeRound([0, width])

    this.y = scaleLinear()
      .range([height, 0])

    // const xAxis = axisBottom(this.x0)

    // const yAxis = axisLeft(this.y)

    this.color = scaleOrdinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])
  }

  render () {
    const data = [
      [
        {name: "Under 5 Years", value: 2704659},
        {name: "5 to 13 Years", value: 4499890},
        {name: "14 to 17 Years", value: 2159981},
        {name: "18 to 24 Years", value: 3853788},
        {name: "25 to 44 Years", value: 10604510},
        {name: "45 to 64 Years", value: 8819342},
        {name: "65 Years and Over", value: 4114496}
      ],
      [
        {name: "Under 5 Years", value: 2027307},
        {name: "5 to 13 Years", value: 3277946},
        {name: "14 to 17 Years", value: 1420518},
        {name: "18 to 24 Years", value: 2454721},
        {name: "25 to 44 Years", value: 7017731},
        {name: "45 to 64 Years", value: 5656528},
        {name: "65 Years and Over", value: 2472223}
      ],
      [
        {name: "Under 5 Years", value: 1208495},
        {name: "5 to 13 Years", value: 2141490},
        {name: "14 to 17 Years", value: 1058031},
        {name: "18 to 24 Years", value: 1999120},
        {name: "25 to 44 Years", value: 5355235},
        {name: "45 to 64 Years", value: 5120254},
        {name: "65 Years and Over", value: 2607672}
      ],
      [
        {name: "Under 5 Years", value: 1140516},
        {name: "5 to 13 Years", value: 1938695},
        {name: "14 to 17 Years", value: 925060},
        {name: "18 to 24 Years", value: 1607297},
        {name: "25 to 44 Years", value: 4782119},
        {name: "45 to 64 Years", value: 4746856},
        {name: "65 Years and Over", value: 3187797}
      ],
      [
        {name: "Under 5 Years", value: 894368},
        {name: "5 to 13 Years", value: 1558919},
        {name: "14 to 17 Years", value: 725973},
        {name: "18 to 24 Years", value: 1311479},
        {name: "25 to 44 Years", value: 3596343},
        {name: "45 to 64 Years", value: 3239173},
        {name: "65 Years and Over", value: 1575308}
      ],
      [
        {name: "Under 5 Years", value: 737462},
        {name: "5 to 13 Years", value: 1345341},
        {name: "14 to 17 Years", value: 679201},
        {name: "18 to 24 Years", value: 1203944},
        {name: "25 to 44 Years", value: 3157759},
        {name: "45 to 64 Years", value: 3414001},
        {name: "65 Years and Over", value: 1910571}
      ]
    ]

    const ageNames = [
        "Under 5 Years",
        "5 to 13 Years",
        "14 to 17 Years",
        "18 to 24 Years",
        "25 to 44 Years",
        "45 to 64 Years",
        "65 Years and Over"
    ]

    const stateNames = [
      "CA",
      "TX",
      "NY",
      "FL",
      "IL",
      "PA"
    ]

    this.x0
      .domain(stateNames)

    this.x1
      .domain(ageNames)
      .rangeRound([0, this.x0.bandwidth()])

    this.y.domain([0, max(data, function (c) {
      return max(c, function (d) {
        return d.value
      })
    })])

    const state = this.chart.selectAll('.state')
      .data(data)
      .enter().append('g')
      .attr('class', 'state')
      .attr('transform', (d, i) => `translate(${this.x0(stateNames[i])}, 0)`)

    state.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('width', this.x1.bandwidth())
      .attr('x', d => this.x1(d.name))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.h - this.y(d.value))
      .style('fill', d => this.color(d.name))
  }

}
