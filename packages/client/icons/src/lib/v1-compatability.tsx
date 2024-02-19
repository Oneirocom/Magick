import * as React from 'react'

// Import all icon components
import {
  Account,
  Add,
  Ankh,
  Bird,
  Close,
  Cloth,
  Cup,
  DangerTrash,
  Delete,
  Feathers,
  Fewshot,
  Folder,
  Hand,
  Info,
  Merge,
  Minus,
  Moon,
  Newnode,
  NodeLock,
  Pause,
  Person,
  PlayPrint,
  Play,
  Properties,
  Refresh,
  Search,
  Seive,
  Snake,
  State,
  StateRead,
  StateWrite,
  Stop,
  StopSign,
  Switch,
  Temperature,
  Text,
  Tiles,
  Time,
  Trash,
  Warn,
  Water,
  WaterPlay,
  WaterRun,
} from './editor'

// Map of all available icon components
const iconComponents = {
  account: Account,
  add: Add,
  ankh: Ankh,
  bird: Bird,
  close: Close,
  cloth: Cloth,
  cup: Cup,
  'danger-trash': DangerTrash,
  delete: Delete,
  feathers: Feathers,
  fewshot: Fewshot,
  folder: Folder,
  hand: Hand,
  info: Info,
  merge: Merge,
  minus: Minus,
  moon: Moon,
  newnode: Newnode,
  'node-lock': NodeLock,
  pause: Pause,
  person: Person,
  'play-print': PlayPrint,
  play: Play,
  properties: Properties,
  refresh: Refresh,
  search: Search,
  seive: Seive,
  snake: Snake,
  state: State,
  'state-read': StateRead,
  'state-write': StateWrite,
  stop: Stop,
  'stop-sign': StopSign,
  switch: Switch,
  temperature: Temperature,
  text: Text,
  time: Time,
  tiles: Tiles,
  trash: Trash,
  warn: Warn,
  water: Water,
  'water-play': WaterPlay,
  'water-run': WaterRun,
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

type IconProps = {
  name?: keyof typeof iconComponents
  size?: number | string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const Icon = ({
  name = 'warn',
  size = 16,
  style = {},
  onClick = () => {},
}: IconProps) => {
  const IconComponent = iconComponents[name]
  return (
    <div
      onClick={onClick}
      //   className={css.icon}
      style={{ height: size, width: size, ...style }}
    >
      {IconComponent ? <IconComponent width={size} height={size} /> : null}
    </div>
  )
}
