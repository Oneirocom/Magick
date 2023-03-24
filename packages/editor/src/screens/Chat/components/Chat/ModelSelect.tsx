import { OpenAIModel } from "../../../../types";
import { FC } from "react";
import styles from './styles.module.css';

interface Props {
  model: OpenAIModel;
  models: OpenAIModel[];
  onModelChange: (model: OpenAIModel) => void;
}

export const ModelSelect: FC<Props> = ({ model, models, onModelChange }) => {
  return (
    <div className={styles.modelContainer}>
      <label className={styles.label}>Model</label>
      <select
        className={styles.select}
        placeholder="Select a model"
        value={model.id}
        onChange={(e) => {
          onModelChange(models.find((model) => model.id === e.target.value) as OpenAIModel);
        }}
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};
