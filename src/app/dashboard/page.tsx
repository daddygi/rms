import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard 👋</h1>
      </div>
      <p className="mt-2 text-gray-600">You're now logged in!</p>
    </main>
  );
}
