
import React from 'react'
import {Sankey} from '../'

const data = {
  a: {
    nodes: [
      {name: 'Attack'},
      {name: 'Reception'},
      {name: 'Reception Error'},
      {name: 'Reception Zero'},
      {name: 'Reception Good'},
      {name: 'Setting Error'},
      {name: 'Setting Zero'},
      {name: 'Setting Good'},
      {name: 'Attack Error'},
      {name: 'Attack Zero'},
      {name: 'Attack Win'}
    ],
    links: [
      { source: 0, target: 9, value: 0.001 },
      { source: 0, target: 10, value: 0 },
      { source: 1, target: 2, value: 0.001 },
      { source: 1, target: 3, value: 5 },
      { source: 1, target: 4, value: 8 },
      { source: 2, target: 5, value: 0.001 },
      { source: 3, target: 8, value: 0 },
      { source: 3, target: 9, value: 1 },
      { source: 3, target: 10, value: 1 },
      { source: 3, target: 5, value: 0 },
      { source: 3, target: 6, value: 1 },
      { source: 3, target: 7, value: 2 },
      { source: 4, target: 8, value: 0 },
      { source: 4, target: 9, value: 0 },
      { source: 4, target: 10, value: 0 },
      { source: 4, target: 5, value: 0 },
      { source: 4, target: 6, value: 1 },
      { source: 4, target: 7, value: 7 },
      { source: 5, target: 8, value: 0.001 },
      { source: 6, target: 8, value: 1 },
      { source: 6, target: 9, value: 2 },
      { source: 6, target: 10, value: 2 },
      { source: 7, target: 8, value: 1 },
      { source: 7, target: 9, value: 5 },
      { source: 7, target: 10, value: 0.001 }
    ]
  },
  b: {
    nodes: [
      {name: 'Attack'},
      {name: 'Reception'},
      {name: 'Reception Error'},
      {name: 'Reception Zero'},
      {name: 'Reception Good'},
      {name: 'Setting Error'},
      {name: 'Setting Zero'},
      {name: 'Setting Good'},
      {name: 'Attack Error'},
      {name: 'Attack Zero'},
      {name: 'Attack Win'}
    ],
    links: [
      { source: 0, target: 9, value: 0.001 },
      { source: 0, target: 10, value: 0 },
      { source: 1, target: 2, value: 3 },
      { source: 1, target: 3, value: 6 },
      { source: 1, target: 4, value: 8 },
      { source: 2, target: 5, value: 0.001 },
      { source: 3, target: 8, value: 0 },
      { source: 3, target: 9, value: 2 },
      { source: 3, target: 10, value: 1 },
      { source: 3, target: 5, value: 0 },
      { source: 3, target: 6, value: 1 },
      { source: 3, target: 7, value: 2 },
      { source: 4, target: 8, value: 1 },
      { source: 4, target: 9, value: 0 },
      { source: 4, target: 10, value: 0 },
      { source: 4, target: 5, value: 1 },
      { source: 4, target: 6, value: 1 },
      { source: 4, target: 7, value: 5 },
      { source: 5, target: 8, value: 0.001 },
      { source: 6, target: 8, value: 0 },
      { source: 6, target: 9, value: 2 },
      { source: 6, target: 10, value: 2 },
      { source: 7, target: 8, value: 1 },
      { source: 7, target: 9, value: 7 },
      { source: 7, target: 10, value: 5 }
    ]
  }
}

let selected = 'a'

export default class SankeyComponent extends React.Component {
  componentDidMount () {
    this.sankey = new Sankey({
      target: this.refs.svg
    })
    this.sankey.render(data[selected])
    window.addEventListener('resize', this.resize)
  }

  resize = () => {
    const {svg} = this.refs
    // clear old content
    svg.removeChild(svg.firstChild)
    // draw again with new width
    const width = svg.parentNode.offsetWidth
    this.sankey = new Sankey({
      target: svg,
      width
    })
    this.sankey.render(data[selected])
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  onClick = () => {
    selected = selected === 'a' ? 'b' : 'a'
    this.sankey.update(data[selected])
  }

  render () {
    return (
      <div>
        <svg ref='svg' />
        <div>
          <button onClick={this.onClick}>
            Toggle
          </button>
        </div>
      </div>
    )
  }
}
