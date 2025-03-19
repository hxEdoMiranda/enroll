"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowLeft } from "lucide-react";

interface EditConvenioFormProps {
  id?: string;
  isNew?: boolean;
}

const initialFormData = {
  nombreConvenio: "",
  modeloAtencion: "",
  reglaPago: "",
  valor: "0",
  fechaInicio: "",
  fechaTermino: "",
  estado: "Activo",
  codigoConvenio: "",
  url: "",
  textoMarca: "",
  atencionDirecta: false,
  teleperitaje: false,
};

export function EditConvenioForm({ id, isNew = false }: EditConvenioFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(isNew ? initialFormData : {
    nombreConvenio: "PRUEBAS 11",
    modeloAtencion: "Suscripción",
    reglaPago: "Valor",
    valor: "0",
    fechaInicio: "06/08/2020",
    fechaTermino: "08/09/2022",
    estado: "Activo",
    codigoConvenio: "PRUEBAS11",
    url: "",
    textoMarca: "",
    atencionDirecta: false,
    teleperitaje: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    router.push("/convenios");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">
            {isNew ? "Crear nuevo convenio" : "Editar convenio"}
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Nombre convenio</Label>
            <div className="flex space-x-2">
              <Input
                value={formData.nombreConvenio}
                onChange={(e) => setFormData({ ...formData, nombreConvenio: e.target.value })}
                className="flex-1"
                placeholder="Ingrese nombre del convenio"
              />
              <Button type="button" className="bg-[#00B8D4] hover:bg-[#0095B0] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Especialidad
              </Button>
            </div>
          </div>

          <div className="text-lg font-medium text-gray-700">Tipificación de convenio</div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Modelo Atención</Label>
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

            <div>
              <Label>Regla de pago</Label>
              <Select
                value={formData.reglaPago}
                onValueChange={(value) => setFormData({ ...formData, reglaPago: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione regla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Valor">Valor</SelectItem>
                  <SelectItem value="Porcentaje">Porcentaje</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="Ingrese valor"
              />
            </div>

            <div>
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>

            <div>
              <Label>Fecha de Término</Label>
              <Input
                type="date"
                value={formData.fechaTermino}
                onChange={(e) => setFormData({ ...formData, fechaTermino: e.target.value })}
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Código Convenio</Label>
              <Input
                value={formData.codigoConvenio}
                onChange={(e) => setFormData({ ...formData, codigoConvenio: e.target.value })}
                placeholder="Ingrese código"
              />
            </div>

            <div>
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="Ingrese URL"
              />
            </div>

            <div>
              <Label>Texto marca</Label>
              <Input
                value={formData.textoMarca}
                onChange={(e) => setFormData({ ...formData, textoMarca: e.target.value })}
                placeholder="Ingrese texto marca"
              />
            </div>
          </div>

          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="atencionDirecta"
                checked={formData.atencionDirecta}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, atencionDirecta: checked as boolean })
                }
              />
              <Label htmlFor="atencionDirecta">Atención directa</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="teleperitaje"
                checked={formData.teleperitaje}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, teleperitaje: checked as boolean })
                }
              />
              <Label htmlFor="teleperitaje">Teleperitaje</Label>
            </div>
          </div>

          <div>
            <Label>Imagen (Imagen en formato JPG o JPEG y medidas 250px de ancho y 50px de alto)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-1">
              <div className="h-[100px] flex items-center justify-center">
                <span className="text-gray-500">Área para subir imagen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/convenios")}
          className="bg-[#FFA726] hover:bg-[#FB8C00] text-white"
        >
          Volver
        </Button>
        <Button type="submit" className="bg-[#26C6DA] hover:bg-[#00ACC1] text-white">
          {isNew ? "Crear Convenio" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}