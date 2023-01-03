import Box from '@mui/material/Box'
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

const StubComponent = props => <div>{props.name}</div>

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
}

const DataControls = ({
  dataControls,
  updateData,
  updateControl,
  width,
  data,
  inspectorData,
  nodeId,
  tab = null,
}) => {
  if (!dataControls)
    return <p className={css['message']}>No component selected</p>
  if (Object.keys(dataControls).length < 1)
    return (
      <p className={css['message']}>
        Selected component has nothing to inspect
      </p>
    )

  return (
    <>
      {Object.entries(dataControls).map(([key, control]) => {
        // Default props to pass through to every data control
        const controlProps = {
          nodeId,
          width,
          control,
          name: inspectorData.name + ' (' + key + ')',
          initialValue: data[control.dataKey] || '',
          updateData,
          tab,
        }

        const Component = controlMap[control.component]

        if (!Component) return null

        if (control.component === 'info' && !control?.data?.info) return null

        return (
          <Box
            key={control.name + nodeId + key}
            sx={{
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <p style={{ margin: 0, marginBottom: '10px' }}>
              {control.name || key}
            </p>
            <Component key={nodeId + control.name} {...controlProps} />
          </Box>
        )
      })}
    </>
  )
}

export default DataControls
