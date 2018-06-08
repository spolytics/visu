
import React from 'react'
import {GroupedBarChart} from '../src/'

export default class GroupedBarChartComponent extends React.Component {
  state = {
    data: [
      {
        'Fuzhou': [0.43, 0.5]
      },
      {
        'Klagenfurt': [0.54, 0.65, 0.23]
      },
      {
        'Rio': [0.33, 0.54, 0.58]
      },
      {
        'Gstaad': [0.43, 0.68, 0.32]
      },
      {
        'Hamburg': [0.34, 0.45]
      },
      {
        'Berlin': [0.56, 0.3234234]
      }
    ],
    focusedGrouped: -1
  }

  componentDidMount () {
    this.groupedBarChart = new GroupedBarChart({
      width: document.body.clientWidth,
      target: this.refs.groupedBarChart,
      mouseover: this.onChartOverGrouped,
      mouseout: this.onChartOutGrouped
    })
    this.groupedBarChart.render(this.state.data)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  resize = () => {
    const width = document.body.clientWidth
    this.groupedBarChart.resize(width)
  }

  onChartOverGrouped = (d, i, n) => {
    this.setState({
      focusedGrouped: i
    })
  }

  onChartOutGrouped = () => {
    this.setState({
      focusedGrouped: -1
    })
  }

  onMouseOverGrouped = (index) => {
    this.groupedBarChart.focus(index)
  }

  onMouseOutGrouped = (index) => {
    this.groupedBarChart.blur(index)
  }

  render () {
    const {data, focusedGrouped} = this.state
    return (
      <div>
        <svg ref='groupedBarChart' />
        <table>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={i}
                onMouseOver={() => this.onMouseOverGrouped(i)}
                onMouseOut={() => this.onMouseOutGrouped(i)}
                style={{backgroundColor: focusedGrouped === i ? '#eee' : '#fff'}}
              >
                <td>
                  {Object.keys(d)[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
