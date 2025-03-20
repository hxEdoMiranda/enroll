"use client";
import { format } from "date-fns/format";
import { Checkbox } from "../ui/checkbox";
import { addDays, parseISO } from "date-fns";
import { useScheduleHandlers } from "@/hooks/use-schedule-handlers";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfesionalesContentProps } from "@/types/agenda-admin/agenda-admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  Plus,
  Minus,
  Trash2,
  Edit,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const DAYS_OF_WEEK = [
  { name: "Lunes", number: 1 },
  { name: "Martes", number: 2 },
  { name: "Miércoles", number: 3 },
  { name: "Jueves", number: 4 },
  { name: "Viernes", number: 5 },
  { name: "Sábado", number: 6 },
  { name: "Domingo", number: 7 },
];

export function AgendaContent({ data }: ProfesionalesContentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [scheduleType, setScheduleType] = useState<
    "general" | "individualizado"
  >("general");
  const [uniformStartTime, setUniformStartTime] = useState("09:00");
  const [uniformEndTime, setUniformEndTime] = useState("17:00");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);

  const {
    loading,
    weeklySchedule,
    setWeeklySchedule,
    setDeletingSlot,
    showDeleteConfirmDialog,
    setShowDeleteConfirmDialog,
    selectedSpecialtyData,
    setSelectedSpecialtyData,
    handleEditSlot,
    handleSaveEditSlot,
    handleOpenAvailabilityModal: openAvailabilityModal,
    handleConfirmDelete,
    handleAddTimeSlot,
    handleCreateAvailability: createAvailability,
    initializeWeeklySchedule,
    existingSchedules,
  } = useScheduleHandlers();

  const filteredProfessionals = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter(profesional => {
      const fullName = `${profesional.firstName} ${profesional.lastName}`.toLowerCase();
            const hasSpecialty = profesional.specializations?.some(
        (spec: any) => spec.display?.toLowerCase().includes(query)
      );
      
      return fullName.includes(query) || hasSpecialty;
    });
  }, [data, searchQuery]);

  const handleOpenAvailabilityModal = (practitioner: any) => {
    openAvailabilityModal(
      practitioner,
      setSelectedPractitioner,
      setStartDate,
      setEndDate,
      setScheduleType,
      setSelectedSpecialty,
      setShowAvailabilityModal,
      uniformStartTime,
      uniformEndTime
    );
  };

  const handleSaveEditSlotWrapper = () => {
    console.log("Guardando edición para el doctor:", selectedPractitioner?.firstName);
    handleSaveEditSlot(selectedPractitioner);
  };


  const handleCreateAvailability = () => {
    createAvailability(selectedPractitioner, setShowAvailabilityModal);
  };

  const handleEditSlotWrapper = (weekIndex: number, dayIndex: number, slotIndex: number) => {
    console.log("Editando slot:", {weekIndex, dayIndex, slotIndex});
    handleEditSlot(weekIndex, dayIndex, slotIndex);
    setShowEditConfirmDialog(true);
  };

  useEffect(() => {
    if (selectedPractitioner && startDate && endDate) {
      console.log("Fecha término modificada, actualizando calendario");
      
      initializeWeeklySchedule(
        startDate,
        endDate,
        uniformStartTime,
        uniformEndTime,
        existingSchedules || [],
        selectedPractitioner
      );
    }
  }, [endDate, startDate, selectedPractitioner]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agenda Profesionales</h1>
      </div>

      <div className="relative w-full max-w-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="buscar"
            placeholder="Buscar por nombre o especialidad"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>


      <Card className="p-0 shadow-md rounded-lg overflow-hidden border-0">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Tipo de profesional</TableHead>
              <TableHead className="font-semibold">Especialidad</TableHead>
              <TableHead className="font-semibold">Correo</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="text-center font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Disponibilidad</span>
                </div>
              </TableHead>
              <TableHead className="text-center font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Agenda</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessionals.map((profesional) => (
              <TableRow key={profesional.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {profesional.firstName + " " + profesional.lastName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {profesional.qualifications
                    ?.map((q) => q.titleDisplay)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {profesional.specializations
                    ?.map((s) => s.display)
                    .join(", ")}
                </TableCell>
                <TableCell>{profesional.emailAddress}</TableCell>
                <TableCell>{profesional.phoneNumber}</TableCell>
                <TableCell className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => handleOpenAvailabilityModal(profesional)}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                    onClick={() =>
                      router.push(`/admin-agenda/agenda/${profesional.id}`)
                    }
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredProfessionals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron profesionales que coincidan con la búsqueda
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={showAvailabilityModal}
        onOpenChange={setShowAvailabilityModal}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[80vw] xl:max-w-[1200px] h-[90vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">
              Crear Disponibilidad - Dr(a). {selectedPractitioner?.firstName}{" "}
              {selectedPractitioner?.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Select
                  value={selectedSpecialtyData?.display || ""}
                  onValueChange={(display) => {
                    const specialty = selectedPractitioner?.specializations?.find(
                      (spec: { display: string }) => spec.display === display
                    );
                    if (specialty) {
                      setSelectedSpecialtyData({
                        code: specialty.code,
                        display: specialty.display || "",
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedPractitioner?.specializations?.map((spec: any) => (
                      <SelectItem key={spec.code} value={spec.display || ""}>
                        {spec.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Término</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de horario</Label>
                <Select
                  value={scheduleType}
                  onValueChange={(value: "general" | "individualizado") =>
                    setScheduleType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Horario General</SelectItem>
                    <SelectItem value="individualizado">
                      Horario Individualizado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scheduleType === "general" && (
                <div className="space-y-2">
                  <Label>Horario General</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="time"
                      value={uniformStartTime}
                      onChange={(e) => setUniformStartTime(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={uniformEndTime}
                      onChange={(e) => setUniformEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {weeklySchedule.length > 0 && (
                <div className="space-y-4 pb-4">
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-7 gap-2 p-4 border-b bg-gray-50">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.number} className="text-center font-medium">
                          <div>{day.name}</div>
                        </div>
                      ))}
                    </div>

                    <div className="divide-y">
                      {weeklySchedule.map((week, weekIndex) => (
                        <div key={weekIndex} className="p-4">
                          <div className="font-medium mb-2">
                            Semana {week.weekNumber}: {format(week.startDate, "dd/MM/yyyy")} - {format(week.endDate, "dd/MM/yyyy")}
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {week.days.map((day, dayIndex) => (
                              <div
                                key={dayIndex}
                                className={`border rounded p-2 space-y-2 ${(day as any).disabled ? 'opacity-50' : ''}`}
                              >
                                <div className="text-center text-sm">
                                  {format(day.date, "dd")}
                                </div>
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={day.enabled}
                                    onCheckedChange={() => {
                                      setWeeklySchedule((prev) =>
                                        prev.map((w, wi) =>
                                          wi === weekIndex
                                            ? {
                                                ...w,
                                                days: w.days.map((d, di) =>
                                                  di === dayIndex
                                                    ? {
                                                        ...d,
                                                        enabled: !d.enabled,
                                                        timeSlots:
                                                          !d.isExisting &&
                                                          !d.enabled
                                                            ? d.timeSlots.map(
                                                                (slot) => ({
                                                                  ...slot,
                                                                  isNew: true,
                                                                  specialtyCode:
                                                                    selectedSpecialtyData?.code,
                                                                  specialtyDisplay:
                                                                    selectedSpecialtyData?.display,
                                                                })
                                                              )
                                                            : d.timeSlots,
                                                      }
                                                    : d
                                                ),
                                              }
                                            : w
                                        )
                                      );
                                    }}
                                    disabled={(day as any).disabled || day.date < parseISO(startDate) || day.date > parseISO(endDate)}
                                  />
                                </div>
                                {day.enabled && (
                                  <div className="space-y-2">
                                    {(() => {
                                      const slotsBySpecialty =
                                        day.timeSlots.reduce((groups, slot) => {
                                          const specialty =
                                            slot.specialtyDisplay ||
                                            "Sin especialidad";
                                          if (!groups[specialty]) {
                                            groups[specialty] = [];
                                          }
                                          groups[specialty].push(slot);
                                          return groups;
                                        }, {} as Record<string, any[]>);

                                      return Object.entries(slotsBySpecialty).map(
                                        ([specialty, slots]) => (
                                          <div
                                            key={specialty}
                                            className="mb-4 border-b pb-2 last:border-b-0"
                                          >
                                            {/* Etiqueta de especialidad para este grupo */}
                                            <div className="mb-2 flex justify-center">
                                              <span className="inline-flex items-center text-center rounded-full text-[10px] px-[6px] py-1 font-light bg-primary text-white">
                                                {specialty}
                                              </span>
                                            </div>

                                            {/* Renderizar los slots de esta especialidad */}
                                            {slots.map((slot, slotIndex) => (
                                              <div
                                                key={slotIndex}
                                                className="space-y-1 relative border-b pb-2 mb-2 last:border-0 last:mb-0 last:pb-0"
                                              >
                                                {/* Etiqueta "Nuevo" si corresponde */}
                                                {slot.isNew && (
                                                  <div className="mb-1 flex justify-center">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-light bg-green-100 text-green-800">
                                                      Nuevo
                                                    </span>
                                                  </div>
                                                )}

                                                <Input
                                                  type="time"
                                                  value={slot.startTime}
                                                  onChange={(e) => {
                                                    const updatedSlots = [
                                                      ...day.timeSlots,
                                                    ];
                                            
                                                    const actualSlotIndex =
                                                      day.timeSlots.findIndex(
                                                        (s) => s === slot
                                                      );

                                                    updatedSlots[
                                                      actualSlotIndex
                                                    ] = {
                                                      ...updatedSlots[
                                                        actualSlotIndex
                                                      ],
                                                      startTime: e.target.value,
                                                    };

                                                    setWeeklySchedule((prev) =>
                                                      prev.map((w, wi) =>
                                                        wi === weekIndex
                                                          ? {
                                                              ...w,
                                                              days: w.days.map(
                                                                (d, di) =>
                                                                  di === dayIndex
                                                                    ? {
                                                                        ...d,
                                                                        timeSlots:
                                                                          updatedSlots,
                                                                    }
                                                                  : d
                                                              ),
                                                            }
                                                          : w
                                                      )
                                                    );
                                                  }}
                                                  className="w-full text-xs"
                                                />

                                                <Input
                                                  type="time"
                                                  value={slot.endTime}
                                                  onChange={(e) => {
                                                    const updatedSlots = [
                                                      ...day.timeSlots,
                                                    ];
                                                    const actualSlotIndex =
                                                      day.timeSlots.findIndex(
                                                        (s) => s === slot
                                                      );

                                                    updatedSlots[
                                                      actualSlotIndex
                                                    ] = {
                                                      ...updatedSlots[
                                                        actualSlotIndex
                                                      ],
                                                      endTime: e.target.value,
                                                    };

                                                    setWeeklySchedule((prev) =>
                                                      prev.map((w, wi) =>
                                                        wi === weekIndex
                                                          ? {
                                                              ...w,
                                                              days: w.days.map(
                                                                (d, di) =>
                                                                  di === dayIndex
                                                                    ? {
                                                                        ...d,
                                                                        timeSlots:
                                                                          updatedSlots,
                                                                    }
                                                                  : d
                                                              ),
                                                            }
                                                          : w
                                                      )
                                                    );
                                                  }}
                                                  className="w-full text-xs"
                                                />

                                                {/* Botones de edición y otros controles */}
                                                <div className="flex justify-center space-x-2">
                                                  {/* Botón para eliminar */}
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      const slotIndex =
                                                        slots.indexOf(slot);
                                                      const actualSlotIndex =
                                                        day.timeSlots.findIndex(
                                                          (s) => s === slot
                                                        );

                                                      if (slot.scheduleId) {
                                                        setDeletingSlot({
                                                          weekIndex,
                                                          dayIndex,
                                                          slotIndex:
                                                            actualSlotIndex,
                                                          scheduleId:
                                                            slot.scheduleId,
                                                        });
                                                        setShowDeleteConfirmDialog(
                                                          true
                                                        );
                                                        return;
                                                      }

                                                      setWeeklySchedule((prev) =>
                                                        prev.map((w, wi) =>
                                                          wi === weekIndex
                                                            ? {
                                                                ...w,
                                                                days: w.days.map(
                                                                  (d, di) =>
                                                                    di ===
                                                                    dayIndex
                                                                      ? {
                                                                          ...d,
                                                                          timeSlots:
                                                                            d.timeSlots.filter(
                                                                              (
                                                                                _,
                                                                                si
                                                                              ) =>
                                                                                si !==
                                                                                actualSlotIndex
                                                                            ),
                                                                        }
                                                                      : d
                                                                ),
                                                              }
                                                            : w
                                                        )
                                                      );
                                                    }}
                                                    className="h-6 w-6 p-0"
                                                  >
                                                    <Minus className="h-3 w-3" />
                                                  </Button>

                                                  {/* Botón para añadir */}
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleAddTimeSlot(
                                                        weekIndex,
                                                        dayIndex
                                                      )
                                                    }
                                                    className="h-6 w-6 p-0"
                                                  >
                                                    <Plus className="h-3 w-3" />
                                                  </Button>
                                                </div>

                                                {/* Botones de edición solo para slots existentes */}
                                                {slot.isExisting && !slot.isNew && (
                                                  <div className="flex justify-center space-x-2 mt-1">
                                                    {/* Botón de editar */}
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleEditSlotWrapper(weekIndex, dayIndex, slotIndex)}
                                                      className="h-7 w-7 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600"
                                                    >
                                                      <Edit className="h-3.5 w-3.5" />
                                                    </Button>

                                                    {/* Botón de eliminar */}
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => {
                                                        console.log("Eliminando slot con ID:", slot.scheduleId);
                                                        setDeletingSlot({
                                                          weekIndex,
                                                          dayIndex,
                                                          slotIndex,
                                                          scheduleId: slot.scheduleId,
                                                        });
                                                        setShowDeleteConfirmDialog(true);
                                                      }}
                                                      className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 text-red-600"
                                                    >
                                                      <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-white">
            <Button
              variant="outline"
              onClick={() => setShowAvailabilityModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAvailability}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!selectedSpecialty || loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creando...
                </div>
              ) : (
                "Crear Agenda"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro que desea eliminar este horario?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEditConfirmDialog}
        onOpenChange={setShowEditConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambios</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro que desea guardar los cambios en este horario?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleSaveEditSlotWrapper();
                setShowEditConfirmDialog(false);
              }}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

