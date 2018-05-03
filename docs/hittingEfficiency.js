
import React from 'react'
import {HittingEfficiency} from '../src/'

export default class HittingEfficiencyComponent extends React.Component {
  state = {
    data: [
      {desc: 'Fuzhou', value: 0.667},
      {desc: 'Klagenfurt', value: 0.400},
      {desc: 'Rio', value: 0.300},
      {desc: 'Gstaad', value: 0.500}
    ],
    focused: -1
  }

  componentDidMount () {
    const {data} = this.state
    this.he = new HittingEfficiency({
      target: this.refs.he,
      mouseover: this.onChartOver,
      mouseout: this.onChartOut
    })
    this.he.render(data)
  }

  onChartOver = (d, i, n) => {
    this.setState({
      focused: i
    })
  }

  onChartOut = () => {
    this.setState({
      focused: -1
    })
  }

  onMouseOver = (index) => {
    this.he.focus(index)
  }

  onMouseOut = (index) => {
    this.he.blur(index)
  }

  render () {
    const {data, focused} = this.state
    return (
      <div>
        <svg ref='he' />
        <table>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={i}
                onMouseOver={() => this.onMouseOver(i)}
                onMouseOut={() => this.onMouseOut(i)}
                style={{backgroundColor: focused === i ? '#eee' : '#fff'}}
              >
                <td>
                  {d.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
