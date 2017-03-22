
import React from 'react'
import {PieChart} from '../'

const def = {
  a: [
    {value: 10, text: 'Error', background: '#4DB6AC'},
    {value: 5, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 18, text: 'Ace', background: '#00796B', color: '#fff'}
  ],
  b: [
    {value: 7, text: 'Error', background: '#4DB6AC'},
    {value: 12, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ]
}

const zeroSlice = {
  a: [
    {value: 7, text: 'Error', background: '#4DB6AC'},
    {value: 0, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ],
  b: [
    {value: 7, text: 'Error', background: '#4DB6AC'},
    {value: 2, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ]
}

const singleSlice = {
  a: [
    {value: 0, text: 'Error', background: '#4DB6AC'},
    {value: 0, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ],
  b: [
    {value: 0, text: 'Error', background: '#4DB6AC'},
    {value: 0, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 0, text: 'Ace', background: '#00796B', color: '#fff'}
  ]
}

const smallSlice = {
  a: [
    {value: 2, text: 'Error', background: '#4DB6AC'},
    {value: 18, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ],
  b: [
    {value: 10, text: 'Error', background: '#4DB6AC'},
    {value: 18, text: 'Zero', background: '#009688', color: '#fff'},
    {value: 16, text: 'Ace', background: '#00796B', color: '#fff'}
  ]
}

let data = 'a'

export default class PieChartComponent extends React.Component {

  componentDidMount () {
    this.pieChart = new PieChart({
      height: 200,
      target: this.refs.normal
    })
    this.pieChart.render(def[data])
    // zero slice
    this.zeroSlicePieChart = new PieChart({
      height: 200,
      target: this.refs.zeroSlice
    })
    this.zeroSlicePieChart.render(zeroSlice[data])
    // single slice
    this.singleSlicePieChart = new PieChart({
      height: 200,
      target: this.refs.singleSlice
    })
    this.singleSlicePieChart.render(singleSlice[data])
    // small slice
    this.smallSlicePieChart = new PieChart({
      height: 200,
      target: this.refs.smallSlice
    })
    this.smallSlicePieChart.render(smallSlice[data])
  }

  onClick = () => {
    data = data === 'a' ? 'b' : 'a'
    this.pieChart.update(def[data])
    this.zeroSlicePieChart.update(zeroSlice[data])
    this.smallSlicePieChart.update(smallSlice[data])
    this.singleSlicePieChart.update(singleSlice[data])
  }

  render () {
    return (
      <div>
        <section>
          <p>default</p>
          <div ref='normal' />
          <button onClick={this.onClick} style={{position: 'fixed', top: 100, right: 200}}>
            Animate
          </button>
        </section>
        <section>
          <p>zero slice</p>
          <div ref='zeroSlice' />
        </section>
        <section>
          <p>single slice / 100%</p>
          <div ref='singleSlice' />
        </section>
        <section>
          <p>very small slice without text</p>
          <div ref='smallSlice' />
        </section>
      </div>
    )
  }

}
