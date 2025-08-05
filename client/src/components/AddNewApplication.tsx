"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addApplication } from "@/lib/features/applications/applicationsSlice";

export default function AddNewApplication() {
  const dispatch: AppDispatch = useDispatch();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    dispatch(addApplication({ company, role, status: "WISHLIST", url }));

    setCompany("");
    setRole("");
    setUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 rounded-lg shadow-sm"
    >
      <h2 className="text-lg font-bold mb-4">Add New Application</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Role / Position"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border rounded"
          required
        />
        {/* 2. Add the input field for the URL */}
        <input
          type="text"
          placeholder="Job Posting URL (Optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 w-full sm:w-auto bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Application
      </button>
    </form>
  );
}
