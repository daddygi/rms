// components/TableSkeleton.tsx
export default function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex space-x-4 p-4 border rounded-md"
        >
          <div className="rounded bg-gray-300 h-4 w-full"></div>
        </div>
      ))}
    </div>
  );
}
