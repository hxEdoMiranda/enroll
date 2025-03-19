"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, EllipsisVertical, GripVertical } from "lucide-react";
import { GroupedQuestions } from "./GroupedQuestions";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddQuestionForm } from "./AddQuestionForm";
import { Group } from "@/modules/questionnaires/types/questionnaires";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditGroupForm } from "../[id]/components/EditGroupForm";
import { DeleteGroupForm } from "../[id]/components/DeleteGroupForm";

export const SortableGroup = ({
  group,
  isDragging,
  index,
}: {
  group: Group;
  isDragging: boolean;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisItemDragging,
  } = useSortable({
    id: index,
    transition: {
      duration: 150,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: !isThisItemDragging ? transition : undefined,
    zIndex: isThisItemDragging ? 2 : 1,
    position: "relative" as const,
    touchAction: "none",
  };

  const handleDragStart = () => {
    setIsOpen(false);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "mb-4 transition-all duration-200 rounded-lg bg-white border border-primary shadow-lg",
          isThisItemDragging && "scale-[1.02] cursor-grabbing opacity-90",
          isDragging && !isThisItemDragging && "transition-transform"
        )}
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-between items-center p-2 font-medium">
            <div className="flex gap-4">
              <button
                {...attributes}
                {...listeners}
                className="touch-none"
                onMouseDown={handleDragStart} // Close before drag starts
                onTouchStart={handleDragStart}
              >
                <GripVertical
                  className={cn(
                    "h-5 w-5 text-gray-500 transition-colors",
                    "hover:text-gray-700 cursor-grab active:cursor-grabbing",
                    isThisItemDragging && "cursor-grabbing text-gray-700"
                  )}
                />
              </button>
              <p>
                {group.name}{" "}
                <span className="text-[#626262]">{`(${group.questions.length} preguntas)`}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DropdownMenu
                  open={dropDownOpen}
                  onOpenChange={(isOpen) => {
                    setDropDownOpen(isOpen);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropDownOpen(false);
                          setModalContent(
                            <EditGroupForm
                              defaultValues={{
                                name: group.name,
                                description: group.description,
                              }}
                              groupIndex={index}
                            />
                          );
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropDownOpen(false);
                          setModalContent(
                            <AddQuestionForm groupIndex={index} />
                          );
                        }}
                      >
                        Añadir Pregunta
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => {
                          setDropDownOpen(false);
                          setModalContent(
                            <DeleteGroupForm groupIndex={index} />
                          );
                        }}
                      >
                        Eliminar grupo
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                  <DialogContent>{modalContent}</DialogContent>
                </DropdownMenu>
              </Dialog>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <div className="mx-4 flex flex-col gap-2">
              <p className="text-[#626262]">{group.description}</p>
              <GroupedQuestions
                groupIndex={index}
                key={group.questions.length}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
