"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchApplications,
  updateApplicationStatus,
} from "@/lib/features/applications/applicationsSlice";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import ApplicationCard from "./ApplicationCard";

const STATUSES = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"];

export default function ApplicationBoard() {
  const dispatch: AppDispatch = useDispatch();

  const { items: applications, status } = useSelector(
    (state: RootState) => state.application
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchApplications());
    }
  }, [status, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const cardId = active.id as string;
    const columnId = over.id as string;

    const currentCard = applications.find((app) => app.id === cardId);

    if (currentCard && currentCard.status !== columnId) {
      dispatch(updateApplicationStatus({ id: cardId, status: columnId }));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {status === "loading" && <p>Loading applications...</p>}
      {status === "failed" && <p>Error loading data.</p>}
      {status === "succeeded" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {STATUSES.map((statusTitle) => (
            <Column key={statusTitle} id={statusTitle} title={statusTitle}>
              {applications
                .filter((app) => app.status === statusTitle)
                .map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
            </Column>
          ))}
        </div>
      )}
    </DndContext>
  );
}
