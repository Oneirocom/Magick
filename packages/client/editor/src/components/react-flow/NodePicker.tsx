import { NodeSpecJSON } from '@magickml/behave-graph';
import React, { useEffect, useState } from 'react';
import { useReactFlow, XYPosition } from 'reactflow';
import { useOnPressKey } from '../../hooks/react-flow/useOnPressKey';

export type NodePickerFilters = {
  handleType: 'source' | 'target';
  valueType: string;
};

type NodePickerProps = {
  position: XYPosition;
  filters?: NodePickerFilters;
  onPickNode: (type: string, position: XYPosition) => void;
  onClose: () => void;
  specJSON: NodeSpecJSON[] | undefined;
};

export const NodePicker: React.FC<NodePickerProps> = ({
  position,
  onPickNode,
  onClose,
  filters,
  specJSON
}: NodePickerProps) => {
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const instance = useReactFlow();

  useOnPressKey('Escape', onClose);

  // Your existing filter logic
  let filtered = specJSON;

  if (filters !== undefined) {
    filtered = filtered?.filter((node) => {
      const sockets =
        filters?.handleType === 'source' ? node.outputs : node.inputs;
      return sockets.some((socket) => socket.valueType === filters?.valueType);
    });
  }

  filtered =
    filtered?.filter((node) => {
      const term = search.toLowerCase();
      return node.type.toLowerCase().includes(term);
    }) || [];

  // Autocomplete logic
  const autocompleteSearchTerm = () => {
    if (search.length === 0 || filtered.length === 0) return;

    // Filter to only include items that start with the current search term
    const relevantItems = filtered.filter(node =>
      node.type.toLowerCase().startsWith(search.toLowerCase())
    );

    if (relevantItems.length === 0) return;

    // Function to find the longest common prefix among an array of strings
    const findLongestCommonPrefix = (arr) => {
      if (arr.length === 0) return "";

      let prefix = arr[0];
      for (let i = 1; i < arr.length; i++) {
        while (arr[i].indexOf(prefix) !== 0) {
          prefix = prefix.substring(0, prefix.length - 1);
          if (prefix === "") return "";
        }
      }
      return prefix;
    };

    // Find the longest common prefix that extends the current search term
    const longestCommonPrefix = findLongestCommonPrefix(relevantItems.map(item => item.type));

    if (longestCommonPrefix.length > search.length) {
      setSearch(longestCommonPrefix);
    }
  };
  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        autocompleteSearchTerm();
      }

      if (event.key === 'ArrowDown') {
        setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter' && filtered.length > 0) {
        onPickNode(filtered[focusedIndex].type, instance.project(position));
        onClose(); // Close the picker after selection
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filtered, focusedIndex, onPickNode, instance, position, onClose]);

  return (
    <div
      className="node-picker absolute z-10 text-sm text-white bg-gray-800 border rounded border-gray-500"
      style={{ top: position.y, left: position.x }}
    >
      <div className="bg-gray-500 p-2">Add Node</div>
      <div className="p-2">
        <input
          type="text"
          autoFocus
          placeholder="Type to filter"
          className=" bg-gray-600 disabled:bg-gray-700 w-full py-1 px-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-48 overflow-y-scroll">
        {filtered.map(({ type }, index) => (
          <div
            key={type}
            className={`p-2 cursor-pointer border-b border-gray-600 ${index === focusedIndex ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            onMouseEnter={() => setFocusedIndex(index)}
            onClick={() => onPickNode(type, instance.project(position))}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};
