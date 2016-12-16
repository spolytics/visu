
import React from 'react'
import ReactDOM from 'react-dom'
import {HittingEfficiency, GroupedBarChart} from '../'

class App extends React.Component {

  state = {
    data: [
      {desc: 'Fuzhou', value: 0.667},
      {desc: 'Klagenfurt', value: 0.400},
      {desc: 'Rio', value: 0.300},
      {desc: 'Gstaad', value: 0.500}
    ],
    focused: -1,
    focusedGrouped: -1
  }

  componentDidMount () {
    const {data} = this.state
    this.he = new HittingEfficiency({
      target: this.refs.he,
      mouseover: this.onChartOver,
      mouseout: this.onChartOut
    })
    this.he.render(data)
    this.groupedBarChart = new GroupedBarChart({
      target: this.refs.groupedBarChart,
      mouseover: this.onChartOverGrouped,
      mouseout: this.onChartOutGrouped
    })
    const d = [
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
    ]

    this.groupedBarChart.render(d)
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

  onMouseOver = (index) => {
    this.he.focus(index)
  }

  onMouseOut = (index) => {
    this.he.blur(index)
  }

  onMouseOverGrouped = (index) => {
    this.groupedBarChart.focus(index)
  }

  onMouseOutGrouped = (index) => {
    this.groupedBarChart.blur(index)
  }

  render () {
    const {data, focused, focusedGrouped} = this.state
    const grouped = ['foo', 'bar', 'baz']
    console.log(focusedGrouped)
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
        <svg ref='groupedBarChart' />
        <table>
          <tbody>
            {grouped.map((d, i) => (
              <tr
                key={i}
                onMouseOver={() => this.onMouseOverGrouped(i)}
                onMouseOut={() => this.onMouseOutGrouped(i)}
                style={{backgroundColor: focusedGrouped === i ? '#eee' : '#fff'}}
              >
                <td>
                  {d}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('react'))
