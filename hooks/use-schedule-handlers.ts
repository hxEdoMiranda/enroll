import { useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  createSchedule,
  deleteSchedule,
  fetchGetScheduleByIdPractitioner,
  updateSchedule,
} from "@/actions/admin-agenda/schedule";
import {
  TimeSlot,
  WeekSchedule,
} from "@/types/agenda-admin/schedule";

export function useScheduleHandlers() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeekSchedule[]>([]);
  const [existingSchedules, setExistingSchedules] = useState<any[]>([]);
  const [editingDay, setEditingDay] = useState<{
    dayIndex: number;
    weekIndex: number;
  } | null>(null);
  const [editingSlot, setEditingSlot] = useState<{
    weekIndex: number;
    dayIndex: number;
    slotIndex: number;
  } | null>(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(
    null
  );
  const [deletingSlot, setDeletingSlot] = useState<{
    weekIndex: number;
    dayIndex: number;
    slotIndex: number;
    scheduleId?: string;
  } | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [selectedSpecialtyData, setSelectedSpecialtyData] = useState<{
    code: string;
    display: string;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initializeWeeklySchedule = (
    startDate: string,
    endDate: string,
    uniformStartTime: string,
    uniformEndTime: string,
    existingSchedules: any[],
    selectedPractitioner: any
  ) => {
    if (startDate && endDate && selectedPractitioner) {
      // Parseamos las fechas de inicio y fin
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      // Validar fechas
      if (isBefore(end, start)) {
        toast({
          variant: "destructive",
          title: "Error en fechas",
          description: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
        return;
      }
      
      console.log("Inicializando calendario desde", format(start, "dd/MM/yyyy"), "hasta", format(end, "dd/MM/yyyy"));
      
      // Mapa para búsqueda rápida de horarios existentes
      const existingScheduleMap = new Map();
      existingSchedules.forEach(schedule => {
        const dateKey = format(new Date(schedule.start), "yyyy-MM-dd");
        if (!existingScheduleMap.has(dateKey)) {
          existingScheduleMap.set(dateKey, []);
        }
        existingScheduleMap.get(dateKey).push(schedule);
      });
      
      // Encontrar el lunes de la semana que contiene la fecha de inicio
      let weekStart = start;
      const dayOfWeek = weekStart.getDay();
      // Si no es lunes (1), retrocedemos hasta el lunes
      if (dayOfWeek !== 1) { 
        // En JavaScript, 0 es domingo, así que ajustamos
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        weekStart = addDays(weekStart, -daysToSubtract);
      }
      
      // Generar array de fechas de inicio de cada semana
      const weekStarts = [];
      let currentWeekStart = weekStart;
      
      while (!isAfter(currentWeekStart, end)) {
        weekStarts.push(currentWeekStart);
        currentWeekStart = addDays(currentWeekStart, 7);
      }
      
      console.log(`Generando ${weekStarts.length} semanas completas`);
      
      // Crear las semanas con sus días
      const weeks = weekStarts.map((weekStartDate, weekIndex) => {
        // Cada semana siempre tiene 7 días (lunes a domingo)
        const weekEndDate = addDays(weekStartDate, 6);
        
        // Formato para mostrar el rango de la semana
        const formattedStartDate = format(weekStartDate, "dd/MM/yyyy");
        const formattedEndDate = format(weekEndDate, "dd/MM/yyyy");
        
        // Generar todos los días de la semana
        const daysInWeek = [];
        for (let i = 0; i < 7; i++) {
          const currentDate = addDays(weekStartDate, i);
          const dateKey = format(currentDate, "yyyy-MM-dd");
          const daySchedules = existingScheduleMap.get(dateKey) || [];
          const hasSchedules = daySchedules.length > 0;
          
          // Verificar si el día está dentro del rango seleccionado
          const isInRange = !isBefore(currentDate, start) && !isAfter(currentDate, end);
          
          // Preparar timeSlots para este día
          let timeSlots = [];
          
          if (hasSchedules) {
            // Usar los horarios existentes
            timeSlots = daySchedules.map((schedule: { 
              id: string; 
              specialty?: string; 
              start: string | Date; 
              end: string | Date;
            }) => {
              let slotSpecialtyCode = "";
              let slotSpecialtyName = schedule.specialty || "";
              
              const matchingSpecialty = selectedPractitioner?.specializations?.find(
                (spec: any) => spec.display === schedule.specialty
              );
              
              if (matchingSpecialty) {
                slotSpecialtyCode = matchingSpecialty.code;
              }
              
              return {
                startTime: format(new Date(schedule.start), "HH:mm"),
                endTime: format(new Date(schedule.end), "HH:mm"),
                isExisting: true,
                isNew: false,
                scheduleId: schedule.id,
                specialtyCode: slotSpecialtyCode,
                specialtyDisplay: slotSpecialtyName,
              };
            });
          } else {
            // Para días nuevos sin horarios existentes
            timeSlots = [{
              startTime: uniformStartTime,
              endTime: uniformEndTime,
              isExisting: false,
              isNew: false,
              specialtyCode: "",
              specialtyDisplay: "",
            }];
          }
          
          daysInWeek.push({
            date: currentDate,
            enabled: hasSchedules,
            timeSlots,
            isExisting: hasSchedules,
            // Los días fuera del rango no se pueden marcar
            disabled: !isInRange
          });
        }
        
        return {
          weekNumber: weekIndex + 1,
          startDate: weekStartDate,
          endDate: weekEndDate,
          formattedRange: `${formattedStartDate} - ${formattedEndDate}`,
          days: daysInWeek,
        };
      });
      
      console.log("Semanas generadas:", weeks.length);
      console.log("Días en primera semana:", weeks[0]?.days.length);
      setWeeklySchedule(weeks);
      setHasUnsavedChanges(false);
    }
  };


  const handleAddDay = (weekIndex: number, dayDate: Date) => {
    console.log("Agregando día:", format(dayDate, "yyyy-MM-dd"), "a la semana", weekIndex + 1);
    
    setWeeklySchedule((prevSchedule) => {
      // Asegurarse de que la semana existe
      if (!prevSchedule[weekIndex]) {
        console.error("La semana", weekIndex + 1, "no existe");
        return prevSchedule;
      }
      
      const newSchedule = JSON.parse(JSON.stringify(prevSchedule));
      const week = newSchedule[weekIndex];
      
      // Buscar si el día ya existe
      const existingDay = week.days.find((d: any) => 
        isSameDay(new Date(d.date), dayDate)
      );
      
      if (existingDay) {
        console.log("El día ya existe, activándolo");
        existingDay.enabled = true;
        return newSchedule;
      }
      
      // Si no existe, crear un nuevo día
      const newDay = {
        date: dayDate,
        enabled: true,
        isExisting: false,
        timeSlots: [
          {
            startTime: "09:00", // Valor por defecto
            endTime: "17:00", // Valor por defecto
            isNew: true,
            isExisting: false,
            specialtyCode: selectedSpecialtyData?.code || "",
            specialtyDisplay: selectedSpecialtyData?.display || "",
          }
        ]
      };
      
      // Insertar el día en el orden correcto
      const insertIndex = week.days.findIndex((d: any) => 
        isAfter(new Date(d.date), dayDate)
      );
      
      if (insertIndex >= 0) {
        week.days.splice(insertIndex, 0, newDay);
      } else {
        week.days.push(newDay);
      }
      
      console.log("Día agregado correctamente");
      return newSchedule;
    });
    
    // Marcar que hay cambios pendientes
    setHasUnsavedChanges(true);
  };
  
  const handleEditSlot = (
    weekIndex: number,
    dayIndex: number,
    slotIndex: number
  ) => {
    const slot = weeklySchedule[weekIndex].days[dayIndex].timeSlots[slotIndex];

    if (slot.specialtyDisplay && slot.specialtyCode) {
      setSelectedSpecialtyData({
        code: slot.specialtyCode,
        display: slot.specialtyDisplay,
      });
    }

    setEditingSlot({ weekIndex, dayIndex, slotIndex });
  };

  // Handler para guardar la edición de un slot
  const handleSaveEditSlot = async (selectedPractitioner: any) => {
    if (!editingSlot || !selectedPractitioner) return;

    const { weekIndex, dayIndex, slotIndex } = editingSlot;
    const slot = weeklySchedule[weekIndex].days[dayIndex].timeSlots[slotIndex];

    if (!slot.scheduleId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró ID del horario a actualizar",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Editando slot con ID:", slot.scheduleId);

      // Obtener datos de especialidad del slot o de la selección global
      const specialtyCode = slot.specialtyCode || selectedSpecialtyData?.code;
      const specialtyDisplay = slot.specialtyDisplay || selectedSpecialtyData?.display;

      if (!specialtyCode || !specialtyDisplay) {
        throw new Error("No se encontró información de la especialidad");
      }

      // Preparar las fechas de inicio y fin
      const startDateTime = new Date(weeklySchedule[weekIndex].days[dayIndex].date);
      startDateTime.setHours(
        parseInt(slot.startTime.split(":")[0]),
        parseInt(slot.startTime.split(":")[1])
      );

      const endDateTime = new Date(weeklySchedule[weekIndex].days[dayIndex].date);
      endDateTime.setHours(
        parseInt(slot.endTime.split(":")[0]),
        parseInt(slot.endTime.split(":")[1])
      );

      // Datos para actualizar
      const scheduleData = {
        idPractitioner: selectedPractitioner.id,
        idSpecialty: specialtyCode,
        nameSpecialty: specialtyDisplay,
        startDateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
        endDateTime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
        timeZone: "America/Santiago",
        comment: `Disponibilidad actualizada para ${specialtyDisplay}`,
      };

      console.log("Enviando datos para actualizar:", scheduleData);
      const response = await updateSchedule(scheduleData, slot.scheduleId);

      if ("error" in response) {
        throw new Error(response.error);
      }

      // Actualiza el slot en el estado
      setWeeklySchedule((prev) => {
        const newSchedule = [...prev];
        newSchedule[weekIndex].days[dayIndex].timeSlots[slotIndex] = {
          ...slot,
          specialtyCode,
          specialtyDisplay,
          isNew: false,
          isExisting: true
        };
        return newSchedule;
      });

      toast({
        title: "Horario actualizado",
        description: "El horario ha sido actualizado exitosamente",
      });

      setEditingSlot(null);
    } catch (error) {
      console.error("Error updating slot:", error);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el horario",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAvailabilityModal = async (
    practitioner: any,
    setSelectedPractitioner: React.Dispatch<React.SetStateAction<any>>,
    setStartDate: React.Dispatch<React.SetStateAction<string>>,
    setEndDate: React.Dispatch<React.SetStateAction<string>>,
    // Esta línea es la que está causando el problema:
    setScheduleType: React.Dispatch<
      React.SetStateAction<"general" | "individualizado">
    >, 
    setSelectedSpecialty: React.Dispatch<React.SetStateAction<string>>,
    setShowAvailabilityModal: React.Dispatch<React.SetStateAction<boolean>>,
    uniformStartTime: string,
    uniformEndTime: string
  ) => {
    setSelectedPractitioner(practitioner);
    if (
      practitioner.specializations &&
      practitioner.specializations.length > 0
    ) {
      setSelectedSpecialty(practitioner.specializations[0].display || "");
    }
    setScheduleType("general")
    try {
      const scheduleResponse = await fetchGetScheduleByIdPractitioner(
        practitioner.id,
        format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      );

      if ("data" in scheduleResponse) {
        const schedules = scheduleResponse.data;
        setExistingSchedules(schedules);

        if (schedules.length > 0) {
          const dates = schedules.map((schedule) => ({
            start: new Date(schedule.start),
            end: new Date(schedule.end),
          }));

          const earliestDate = new Date(
            Math.min(...dates.map((d) => d.start.getTime()))
          );
          const latestDate = new Date(
            Math.max(...dates.map((d) => d.end.getTime()))
          );

          const formattedStartDate = format(earliestDate, "yyyy-MM-dd");
          const formattedEndDate = format(latestDate, "yyyy-MM-dd");

          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setScheduleType("individualizado");

          // Inicializar los horarios semanales aquí, después de cargar los datos existentes
          initializeWeeklySchedule(
            formattedStartDate,
            formattedEndDate,
            uniformStartTime,
            uniformEndTime,
            schedules,
            practitioner
          );
        } else {
          // Si no hay horarios, inicializar con fechas predeterminadas
          const today = new Date();
          const nextWeek = addDays(today, 7);
          const formattedStartDate = format(today, "yyyy-MM-dd");
          const formattedEndDate = format(nextWeek, "yyyy-MM-dd");

          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);

          // Inicializar con fechas predeterminadas y sin horarios existentes
          initializeWeeklySchedule(
            formattedStartDate,
            formattedEndDate,
            uniformStartTime,
            uniformEndTime,
            [],
            practitioner
          );
        }

        toast({
          title: "Horarios cargados",
          description: "Se han cargado los horarios existentes del profesional",
        });
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los horarios del profesional",
      });

      // Incluso en caso de error, inicializar con fechas predeterminadas
      const today = new Date();
      const nextWeek = addDays(today, 7);
      initializeWeeklySchedule(
        format(today, "yyyy-MM-dd"),
        format(nextWeek, "yyyy-MM-dd"),
        uniformStartTime,
        uniformEndTime,
        [],
        practitioner
      );
    }

    setShowAvailabilityModal(true);
  };


  

  // Handler para editar un día completo
  const handleEditDay = (weekIndex: number, dayIndex: number) => {
    const day = weeklySchedule[weekIndex].days[dayIndex];

    // Actualizar el selectedSpecialtyData con los datos del día que vamos a editar
    if (day.specialty && day.specialtyCode) {
      setSelectedSpecialtyData({
        code: day.specialtyCode,
        display: day.specialty,
      });
    }

    setEditingDay({ weekIndex, dayIndex });
  };

  // Handler para iniciar la eliminación de un día
  const handleDeleteDay = (scheduleId: string) => {
    setDeletingScheduleId(scheduleId);
    setShowDeleteConfirmDialog(true);
  };

  // Handler para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (deletingSlot) {
      // Eliminar un slot individual
      const { weekIndex, dayIndex, slotIndex, scheduleId } = deletingSlot;

      try {
        setLoading(true);
        if (!scheduleId) return;

        const response = await deleteSchedule(scheduleId);

        if ("error" in response) {
          throw new Error(response.error);
        }

        // Actualizar el estado local
        setWeeklySchedule((prev) => {
          return prev.map((w, wi) =>
            wi === weekIndex
              ? {
                  ...w,
                  days: w.days.map((d, di) =>
                    di === dayIndex
                      ? {
                          ...d,
                          timeSlots: d.timeSlots.filter(
                            (_, si) => si !== slotIndex
                          ),
                          enabled:
                            d.timeSlots.filter(
                              (s) => s.isExisting && s.scheduleId !== scheduleId
                            ).length === 0
                              ? false
                              : d.enabled,
                        }
                      : d
                  ),
                }
              : w
          );
        });

        setExistingSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== scheduleId)
        );

        toast({
          title: "Horario eliminado",
          description: "El horario ha sido eliminado exitosamente",
        });
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el horario",
        });
      } finally {
        setLoading(false);
        setShowDeleteConfirmDialog(false);
        setDeletingSlot(null);
      }
    } else if (deletingScheduleId) {
      // Eliminar todo un día
      try {
        setLoading(true);
        const response = await deleteSchedule(deletingScheduleId);

        if ("error" in response) {
          throw new Error(response.error);
        }

        setWeeklySchedule((prev) =>
          prev.map((week) => ({
            ...week,
            days: week.days.map((day) =>
              day.scheduleId === deletingScheduleId
                ? {
                    ...day,
                    enabled: false,
                    scheduleId: undefined,
                    isExisting: false,
                  }
                : day
            ),
          }))
        );

        setExistingSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== deletingScheduleId)
        );

        toast({
          title: "Horario eliminado",
          description: "El horario ha sido eliminado exitosamente",
        });
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el horario",
        });
      } finally {
        setLoading(false);
        setShowDeleteConfirmDialog(false);
        setDeletingScheduleId(null);
      }
    }
  };

  // Handler para añadir un slot de tiempo
  const handleAddTimeSlot = (weekIndex: number, dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((w, wi) =>
        wi === weekIndex
          ? {
              ...w,
              days: w.days.map((d, di) =>
                di === dayIndex
                  ? {
                      ...d,
                      timeSlots: [
                        ...d.timeSlots,
                        {
                          startTime: "09:00",
                          endTime: "17:00",
                          isNew: true,
                          specialtyCode: selectedSpecialtyData?.code,
                          specialtyDisplay: selectedSpecialtyData?.display,
                        },
                      ],
                    }
                  : d
              ),
            }
          : w
      )
    );
  };

  // Handler para guardar la edición de un día
  const handleSaveEdit = async (
    weekIndex: number,
    dayIndex: number,
    selectedPractitioner: any
  ) => {
    if (!selectedPractitioner) return;

    try {
      setLoading(true);
      const day = weeklySchedule[weekIndex].days[dayIndex];

      if (!day.scheduleId) return;

      // Si no tenemos selectedSpecialtyData pero tenemos los datos en el día, usarlos
      const specialtyCode = day.specialtyCode;
      const specialtyDisplay = day.specialty;

      if (!specialtyCode || !specialtyDisplay) {
        throw new Error("No se encontró información de la especialidad");
      }

      const updatePromises = day.timeSlots.map((slot) => {
        const startDateTime = new Date(day.date);
        startDateTime.setHours(
          parseInt(slot.startTime.split(":")[0]),
          parseInt(slot.startTime.split(":")[1])
        );

        const endDateTime = new Date(day.date);
        endDateTime.setHours(
          parseInt(slot.endTime.split(":")[0]),
          parseInt(slot.endTime.split(":")[1])
        );

        const scheduleData = {
          idPractitioner: selectedPractitioner.id,
          idSpecialty: specialtyCode,
          nameSpecialty: specialtyDisplay,
          startDateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
          endDateTime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
          timeZone: "America/Santiago",
          comment: `Disponibilidad actualizada para ${specialtyDisplay}`,
        };
        const id = day.scheduleId;

        if (!id) {
          throw new Error("No se encontró ID del horario a actualizar");
        }

        return updateSchedule(scheduleData, id);
      });

      const results = await Promise.all(updatePromises);
      const errors = results.filter((result) => "error" in result);

      if (errors.length > 0) {
        throw new Error(`Error al actualizar ${errors.length} horarios`);
      }

      toast({
        title: "Horario actualizado",
        description: "El horario ha sido actualizado exitosamente",
      });

      setEditingDay(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el horario",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler para crear disponibilidad
  const handleCreateAvailability = async (
    selectedPractitioner: any,
    setShowAvailabilityModal: (show: boolean) => void
  ) => {
    if (!selectedPractitioner || !selectedSpecialtyData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Seleccione un profesional y una especialidad",
      });
      return;
    }

    try {
      setLoading(true);

      // Recopila TODOS los slots nuevos que deben crearse
      const slotsToCreate = weeklySchedule.flatMap((week) =>
        week.days.flatMap((day) => {
          if (!day.enabled) return [];

          // Procesar TODOS los slots marcados como nuevos incluso en las semanas nuevas
          return day.timeSlots
            .filter((slot) => !slot.isExisting || slot.isNew === true)
            .map((slot) => {
              const startDateTime = new Date(day.date);
              startDateTime.setHours(
                parseInt(slot.startTime.split(":")[0]),
                parseInt(slot.startTime.split(":")[1])
              );

              const endDateTime = new Date(day.date);
              endDateTime.setHours(
                parseInt(slot.endTime.split(":")[0]),
                parseInt(slot.endTime.split(":")[1])
              );

              // Usar la especialidad del slot si tiene, o la seleccionada globalmente
              const specialtyCode =
                slot.specialtyCode || selectedSpecialtyData.code;
              const specialtyDisplay =
                slot.specialtyDisplay || selectedSpecialtyData.display;

              return {
                data: {
                  idPractitioner: selectedPractitioner.id,
                  idSpecialty: specialtyCode,
                  nameSpecialty: specialtyDisplay,
                  startDateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
                  endDateTime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
                  timeZone: "America/Santiago",
                  comment: `Disponibilidad para ${specialtyDisplay}`,
                },
                day,
                slot,
                slotIndex: day.timeSlots.findIndex((s) => s === slot),
                dayIndex: week.days.findIndex((d) => d === day),
                weekIndex: weeklySchedule.findIndex((w) => w === week),
              };
            });
        })
      );

      if (slotsToCreate.length === 0) {
        toast({
          variant: "default",
          title: "Sin cambios",
          description: "No hay nuevos horarios para crear",
        });
        return;
      }

      // Crear los slots nuevos
      const schedulePromises = slotsToCreate.map((item) =>
        createSchedule(item.data)
      );

      const results = await Promise.all(schedulePromises);
      const errors = results.filter((result) => "error" in result);

      if (errors.length > 0) {
        throw new Error(`Error al crear ${errors.length} horarios`);
      }

      if (results.length > 0) {
        setWeeklySchedule((prev) => {
          const newSchedule = [...prev];
          results.forEach((result, index) => {
            if ("data" in result && result.data.id) {
              const { weekIndex, dayIndex, slotIndex } = slotsToCreate[index];
              newSchedule[weekIndex].days[dayIndex].timeSlots[slotIndex] = {
                ...newSchedule[weekIndex].days[dayIndex].timeSlots[slotIndex],
                isNew: false,
                isExisting: true,
                scheduleId: result.data.id,
              };
            }
          });
          return newSchedule;
        });
      }

      toast({
        title: "Horarios creados",
        description: `Se han creado ${results.length} nuevos horarios exitosamente`,
      });

      setShowAvailabilityModal(false);
    } catch (error) {
      console.error("Error creating schedules:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al crear los horarios",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    weeklySchedule,
    setWeeklySchedule,
    existingSchedules,
    setExistingSchedules,
    editingDay,
    editingSlot,
    deletingScheduleId,
    deletingSlot,
    showDeleteConfirmDialog,
    setShowDeleteConfirmDialog,
    selectedSpecialtyData,
    setSelectedSpecialtyData,
    handleEditSlot,
    handleSaveEditSlot,
    handleOpenAvailabilityModal,
    handleEditDay,
    handleDeleteDay,
    handleConfirmDelete,
    handleAddTimeSlot,
    handleSaveEdit,
    handleCreateAvailability,
    initializeWeeklySchedule,
    setDeletingSlot,
    handleAddDay,
  };
}
