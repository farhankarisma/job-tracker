"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useEffect, useState } from "react";
import { closeEditModal } from "@/lib/features/ui/uiSlice";
import { editApplication } from "@/lib/features/applications/applicationsSlice";


export default function EditApplicationModal() {
  const dispatch: AppDispatch = useDispatch();
  const { isEditModalOpen, editingApplicationId } = useSelector(
    (state: RootState) => state.ui
  );

  const applicationToEdit = useSelector((state: RootState) =>
    state.application.items.find((app) => app.id === editingApplicationId)
  );

  const [formData, setFormData] = useState({ company: "", role: "", url: "" });

  useEffect(() => {
    if (applicationToEdit) {
      setFormData({
        company: applicationToEdit.company,
        role: applicationToEdit.role,
        url: applicationToEdit.url || "",
      });
    }
  }, [applicationToEdit]);

  if (!isEditModalOpen || !applicationToEdit) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(editApplication({ id: applicationToEdit.id, ...formData }));
    dispatch(closeEditModal());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <input
                type="text"
                name="role"
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL
              </label>
              <input
                type="text"
                name="url"
                id="url"
                value={formData.url}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => dispatch(closeEditModal())}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
