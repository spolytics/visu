
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

  onClick = () => {
    this.court.clear()
  }

  highlight = event => {
    this.court.highlight(event.target.name)
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
        <button type='button' name='b9' onClick={this.highlight}>
          highlight zone b9
        </button>
        <button type='button' name='a3' onClick={this.highlight}>
          highlight zone a3
        </button>
        <button type='button' onClick={this.onClick}>
          clear
        </button>
      </section>
    )
  }
}
