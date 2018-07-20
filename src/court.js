
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

    const zones = [
      [1, 6, 5],
      [9, 8, 7],
      [2, 3, 4],
      [4, 3, 2],
      [7, 8, 9],
      [5, 6, 1]
    ]

    zones.forEach((row, rowNumber) => {
      row.forEach((zone, columnNumber) => {
        const x = columnNumber * this.zoneWidth
        const y = rowNumber * this.zoneHeight
        this.drawZone(this.mh + x, this.mv + y, rowNumber < 3 ? 'b' :'a', zone)
      })
    })

    this.net = this.chart
      .append('line')
      .attr('x1', 0.05 * w)
      .attr('y1', h / 2)
      .attr('x2', 0.95 * w)
      .attr('y2', h / 2)
      .attr('class', 'net')
  }

  drawZone (top, left, side, number) {
    const zone = this.chart
      .append('g')
      .attr('class', `zone side${side} number${number}`)
      .attr('transform', `translate(${top}, ${left})`)

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
      .text(number)
  }

  setStartZone (side, number) {
    this.chart.select(`.zone.side${side}.number${number}`).classed('start', true)
  }

  setEndZone (side, number) {
    this.chart.select(`.zone.side${side}.number${number}`).classed('end', true)
  }

  clearAll () {
    this.chart.selectAll('.zone').classed('start', false)
    this.chart.selectAll('.zone').classed('end', false)
  }
}
