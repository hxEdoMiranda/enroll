"use client";

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { addDays } from "date-fns/addDays";
import { addMinutes } from "date-fns/addMinutes";
import { isSameDay } from "date-fns/isSameDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CleanedSchedule } from "@/types/agenda-admin/schedule";
import { useToast } from "@/hooks/use-toast";
import { differenceInMinutes } from "date-fns";
import {
  fetchCreateSlot,
  fetchDeleteSlot,
  fetchGetSlotsByidPractitioner,
} from "@/app/actions/admin-agenda/slots";

interface AgendaCalendarProps {
  practitionerId?: string;
  initialSchedule?: CleanedSchedule[];
}

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DURATION_OPTIONS = [
  { value: "15", label: "15 minutos" },
  { value: "20", label: "20 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "40", label: "40 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "60 minutos" },
];

const SPECIALTY_COLORS: Record<string, { bg: string; light: string; text: string; hover: string }> = {
  psicologia: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-800",
    hover: "hover:bg-purple-600",
  },
  "medicina general": {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-800",
    hover: "hover:bg-blue-600",
  },
  odontologia: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-800",
    hover: "hover:bg-green-600",
  },
  nutricion: {
    bg: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-800",
    hover: "hover:bg-orange-600",
  },
  default: {
    bg: "bg-gray-500",
    light: "bg-gray-50",
    text: "text-gray-800",
    hover: "hover:bg-gray-600",
  },
};

const CustomToolbar = ({ onNavigate, label, onView, view, date }: any) => {
  let formattedDate = '';
  
  if (view === Views.MONTH) {
    formattedDate = format(date, "MMMM yyyy", { locale: es });
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } else if (view === Views.DAY) {
    // const dayNumber = format(date, "d", { locale: es });
    // const dayName = format(date, "EEEE", { locale: es });
    const monthYear = format(date, "MMMM yyyy", { locale: es });
    
    // const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    
    formattedDate = capitalizedMonthYear;
  }

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("PREV")}
          className="h-8 w-8 rounded-full hover:bg-blue-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("NEXT")}
          className="h-8 w-8 rounded-full hover:bg-blue-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate("TODAY")}
          className="ml-2 text-sm hover:bg-blue-50 hover:text-blue-600"
        >
          Hoy
        </Button>
      </div>

      {view === Views.DAY ? (
        <div className="flex flex-col items-center text-center px-4 py-2 bg-blue-50 rounded-md">
          <div className="text-2xl font-bold text-blue-600 leading-none mb-1">
            {format(date, "d", { locale: es })}
          </div>
          <div className="text-base font-semibold text-blue-800 capitalize">
            {format(date, "EEEE", { locale: es }).charAt(0).toUpperCase() + 
             format(date, "EEEE", { locale: es }).slice(1)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {format(date, "d 'de' MMMM, yyyy", { locale: es })}
          </div>
        </div>
      ) : (
        <span className="text-lg font-semibold text-gray-800">{formattedDate}</span>
      )}

      <div className="flex space-x-2">
        <Button
          variant={view === Views.MONTH ? "default" : "outline"}
          onClick={() => onView(Views.MONTH)}
          className={view === Views.MONTH ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}
        >
          Mes
        </Button>
        <Button
          variant={view === Views.DAY ? "default" : "outline"}
          onClick={() => onView(Views.DAY)}
          className={view === Views.DAY ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}
        >
          Día
        </Button>
      </div>
    </div>
  );
};

const getSpecialtyColors = (specialty: string | undefined) => {
  if (!specialty) return SPECIALTY_COLORS.default;
  const lowerSpecialty = specialty.toLowerCase();
  return SPECIALTY_COLORS[lowerSpecialty] || SPECIALTY_COLORS.default;
};

