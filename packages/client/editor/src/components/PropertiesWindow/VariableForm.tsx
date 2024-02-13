import React, { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@magickml/client-ui'

export const VariableControl = () => {
  const [name, setName] = useState('level')
  const [type, setType] = useState('Integer')
  const [value, setValue] = useState(0)

  return (
    <div className="bg-[var(--background-color)] p-6 rounded-xl shadow-md max-w-md mx-auto my-8">
      <div className="flex items-center mb-2">
        <label className="text-gray-300 text-sm mr-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="shadow appearance-none border border-gray-600 bg-[var(--foreground-color)] text-white rounded py-1 px-1 leading-tight focus:outline-none focus:border-gray-500 flex-1"
        />
      </div>
      <div className="flex items-center mb-2">
        <label className="text-gray-300 text-sm mr-2">Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Integer">Integer</SelectItem>
            <SelectItem value="String">String</SelectItem>
            <SelectItem value="Boolean">Boolean</SelectItem>
            {/* Add more options for other types here */}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <label className="text-gray-300 text-sm mr-2">Value</label>
        <input
          type="number"
          value={value}
          onChange={e => setValue(parseInt(e.target.value, 10))}
          className="shadow appearance-none border border-gray-600 bg-[var(--foreground-color)] text-white rounded py-2 px-3 leading-tight focus:outline-none focus:border-gray-500 flex-1"
        />
        {/* Increment and decrement buttons would go here */}
      </div>
    </div>
  )
}
