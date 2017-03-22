
import React from 'react'
import {LineChart} from '../'

const a = [
  {
    description: '',
    scoreTeamA: 0,
    scoreTeamB: 0,
    firstName: '',
    lastName: ''
  },
  {
    description: 'Dig error',
    scoreTeamA: 0,
    scoreTeamB: 1,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 1,
    scoreTeamB: 1,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Dig error',
    scoreTeamA: 1,
    scoreTeamB: 2,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 2,
    scoreTeamB: 2,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Ace',
    scoreTeamA: 3,
    scoreTeamB: 2,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Service error',
    scoreTeamA: 3,
    scoreTeamB: 3,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack error',
    scoreTeamA: 3,
    scoreTeamB: 4,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack error',
    scoreTeamA: 3,
    scoreTeamB: 5,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 4,
    scoreTeamB: 5,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 5,
    scoreTeamB: 5,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Dig error',
    scoreTeamA: 5,
    scoreTeamB: 6,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 6,
    scoreTeamB: 6,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 7,
    scoreTeamB: 6,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Block winner',
    scoreTeamA: 8,
    scoreTeamB: 6,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Dig error',
    scoreTeamA: 8,
    scoreTeamB: 7,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack error',
    scoreTeamA: 8,
    scoreTeamB: 8,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 9,
    scoreTeamB: 8,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 10,
    scoreTeamB: 8,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 11,
    scoreTeamB: 8,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 12,
    scoreTeamB: 8,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Service error',
    scoreTeamA: 12,
    scoreTeamB: 9,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 13,
    scoreTeamB: 9,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Dig error',
    scoreTeamA: 13,
    scoreTeamB: 10,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Unforced error',
    scoreTeamA: 14,
    scoreTeamB: 10,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Dig error',
    scoreTeamA: 14,
    scoreTeamB: 11,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Reception error',
    scoreTeamA: 14,
    scoreTeamB: 12,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 15,
    scoreTeamB: 12,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Dig error',
    scoreTeamA: 15,
    scoreTeamB: 13,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack error',
    scoreTeamA: 15,
    scoreTeamB: 14,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Reception error',
    scoreTeamA: 15,
    scoreTeamB: 15,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 16,
    scoreTeamB: 15,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack error',
    scoreTeamA: 16,
    scoreTeamB: 16,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 17,
    scoreTeamB: 16,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Service error',
    scoreTeamA: 17,
    scoreTeamB: 17,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 18,
    scoreTeamB: 17,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Block error',
    scoreTeamA: 18,
    scoreTeamB: 18,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 19,
    scoreTeamB: 18,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Dig error',
    scoreTeamA: 19,
    scoreTeamB: 19,
    firstName: 'Lars',
    lastName: 'Flüggen'
  },
  {
    description: 'Attack winner',
    scoreTeamA: 20,
    scoreTeamB: 19,
    firstName: 'Markus',
    lastName: 'Böckermann'
  },
  {
    description: 'Ace',
    scoreTeamA: 21,
    scoreTeamB: 19,
    firstName: 'Markus',
    lastName: 'Böckermann'
  }
]

const b = [
  {description: '', scoreTeamA: 0, scoreTeamB: 0, firstName: '', lastName: ''},
  {description: 'Dig error', scoreTeamA: 0, scoreTeamB: 1, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Dig error', scoreTeamA: 0, scoreTeamB: 2, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Unforced error', scoreTeamA: 1, scoreTeamB: 2, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block winner', scoreTeamA: 2, scoreTeamB: 2, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Attack winner', scoreTeamA: 3, scoreTeamB: 2, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Dig error', scoreTeamA: 3, scoreTeamB: 3, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Attack winner', scoreTeamA: 4, scoreTeamB: 3, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Dig error', scoreTeamA: 4, scoreTeamB: 4, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Attack winner', scoreTeamA: 5, scoreTeamB: 4, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Dig error', scoreTeamA: 5, scoreTeamB: 5, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Unforced error', scoreTeamA: 6, scoreTeamB: 5, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Attack winner', scoreTeamA: 7, scoreTeamB: 5, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Dig error', scoreTeamA: 7, scoreTeamB: 6, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Block error', scoreTeamA: 7, scoreTeamB: 7, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Attack winner', scoreTeamA: 8, scoreTeamB: 7, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block winner', scoreTeamA: 9, scoreTeamB: 7, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Dig error', scoreTeamA: 9, scoreTeamB: 8, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Attack winner', scoreTeamA: 10, scoreTeamB: 8, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Unforced error', scoreTeamA: 11, scoreTeamB: 8, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Unforced error', scoreTeamA: 12, scoreTeamB: 8, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block error', scoreTeamA: 12, scoreTeamB: 9, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block winner', scoreTeamA: 13, scoreTeamB: 9, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block error', scoreTeamA: 13, scoreTeamB: 10, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Dig error', scoreTeamA: 13, scoreTeamB: 11, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Attack winner', scoreTeamA: 14, scoreTeamB: 11, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Block error', scoreTeamA: 14, scoreTeamB: 12, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Attack error', scoreTeamA: 14, scoreTeamB: 13, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Reception error', scoreTeamA: 14, scoreTeamB: 14, firstName: 'Julius', lastName: 'Brink'},
  {description: 'Attack winner', scoreTeamA: 15, scoreTeamB: 14, firstName: 'Jonas', lastName: 'Reckermann'},
  {description: 'Unforced error', scoreTeamA: 16, scoreTeamB: 14, firstName: 'Jonas', lastName: 'Reckermann'}
]

export default class LineChartComponent extends React.Component {

  state = {
    moves: []
  }

  componentDidMount () {
    this.fetch(a)
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  componentDidUpdate (prevProps, prevState) {
    this.draw(prevState.moves.length)
  }

  draw = (update) => {
    if (update) {
      this.lineChart.update(this.state.moves)
    } else {
      this.lineChart = new LineChart({
        target: this.refs.svg
      })
      this.lineChart.setTeams('Brink / Reckermann', 'Cerutti / Rego')
      this.lineChart.render(this.state.moves)
    }
  }

  resize = () => {
    const {svg} = this.refs
    svg.removeChild(svg.firstChild)
    const width = svg.offsetWidth
    this.lineChart = new LineChart({
      target: this.refs.svg,
      width
    })
    this.lineChart.render(this.state.moves)
  }

  onClick = () => {
    this.fetch(b)
  }

  fetch = (moves) => {
    window.setTimeout(() => {
      this.setState({moves})
    }, 500)
  }

  render () {
    return (
      <section>
        <div ref='svg' />
        <button onClick={this.onClick}>
          Animate
        </button>
      </section>
    )
  }

}
