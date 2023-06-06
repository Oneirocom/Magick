// DOCUMENTED 
/** This component represents FineTuneResultsFile. It displays the results of
 * fine-tuning a model on a given dataset.
 * @param {string} id - the id of the dataset the model was fine-tuned on
 * @returns {JSX.Element} - a table displaying the results of fine-tuning
*/
import React, { FC } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import useFineTuneResults from './useFineTuneResults';

interface FineTuneResultsFileProps {
  id: string;
}

const FineTuneResultsFile: FC<FineTuneResultsFileProps> = ({ id }) => {
  /** Fetches the results of the fine-tuning process.
   * @param {string} id - the id of the dataset the model was fine-tuned on
   * @returns {Object} - an object containing the results of the fine-tuning process
  */
  const { results, error } = useFineTuneResults(id);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!results) {
    return <Loading />;
  }

  return (
    <table className="w-full text-left" cellPadding={4}>
      <thead>
        <tr>
          <th>Step</th>
          <th>Elapsed Tokens</th>
          <th>Examples</th>
          <th>Training Loss</th>
          <th>Sequence Accuracy</th>
          <th>Token Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {results.map((row) => (
          <tr key={row.step}>
            <td>{row.step}</td>
            <td>{row.elapsed_tokens}</td>
            <td>{row.elapsed_examples}</td>
            <td>{row.training_loss}</td>
            <td>{row.training_sequence_accuracy}</td>
            <td>{row.training_token_accuracy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FineTuneResultsFile;