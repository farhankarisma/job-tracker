"use client";

import { useDraggable } from "@dnd-kit/core";
import { Application } from "@/lib/type";
import { deleteApplication } from "@/lib/features/applications/applicationsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { TiDelete } from "react-icons/ti";
import { openEditModal } from "@/lib/features/ui/uiSlice";

function DragHandle(props: any) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}

export default function ApplicationCard({ app }: { app: Application }) {
  const dispatch: AppDispatch = useDispatch();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: app.id,
    data: { app },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleDelete = (e: React.MouseEvent) => {
    if (
      window.confirm(
        `Are you sure want to delete ${app.role} at ${app.company}?`
      )
    ) {
      dispatch(deleteApplication(app.id));
    }
  };

  const handleEdit = () => {
    dispatch(openEditModal(app.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 border rounded-lg shadow-sm bg-black/65 touch-none relative group overflow-auto"
    >
      <div className="cursor-grab text-gray-400" {...listeners}>
        <DragHandle />
      </div>
      <h3 className="font-bold">{app.role}</h3>
      <p className="text-black">{app.company}</p>
      <a href={app.url}>Link</a>
      <button
        onClick={handleEdit}
        className="p-1 text-white"
        aria-label="Edit application"
      >
        {/* Simple SVG for a pencil icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </button>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <TiDelete size={24} />
      </button>
    </div>
  );
}
