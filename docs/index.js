
import React from 'react'
import ReactDOM from 'react-dom'
import {HittingEfficiency} from '../'

class App extends React.Component {

  componentDidMount () {
    this.he = new HittingEfficiency({
      target: this.refs.he
    })
    const data = [
      {desc: 'Fuzhou', value: 0.667},
      {desc: 'Klagenfurt', value: 0.400},
      {desc: 'Rio', value: 0.300},
      {desc: 'Gstaad', value: 0.500}
    ]
    this.he.render(data)
  }

  render () {
    return (
      <div>
        <svg ref='he' />
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('react'))
