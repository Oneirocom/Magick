import { Emitter, Connection } from '@magickml/rete'
import { EventsTypes } from './events'

function toTrainCase(str: string) {
  return str.toLowerCase().replace(/ /g, '-')
}

export function getMapItemRecursively<T>(
  map: WeakMap<Element, T>,
  el: Element
): T | null {
  return (
    map.get(el) ||
    (el.parentElement ? getMapItemRecursively(map, el.parentElement) : null)
  )
}

export function defaultPath(points: number[], curvature: number) {
  const [x1, y1, x2, y2] = points
  const hx1 = x1 + Math.abs(x2 - x1) * curvature
  const hx2 = x2 - Math.abs(x2 - x1) * curvature

  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}

export function renderPathData(
  emitter: Emitter<EventsTypes>,
  points: number[],
  connection?: Connection
) {
  const data = { points, connection, d: '' }

  emitter.trigger('connectionpath', data)

  return data.d || defaultPath(points, 0.4)
}

export function updateConnection({ el, d }: { el: HTMLElement; d: string }) {
  const path = el.querySelector('.connection path')

  if (!path) throw new Error('Path of connection was broken')

  path.setAttribute('d', d)
}

export function renderConnection({
  el,
  d,
  connection,
}: {
  el: HTMLElement
  d: string
  connection?: Connection
}) {
  const classed = !connection
    ? []
    : [
        'input-' + toTrainCase(connection.input.name),
        'output-' + toTrainCase(connection.output.name),
        'socket-input-' + toTrainCase(connection.input.socket.name),
        'socket-output-' + toTrainCase(connection.output.socket.name),
      ]

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  // Create SVG filter for the glow effect
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const filter = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'filter'
  )
  filter.setAttribute('id', 'glow')
  const feGaussianBlur = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feGaussianBlur'
  )
  feGaussianBlur.setAttribute('stdDeviation', '4')
  feGaussianBlur.setAttribute('result', 'coloredBlur')
  const feFlood = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feFlood'
  )
  feFlood.setAttribute('flood-color', 'white')
  feFlood.setAttribute('flood-opacity', '0.75')
  feFlood.setAttribute('result', 'glowColor')
  const feComposite = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feComposite'
  )
  feComposite.setAttribute('in', 'glowColor')
  feComposite.setAttribute('in2', 'coloredBlur')
  feComposite.setAttribute('operator', 'in')
  feComposite.setAttribute('result', 'glowComposite')
  const feMerge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feMerge'
  )
  const feMergeNode = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feMergeNode'
  )
  feMergeNode.setAttribute('in', 'glowComposite')
  const feMergeNode2 = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'feMergeNode'
  )
  feMergeNode2.setAttribute('in', 'SourceGraphic')

  feMerge.appendChild(feMergeNode)
  feMerge.appendChild(feMergeNode2)
  filter.appendChild(feGaussianBlur)
  filter.appendChild(feFlood)
  filter.appendChild(feComposite)
  filter.appendChild(feMerge)
  defs.appendChild(filter)
  svg.appendChild(defs)

  svg.classList.add('connection', ...classed)
  path.classList.add('main-path')

  path.setAttribute('d', d)

  svg.appendChild(path)
  el.appendChild(svg)

  updateConnection({ el, d })

  // const observer = new MutationObserver(mutations => {
  //   mutations.forEach(mutation => {
  //     console.log('CHANGES!')
  //     if (
  //       mutation.type === 'attributes' &&
  //       mutation.attributeName === 'class'
  //     ) {
  //       const target = mutation.target as HTMLElement
  //       const path = target.querySelector('.main-path')
  //       if (target.classList.contains('selected')) {
  //         if (path) path.setAttribute('filter', 'url(#glow)')
  //       } else {
  //         if (path) path.removeAttribute('filter')
  //       }
  //     }
  //   })
  // })

  // // Call the observer with the right element selector.
  // observer.observe(document.querySelector('.connection-wrapper'), {
  //   attributes: true,
  // })
}