const MonthEventWrapper = ({ event, onSwitchToDay, allEvents }: any) => {
  if (event.type === "availability") {
    const slotsForDay = event.slots?.filter((slot: any) =>
      isSameDay(new Date(slot.startDateTime), new Date(event.start))
    );

    const colors = getSpecialtyColors(event.specialty);

    const hasMultipleAvailabilities = (
      allEvents.filter((e: any) => 
        e.type === "availability" && 
        isSameDay(new Date(e.start), new Date(event.start))
      ).length > 1
    );

    // Manejador que cambia a la vista día al hacer clic en el evento
    const handleEventClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSwitchToDay) {
        onSwitchToDay(event.start);
      }
    };

    return (
      <div
        className={`h-full w-full ${colors.light} p-1.5 overflow-hidden cursor-pointer rounded-md border-l-4 border-${colors.bg.replace('bg-', '')} shadow-sm hover:shadow transition-all duration-150 ease-in-out`}
        onClick={handleEventClick}
        style={{ borderLeftColor: event.specialty === 'psicologia' ? '#a855f7' : '#3b82f6' }}
      >
        <div className={`text-xs ${colors.text} font-medium`}>
          <div className="font-semibold capitalize truncate">{event.specialty}</div>
          <div className="mt-0.5 flex items-center">
            <div className="truncate text-xs">
              {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
          </div>
          </div>
          <div className="flex items-center mt-1">
            <div className={`w-2.5 h-2.5 rounded-full ${colors.bg} mr-1.5`}></div>
            <span className="text-blue-700 font-semibold">
              {slotsForDay?.length || 0} atenciones
            </span>
          </div>
          
          {hasMultipleAvailabilities && (
            <div className="mt-1 bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-xs font-medium">
              Múltiples disponibilidades
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

const EventWrapper = ({ event, view, onDeleteSlot, onSwitchToDay, allEvents }: any) => {
  if (view === Views.MONTH) {
    return <MonthEventWrapper event={event} onSwitchToDay={onSwitchToDay} allEvents={allEvents} />;
  }
  return <DayEventWrapper event={event} onDeleteSlot={onDeleteSlot} />;
};

const DayEventWrapper = ({ event, onDeleteSlot }: any) => {
  if (event.type === "availability") {
    const colors = getSpecialtyColors(event.specialty);

    return (
      <div
        className={`${colors.bg} text-white p-2 rounded h-full overflow-y-auto`}
        style={{ minHeight: "30px" }} 
      >
        <div className="text-sm font-medium mb-1">{event.specialty}</div>
        <div className="text-xs">
          {format(new Date(event.start), "HH:mm")} -{" "}
          {format(new Date(event.end), "HH:mm")}
        </div>
      </div>
    );
  }

  if (event.type === "slot") {
    const colors = getSpecialtyColors(event.specialty);

    return (
      <div
        className={`${colors.bg} text-white p-1 rounded h-full group relative`}
      >
        <div className="text-xs">
          Atencion: {format(new Date(event.start), "HH:mm")} -{" "}
          {format(new Date(event.end), "HH:mm")}
          <br />
          {event.status === "free" ? "Disponible" : "Ocupado"}
        </div>
        {event.status === "free" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSlot(event);
            }}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
    );
  }

  // Fallback para otros tipos de eventos
  return (
    <div className="bg-gray-500 text-white p-1 rounded h-full">
      <div className="text-xs">
        {format(new Date(event.start), "HH:mm")} -{" "}
        {format(new Date(event.end), "HH:mm")}
      </div>
    </div>
  );
};

const CustomHeaderCell = ({ label }: any) => {
  let formattedLabel = '';
  if (label === 'Sun') formattedLabel = 'dom';
  else if (label === 'Mon') formattedLabel = 'lun';
  else if (label === 'Tue') formattedLabel = 'mar';
  else if (label === 'Wed') formattedLabel = 'mié';
  else if (label === 'Thu') formattedLabel = 'jue';
  else if (label === 'Fri') formattedLabel = 'vie';
  else if (label === 'Sat') formattedLabel = 'sáb';
  else formattedLabel = label.toLowerCase();
  
  return <span className="day-header">{formattedLabel}</span>;
};

const calendarFormats = {
  dayHeaderFormat: (date: Date) => {
    return format(date, "d 'de' MMMM", { locale: es });
  }
};

const injectCustomStyles = () => {
  if (!document.getElementById('calendar-custom-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'calendar-custom-styles';
    styleEl.innerHTML = `
      /* Estilos generales del calendario */
      .rbc-calendar {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      /* ESTILOS PARA EL CALENDARIO COMO CUADRÍCULA */
      .rbc-month-view {
        border: 1px solid #94a3b8;
        border-radius: 4px;
        overflow: hidden;
        background-color: white;
      }
      
      /* ESTILOS PARA CELDAS Y FILAS */
      .rbc-month-row {
        border-bottom: 1px solid #cbd5e1;
        min-height: 90px;
      }
      
      .rbc-day-bg {
        border-right: 1px solid #cbd5e1;
        background-color: white;
      }
      
      /* Reforzar las líneas verticales para mejor visualización */
      .rbc-month-row + .rbc-month-row {
        border-top: none;
      }
      
      /* ESTILOS PARA LOS DÍAS FUERA DEL MES ACTUAL */
      .rbc-off-range-bg {
        background-color: #f1f5f9;
      }
      
      /* ESTILOS PARA LOS ENCABEZADOS DE LOS DÍAS */
      .rbc-header {
        padding: 8px 0;
        font-weight: 600;
        font-size: 0.9rem;
        border-bottom: 1px solid #cbd5e1;
        border-right: 1px solid #cbd5e1;
        color: #4b5563;
        background-color: #f8fafc;
      }
      
      /* Estilo para el texto del encabezado de los días */
      .day-header {
        text-transform: lowercase;
      }
      
      .day-header:first-letter {
        text-transform: uppercase;
      }
      
      /* ESTILOS PARA EL DÍA ACTUAL - Cubriendo toda la celda */
      .rbc-day-bg.rbc-today {
        background-color: #dbeafe !important;
        position: relative;
      }
      
      /* Borde alrededor del día actual - simulando la selección azul */
      .rbc-day-bg.rbc-today:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid #3b82f6;
        pointer-events: none;
        z-index: 1;
      }
      
      /* ESTILOS PARA EL NÚMERO DEL DÍA */
      .rbc-date-cell {
        text-align: center;
        padding: 5px;
        font-weight: 500;
        color: #374151;
        font-size: 0.95rem;
      }
      
      /* ESTILOS PARA EL NÚMERO DEL DÍA ACTUAL */
      .rbc-date-cell.rbc-now {
        color: #1e40af;
        font-weight: 700;
      }
      
      .rbc-date-cell.rbc-now a {
        color: inherit;
      }
      
      /* ESTILOS PARA LOS DÍAS FUERA DEL MES */
      .rbc-off-range {
        color: #9ca3af !important;
      }
      
      /* ESTILOS PARA LA CELDA DEL DÍA */
      .date-cell-wrapper {
        height: 100%;
        width: 100%;
        cursor: pointer;
      }
      
      .date-cell-wrapper:hover {
        background-color: rgba(219, 234, 254, 0.5);
      }
      
      /* ESTILOS PARA EVENTOS */
      .rbc-event {
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        margin: 1px 2px;
      }
      
      /* Estilo para los eventos múltiples */
      .multiple-availabilities-indicator {
        background-color: #fef3c7;
        color: #92400e;
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 0.7rem;
        margin-top: 2px;
        text-align: center;
      }
      
      /* ESTILO PARA EL BOTÓN DE VER MÁS */
      .rbc-show-more {
        font-weight: 600;
        color: #2563eb;
        background: transparent;
      }
      
      /* ESTILO PARA LA TOOLBAR */
      .rbc-toolbar {
        margin-bottom: 10px;
      }
      
      /* ESTILO PARA EL TÍTULO DEL CALENDARIO */
      .rbc-toolbar-label {
        font-weight: 600;
        font-size: 1.1rem;
        color: #111827;
      }
      
      /* ESTILOS PARA LA VISTA DIARIA */
      .rbc-time-view {
        border: 1px solid #94a3b8;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 800px;
        height: 800px;
      }
      
      /* Asegurar que se ve todo el contenido */
      .rbc-time-content {
        flex: 1;
        overflow-y: auto !important;
        position: relative;
        border-top: 1px solid #cbd5e1;
        height: 700px !important;
        min-height: 700px !important;
      }
      
      /* Hacer que las horas sean más pequeñas para que quepan todas */
      .rbc-timeslot-group {
        min-height: 20px !important;
        height: 20px !important;
        border-bottom: 1px solid #e5e7eb;
      }
      
      /* Ajustar el tamaño de los contenedores de hora */
      .rbc-time-slot {
        height: 20px !important;
      }
      
      /* Ajuste para que se muestren todas las horas */
      .rbc-time-view .rbc-time-gutter {
        padding-right: 10px;
      }
      
      .rbc-time-header {
        border-bottom: 1px solid #cbd5e1;
      }
      
      /* Mejorar la visualización de las etiquetas de hora */
      .rbc-time-gutter .rbc-label {
        font-size: 10px !important;
        padding: 2px 5px !important;
        text-align: right;
      }
      
      /* Asegurar que la columna de horas tiene suficiente anchura */
      .rbc-time-gutter {
        width: 80px !important;
        min-width: 80px !important;
        flex: 0 0 80px !important;
      }
      
      .rbc-time-header-gutter {
        width: 80px !important;
        min-width: 80px !important;
        flex: 0 0 80px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #4b5563;
        background-color: #f8fafc;
      }
      
      .rbc-time-header-gutter-custom {
        text-align: center;
        font-weight: 600;
        color: #4b5563;
      }
      
      .rbc-time-custom-label {
        display: block;
        text-align: right;
        padding-right: 10px;
      }
      
      /* Indicador de hora actual */
      .rbc-current-time-indicator {
        background-color: #3b82f6;
        height: 2px;
        z-index: 3;
      }
      
      /* Ocultar elementos innecesarios en la vista día */
      .rbc-allday-cell {
        display: none;
      }
      
      /* Hacer que los eventos sean más visibles en vista día */
      .rbc-event {
        background-color: #3b82f6;
      }
      
      /* Líneas verticales en la vista día */
      .rbc-time-column {
        border-left: 1px solid #e5e7eb;
      }
      
      /* Asegurar que se muestran todas las horas */
      .rbc-time-content > .rbc-time-gutter {
        font-size: 0.9rem !important;
        font-weight: 600 !important;
      }
      
      /* Ajuste para que se muestren todas las horas */
      .rbc-time-view .rbc-time-gutter {
        padding-right: 10px;
      }
      
      /* Asegurar que las etiquetas de hora sean visibles */
      .rbc-label {
        font-size: 12px !important;
        font-weight: 600 !important;
        color: #1f2937 !important;
      }
      
      /* Hacer que el calendario se ajuste mejor a la vista */
      .rbc-calendar {
        height: 100% !important;
      }
      
      /* Evitar scroll horizontal */
      .rbc-time-view, .rbc-time-content {
        overflow-x: hidden !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
};

// Modificamos el customDayPropGetter para simplificarlo y evitar conflictos
const customDayPropGetter = (date: Date) => {
  const isToday = isSameDay(date, new Date());
  
  return {
    className: isToday ? 'rbc-today' : '',
  };
};

// Formatear horas para mostrar en formato 24 horas
const timeGutterFormat = (date: Date, culture?: string, localizer?: any): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// const getDayTimeslots = (): Date[] => {
//   const times = [];
//   const today = new Date();
  
//   for (let hour = 0; hour < 24; hour++) {
//     const time = new Date(today);
//     time.setHours(hour);
//     time.setMinutes(0);
//     time.setSeconds(0);
//     times.push(time);
//   }
  
//   return times;
// };

export function AgendaCalendar({
  practitionerId,
  initialSchedule,
}: AgendaCalendarProps) {
  const [view, setView] = useState<"month" | "day">(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const DateCellWrapper = ({ children, value }: any) => {
    const handleClick = () => {
      setDate(value);
      setView(Views.DAY);
    };

    return (
      <div
        onClick={handleClick}
        className="date-cell-wrapper"
      >
        {children}
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      if (!practitionerId) return;
  
      try {
        const slotsResponse = await fetchGetSlotsByidPractitioner(practitionerId);
        
        const availableSlots = "data" in slotsResponse ? slotsResponse.data : [];
        setSlots(availableSlots);
  
        if (initialSchedule && initialSchedule.length > 0) {
          const availabilityEvents = initialSchedule.map((schedule) => {
            const scheduleSlots = availableSlots.filter(
              (slot) => slot.schedule.reference === `Schedule/${schedule.id}`
            );
  
            return {
              start: new Date(schedule.start),
              end: new Date(schedule.end),
              specialty: schedule.specialty,
              id: schedule.id,
              active: schedule.active,
              type: "availability",
              slots: scheduleSlots, 
            };
          });
  
          const slotEvents = availableSlots.map((slot) => {
            const scheduleId = slot.schedule.reference?.replace("Schedule/", "") || "";
            
            const relatedSchedule = initialSchedule.find(
              (s) => s.id === scheduleId
            );
            
            let specialty = "Sin especialidad";
            
            if (slot.specialty && slot.specialty.length > 0 && 
                slot.specialty[0].coding && slot.specialty[0].coding.length > 0) {
              specialty = slot.specialty[0].coding[0].display;
            } 
            else if (relatedSchedule?.specialty) {
              specialty = relatedSchedule.specialty;
            }
  
            return {
              id: slot.id,
              start: new Date(slot.start),
              end: new Date(slot.end),
              type: "slot",
              status: slot.status,
              idSchedule: scheduleId,
              specialty: specialty,
            };
          });
  
          setEvents([...availabilityEvents, ...slotEvents]);
          
          console.log("Slots events:", slotEvents);
          console.log("Availability events:", availabilityEvents);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        
        if (initialSchedule && initialSchedule.length > 0) {
          const availabilityEvents = initialSchedule.map((schedule) => ({
            start: new Date(schedule.start),
            end: new Date(schedule.end),
            specialty: schedule.specialty,
            id: schedule.id,
            active: schedule.active,
            type: "availability",
            slots: [], 
          }));
          
          setEvents(availabilityEvents);
        }
        
        toast({
          variant: "destructive",
          title: "Advertencia",
          description: "No se encontraron slots disponibles para este profesional",
        });
      }
    };
  
    loadData();
  }, [initialSchedule, practitionerId, toast]);

  useEffect(() => {
    injectCustomStyles();
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    console.log("Slot seleccionado:", slotInfo);

    if (view === Views.MONTH) {
      setDate(slotInfo.start);
      setView(Views.DAY);
      return;
    }

    const isWithinAvailability = events.some(
      (event) =>
        event.type === "availability" &&
        isSameDay(slotInfo.start, event.start) &&
        slotInfo.start >= event.start &&
        slotInfo.end <= event.end
    );

    if (!isWithinAvailability) {
      toast({
        variant: "destructive",
        title: "Horario no disponible",
        description:
          "Solo puede crear slots dentro de los rangos de disponibilidad",
      });
      return;
    }

    setSelectedSlot(slotInfo);
    setShowDialog(true);
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlot?.id) return;

    try {
      setLoading(true);
      const response = await fetchDeleteSlot(selectedSlot.id);

      if ("error" in response) {
        throw new Error(response.error);
      }

      setEvents((prev) => prev.filter((event) => event.id !== selectedSlot.id));

      setEvents((prev) =>
        prev.map((event) => {
          if (event.type === "availability") {
            return {
              ...event,
              slots:
                event.slots?.filter(
                  (slot: any) => slot.id !== selectedSlot.id
                ) || [],
            };
          }
          return event;
        })
      );

      toast({
        title: "Slot eliminado",
        description: "El slot ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el slot",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelection = (event: any) => {
    if (
      view === Views.DAY &&
      event.type === "slot" &&
      event.status === "free"
    ) {
      setSelectedSlot(event);
      setShowDeleteDialog(true);
    }
  };

  const handleCreateSlots = async () => {
    if (!selectedSlot || !practitionerId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Información incompleta para crear los slots",
      });
      return;
    }
  
    try {
      setLoading(true);
  
      const availabilityEvent = events.find(
        (event) =>
          event.type === "availability" &&
          isSameDay(selectedSlot.start, event.start) &&
          selectedSlot.start >= event.start &&
          selectedSlot.end <= event.end
      );
  
      if (!availabilityEvent) {
        throw new Error("No se encontró el horario de disponibilidad");
      }
  
      const duration = parseInt(selectedDuration);
      const totalMinutes = differenceInMinutes(
        selectedSlot.end,
        selectedSlot.start
      );
      const numberOfSlots = Math.floor(totalMinutes / duration);
  
      if (numberOfSlots <= 0) {
        throw new Error(
          "El rango seleccionado es menor que la duración del slot"
        );
      }
  
      const newSlots = [];
      const slotCreationPromises = [];
  
      for (let i = 0; i < numberOfSlots; i++) {
        const slotStart = addMinutes(selectedSlot.start, i * duration);
        const slotEnd = addMinutes(slotStart, duration);
  
        if (slotEnd > availabilityEvent.end) {
          break;
        }
  
        const slotData = {
          idSchedule: availabilityEvent.id,
          startDateTime: format(slotStart, "yyyy-MM-dd'T'HH:mm:ss"),
          endDateTime: format(slotEnd, "yyyy-MM-dd'T'HH:mm:ss"),
          timeZone: "America/Santiago",
          status: "free"
        };
  
        slotCreationPromises.push(fetchCreateSlot(slotData));
  
        newSlots.push({
          start: slotStart,
          end: slotEnd,
          type: "slot",
          status: "free",
          specialty: availabilityEvent.specialty
        });
      }
  
      const results = await Promise.all(slotCreationPromises);
  
      const errors = results.filter((result) => "error" in result);
      if (errors.length > 0) {
        throw new Error(`Error al crear ${errors.length} slots`);
      }
  
      const slotsWithIds = newSlots.map((slot, index) => ({
        ...slot,
        id: "data" in results[index] ? results[index].data.id : undefined,
      }));
  
      setEvents((prev) => [
        ...prev, 
        ...slotsWithIds.map(slot => ({
          id: slot.id,
          start: slot.start,
          end: slot.end,
          type: "slot",
          status: "free",
          idSchedule: availabilityEvent.id,
          specialty: availabilityEvent.specialty
        }))
      ]);
  
      setEvents((prev) =>
        prev.map((event) =>
          event.id === availabilityEvent.id
            ? {
                ...event,
                slots: [
                  ...(event.slots || []),
                  ...slotsWithIds.map((slot) => ({
                    id: slot.id,
                    status: "free",
                    startDateTime: format(slot.start, "yyyy-MM-dd'T'HH:mm:ss"),
                    endDateTime: format(slot.end, "yyyy-MM-dd'T'HH:mm:ss"),
                    idSchedule: `Schedule/${availabilityEvent.id}`
                  })),
                ],
              }
            : event
        )
      );
  
      toast({
        title: "Slots creados",
        description: `Se han creado ${slotsWithIds.length} slots exitosamente`,
      });
  
      setShowDialog(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error creating slots:", error);
      toast({
        variant: "destructive",
        title: "Error al crear slots",
        description:
          error instanceof Error
            ? error.message
            : "Error inesperado al crear los slots",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToDay = (selectedDate: Date) => {
    setDate(selectedDate);
    setView(Views.DAY);
  };

  const handleViewChange = (newView: string) => {
    // Solo aceptamos las vistas month y day
    if (newView === 'month' || newView === 'day') {
      setView(newView as "month" | "day");
    }
  };

  return (
    <>
      <div className="h-[950px] overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={setDate}
          step={30}
          timeslots={1}
          selectable={true}
          formats={{
            ...calendarFormats,
            timeGutterFormat: timeGutterFormat
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            if (view === Views.MONTH && event.type === "availability") {
              setDate(event.start);
              setView(Views.DAY);
            } else {
              handleSlotSelection(event);
            }
          }}
          dayLayoutAlgorithm="no-overlap"
          components={{
            toolbar: (toolbarProps) => (
              <CustomToolbar
                {...toolbarProps}
                date={date}
              />
            ),
            event: (props) => (
              <EventWrapper
                {...props}
                onDeleteSlot={handleSlotSelection}
                onSwitchToDay={handleSwitchToDay}
                allEvents={events}
              />
            ),
            dateCellWrapper: DateCellWrapper,
            header: CustomHeaderCell
          }}
          views={{
            month: true,
            day: true,
          }}
          min={new Date(0, 0, 0, 0, 0, 0)}
          max={new Date(0, 0, 0, 23, 45, 0)}
          messages={{
            next: ">",
            previous: "<",
            today: "Hoy",
            month: "Mes",
            day: "Día",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "No hay horarios disponibles",
            showMore: (total) => `+ Ver más (${total})`,
          }}
          className="rounded-lg calendar-container"
          dayPropGetter={customDayPropGetter}
        />
        
        {/* Leyenda de especialidades */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <div className="font-medium text-sm">Especialidades:</div>
          {Array.from(
            new Set(initialSchedule?.map((s) => s.specialty) || [])
          ).map((specialty) => {
            if (!specialty) return null;
            const colors = getSpecialtyColors(specialty);
            return (
              <div key={specialty} className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm">
                <div className={`w-3 h-3 rounded-full ${colors.bg} mr-1`}></div>
                <span className="text-sm capitalize">{specialty}</span>
              </div>
            );
          })}
        </div>
        
        {/* Leyenda de atenciones */}
        <div className="mt-3 text-xs text-gray-500">
          <p>* Haga clic en una disponibilidad para ver sus atenciones en vista diaria</p>
          <p>* El número mostrado indica la cantidad de atenciones disponibles en ese horario</p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] xl:w-full">
          <DialogHeader>
            <DialogTitle>Crear horas</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">Horario seleccionado</Label>
              <div className="text-sm">
                {selectedSlot && (
                  <div className="flex flex-row space-x-4">
                    <p>
                      {" "}
                      Inicio: 
                      {format(selectedSlot.start, "dd/MM/yyyy HH:mm")}
                    </p>
                    <p>
                      {" "}
                      Fin:{" "}
                      {format(selectedSlot.end, "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Duración de cada atencion</Label>
              <Select
                value={selectedDuration}
                onValueChange={setSelectedDuration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione duración" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSlot && selectedDuration && (
              <div className="space-y-2">
                <Label className="font-semibold">Resumen de atenciones</Label>
                <div className="text-sm">
                  {(() => {
                    const duration = parseInt(selectedDuration);
                    const totalMinutes = differenceInMinutes(
                      selectedSlot.end,
                      selectedSlot.start
                    );
                    const numberOfSlots = Math.floor(totalMinutes / duration);
                    return (
                      <div className=" flex flex-row space-x-4">
                        <p> Duración atencion {duration} minutos</p>
                        <p>  Cantidad de atenciones: {numberOfSlots}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSlots}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Creando slots..." : "Crear slots"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar atencion</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta atencion?
              {selectedSlot && (
                <div className="mt-2 text-sm">
                  Horario:{" "}
                  {format(new Date(selectedSlot.start), "dd/MM/yyyy HH:mm")} -{" "}
                  {format(new Date(selectedSlot.end), "HH:mm")}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedSlot(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSlot}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
