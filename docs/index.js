
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Link, Route} from 'react-router-dom'
import GroupedBarChartComponent from './groupedBarChart'
import HittingEfficiencyComponent from './hittingEfficiency'
import PieChartComponent from './pieChart'
import LineChartComponent from './lineChart'
import SankeyComponent from './sankey'

class App extends React.Component {
  render () {
    return (
      <HashRouter>
        <div>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/groupedbarchart'>Grouped Bar Chart</Link>
            </li>
            <li>
              <Link to='/hittingefficiency'>Hitting Efficiency</Link>
            </li>
            <li>
              <Link to='/piechart'>Pie Chart</Link>
            </li>
            <li>
              <Link to='/linechart'>Line Chart</Link>
            </li>
            <li>
              <Link to='/sankey'>Sankey</Link>
            </li>
          </ul>
          <Route exact path='/' component={() => <h1>visu</h1>} />
          <Route path='/groupedbarchart' component={GroupedBarChartComponent} />
          <Route path='/hittingefficiency' component={HittingEfficiencyComponent} />
          <Route path='/piechart' component={PieChartComponent} />
          <Route path='/linechart' component={LineChartComponent} />
          <Route path='/sankey' component={SankeyComponent} />
        </div>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react'))
