import React, { useState } from 'react'
import { Slider as ShadSlider, Input } from '@magickml/ui'

type SliderControl = {
  name: string
  dataKey: string
  options?: {
    min?: number
    max?: number
    step?: number
    defaultValue?: number
    tooltip?: string
  }
}

type Props = {
  control: SliderControl
  updateData: (data: any) => void
  initialValue?: number
}

const SliderControl: React.FC<Props> = ({
  control,
  updateData,
  initialValue = 1,
}) => {
  console.log('InputControl', control, updateData, initialValue)

  const { dataKey, name, options } = control
  const [value, setValue] = useState(initialValue)

  const onChange = (newValues: number[]) => {
    const newValue = newValues[0]
    setValue(newValue)
    updateData({ [dataKey]: newValue })
  }

  return (
    <div className="flex items-center justify-between gap-x-4">
      <ShadSlider
        defaultValue={[options?.defaultValue] ?? [1]}
        value={[value]}
        min={options?.min ?? 1}
        max={options?.max ?? 100}
        step={options?.step ?? 1}
        onValueChange={onChange}
        aria-label={name}
        title={name}
      />
      <Input
        value={value}
        type="number"
        onChange={e => {
          const newValue = Number(e.target.value)
          setValue(newValue)
          updateData({ [dataKey]: newValue })
        }}
        className="w-24"
        step={options?.step ?? 1}
        min={options?.min ?? 1}
        max={options?.max ?? 100}
      />
    </div>
  )
}

export default SliderControl
