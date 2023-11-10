import { GraphJSON } from '@magickml/behave-graph';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';

import { Modal } from './Modal.js';

export type Examples = {
  [key: string]: GraphJSON;
};

export type LoadModalProps = {
  open?: boolean;
  onClose: () => void;
  setBehaviorGraph: (value: GraphJSON) => void;
  examples: Examples;
};

export const LoadModal: React.FC<LoadModalProps> = ({
  open = false,
  onClose,
  setBehaviorGraph,
  examples
}) => {
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState('');

  const instance = useReactFlow();

  useEffect(() => {
    if (selected) {
      setValue(JSON.stringify(examples[selected], null, 2));
    }
  }, [selected, examples]);

  const handleLoad = useCallback(() => {
    let graph;
    if (value !== undefined) {
      graph = JSON.parse(value) as GraphJSON;
    } else if (selected !== '') {
      graph = examples[selected];
    }

    if (graph === undefined) return;

    setBehaviorGraph(graph);

    // TODO better way to call fit vew after edges render
    setTimeout(() => {
      instance.fitView();
    }, 100);

    handleClose();
  }, [setBehaviorGraph, value, instance]);

  const handleClose = () => {
    setValue(undefined);
    setSelected('');
    onClose();
  };

  return (
    <Modal
      title="Load Graph"
      actions={[
        { label: 'Cancel', onClick: handleClose },
        { label: 'Load', onClick: handleLoad }
      ]}
      open={open}
      onClose={onClose}
    >
      <textarea
        autoFocus
        className="border border-gray-300 w-full p-2 h-32 align-top"
        placeholder="Paste JSON here"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      ></textarea>
      <div className="p-4 text-center text-gray-800">or</div>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full p-3"
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
      >
        <option disabled value="">
          Select an example
        </option>
        {Object.keys(examples).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </Modal>
  );
};
