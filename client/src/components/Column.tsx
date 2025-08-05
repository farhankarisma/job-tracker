"use client";
import { useDroppable } from "@dnd-kit/core";
import { ColumnProps } from "@/lib/type";

export default function Column({ id, title, children }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
      <h2 className="text-lg font-bold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
