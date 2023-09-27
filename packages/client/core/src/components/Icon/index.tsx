// DOCUMENTED
import * as React from 'react'
import css from './icon.module.css'

import account from './icons/account.svg'
import add from './icons/add.svg'
import ankh from './icons/ankh.svg'
import bird from './icons/bird.svg'
import cloth from './icons/cloth.svg'
import cup from './icons/cup.svg'
import feathers from './icons/feathers.svg'
import fewshot from './icons/fewshot.svg'
import hand from './icons/hand.svg'
import info from './icons/info.svg'
import merge from './icons/merge.svg'
import minus from './icons/minus.svg'
import moon from './icons/moon.svg'
import newnode from './icons/newnode.svg'
import pause from './icons/pause.svg'
import person from './icons/person.svg'
import playPrint from './icons/play-print.svg'
import play from './icons/play.svg'
import properties from './icons/properties.svg'
import refresh from './icons/refresh.svg'
import search from './icons/search.svg'
import seive from './icons/seive.svg'
import snake from './icons/snake.svg'
import state from './icons/state.svg'
import stateRead from './icons/state-read.svg'
import stateWrite from './icons/state-write.svg'
import stop from './icons/stop.svg'
import stopSign from './icons/stop-sign.svg'
import switchIcon from './icons/switch.svg'
import temperature from './icons/temperature.svg'
import text from './icons/text.svg'
import time from './icons/time.svg'
import warn from './icons/warn.svg'
import water from './icons/water.svg'
import waterPlay from './icons/water-play.svg'
import waterRun from './icons/water-run.svg'
import folder from './icons/folder.svg'
import close from './icons/close.svg'
import tiles from './icons/tiles.svg'
import trash from './icons/trash.svg'
import dangerTrash from './icons/danger-trash.svg'
import nodeLock from './icons/node-lock.svg'
import lock from './icons/Lock.svg'
import trashLine from './icons/delete.svg'

// Map of all available icons
const icons = {
  account,
  add,
  ankh,
  bird,
  cloth,
  cup,
  feathers,
  fewshot,
  hand,
  info,
  merge,
  minus,
  moon,
  newnode,
  pause,
  person,
  'play-print': playPrint,
  play,
  properties,
  refresh,
  search,
  seive,
  snake,
  state,
  'state-read': stateRead,
  'state-write': stateWrite,
  stop,
  'stop-sign': stopSign,
  switch: switchIcon,
  temperature,
  text,
  time,
  warn,
  water,
  'water-play': waterPlay,
  'water-run': waterRun,
  folder,
  close,
  tiles,
  trash,
  trashLine,
  'danger-trash': dangerTrash,
  'node-lock': nodeLock,
  lock: lock,
}

// Categories for components and data controls
export const componentCategories = {
  'AI/ML': 'play-print',
  IO: 'water',
  Logic: 'switch',
  State: 'state',
  Module: 'cup',
  Core: 'ankh',
}

export const dataControlCategories = {
  'Data Inputs': 'properties',
  'Data Outputs': 'properties',
  Fewshot: 'fewshot',
  Stop: 'stop-sign',
  Temperature: 'temperature',
  'Max Tokens': 'moon',
}

/**
 * Icon Component Prop types
 */
type IconProps = {
  name?: string
  size?: number | string
  style?: React.CSSProperties
  onClick?: Function
}

/**
 * Icon Component
 * @param name - icon name, default is 'warn'
 * @param size - icon size, default is 16
 * @param style - CSS properties, default is an empty object
 * @param onClick - event handler for click event, default is an empty function
 * @returns Icon JSX Element
 */
export const Icon = ({
  name = 'warn',
  size,
  style = {},
  onClick = () => {
    /* null */
  },
}: IconProps) => {
  return (
    <div
      onClick={e => onClick(e)}
      className={`${css['icon']}`}
      style={{ height: size ?? 16, width: size, ...style }}
    >
      <img src={icons[name]} alt={name} />
    </div>
  )
}
