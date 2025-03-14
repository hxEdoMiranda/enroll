"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ProfesionalesContentProps } from "@/types/agenda-admin/agenda-admin";
import { useProfesionalesStore } from "@/store/agenda-admin/profesionalesStore";

export function ProfesionalesFilters({ data }: ProfesionalesContentProps) {
  const { searchQuery, setSearchQuery, setFilteredData } =
    useProfesionalesStore();

  useEffect(() => {
    const filtered = data.filter(
      (profesional) =>
        profesional.id === searchQuery ||
        profesional.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.secondName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.motherLastName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.specializations
          ?.map((s) => s.display)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.qualifications
          ?.map((q) => q.titleDisplay)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.emailAddress
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profesional.phoneNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data, setFilteredData]);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por nombre, especialidad, correo o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Especialidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="medicina-general">Medicina General</SelectItem>
          <SelectItem value="nutriologia">Nutriología</SelectItem>
          <SelectItem value="psicologia">Psicología</SelectItem>
          <SelectItem value="cardiologia">Cardiología</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="activo">Activo</SelectItem>
          <SelectItem value="inactivo">Inactivo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}