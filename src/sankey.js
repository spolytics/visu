
import {select} from 'd3-selection'
import {sankey, sankeyLinkHorizontal} from 'd3-sankey'
import {rgb} from 'd3-color'
import {scaleOrdinal} from 'd3-scale'
import 'd3-transition'

const defaults = {
  // target element or selector to contain the svg
  target: '#chart',

  // width of chart
  width: 800,

  // height of chart
  height: 320,

  // margin
  margin: {
    top: 1,
    right: 1,
    bottom: 10,
    left: 1
  },

  // y spacing between nodes
  nodePadding: 10,

  // node width
  nodeWidth: 15
}

/**
 * Sankey.
 */
export default class Sankey {
  /**
   * construct with given `config`.
   */
  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  /**
   * Initialize chart.
   */
  init () {
    const {target, width, height, margin, nodeWidth, nodePadding} = this
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom

    this.chart = select(target)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.sankey = sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .size([w, h])
      .nodeId(d => d.id)
  }

  /**
   * Create gradient identifier.
   */
  gradientID (d) {
    return `linkGrad-${d.source.id}-${d.target.id}`.replace(/\s/g, '')
  }

  /**
   * Get node color from datum.
   */
  nodeColor (d) {
    const color = scaleOrdinal()
      .domain(['reception', 'setting', 'attack'])
      .range(['#009688', '#8BC34A', '#FFC107'])

    if (d.value < 1) {
      d.color = '#bbb'
    } else {
      const category = d.name.replace(/ .*/, '').toLowerCase()
      d.color = color(category)
    }
    return d.color
  }

  /**
   * render
   */
  render (data, options = {}) {
    // get data
    this.sankey(data)

    // linear gradient definitions
    const grads = this.chart
      .append('defs')
      .selectAll('linearGradient')
      .data(data.links, d => this.gradientID)
      .enter()
      .append('linearGradient')
      .attr('id', this.gradientID)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => d.source.x0)
      .attr('y1', d => d.source.y0)
      .attr('x2', d => d.target.x0)
      .attr('y2', d => d.target.y0)

    grads
      .html('')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 <= +d.target.x0) ? d.source : d.target))

    grads
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 > +d.target.x0) ? d.source : d.target))

    // links
    this.chart
      .append('g')
      .selectAll('.link')
      .data(data.links, d => d.source.id + d.target.id)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .style('stroke-width', d => Math.max(1, d.width))
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('opacity', d => d.value < 1 ? 0.001 : null)
      // .sort((a, b) => b.dy - a.dy)
      .append('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // nodes
    const node = this.chart
      .append('g')
      .selectAll('.node')
      .data(data.nodes, d => d.id)
      .enter()
      .append('g')
      .attr('class', 'node')

    // rect inside node
    node
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .style('fill', this.nodeColor)
      .style('stroke', d => d.value < 1 ? '#bbb' : rgb(d.color).darker(2))
      .append('title')
      .text(d => `${d.name}\n${d.value.toFixed()}`)

    // text inside node
    node
      .append('text')
      .attr('x', d => d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('fill', d => d.value < 1 ? '#bbb' : null)
      .text(d => d.name)
      .filter(d => d.x0 < this.width / 2)
      .attr('x', d => d.x1 + 6)
      .attr('text-anchor', 'start')
  }

  /**
   * update
   */
  update (data) {
    this.sankey(data)

    // gradients
    const grads = this.chart
      .select('defs')
      .selectAll('linearGradient')
      .data(data.links, d => this.gradientID)

    // enter selection
    const gradsEnter = grads
      .enter()
      .append('linearGradient')
      .attr('id', this.gradientID)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => d.source.x0)
      .attr('y1', d => d.source.y0)
      .attr('x2', d => d.target.x0)
      .attr('y2', d => d.target.y0)

    gradsEnter
      .html('')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 <= +d.target.x0) ? d.source : d.target))

    gradsEnter
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 > +d.target.x0) ? d.source : d.target))

    // transition selection
    const gradsTransition = grads.transition()
      .attr('x1', d => d.source.x0)
      .attr('y1', d => d.source.y0)
      .attr('x2', d => d.target.x0)
      .attr('y2', d => d.target.y0)

    gradsTransition
      .select('stop[offset="0%"]')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 <= +d.target.x0) ? d.source : d.target))

    gradsTransition
      .select('stop[offset="100%"]')
      .attr('stop-color', d => this.nodeColor((+d.source.x0 > +d.target.x0) ? d.source : d.target))

    // exit selection
    grads
      .exit()
      .remove()

    // links
    const link = this.chart
      .selectAll('.link')
      // required for properly animating links. d3 needs it to keep reference.
      .data(data.links, d => d.source.id + d.target.id)
      // sort sets order in which links are drawn. important for overlapping / mouse effects
      // .sort((a, b) => b.dy - a.dy)

    // animate new links
    link
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .style('stroke-width', d => Math.max(1, d.width))
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('display', d => d.value < 1 ? 'none' : null)
      // .sort((a, b) => b.dy - a.dy)
      .append('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // animate still existing links to new positions
    link.transition()
      .attr('d', sankeyLinkHorizontal())
      .style('stroke-width', d => Math.max(1, d.width))
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('opacity', d => d.value < 1 ? 0.001 : null)
      .select('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // remove old links
    link.exit()
      .transition()
      .style('stroke-width', '0px')
      .remove()

    // get all rects
    const rect = this.chart
      .selectAll('rect')
      .data(data.nodes, d => `rect-${d.id}`)

    // animate still existing rects to new positions
    rect
      .transition()
      .style('fill', this.nodeColor)
      .style('stroke', d => d.value < 1 ? '#bbb' : rgb(d.color).darker(2))
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .select('title')
      .text(d => `${d.name}\n${d.value.toFixed()}`)

    // text
    const text = this.chart
      .selectAll('text')
      .data(data.nodes, d => d.id)

    // animate still existing text to new position
    text
      .transition()
      .style('fill', d => d.value < 1 ? '#bbb' : null)
      .attr('x', d => d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .filter(d => d.x0 < this.width / 2)
      .attr('x', d => d.x1 + 6)
      .attr('text-anchor', 'start')
  }
}
