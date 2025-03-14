"use client";

import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {format} from "date-fns/format";
import {parse} from "date-fns/parse";
import {startOfWeek} from "date-fns/startOfWeek";
import {getDay} from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createSchedule } from "@/actions/admin-agenda/schedule";
import { CleanedSchedule } from "@/types/agenda-admin/schedule";
import { useRouter } from "next/navigation";

interface AvailabilityCalendarProps {
  practitionerId?: string;
  initialSchedule?: CleanedSchedule[];
}

const locales = {
  "es": es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = ({ onNavigate, label, onView, view }: any) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('PREV')}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('NEXT')}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate('TODAY')}
          className="ml-2"
        >
          Hoy
        </Button>
      </div>
      
      <span className="text-lg font-semibold">{label}</span>
      
      <div className="flex space-x-2">
        <Button
          variant={view === Views.MONTH ? 'default' : 'ghost'}
          onClick={() => onView(Views.MONTH)}
        >
          Mes
        </Button>
        <Button
          variant={view === Views.DAY ? 'default' : 'ghost'}
          onClick={() => onView(Views.DAY)}
        >
          Día
        </Button>
      </div>
    </div>
  );
};

const EventWrapper = ({ event, view }: any) => {
  if (view === Views.MONTH) {
    return <MonthEventWrapper event={event} />;
  }
  return <DayEventWrapper event={event} />;
};

const MonthEventWrapper = ({ event }: any) => {
  return (
    <div className="absolute inset-0 bg-green-100">
      <div className="p-2 border-b border-green-200">
        <div className="text-xs text-green-800">
          Disponible: {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

const DayEventWrapper = ({ event }: any) => {
  return (
    <div className="bg-green-500 text-white p-1 rounded h-full">
      <div className="text-xs">
        Disponible: {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
      </div>
    </div>
  );
};

export function AvailabilityCalendar({ practitionerId, initialSchedule }: AvailabilityCalendarProps) {
  const router = useRouter();
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    idServiceCategory: "",
    idServiceType: "",
    idSpecialty: "",
    comment: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSchedule) {
      const formattedEvents = initialSchedule.map(schedule => ({
        start: new Date(schedule.start),
        end: new Date(schedule.end),
        title: "Disponible",
        id: schedule.id,
        active: schedule.active
      }));
      setEvents(formattedEvents);
    }
  }, [initialSchedule]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (view !== Views.DAY) return;
    setSelectedSlot(slotInfo);
    setShowDialog(true);
  };

  const handleSaveEvent = async () => {
    if (!selectedSlot || !practitionerId) return;

    try {
      setLoading(true);
      const scheduleData = {
        idPractitioner: practitionerId,
        startDateTime: selectedSlot.start.toISOString(),
        endDateTime: selectedSlot.end.toISOString(),
        ...formData
      };

      const response = await createSchedule(scheduleData);

      if ('data' in response) {
        const newEvent = {
          start: selectedSlot.start,
          end: selectedSlot.end,
          title: "Disponible",
          id: response.data.id
        };
        setEvents([...events, newEvent]);
      } else {
        console.error('Error creating schedule:', response.error);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    } finally {
      setLoading(false);
      setShowDialog(false);
      setSelectedSlot(null);
    }
  };

  return (
    <>
      <div className="h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          step={15}
          timeslots={1}
          selectable={view === Views.DAY}
          onSelectSlot={handleSelectSlot}
          components={{
            toolbar: CustomToolbar,
            event: EventWrapper
          }}
          views={{
            month: true,
            day: true,
          }}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
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
            showMore: total => `+ Ver más (${total})`
          }}
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Crear nueva disponibilidad</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowDialog(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Servicio</Label>
              <Select
                value={formData.idServiceType}
                onValueChange={(value) => setFormData({ ...formData, idServiceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Telemedicina</SelectItem>
                  <SelectItem value="2">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Especialidad</Label>
              <Select
                value={formData.idSpecialty}
                onValueChange={(value) => setFormData({ ...formData, idSpecialty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Medicina General</SelectItem>
                  <SelectItem value="2">Pediatría</SelectItem>
                  <SelectItem value="3">Cardiología</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear disponibilidad"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}