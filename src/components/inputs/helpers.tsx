export const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) => (
  <div className="flex flex-col">
    <label className="font-medium text-sm mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className="bg-white border border-gray-300 shadow-sm px-3 py-2 rounded"
    />
  </div>
);
