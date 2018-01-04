
import React from 'react'
import {Court} from '../'

export default class CourtComponent extends React.Component {
  componentDidMount () {
    this.draw()
  }

  draw = () => {
    this.court = new Court({
      width: 320,
      height: 480,
      target: this.refs.svg
    })
    this.court.render()
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
      </section>
    )
  }
}
