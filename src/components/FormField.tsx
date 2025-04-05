// src/components/FormField.tsx
export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}
