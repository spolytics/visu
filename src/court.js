
import {select} from 'd3-selection'

const defaults = {
  width: 480,
  height: 640,
  margin: {
    top: 15,
    right: 10,
    bottom: 35,
    left: 60
  },
  click: () => {}
}

export default class Court {
  constructor (config) {
    Object.assign(this, defaults, config)
    this.init()
  }

  init () {
    const {target, width, height, margin} = this
    const w = this.w = width - margin.left - margin.right
    const h = this.h = height - margin.top - margin.bottom

    this.chart = select(target)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // margin horizontal
    this.mh = 0.10 * w
    // margin vertical
    this.mv = 0.10 * h

    this.zoneWidth = (w - 2 * this.mh) / 3
    this.zoneHeight = (h - 3 * this.mv) / 2 / 3

    const zones = [
      [
        {
          side: 'b',
          number: 4
        },
        {
          side: 'b',
          number: 3
        },
        {
          side: 'b',
          number: 2
        }
      ],
      [
        {
          side: 'b',
          number: 7
        },
        {
          side: 'b',
          number: 8
        },
        {
          side: 'b',
          number: 9
        }
      ],
      [
        {
          side: 'b',
          number: 5
        },
        {
          side: 'b',
          number: 6
        },
        {
          side: 'b',
          number: 1
        }
      ],
      [
        {
          side: 'a',
          number: 4
        },
        {
          side: 'a',
          number: 3
        },
        {
          side: 'a',
          number: 2
        }
      ],
      [
        {
          side: 'a',
          number: 7
        },
        {
          side: 'a',
          number: 8
        },
        {
          side: 'a',
          number: 9
        }
      ],
      [
        {
          side: 'a',
          number: 5
        },
        {
          side: 'a',
          number: 6
        },
        {
          side: 'a',
          number: 1
        }
      ]
    ]

    const grid = this.chart.selectAll('.row')
      .data(zones)
      .enter()
      // add group for row
      .append('g')
      .attr('transform', (d, i) => {
        let y = i * this.zoneHeight
        if (i > 2) {
          y += this.zoneHeight
        }
        return `translate(0, ${this.mv + y})`
      })
      .selectAll('.zone')
      .data(d => d)
      .enter()
      // add group for rect and text
      .append('g')
      .attr('transform', (d, i) => {
        const x = i * this.zoneWidth
        return `translate(${this.mh + x}, 0)`
      })
      .attr('class', d => `zone side${d.side} number${d.number}`)

      // add rect
    grid.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.zoneWidth)
      .attr('height', this.zoneHeight)
      .on('click', this.click)

      // add text
    grid.append('text')
      .attr('x', this.zoneWidth / 2)
      .attr('y', this.zoneHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('pointer-events', 'none')
      .text(d => d.number)

    this.chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', `translate(${w / 2}, ${this.mv + 3.75 * this.zoneHeight})`)
      .attr('fill', '#666')
      .text('start zone')

    this.chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', `translate(${w / 2}, ${this.mv - 0.25 * this.zoneHeight})`)
      .attr('fill', '#666')
      .text('end zone')
  }

  setStartZone (side, number) {
    this.chart.select(`.zone.side${side}.number${number}`).classed('start', true)
  }

  setEndZone (side, number) {
    this.chart.select(`.zone.side${side}.number${number}`).classed('end', true)
  }

  clearAll () {
    this.chart.selectAll('.zone').classed('start', false)
    this.chart.selectAll('.zone').classed('end', false)
  }
}
