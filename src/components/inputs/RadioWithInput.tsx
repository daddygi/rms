// components/inputs/RadioWithInput.tsx
import React from "react";

type BinaryModeProps = {
  label: string;
  name: string;
  value: boolean;
  inputLabel: string;
  inputValue: string;
  onChange: (name: string, value: boolean, input?: string) => void;
  options?: undefined;
};

type MultiModeProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
  otherValue: string;
  onChange: (name: string, value: string, other?: string) => void;
  inputLabel?: string;
};

type RadioWithInputProps = BinaryModeProps | MultiModeProps;

export const RadioWithInput: React.FC<RadioWithInputProps> = (props) => {
  const isBinary = props.options === undefined;

  if (isBinary) {
    const { label, name, value, inputLabel, inputValue, onChange } = props;

    return (
      <fieldset className="space-y-2">
        <legend className="font-medium">{label}</legend>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name={name}
              checked={value === true}
              onChange={() => onChange(name, true)}
              className="accent-blue-600"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name={name}
              checked={value === false}
              onChange={() => onChange(name, false)}
              className="accent-blue-600"
            />
            <span>No</span>
          </label>
        </div>
        {value && (
          <input
            type="text"
            placeholder={inputLabel}
            value={inputValue}
            onChange={(e) => onChange(name, true, e.target.value)}
            className="border px-3 py-2 rounded w-full mt-2"
          />
        )}
      </fieldset>
    );
  } else {
    const { label, name, value, options, otherValue, onChange } = props;

    return (
      <fieldset className="space-y-2">
        <legend className="font-medium">{label}</legend>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onChange(name, option)}
                className="accent-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
          <label className="flex items-center col-span-2 sm:col-span-1">
            <input
              type="radio"
              name={name}
              value="Other"
              checked={value === "Other"}
              onChange={() => onChange(name, "Other")}
              className="accent-blue-600 mr-2"
            />
            <span className="mr-2">Other:</span>
            {value === "Other" && (
              <input
                type="text"
                className="border px-2 py-1 rounded flex-1"
                placeholder="Please specify"
                value={otherValue}
                onChange={(e) => onChange(name, "Other", e.target.value)}
              />
            )}
          </label>
        </div>
      </fieldset>
    );
  }
};
