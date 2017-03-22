
import {select} from 'd3-selection'
import {sankey} from 'd3-sankey'
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
  nodeWidth: 15,

  // number of times the converging function computeNodeDepths is run
  iterations: 32
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
  }

  /**
   * Create gradient identifier.
   */
  gradientID (d) {
    return `linkGrad-${d.source.name}-${d.target.name}`.replace(/\s/g, '')
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
    const {iterations} = this

    // get data
    this.sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(iterations)

    // linear gradient definitions
    const grads = this.chart
      .append('defs')
      .selectAll('linearGradient')
      .data(data.links, d => this.gradientID)
      .enter()
      .append('linearGradient')
      .attr('id', this.gradientID)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    grads
      .html('')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => this.nodeColor((+d.source.x <= +d.target.x) ? d.source : d.target))

    grads
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => this.nodeColor((+d.source.x > +d.target.x) ? d.source : d.target))

    // links
    const path = this.sankey.link()

    this.chart
      .append('g')
      .selectAll('.link')
      .data(data.links, d => d.source.name + d.target.name)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', path)
      // css properties require units. must use `10px` instead 10 like in older d3 versions
      // https://github.com/d3/d3-transition/issues/50
      .style('stroke-width', d => `${Math.max(1, d.dy)}px`)
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('opacity', d => d.value < 1 ? 0.001 : null)
      // .sort((a, b) => b.dy - a.dy)
      .append('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // nodes
    const node = this.chart
      .append('g')
      .selectAll('.node')
      .data(data.nodes, d => d.name)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // rect inside node
    node
      .append('rect')
      .attr('height', d => d.dy)
      .attr('width', () => this.sankey.nodeWidth())
      .style('fill', this.nodeColor)
      .style('stroke', d => d.value < 1 ? '#bbb' : rgb(d.color).darker(2))
      .append('title')
      .text(d => `${d.name}\n${d.value.toFixed()}`)

    // text inside node
    node
      .append('text')
      .attr('x', -6)
      .attr('y', d => d.dy / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .style('fill', d => d.value < 1 ? '#bbb' : null)
      .text(d => d.name)
      .filter(d => d.x < this.width / 2)
      .attr('x', () => 6 + this.sankey.nodeWidth())
      .attr('text-anchor', 'start')
  }

  /**
   * update
   */
  update (data) {
    const {iterations} = this

    this.sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(iterations)

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
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    gradsEnter
      .html('')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => this.nodeColor((+d.source.x <= +d.target.x) ? d.source : d.target))

    gradsEnter
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => this.nodeColor((+d.source.x > +d.target.x) ? d.source : d.target))

    // transition selection
    const gradsTransition = grads.transition()
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    gradsTransition
      .select('stop[offset="0%"]')
      .attr('stop-color', d => this.nodeColor((+d.source.x <= +d.target.x) ? d.source : d.target))

    gradsTransition
      .select('stop[offset="100%"]')
      .attr('stop-color', d => this.nodeColor((+d.source.x > +d.target.x) ? d.source : d.target))

    // exit selection
    grads
      .exit()
      .remove()

    // links
    const path = this.sankey.link()

    const link = this.chart
      .selectAll('.link')
      // required for properly animating links. d3 needs it to keep reference.
      .data(data.links, d => d.source.name + d.target.name)
      // sort sets order in which links are drawn. important for overlapping / mouse effects
      // .sort((a, b) => b.dy - a.dy)

    // animate new links
    link
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', path)
      // css properties require units. must use `10px` instead 10 like in older d3 versions
      // https://github.com/d3/d3-transition/issues/50
      .style('stroke-width', d => `${Math.max(1, d.dy)}px`)
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('display', d => d.value < 1 ? 'none' : null)
      // .sort((a, b) => b.dy - a.dy)
      .append('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // animate still existing links to new positions
    link.transition()
      .attr('d', path)
      .style('stroke-width', d => `${Math.max(1, d.dy)}px`)
      .style('stroke', d => `url(#${this.gradientID(d)})`)
      .style('opacity', d => d.value < 1 ? 0.001 : null)
      .select('title')
      .text((d) => `${d.source.name} -> ${d.target.name}\n${d.value}`)

    // remove old links
    link.exit()
      .transition()
      .style('stroke-width', '0px')
      .remove()

    // nodes
    const node = this.chart
      .selectAll('.node')
      .data(data.nodes, d => d.name)

    // animate still existing nodes to new positions
    node
      .transition()
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // get all rects
    const rect = this.chart
      .selectAll('rect')
      .data(data.nodes, d => `rect-${d.name}`)

    // animate still existing rects to new positions
    rect
      .style('fill', this.nodeColor)
      .style('stroke', d => d.value < 1 ? '#bbb' : rgb(d.color).darker(2))
      .transition()
      .attr('height', d => d.dy)
      .select('title')
      .text(d => `${d.name}\n${d.value.toFixed()}`)

    // text
    const text = this.chart
      .selectAll('text')
      .data(data.nodes, d => d.name)

    // animate still existing text to new position
    text
      .style('fill', d => d.value < 1 ? '#bbb' : null)
      .transition()
      .attr('y', d => d.dy / 2)
      .filter(d => d.x < this.width / 2)
  }

}
