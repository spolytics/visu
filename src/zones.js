
import {select} from 'd3-selection'
import {scaleQuantize, scaleLinear, scaleSequential} from 'd3-scale'
import {interpolateOranges, interpolateBlues} from 'd3-scale-chromatic'
import {axisRight} from 'd3-axis'

const defaults = {
  width: 480,
  height: 640,
  margin: {
    top: 10,
    right: 100,
    bottom: 10,
    left: 10
  }
}

const from = scaleSequential()
  .domain([0, 1])
  .interpolator(interpolateOranges)

const to = scaleSequential()
  .domain([0, 1])
  .interpolator(interpolateBlues)

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

    // margin horizontal
    this.mh = 0.10 * w
    // margin vertical
    this.mv = 0.10 * h

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

    // add legend
    const gradient = this.chart
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', to(1))

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', to(0))

    // legend group for rect and axis
    const legend = this.chart
      .append('g')
      .attr('transform', 'translate(250, 0)')

    const legendHeight = 200

    legend
      .append('rect')
      .attr('width', 25)
      .attr('height', legendHeight)
      .style('fill', 'url(#gradient)')

    // add ticks
    const y = scaleLinear().range([legendHeight, 0]).domain([1, 100])
    const yAxis = axisRight(y)

    legend
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(25, 0)')
      .call(yAxis)
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
      .attr('fill', side === 'a' ? from(number * 0.1) : to(number * 0.1))

    zone
      .append('text')
      .attr('x', this.zoneWidth / 2)
      .attr('y', this.zoneHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(number)
  }
}
