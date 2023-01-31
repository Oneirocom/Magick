import ErrorMessage from "components/ErrorMessage";
import Loading from "components/Loading";
import React from "react";
import useFineTuneResults from "./useFineTuneResults";

export default function FineTuneResultsFile({ id }: { id: string }) {
  const { results, error } = useFineTuneResults(id);

  if (error) return <ErrorMessage error={error} />;
  if (!results) return <Loading />;

  return (
    <table className="w-full text-left" cellPadding={4}>
      <thead>
        <tr>
          <th>Step</th>
          <th>Elapsed Tokens</th>
          <th>Examples</th>
          <th>Training Loss</th>
          <th>Sequency Accuracy</th>
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
}
