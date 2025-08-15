"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { closeEditJobModal } from "@/lib/features/ui/uiSlice";
import { editJob } from "@/lib/features/jobs/jobsSlice";
import { JobStatus, Job, JobType } from "@/lib/type";
import toast from "react-hot-toast";

export default function EditJobModal() {
  const dispatch: AppDispatch = useDispatch();

  const { isEditJobModalOpen, editingJobId } = useSelector(
    (state: RootState) => state.ui
  );

  const jobToEdit = useSelector((state: RootState) =>
    state.jobs.items.find((job) => job.id === editingJobId)
  );

  const [formData, setFormData] = useState<Partial<Job>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        company: jobToEdit.company,
        position: jobToEdit.position,
        status: jobToEdit.status,
        notes: jobToEdit.notes,
        jobUrl: jobToEdit.jobUrl,
        type: jobToEdit.type,
        color: jobToEdit.color,
        reminderAt: jobToEdit.reminderAt
          ? new Date(jobToEdit.reminderAt).toISOString().split("T")[0]
          : "",
      });
      setErrors({});
    }
  }, [jobToEdit]);

  // Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.company?.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.position?.trim()) {
      newErrors.position = "Position is required";
    }

    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      newErrors.jobUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      dispatch(closeEditJobModal());
    }
  };

  if (!isEditJobModalOpen || !jobToEdit) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        ...formData,
        company: formData.company?.trim(),
        position: formData.position?.trim(),
        notes: formData.notes?.trim(),
        jobUrl: formData.jobUrl?.trim() || undefined,
        reminderAt: formData.reminderAt || undefined,
      };

      await dispatch(editJob({ id: jobToEdit.id, ...updateData })).unwrap();
      toast.success("Job updated successfully!");
      dispatch(closeEditJobModal());
    } catch (error) {
      toast.error(`Failed to update job: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/50 fixed inset-0 bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className=" text-black p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Job Application</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company and Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g., Google, Microsoft"
                value={formData.company || ""}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.company
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-green-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position / Role *
              </label>
              <input
                type="text"
                name="position"
                placeholder="e.g., Software Engineer, Product Manager"
                value={formData.position || ""}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.position
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-green-500"
                }`}
                disabled={isSubmitting}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>
          </div>

          {/* Status and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              >
                {Object.values(JobStatus).map((s) => (
                  <option key={s} value={s}>
                    {s
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              >
                {Object.values(JobType).map((t) => (
                  <option key={t} value={t}>
                    {t
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              name="jobUrl"
              placeholder="https://company.com/jobs/posting"
              value={formData.jobUrl || ""}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.jobUrl
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-green-500"
              }`}
              disabled={isSubmitting}
            />
            {errors.jobUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.jobUrl}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes & Additional Details
            </label>
            <textarea
              name="notes"
              placeholder="Contact person, interview notes, salary expectations, etc."
              value={formData.notes || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
              disabled={isSubmitting}
            />
          </div>

          {/* Reminder and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Date
              </label>
              <input
                type="date"
                name="reminderAt"
                value={formData.reminderAt || ""}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Set a follow-up reminder
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="color"
                  value={formData.color || "#3B82F6"}
                  onChange={handleInputChange}
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <div
                    className="w-full h-8 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.color || "#3B82F6" }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-1">Preview color</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
