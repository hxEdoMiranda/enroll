"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableGroup } from "./SortableGroup";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { cn, isActionError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useQuestionnaire } from "../[id]/components/QuestionnaireProvider";

export const Groups = ({ questionnaireId }: { questionnaireId: string }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const { questionnaire, setQuestionnaire } = useQuestionnaire();

  const groups = questionnaire.groups;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = () => {
    if (isReordering) return;
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((_, index) => index === active.id);
      const newIndex = groups.findIndex((_, index) => index === over.id);

      const newGroups = arrayMove(groups, oldIndex, newIndex);

      try {
        setIsReordering(true);

        setQuestionnaire({
          ...questionnaire,
          groups: newGroups,
        });

        const result = await updateQuestionnaireById({
          id: questionnaireId,
          groups: newGroups.map((group) => ({
            ...group,
            questions: group.questions.map(({ _id }) => _id),
          })),
        });

        if (isActionError(result)) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating group order:", error);
        setQuestionnaire({
          ...questionnaire,
          groups: newGroups,
        });
      } finally {
        setIsReordering(false);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white/50 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200",
          isReordering ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Guardando orden...</span>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groups.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {groups.map((group, index) => (
            <SortableGroup
              key={index}
              index={index}
              group={group}
              isDragging={isDragging}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
