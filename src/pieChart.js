
import {select} from 'd3-selection'
import {pie, arc} from 'd3-shape'
import {interpolate} from 'd3-interpolate'
import 'd3-transition'

const defaults = {
  height: 400,
  keyBackgroundColor: 'background',
  keyFontColor: 'color',
  keyText: 'text'
}

/**
 * Pie chart component.
 */
export default class PieChart {

  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  /**
   * Initialize chart without any data.
   */
  init () {
    const {target, width, height} = this
    const radius = height / 2
    this.svg = select(target)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`)

    this.arc = arc()
      .innerRadius(0)
      .outerRadius(radius - 10)

    this.arcOuter = arc()
      .innerRadius(0)
      .outerRadius(radius)

    this.arcText = arc()
      .innerRadius((1 / 3) * (radius - 10))
      .outerRadius(radius - 10)

    this.pie = pie()
      .sort(null)
      .value(d => d.value)
  }

  /**
   * Render chart.
   */
  render (data) {
    // calc total amount for calculating percentages
    const total = data.reduce((p, c) => p + c.value, 0)

    // chart
    const g = this.svg
      .selectAll('.arc')
      .data(this.pie(data))
      .enter()
      // .filter(d => d.data.value !== 0)
      .append('g')
      .attr('class', (d, i) => `arc no${i}`)

    // append slices to be shown on hover
    g.append('path')
      .attr('d', this.arcOuter)
      .attr('class', (d, i) => `path outer no${i}`)
      .style('fill', d => d.data[this.keyBackgroundColor])
      .style('stroke', '#fff')
      .style('opacity', 0)
      .each(function (d) { this._current = d })

    // append real chart on top of to be highlighted slices
    g.append('path')
      .attr('d', this.arc)
      .attr('class', (d, i) => `path inner no${i}`)
      .style('fill', d => d.data[this.keyBackgroundColor])
      .style('stroke', '#eee')
      // store the initial angles
      .each(function (d) { this._current = d })
      .on('mouseover', (d, i) => {
        // prevent highlight and tooltip when slice has zero value
        if (!d.data.value) return

        // highlight outer ring
        this.svg
          .select(`.path.outer.no${i}`)
          .style('opacity', 0.35)

        // append tooltip
        const width = 70
        const height = 40
        const left = this.arcText.centroid(d)[0]
        const top = this.arcText.centroid(d)[1]

        const tip = this.svg
          .append('g')
          .attr('class', 'tip')
          .style('pointer-events', 'none')
          .attr('transform', () => `translate(${left - (width / 2)}, ${top - (height / 2)})`)

        tip
          .append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#fff')
          .attr('stroke', '#eee')

        // title, e.g. 'Ace'
        tip.append('text')
          .attr('x', 4)
          .attr('y', 16)
          .text(() => d.data[this.keyText])
          .style('font-size', '12px')

        // subtitle, absolute and relative value
        tip.append('text')
          .attr('x', 4)
          .attr('y', 32)
          .text(() => `${d.data.value} (${(d.data.value / total * 100).toFixed(1)}%)`)
          .style('font-weight', 'bold')
          .style('font-size', '12px')
      })
      .on('mouseout', (d, i) => {
        if (!d.data.value) return
        // remove outer ring highlight
        this.svg
          .select(`.path.outer.no${i}`)
          .style('opacity', 0)
        // remove tooltip from dom
        this.svg
          .select(`.tip`)
          .remove()
      })

    const that = this
    g.append('text')
      .attr('transform', d => `translate(${this.arcText.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('fill', d => d.data[this.keyFontColor])
      .style('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .text(d => d.data[this.keyText])
      .each(function (d) { this._current = d })
      .each(function (d) {
        const bb = this.getBBox()
        const center = that.arc.centroid(d)

        const topLeft = {
          x: center[0] + bb.x,
          y: center[1] + bb.y
        }

        const topRight = {
          x: topLeft.x + bb.width,
          y: topLeft.y
        }

        const bottomLeft = {
          x: topLeft.x,
          y: topLeft.y + bb.height
        }

        const bottomRight = {
          x: topLeft.x + bb.width,
          y: topLeft.y + bb.height
        }

        d.visible = that.pointIsInArc(topLeft, d, that.arc) &&
          that.pointIsInArc(topRight, d, that.arc) &&
          that.pointIsInArc(bottomLeft, d, that.arc) &&
          that.pointIsInArc(bottomRight, d, that.arc)
      })
    .style('opacity', d => d.visible ? 1 : 0)

    // legend
    this.legend(data)
  }

  pointIsInArc (pt, ptData, d3Arc) {
    // Center of the arc is assumed to be 0,0
    // (pt.x, pt.y) are assumed to be relative to the center
    const r1 = d3Arc.innerRadius()(ptData) // Note: Using the innerRadius
    const r2 = d3Arc.outerRadius()(ptData)
    const theta1 = d3Arc.startAngle()(ptData)
    const theta2 = d3Arc.endAngle()(ptData)

    const dist = pt.x * pt.x + pt.y * pt.y
    let angle = Math.atan2(pt.x, -pt.y) // Note: different coordinate system.

    angle = (angle < 0) ? (angle + Math.PI * 2) : angle

    return (r1 * r1 <= dist) && (dist <= r2 * r2) && (theta1 <= angle) && (angle <= theta2)
  }

  /**
   * Update chart with enter, transition and exit selection.
   */
  update (data) {
    const that = this

    // outer
    function arcOuterTween (a) {
      const i = interpolate(this._current, a)
      this._current = i(0)
      return (t) => that.arcOuter(i(t))
    }

    this.svg
      .selectAll('.path.outer')
      .data(this.pie(data))
      .transition()
      .attrTween('d', arcOuterTween)

    // inner
    function arcTween (a) {
      const i = interpolate(this._current, a)
      this._current = i(0)
      return (t) => that.arc(i(t))
    }

    this.svg
      .selectAll('.path.inner')
      .data(this.pie(data))
      .transition()
      .attrTween('d', arcTween)

    // transition text
    function textTween (a) {
      const i = interpolate(this._current, a)
      this._current = i(0)
      return (t) => `translate(${that.arcText.centroid(i(t))})`
    }

    this.svg
      .selectAll('text')
      .data(this.pie(data))
      .transition()
      .attrTween('transform', textTween)
      .each(function (d) {
        const bb = this.getBBox()
        const center = that.arc.centroid(d)

        const topLeft = {
          x: center[0] + bb.x,
          y: center[1] + bb.y
        }

        const topRight = {
          x: topLeft.x + bb.width,
          y: topLeft.y
        }

        const bottomLeft = {
          x: topLeft.x,
          y: topLeft.y + bb.height
        }

        const bottomRight = {
          x: topLeft.x + bb.width,
          y: topLeft.y + bb.height
        }

        d.visible = that.pointIsInArc(topLeft, d, that.arc) &&
          that.pointIsInArc(topRight, d, that.arc) &&
          that.pointIsInArc(bottomLeft, d, that.arc) &&
          that.pointIsInArc(bottomRight, d, that.arc)
      })
      .style('opacity', d => d.visible ? 1 : 0)
  }

  legend (data) {
    // legend
    const legend = this.svg
      .append('g')
      .attr('class', 'legend')
      .selectAll('g')
      .data(this.pie(data))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 22})`)
      .on('mouseover', (d, i) => {
        this.svg
          .select(`.path.outer.no${i}`)
          .style('opacity', 0.35)
      })
      .on('mouseout', (d, i) => {
        this.svg
          .select(`.path.outer.no${i}`)
          .style('opacity', 0)
      })

    legend.append('rect')
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', d => d.data[this.keyBackgroundColor])

    legend.append('text')
      .attr('x', 25)
      .attr('y', 8)
      .attr('dy', '0.35em')
      .text(d => d.data[this.keyText])

    // now position legend correctly
    const legendHeight = this.svg
      .select('.legend')
      .node()
      .getBBox()
      .height

      // this.height / 2 is radius + some margin
    this.svg
      .select('.legend')
      .attr('transform', `translate(${(this.height / 2) + 20}, ${-legendHeight / 2})`)
  }

}
