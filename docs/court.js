
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

  clearAll = () => {
    this.court.clearAll()
  }

  highlight = event => {
    const [side, number] = event.target.name.split('-')
    this.court.highlight(side, number)
  }

  clear = event => {
    const [side, number] = event.target.name.split('-')
    this.court.clear(side, number)
  }

  render () {
    return (
      <section>
        <svg ref='svg' />
        <button type='button' name='b-9' onClick={this.highlight}>
          highlight zone b9
        </button>
        <button type='button' name='b-9' onClick={this.clear}>
          clear zone b9
        </button>
        <button type='button' name='a-3' onClick={this.highlight}>
          highlight zone a3
        </button>
        <button type='button' name='a-3' onClick={this.clear}>
          clear zone a3
        </button>
        <button type='button' onClick={this.clearAll}>
          clear all
        </button>
      </section>
    )
  }
}
