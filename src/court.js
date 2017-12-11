
import {select} from 'd3-selection'

const defaults = {
  width: 480,
  height: 640,
  margin: {
    top: 15,
    right: 10,
    bottom: 35,
    left: 60
  },
  tickSize: 5,
  yTicks: 5
}

export default class Court {
  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  init () {
    const {target, width, height, margin} = this
    const {tickSize, yTicks} = this
    const w = this.w = width - margin.left - margin.right
    const h = this.h = height - margin.top - margin.bottom

    this.chart = select(target)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.background = this.chart
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w)
      .attr('height', h)
      .attr('class', 'background')

    this.field = this.chart
      .append('rect')
      .attr('x', 50)
      .attr('y', 50)
      .attr('width', w - 100)
      .attr('height', h - 100)
      .attr('class', 'field')

    this.net = this.chart
      .append('line')
      .attr('x1', 30)
      .attr('y1', h / 2)
      .attr('x2', w - 30)
      .attr('y2', h / 2)
      .attr('class', 'net')
  }

  render (data) {
    console.log(data)
  }
}
