
import React from 'react'
import {Court} from '../src'

export default class CourtComponent extends React.Component {
  componentDidMount () {
    this.draw()
  }

  draw = () => {
    this.court = new Court({
      width: 320,
      height: 480,
      target: this.refs.svg,
      click: this.onClick
    })
  }

  onClick = (a, b, c) => {
    console.log(a, b, c)
  }

  clearAll = () => {
    this.court.clearAll()
  }

  setStartZone = event => {
    const [side, number] = event.target.name.split('-')
    this.court.setStartZone(side, number)
  }

  setEndZone = event => {
    const [side, number] = event.target.name.split('-')
    this.court.setEndZone(side, number)
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
        <button type='button' name='b-9' onClick={this.setStartZone}>
          start zone b9
        </button>
        <button type='button' name='a-3' onClick={this.setEndZone}>
          end zone a3
        </button>
        <button type='button' name='b-9' onClick={this.setEndZone}>
          end zone b9
        </button>
        <button type='button' onClick={this.clearAll}>
          clear all
        </button>
      </section>
    )
  }
}
