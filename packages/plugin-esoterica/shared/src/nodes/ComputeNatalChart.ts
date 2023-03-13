import Rete from 'rete'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  objectSocket,
  stringSocket,
  triggerSocket,
} from '@magickml/engine'

import ephemeris from './ephemeris'
import cities from './main'

const info = 'Returns the same output as the input'

type WorkerReturn = {
  output: string
}

function getZodiacSign(degString) {
  return degString >= 0 && degString <= 30
    ? 'Aries'
    : degString >= 30 && degString <= 60
    ? 'Taurus'
    : degString >= 60 && degString <= 90
    ? 'Gemini'
    : degString >= 90 && degString <= 120
    ? 'Cancer'
    : degString >= 120 && degString <= 150
    ? 'Leo'
    : degString >= 150 && degString <= 180
    ? 'Virgo'
    : degString >= 180 && degString <= 210
    ? 'Libra'
    : degString >= 210 && degString <= 240
    ? 'Scorpio'
    : degString >= 240 && degString <= 270
    ? 'Sagittarius'
    : degString >= 270 && degString <= 300
    ? 'Capricorn'
    : degString >= 300 && degString <= 330
    ? 'Aquarius'
    : degString >= 330 && degString <= 360
    ? 'Pisces'
    : 'No Sign'
}

export class ComputeNatalChart extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Compute Natal Chart')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Esoterica'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const month = new Rete.Input('month', 'Month', stringSocket)
    const day = new Rete.Input('day', 'Day', stringSocket)
    const year = new Rete.Input('year', 'Year', stringSocket)
    const hour = new Rete.Input('hour', 'Hour', stringSocket)
    const minute = new Rete.Input('minute', 'Minute', stringSocket)
    const city = new Rete.Input('city', 'City', stringSocket)
    const country = new Rete.Input('country', 'Country', stringSocket)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(dataInput)
      .addInput(month)
      .addInput(day)
      .addInput(year)
      .addInput(hour)
      .addInput(minute)
      .addInput(city)
      .addInput(country)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  // eslint-disable-next-line @typescript-eslint/require-await, require-await, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const month = inputs.month ? inputs.month[0] : '1'
    const day = inputs.day && inputs.day[0] ? inputs.day[0] : '1'
    const year = inputs.year ? inputs.year[0] : '1980'
    const hour = inputs.hour ? inputs.hour[0] : '12'
    const minute = inputs.minute ? inputs.minute[0] : '0'
    const city = inputs.city ? inputs.city[0] : 'New York'
    const country = inputs.country ? inputs.country[0] : 'United States'

    const coords = cities.getCityGeo(country, city)

    const [lat, lng] = coords

    const birthDate = new Date(month + '.' + day + '.' + year + ', ' + hour + ':' + minute + ':00')

    const astroCalc = ephemeris.getAllPlanets(
      birthDate,
      lat,
      lng,
      0
    )
    
    const degString = astroCalc.observed.sun.apparentLongitudeDd
    const moonDegString = astroCalc.observed.moon.apparentLongitudeDd
    const mercDegString = astroCalc.observed.mercury.apparentLongitudeDd
    const venusDegString = astroCalc.observed.venus.apparentLongitudeDd
    const marsDegString = astroCalc.observed.mars.apparentLongitudeDd
    const jupiterDegString = astroCalc.observed.jupiter.apparentLongitudeDd
    const saturnDegString = astroCalc.observed.saturn.apparentLongitudeDd
    const uranusDegString = astroCalc.observed.uranus.apparentLongitudeDd
    const neptuneDegString = astroCalc.observed.neptune.apparentLongitudeDd
    const plutoDegString = astroCalc.observed.pluto.apparentLongitudeDd

    const zodSign = getZodiacSign(degString)
    const moonZodSign = getZodiacSign(moonDegString)
    const mercZodSign = getZodiacSign(mercDegString)
    const venusZodSign = getZodiacSign(venusDegString)
    const marsZodSign = getZodiacSign(marsDegString)
    const jupiterZodSign = getZodiacSign(jupiterDegString)
    const saturnZodSign = getZodiacSign(saturnDegString)
    const uranusZodSign = getZodiacSign(uranusDegString)
    const neptuneZodSign = getZodiacSign(neptuneDegString)
    const plutoZodSign = getZodiacSign(plutoDegString)

    const returned = {
      sun: zodSign,
      moon: moonZodSign,
      merc: mercZodSign,
      venus: venusZodSign,
      mars: marsZodSign,
      jupiter: jupiterZodSign,
      saturn: saturnZodSign,
      uranus: uranusZodSign,
      neptune: neptuneZodSign,
      pluto: plutoZodSign,
    }

    node.display(JSON.stringify(returned))

    return {
      output: returned,
    }
  }
}
