"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EllipsisVertical, GripVertical, Loader2 } from "lucide-react";
import { cn, isActionError } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { EditQuestionForm } from "./EditQuestionForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddQuestionForm } from "./AddQuestionForm";
import { IQuestion } from "@/modules/questionnaires/types/questionnaires";
import { useQuestionnaire } from "../[id]/components/QuestionnaireProvider";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DeleleteQuestionForm } from "./DeleleteQuestionForm";

const SortableQuestion = ({
  questionnaireId,
  groupIndex,
  defaultQuestion,
  isDragging,
}: {
  questionnaireId: string;
  groupIndex: number;
  defaultQuestion: IQuestion;
  questions: string[];
  isDragging: boolean;
}) => {
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
    id: defaultQuestion._id,
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

  const [question] = useState(defaultQuestion);

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          "mb-4 transition-all duration-200",
          isThisItemDragging &&
            "shadow-2xl scale-[1.02] cursor-grabbing opacity-90",
          isDragging && !isThisItemDragging && "transition-transform"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button {...attributes} {...listeners} className="touch-none">
              <GripVertical
                className={cn(
                  "h-5 w-5 text-gray-500 transition-colors",
                  "hover:text-gray-700 cursor-grab active:cursor-grabbing",
                  isThisItemDragging && "cursor-grabbing text-gray-700"
                )}
              />
            </button>
            <h3 className="font-semibold">{question.text}</h3>
          </div>
          <Dialog>
            <DropdownMenu
              open={dropDownOpen}
              onOpenChange={(isOpen) => setDropDownOpen(isOpen)}
            >
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropDownOpen(false);
                        setModalContent(
                          <AddQuestionForm
                            defaultValues={question}
                            groupIndex={groupIndex}
                          />
                        );
                      }}
                    >
                      Duplicar pregunta
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropDownOpen(false);
                        setModalContent(
                          <EditQuestionForm
                            id={question._id}
                            defaultValues={{
                              options: question.options,
                              text: question.text,
                              type: question.type,
                              groupId: question.groupId,
                            }}
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
                          <DeleleteQuestionForm
                            questionnaireId={questionnaireId}
                            questionId={question._id}
                            groupIndex={groupIndex}
                          />
                        );
                      }}
                    >
                      Eliminar pregunta
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>{modalContent}</DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-4">
          {question.type === "RADIO" && (
            <RadioGroup className="flex flex-wrap gap-2">
              {question.options.map(({ text, score, _id, correct_answer }) => (
                <div key={_id} className={cn("flex items-center space-x-2")}>
                  <RadioGroupItem value={_id} id={_id} className="shrink-0" />
                  <Label
                    className={cn(correct_answer && "text-green-900 font-bold")}
                    htmlFor={_id}
                  >
                    {text}
                  </Label>
                  {score != null && (
                    <Badge className="ml-2" variant="secondary">
                      {score}
                    </Badge>
                  )}
                </div>
              ))}
            </RadioGroup>
          )}
          {question.type === "CHECK" && (
            <div className="flex flex-wrap gap-2">
              {question.options.map(({ text, score, _id, correct_answer }) => (
                <div key={_id} className="flex items-center space-x-2">
                  <Checkbox id={_id} />
                  <label
                    htmlFor={_id}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      correct_answer && "text-green-900 font-bold"
                    )}
                  >
                    {text}
                    {score != null && (
                      <Badge className="ml-2" variant="secondary">
                        {score}
                      </Badge>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}
          {question.type === "OPTION" && (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={question.text} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{question.text}</SelectLabel>
                  {question.options.map(({ text, _id }) => (
                    <SelectItem key={_id} value={_id}>
                      {text}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {question.type === "TEXT" && (
            <Input
              className="max-w-md"
              type="text"
              placeholder={question.text}
            />
          )}
          {question.type === "TEXTAREA" && (
            <Textarea className="max-w-md" placeholder={question.text} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const GroupedQuestions = ({ groupIndex }: { groupIndex: number }) => {
  const { questionnaire } = useQuestionnaire();
  const [questions, setQuestions] = useState(
    questionnaire.groups[groupIndex].questions
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

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
      const oldIndex = questions.findIndex((q) => q._id === active.id);
      const newIndex = questions.findIndex((q) => q._id === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex);

      try {
        setIsReordering(true);
        setQuestions(newQuestions);

        const updatedGroups = questionnaire.groups.map((group, i) => ({
          ...group,
          questions:
            i === groupIndex
              ? newQuestions.map(({ _id }) => _id)
              : group.questions.map(({ _id }) => _id),
        }));

        const result = await updateQuestionnaireById({
          id: questionnaire.uid,
          groups: updatedGroups,
        });

        if (isActionError(result)) {
          throw new Error("Ocurrió un error");
        }
      } catch (error) {
        console.error("Error updating question order:", error);
        setQuestions(questions);
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
          items={questions.map(({ _id }) => ({ id: _id }))}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question) => (
            <SortableQuestion
              groupIndex={groupIndex}
              questionnaireId={questionnaire.uid}
              questions={questions.map(({ _id }) => _id)}
              key={question._id}
              defaultQuestion={question}
              isDragging={isDragging}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
