
import {select, mouse} from 'd3-selection'
import {scaleLinear, scaleOrdinal, schemeCategory10} from 'd3-scale'
import {axisBottom, axisLeft} from 'd3-axis'
import {line, curveLinear, area} from 'd3-shape'
import 'd3-transition'

const defaults = {

  width: 800,

  height: 400,

  margin: {
    top: 15,
    right: 10,
    bottom: 35,
    left: 60
  },

  tickSize: 5,

  yTicks: 5,

  curve: curveLinear,

  tip: {
    width: 250,
    height: 85,
    margin: 25
  }
}

/**
 * Line chart.
 */
export default class LineChart {

  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  init () {
    const {target, width, height, margin, curve} = this
    const {tickSize, yTicks} = this
    const w = this.w = width - margin.left - margin.right
    const h = this.h = height - margin.top - margin.bottom

    this.color = scaleOrdinal(schemeCategory10)

    const wrapper = select(target)
      .append('div')
      .style('position', 'relative')

    this.chart = wrapper
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.x = scaleLinear()
      .range([0, w])

    this.y = scaleLinear()
      .range([h, 0])

    this.xAxis = axisBottom(this.x)
      .ticks(0)

    this.yAxis = axisLeft(this.y)
      .ticks(yTicks)
      .tickPadding(8)
      .tickSize(tickSize)

    this.chart.append('g')
      .attr('class', 'y grid')

    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${h})`)

    this.chart.append('g')
      .attr('class', 'y axis')

    this.line = line()
      .x((d, i) => this.x(i))
      .y(d => this.y(d))
      .curve(curve)

    this.area = area()
      .x((d, i) => this.x(i))
      .y0(h)
      .y1(d => this.y(d))

    const tip = wrapper
      .append('div')
      .attr('class', 'linechart tip')

    tip.append('div')
      .attr('class', 'tip title')

    const teamA = tip.append('div')
      .attr('class', 'tip team')
      .style('color', () => this.color(0))

    teamA.append('span')
      .attr('class', 'tip team teamA name')

    teamA.append('span')
      .attr('class', 'tip team teamA score')

    const teamB = tip.append('div')
      .attr('class', 'tip team')
      .style('color', () => this.color(1))

    teamB.append('span')
      .attr('class', 'tip team teamB name')

    teamB.append('span')
      .attr('class', 'tip team teamB score')
  }

  /**
   * Render axis.
   */
  renderAxis (data) {
    const {chart, x, y, xAxis, yAxis} = this
    const count = data.length - 1
    x.domain([0, count])
    y.domain([0, Math.max(data[count].scoreTeamA, data[count].scoreTeamB)])
    const c = chart.transition()
    c.select('.x.axis').call(xAxis)
    c.select('.y.axis').call(yAxis)
  }

  /**
   * Render dots.
   */
  renderDots (data) {
    const group = [data.map(d => d.scoreTeamA), data.map(d => d.scoreTeamB)]
    this._drawCircles(group[0], 0, 'a')
    this._drawCircles(group[1], 1, 'b')
  }

  /**
   * Draw circles for single team.
   */
  _drawCircles (data, i, side) {
    const s = this.chart
      .selectAll(`.dot.${side}`)
      .data(data)

    // enter
    s.enter()
      .append('circle')
      .attr('class', `dot ${side}`)
      .attr('cx', (d, i) => this.x(i))
      .attr('cy', d => this.y(d))
      .transition()
      .attr('r', 5)
      .style('fill', () => this.color(i))
      .style('stroke', '#fff')
      .style('stroke-width', '2px')

    // transition
    s.transition()
      .attr('cx', (d, i) => this.x(i))
      .attr('cy', d => this.y(d))

    // exit
    s.exit().transition().remove()
  }

  /**
   * Render overlay.
   */
  renderOverlay (data) {
    // const group = [data.map(d => d.scoreTeamA), data.map(d => d.scoreTeamB)]
    this.chart.append('rect')
      .attr('class', 'overlay')
      .attr('width', this.w)
      .attr('height', this.h)
      .style('fill', 'transparent')
      .on('mousemove', (event) => {
        const m = mouse(this.chart.node())
        const x = this.x.invert(m[0])
        const i = Math.round(x)

        // highlight current dots for team a and team b
        this.chart
          .selectAll('.dot.a')
          .style('stroke', (d, j) => i === j ? this.color(0) : '#fff')

        this.chart
          .selectAll('.dot.b')
          .style('stroke', (d, j) => i === j ? this.color(1) : '#fff')

        const scoreTeamA = data[i].scoreTeamA
        const scoreTeamB = data[i].scoreTeamB
        const max = scoreTeamA > scoreTeamB ? scoreTeamA : scoreTeamB
        const min = scoreTeamA < scoreTeamB ? scoreTeamA : scoreTeamB

        const left = this.x(i) + this.margin.left
        const top = this.y(max) + this.margin.top
        const bottom = this.y(min) + this.margin.top
        const sel = select('.linechart.tip')
        // check left edge
        if (left - (this.tip.width / 2) - this.margin.left <= 0) {
          // left edge
          const xFixed = this.x.invert(this.tip.width / 2)
          sel.style('left', `${this.x(Math.ceil(xFixed)) + this.margin.left - (this.tip.width / 2)}px`)
        } else if (left >= (this.w - this.tip.width / 2)) {
          // right edge
          const xFixed = this.x.invert(this.w - (this.tip.width / 2))
          sel.style('left', `${this.x(Math.floor(xFixed)) + this.margin.left - (this.tip.width / 2)}px`)
        } else {
          // default
          sel.style('left', `${left - (this.tip.width / 2)}px`)
        }

        if (top - this.tip.height - this.tip.margin > 0) {
          // default
          sel.style('top', `${top - this.tip.height - this.tip.margin}px`)
        } else {
          // check top edge
          sel.style('top', `${bottom + this.tip.margin}px`)
        }

        // update title
        select('.tip.title')
          .text(`${data[i].description} by ${data[i].firstName} ${data[i].lastName}`)

        // update score
        select('.tip.teamA.score')
          .text(`${data[i].scoreTeamA}`)

        select('.tip.teamB.score')
          .text(`${data[i].scoreTeamB}`)

        // hide tip at origin
        let opacity = 1
        if (i === 0) {
          opacity = 0
        }
        sel
          .style('opacity', opacity)
      })
      .on('mouseleave', () => {
        // deselect dots
        this.chart
          .selectAll('.dot')
          .style('stroke', '#fff')
        // hide tooltip
        select('.linechart.tip')
          .transition()
          .style('opacity', 0)
      })
  }

  /**
   * Render area.
   */
  renderArea (data) {
    const group = [data.map(d => d.scoreTeamA), data.map(d => d.scoreTeamB)]

    const s = this.chart
      .selectAll('.area')
      .data(group)

    // enter
    s.enter()
      .append('path')
      .attr('class', 'area')
      .style('opacity', 0.5)
      .style('fill', (d, i) => this.color(i))
      .transition()
      .attr('d', (d, i) => this.area(group[i]))

    // transition
    s.transition()
      .attr('d', (d, i) => this.area(group[i]))

    // exit
    s.exit().remove()
  }

  /**
   * Render line.
   */
  renderLine (data) {
    const group = [data.map(d => d.scoreTeamA), data.map(d => d.scoreTeamB)]

    const s = this.chart
      .selectAll('.line')
      .data(group)

    // enter
    s.enter()
      .append('path')
      .attr('class', 'line')
      .transition()
      .attr('d', (d, i) => this.line(group[i]))
      .style('stroke', (d, i) => this.color(i))

    // transition
    s.transition()
      .attr('d', (d, i) => this.line(group[i]))

    // exit
    s.exit().transition().remove()
  }

  /**
   * Render grid.
   */
  renderGrid (data) {
    const {yTicks} = this
    this.chart
      .selectAll('.grid.y')
      .transition()
      .call(
        axisLeft(this.y)
          .ticks(yTicks)
          .tickSizeInner(-this.w)
          .tickSizeOuter(0)
          .tickFormat('')
      )
  }

  /**
   * Set team names in tip.
   */
  setTeams (sideA, sideB) {
    select('.tip.team.teamA.name')
      .text(sideA)
    select('.tip.team.teamB.name')
      .text(sideB)
  }

  /**
   * Render.
   */
  render (data) {
    // render axis first because it sets the x and y domains
    this.renderAxis(data)
    this.renderGrid(data)
    this.renderArea(data)
    this.renderLine(data)
    this.renderDots(data)
    this.renderOverlay(data)
  }

  /**
   * Update
   */
  update (data) {
    this.render(data)
  }

}
