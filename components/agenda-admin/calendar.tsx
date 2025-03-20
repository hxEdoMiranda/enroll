"use client";

import { Calendar as BigCalendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format , parse , startOfWeek, getDay , differenceInMinutes ,  isSameDay ,  addMinutes } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { useState } from "react";
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

const mockAppointments = [
  {
    id: 1,
    start: new Date(2024, 1, 15, 9, 0),
    end: new Date(2024, 1, 15, 12, 0),
    minutosAtencion: 30,
    realizado: true
  },
  {
    id: 2,
    start: new Date(2024, 1, 15, 14, 0),
    end: new Date(2024, 1, 15, 17, 0),
    minutosAtencion: 30,
    realizado: false
  },
  {
    id: 3,
    start: new Date(2024, 1, 20, 10, 0),
    end: new Date(2024, 1, 20, 16, 0),
    minutosAtencion: 45,
    realizado: true
  },
  {
    id: 4,
    start: new Date(2024, 1, 25, 8, 0),
    end: new Date(2024, 1, 25, 13, 0),
    minutosAtencion: 30,
    realizado: false
  }
];

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

const MonthEventWrapper = ({ event, events }: any) => {
  const eventsForDay = events.filter((e: any) => 
    isSameDay(e.start, event.start)
  );
  
  
  if (eventsForDay[0] !== event) return null;

  
  const earliestStart = eventsForDay.reduce((earliest: Date, e: any) => {
    return e.start < earliest ? e.start : earliest;
  }, eventsForDay[0].start);

  
  const totalBlocks = eventsForDay.reduce((total: number, e: { end: any; start: any; minutosAtencion: string; }) => {
    const duration = differenceInMinutes(e.end, e.start);
    return total + Math.ceil(duration / parseInt(e.minutosAtencion));
  }, 0);

  interface Event {
    id: number;
    start: Date;
    end: Date;
    minutosAtencion: number;
    realizado: boolean;
  }



  const realizadosBlocks = eventsForDay.reduce((total: number, e: Event) => {
    if (e.realizado) {
      const duration = differenceInMinutes(e.end, e.start);
      return total + Math.ceil(duration / e.minutosAtencion);
    }
    return total;
  }, 0);

  if (totalBlocks === 0) {
    return (
      <div className="absolute inset-0 bg-gray-100 p-2">
        <div className="text-xs text-gray-600">
          No hay horas disp.
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-100">
      <div className="p-2 border-b border-gray-200">
        <div className="text-xs text-gray-600">
          Hr. inicio: {format(earliestStart, 'HH:mm')}
        </div>
      </div>
      <div className="p-2">
        <div className="text-xs text-gray-600">
          Bloques: {realizadosBlocks}/{totalBlocks}
        </div>
      </div>
    </div>
  );
};

const DayEventWrapper = ({ event }: any) => {
  return (
    <div className={`${event.realizado ? 'bg-green-500' : 'bg-blue-500'} text-white p-1 rounded h-full`}>
      <div className="text-xs">
        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
      </div>
    </div>
  );
};

const EventWrapper = ({ event, view, events }: any) => {
  if (view === Views.MONTH) {
    return <MonthEventWrapper event={event} events={events} />;
  }
  return <DayEventWrapper event={event} />;
};

export function Calendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(mockAppointments);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    tipoAgenda: "Exclusiva",
    modeloAtencion: "Suscripción",
    zonaHoraria: "GMT-3",
    minutosAtencion: "30",
    invitarProfesionales: false
  });

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (view !== Views.DAY) return;
    setSelectedSlot(slotInfo);
    setShowDialog(true);
  };

  const handleSaveEvent = () => {
    if (!selectedSlot) return;

    const minutes = parseInt(formData.minutosAtencion);
    const startTime = selectedSlot.start;
    const endTime = selectedSlot.end;
    const newEvents = [];

    
    let currentStart = startTime;
    let newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
    while (currentStart < endTime) {
      const blockEnd = addMinutes(currentStart, minutes);
      const actualEnd = blockEnd > endTime ? endTime : blockEnd;

      newEvents.push({
        id: newId++,
        title: "Atención Agenda",
        start: currentStart,
        end: actualEnd,
        realizado: false,
        minutosAtencion: parseInt(formData.minutosAtencion),
        tipoAgenda: formData.tipoAgenda,
        modeloAtencion: formData.modeloAtencion,
        zonaHoraria: formData.zonaHoraria,
        invitarProfesionales: formData.invitarProfesionales
      });

      currentStart = blockEnd;
    }

    setEvents([...events, ...newEvents]);
    setShowDialog(false);
    setSelectedSlot(null);
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
          onView={(newView: View) => setView(newView)}
          date={date}
          onNavigate={setDate}
          step={15}
          timeslots={1}
          // selectable={view === Views.DAY}
          onSelectSlot={handleSelectSlot}
          components={{
            toolbar: CustomToolbar,
            event: (props) => <EventWrapper {...props} events={events} />
          }}
          views={{
            month: true,
            day: true,
          }}
          defaultView={Views.MONTH}
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
            noEventsInRange: "No hay eventos en este rango",
            showMore: total => `+ Ver más (${total})`
          }}
        />
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Características de la agenda para el convenio</span>
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
              <Label>Tipo agenda</Label>
              <Select
                value={formData.tipoAgenda}
                onValueChange={(value) => setFormData({ ...formData, tipoAgenda: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exclusiva">Exclusiva</SelectItem>
                  <SelectItem value="Compartida">Compartida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modelo atención</Label>
              <Select
                value={formData.modeloAtencion}
                onValueChange={(value) => setFormData({ ...formData, modeloAtencion: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Suscripción">Suscripción</SelectItem>
                  <SelectItem value="Prepago">Prepago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zona horaria</Label>
              <Select
                value={formData.zonaHoraria}
                onValueChange={(value) => setFormData({ ...formData, zonaHoraria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT-3">GMT-3</SelectItem>
                  <SelectItem value="GMT-4">GMT-4</SelectItem>
                  <SelectItem value="GMT-5">GMT-5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Minutos Atención</Label>
              <Select
                value={formData.minutosAtencion}
                onValueChange={(value) => setFormData({ ...formData, minutosAtencion: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 MIN</SelectItem>
                  <SelectItem value="20">20 MIN</SelectItem>
                  <SelectItem value="30">30 MIN</SelectItem>
                  <SelectItem value="45">45 MIN</SelectItem>
                  <SelectItem value="60">60 MIN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="invitarProfesionales"
                checked={formData.invitarProfesionales}
                onChange={(e) => setFormData({ ...formData, invitarProfesionales: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="invitarProfesionales">Invitar Profesionales Asociados</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent} className="bg-blue-500 hover:bg-blue-600">
              Crear agenda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}