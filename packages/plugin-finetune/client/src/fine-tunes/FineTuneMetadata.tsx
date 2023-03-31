// DOCUMENTED 
/** 
 * A Metadata card displaying fine-tune information.
 * @param fineTune - A fine-tuned model object
 */
import { MetadataCard } from '../components/MetadataCard';
import React from 'react';
import { OpenAI } from '../types/openai';

export default function FineTuneMetadata({ fineTune }: { fineTune: OpenAI.FineTune }) {
  return (
    <MetadataCard
      fields={[
        { label: 'ID', value: fineTune.id, clickToCopy: true },
        { label: 'Engine', value: fineTune.model },
        { label: 'Training', value: fineTune.training_files[0]?.filename },
        { label: 'Validation', value: fineTune.validation_files[0]?.filename },
        { label: 'Updated', value: new Date(fineTune.updatedAt * 1000) },
      ]}
    />
  );
}