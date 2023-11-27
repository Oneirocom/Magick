// DOCUMENTED
import CodeControl from './CodeControl'
import css from './datacontrols.module.css'
import Info from './Info'
import Input from './Input'
import InputGenerator from './InputGenerator'
import LongText from './LongTextControl'
import OutputGenerator from './OutputGenerator'
import DropdownSelect from './DropdownSelect'
import SocketGenerator from './SocketGenerator'
import MultiSocketGenerator from './MultiSocketGenerator'
import PlaytestControl from './PlaytestControl'
import SwitchControl from './SwitchControl'
import SpellSelect from './SpellSelect'
import CheckBoxControl from './CheckBox'
import { ControlData } from '@magickml/core'
import { Tooltip } from '@mui/material'
import CollectionSelect from './CollectionSelect'

/**
 * Stub component for unknown control types.
 * @param props - The properties for the stub component.
 * @returns A simple div containing the given props name.
 */
const StubComponent = (props: { name: string }) => <div>{props.name}</div>

// Mapping of data control labels to their corresponding components
const controlMap = {
  code: CodeControl,
  dial: StubComponent,
  info: Info,
  input: Input,
  inputGenerator: InputGenerator,
  longText: LongText,
  spellSelect: SpellSelect,
  outputGenerator: OutputGenerator,
  slider: StubComponent,
  multiSocketGenerator: MultiSocketGenerator,
  socketGenerator: SocketGenerator,
  playtest: PlaytestControl,
  switch: SwitchControl,
  dropdownSelect: DropdownSelect,
  checkbox: CheckBoxControl,
  collectionSelect: CollectionSelect,
}

// type DataControl = {
//   component: string
//   dataKey: string
//   label: string
//   type: string
//   options?: any
//   name?: string
//   data: Record<string, any>
// }

export type DataControlsProps = {
  dataControls: { [key: string]: ControlData }
  updateData: Function
  updateControl: Function
  width: number
  data: unknown
  inspectorData: Record<string, any>
  nodeId: number
  tab?: string
}

/**
 * DataControls component for displaying various data controls.
 * @param dataControls - The data controls object to render.
 * @param updateData - The updateData function for updating data values.
 * @param updateControl - The updateControl function for updating controls.
 * @param width - Width of the data control container.
 * @param data - Data object to pass through to each data control component.
 * @param inspectorData - Inspector data for the inspection target.
 * @param nodeId - The unique node ID for the control container.
 * @param tab - The optional tab name if using tabs within a control.
 * @returns The rendered DataControls component.
 */
const DataControls = ({
  dataControls,
  updateData,
  updateControl,
  width,
  data,
  inspectorData,
  nodeId,
  tab = null,
}: DataControlsProps) => {
  if (!dataControls) {
    return <p className={css['message']}>No component selected</p>
  }
  if (Object.keys(dataControls).length < 1) {
    return <p className={css['message']}>Selected component has no controls</p>
  }

  return (
    <>
      {Object.entries(dataControls).map(([key, control]) => {
        // Default props to pass through to every data control

        const controlProps = {
          nodeId,
          width,
          control,
          name: inspectorData.name + ' (' + key + ')',
          initialValue:
            data[control.dataKey] === 0 ? 0 : data[control.dataKey] || '',
          updateData,
          tab,
        }

        const Component = controlMap[control.component]

        if (!Component) return null

        if (control.component === 'info' && !control?.data?.info) return null
        return (
          <div
            key={control.name + nodeId + key}
            style={{
              marginBottom: '2em',
              borderRadius: '5px',
            }}
          >
            <Tooltip
              title={control.tooltip ? control.tooltip : control.name}
              placement="top-start"
              arrow
            >
              <p style={{ margin: 0, marginBottom: '10px' }}>
                {control.name || key}
              </p>
            </Tooltip>
            <Component key={nodeId + control.name} {...controlProps} />
          </div>
        )
      })}
    </>
  )
}

export default DataControls
