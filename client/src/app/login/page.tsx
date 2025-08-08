import ApplicationBoard from "@/components/ApplicationBoard";
import AddNewApplication from "@/components/AddNewApplication";
import EditApplicationModal from "@/components/EditApplicationModal";

export default function HomePage() {
  return (
    <main className="p-4 sm:p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Job Tracker</h1>

      <AddNewApplication />
      <ApplicationBoard />
      <EditApplicationModal />
    </main>
  );
}
