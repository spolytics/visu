
import React from 'react'
import {Zones} from '../src/'

const sets = {
  a: [
    0.1,
    0.2,
    0.5,
    0.6,
    0.2,
    0.9,
    0.8,
    0.7,
    0
  ],
  b: [
    0.2,
    0,
    0.8,
    0.7,
    0.9,
    0.1,
    0.2,
    0.5,
    0.6
  ]
}

export default class ZonesComponent extends React.Component {
  componentDidMount () {
    this.draw()
  }

  draw = () => {
    this.zones = new Zones({
      width: 320,
      height: 480,
      target: this.refs.svg
    })
    this.zones.render(sets.a)
  }

  update = event => {
    this.zones.update(sets[event.target.name])
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
        <button type='button' name='a' onClick={this.update}>
          use dataset a
        </button>
        <button type='button' name='b' onClick={this.update}>
          use dataset b
        </button>
      </section>
    )
  }
}
