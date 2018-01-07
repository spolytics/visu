
import {select} from 'd3-selection'

const defaults = {
  width: 480,
  height: 640,
  margin: {
    top: 15,
    right: 10,
    bottom: 35,
    left: 60
  }
}

export default class Court {
  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  init () {
    const {target, width, height, margin} = this
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

    // margin horizontal
    this.mh = 0.10 * w
    // margin vertical
    this.mv = 0.10 * h

    this.field = this.chart
      .append('rect')
      .attr('x', this.mh)
      .attr('y', this.mv)
      .attr('width', w - 2 * this.mh)
      .attr('height', h - 2 * this.mv)
      .attr('class', 'field')

    this.zoneWidth = (w - 2 * this.mh) / 3
    this.zoneHeight = (h - 2 * this.mv) / 2 / 3

    // 1, 5, 6
    this.b1 = this.zone(this.mh, this.mv, 1)
    this.b6 = this.zone(this.mh + this.zoneWidth, this.mv, 6)
    this.b5 = this.zone(this.mh + 2 * this.zoneWidth, this.mv, 5)

    // 7, 8, 9
    this.b9 = this.zone(this.mh, this.mv + this.zoneHeight, 9)
    this.b8 = this.zone(this.mh + this.zoneWidth, this.mv + this.zoneHeight, 8)
    this.b7 = this.zone(this.mh + 2 * this.zoneWidth, this.mv + this.zoneHeight, 7)

    // 2, 3, 4
    this.b2 = this.zone(this.mh, this.mv + 2 * this.zoneHeight, 2)
    this.b3 = this.zone(this.mh + this.zoneWidth, this.mv + 2 * this.zoneHeight, 3)
    this.b4 = this.zone(this.mh + 2 * this.zoneWidth, this.mv + 2 * this.zoneHeight, 4)

    // 2, 3, 4
    this.a4 = this.zone(this.mh, this.mv + 3 * this.zoneHeight, 4)
    this.a3 = this.zone(this.mh + this.zoneWidth, this.mv + 3 * this.zoneHeight, 3)
    this.a2 = this.zone(this.mh + 2 * this.zoneWidth, this.mv + 3 * this.zoneHeight, 2)

    // 7, 8, 9
    this.a7 = this.zone(this.mh, this.mv + 4 * this.zoneHeight, 7)
    this.a8 = this.zone(this.mh + this.zoneWidth, this.mv + 4 * this.zoneHeight, 8)
    this.a9 = this.zone(this.mh + 2 * this.zoneWidth, this.mv + 4 * this.zoneHeight, 9)

    // 1, 2, 3
    this.a5 = this.zone(this.mh, this.mv + 5 * this.zoneHeight, 5)
    this.a6 = this.zone(this.mh + this.zoneWidth, this.mv + 5 * this.zoneHeight, 6)
    this.a1 = this.zone(this.mh + 2 * this.zoneWidth, this.mv + 5 * this.zoneHeight, 1)

    this.net = this.chart
      .append('line')
      .attr('x1', 0.05 * w)
      .attr('y1', h / 2)
      .attr('x2', 0.95 * w)
      .attr('y2', h / 2)
      .attr('class', 'net')
  }

  zone (top, left, text) {
    const that = this
    const zone = this.chart
      .append('g')
      .attr('class', 'zone')
      .attr('transform', `translate(${top}, ${left})`)
      .on('click', function () {
        that.chart.selectAll('.zone').classed('active', false)
        select(this).classed('active', true)
      })

    zone
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.zoneWidth)
      .attr('height', this.zoneHeight)

    zone
      .append('text')
      .attr('x', this.zoneWidth / 2)
      .attr('y', this.zoneHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(text)

    return zone
  }

  highlight (zone) {
    this[zone].classed('active', true)
  }

  clear () {
    this.chart.selectAll('.zone').classed('active', false)
  }

  render (data) {
    console.log(data)
  }
}
