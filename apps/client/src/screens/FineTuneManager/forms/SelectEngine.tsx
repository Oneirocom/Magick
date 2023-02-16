import { useFormContext } from "react-hook-form";
import Select from "react-select";

export const BaseEngines = ["ada", "babbage", "curie", "davinci"];
export const InstructEngines = ["davinci-instruct-beta", "curie-instruct-beta"];

export default function SelectEngine({
  engines = BaseEngines,
  name = "model",
  required,
}: {
  engines?: string[];
  name: string;
  required?: boolean;
}) {
  const form = useFormContext();

  const options = engines.map((engine) => ({
    label: engine,
    value: engine,
  }));

  return (
    <Select
      {...form.register(name, { required })}
      className="w-44"
      classNamePrefix="react-select"
      defaultValue={options.find(
        (option) => option.value === form.getValues()[name]
      )}
      isClearable={!required}
      escapeClearsValue
      isSearchable={false}
      onChange={(selection) => form.setValue(name, selection?.value ?? "")}
      options={options}
    />
  );
}
