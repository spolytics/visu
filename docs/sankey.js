
import React from 'react'
import {Sankey} from '../'

const data = {
  a: {
    nodes: [
      {id: 'attack', name: 'Attack'},
      {id: 'reception', name: 'Reception'},
      {id: 'receptionError', name: 'Reception Error'},
      {id: 'receptionZero', name: 'Reception Zero'},
      {id: 'receptionGood', name: 'Reception Good'},
      {id: 'settingError', name: 'Setting Error'},
      {id: 'settingZero', name: 'Setting Zero'},
      {id: 'settingGood', name: 'Setting Good'},
      {id: 'attackError', name: 'Attack Error'},
      {id: 'attackZero', name: 'Attack Zero'},
      {id: 'attackWin', name: 'Attack Win'}
    ],
    links: [
      { source: 'attack', target: 'attackZero', value: 0.001 },
      { source: 'attack', target: 'attackWin', value: 0 },
      { source: 'reception', target: 'receptionError', value: 0.001 },
      { source: 'reception', target: 'receptionZero', value: 5 },
      { source: 'reception', target: 'receptionGood', value: 8 },
      { source: 'receptionError', target: 'settingError', value: 0.001 },
      { source: 'receptionZero', target: 'attackError', value: 0 },
      { source: 'receptionZero', target: 'attackZero', value: 1 },
      { source: 'receptionZero', target: 'attackWin', value: 1 },
      { source: 'receptionZero', target: 'settingError', value: 0 },
      { source: 'receptionZero', target: 'settingZero', value: 1 },
      { source: 'receptionZero', target: 'settingGood', value: 2 },
      { source: 'receptionGood', target: 'attackError', value: 0 },
      { source: 'receptionGood', target: 'attackZero', value: 0 },
      { source: 'receptionGood', target: 'attackWin', value: 0 },
      { source: 'receptionGood', target: 'settingError', value: 0 },
      { source: 'receptionGood', target: 'settingZero', value: 1 },
      { source: 'receptionGood', target: 'settingGood', value: 7 },
      { source: 'settingError', target: 'attackError', value: 0.001 },
      { source: 'settingZero', target: 'attackError', value: 1 },
      { source: 'settingZero', target: 'attackZero', value: 2 },
      { source: 'settingZero', target: 'attackWin', value: 2 },
      { source: 'settingGood', target: 'attackError', value: 1 },
      { source: 'settingGood', target: 'attackZero', value: 5 },
      { source: 'settingGood', target: 'attackWin', value: 0.001 }
    ]
  },
  b: {
    nodes: [
      {id: 'attack', name: 'Attack'},
      {id: 'reception', name: 'Reception'},
      {id: 'receptionError', name: 'Reception Error'},
      {id: 'receptionZero', name: 'Reception Zero'},
      {id: 'receptionGood', name: 'Reception Good'},
      {id: 'settingError', name: 'Setting Error'},
      {id: 'settingZero', name: 'Setting Zero'},
      {id: 'settingGood', name: 'Setting Good'},
      {id: 'attackError', name: 'Attack Error'},
      {id: 'attackZero', name: 'Attack Zero'},
      {id: 'attackWin', name: 'Attack Win'}
    ],
    links: [
      { source: 'attack', target: 'attackZero', value: 0.001 },
      { source: 'attack', target: 'attackWin', value: 0 },
      { source: 'reception', target: 'receptionError', value: 3 },
      { source: 'reception', target: 'receptionZero', value: 6 },
      { source: 'reception', target: 'receptionGood', value: 8 },
      { source: 'receptionError', target: 'settingError', value: 0.001 },
      { source: 'receptionZero', target: 'attackError', value: 0 },
      { source: 'receptionZero', target: 'attackZero', value: 2 },
      { source: 'receptionZero', target: 'attackWin', value: 1 },
      { source: 'receptionZero', target: 'settingError', value: 0 },
      { source: 'receptionZero', target: 'settingZero', value: 1 },
      { source: 'receptionZero', target: 'settingGood', value: 2 },
      { source: 'receptionGood', target: 'attackError', value: 1 },
      { source: 'receptionGood', target: 'attackZero', value: 0 },
      { source: 'receptionGood', target: 'attackWin', value: 0 },
      { source: 'receptionGood', target: 'settingError', value: 1 },
      { source: 'receptionGood', target: 'settingZero', value: 1 },
      { source: 'receptionGood', target: 'settingGood', value: 5 },
      { source: 'settingError', target: 'attackError', value: 0.001 },
      { source: 'settingZero', target: 'attackError', value: 0 },
      { source: 'settingZero', target: 'attackZero', value: 2 },
      { source: 'settingZero', target: 'attackWin', value: 2 },
      { source: 'settingGood', target: 'attackError', value: 1 },
      { source: 'settingGood', target: 'attackZero', value: 7 },
      { source: 'settingGood', target: 'attackWin', value: 5 }
    ]
  }
}

export default class SankeyComponent extends React.Component {
  state = {
    selected: 'a'
  }

  componentDidMount () {
    this.sankey = new Sankey({
      target: this.refs.svg
    })
    this.sankey.render(data[this.state.selected])
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
    this.sankey.render(data[this.state.selected])
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  onClick = () => {
    const selected = this.state.selected === 'a' ? 'b' : 'a'
    this.sankey.update(data[selected])
    this.setState({
      selected
    })
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
