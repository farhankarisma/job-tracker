"use client";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "@/lib/features/auth/authSlice";
import AddNewApplication from "@/components/AddNewApplication";
import ApplicationBoard from "@/components/ApplicationBoard";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { token } = useSelector((state: RootState) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      router.push("/login");
    }
  }, [token, isClient, router]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isClient || !token) {
    return (
      <div className="flex justify-center items-center h-screen">Loading</div>
    );
  }

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Job Tracker</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <AddNewApplication />
      <ApplicationBoard />
    </main>
  );
}
