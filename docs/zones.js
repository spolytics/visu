
import React from 'react'
import {Zones} from '../src/'

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
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
      </section>
    )
  }
}
