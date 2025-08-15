'use client';

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { closeAddJobModal } from "@/lib/features/ui/uiSlice";
import { addJob } from "@/lib/features/jobs/jobsSlice";
import { JobStatus, JobType } from "@/lib/type";
import toast from "react-hot-toast";

export default function AddApplicationModal() {
  const dispatch: AppDispatch = useDispatch();
  const { isAddJobModalOpen } = useSelector((state: RootState) => state.ui);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<JobStatus>(JobStatus.APPLIED);
  const [type, setType] = useState<JobType>(JobType.INTERNSHIP);
  const [notes, setNotes] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [color, setColor] = useState("#3B82F6"); // Better default color
  const [reminderAt, setReminderAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isAddJobModalOpen) {
      setCompany("");
      setPosition("");
      setStatus(JobStatus.APPLIED);
      setType(JobType.INTERNSHIP);
      setNotes("");
      setJobUrl("");
      setColor("#3B82F6");
      setReminderAt("");
      setErrors({});
    }
  }, [isAddJobModalOpen]);

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!position.trim()) {
      newErrors.position = "Position is required";
    }
    
    if (jobUrl && !isValidUrl(jobUrl)) {
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
      dispatch(closeAddJobModal());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        addJob({
          company: company.trim(),
          position: position.trim(),
          status,
          jobUrl: jobUrl.trim() || undefined,
          type,
          notes: notes.trim(),
          color,
          reminderAt: reminderAt || undefined,
        })
      ).unwrap();

      toast.success("Job application added successfully!");
      dispatch(closeAddJobModal());
    } catch (error) {
      toast.error(`Failed to add job: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAddJobModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-black p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Job Application</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                placeholder="e.g., Google, Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500'
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
                placeholder="e.g., Software Engineer, Product Manager"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500'
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
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              >
                {Object.values(JobStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              >
                {Object.values(JobType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
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
              placeholder="https://company.com/jobs/posting"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.jobUrl ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500'
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
              placeholder="Contact person, interview notes, salary expectations, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Set a follow-up reminder</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <div 
                    className="w-full h-8 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: color }}
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
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
