"use client";

import { PlanModel } from "@/modules/configuration/types/Plan.type";
import { BannerPlanManager } from "./banner-plan-manager";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, SaveIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormMessage,
  FormLabel,
  FormItem,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePlanSchema,
  UpdatePlan,
} from "@/modules/configuration/schemas/plan.model";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";
import { updatePlanInfo } from "@/app/actions/planes";
import { ServiceModel } from "@/modules/configuration/types/Service.type";
import { toast } from "sonner";

interface PlanManagerProps {
  planesData: PlanModel[];
  companyData: CompanyFullModel;
  servicesData: ServiceModel[];
}

export function PlanManager({
  planesData,
  companyData,
  servicesData,
}: PlanManagerProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceModel[]>([]);

  // Función para formatear fechas al formato YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const selectedPlan = selectedPlanId
    ? planesData.find((plan) => plan.uid === selectedPlanId)
    : null;

  // Inicializar el formulario con valores vacíos
  const form = useForm<UpdatePlan>({
    resolver: zodResolver(UpdatePlanSchema),
    defaultValues: {
      uid: "",
      identifier: "",
      name: "",
      state: false,
      start_date: "",
      end_date: "",
      max_number_of_holders: 0,
      self_managed_load: false,
      max_number_of_loads: 0,
      custom_plan_id: "6781197f090c7577fa400c10",
      company: companyData.id,
      service: [],
    },
  });

  // Establecer el primer plan como seleccionado por defecto
  useEffect(() => {
    if (!selectedPlanId && planesData.length > 0) {
      setSelectedPlanId(planesData[0].uid);
    }
  }, [selectedPlanId, planesData]);

  // Actualizar el formulario cuando cambie el plan seleccionado
  useEffect(() => {
    if (selectedPlan) {
      form.reset({
        uid: selectedPlan.uid,
        identifier: selectedPlan.identifier,
        name: selectedPlan.name,
        state: selectedPlan.state,
        start_date: formatDate(selectedPlan.start_date),
        end_date: formatDate(selectedPlan.end_date),
        max_number_of_holders: selectedPlan.max_number_of_holders,
        self_managed_load: selectedPlan.self_managed_load,
        max_number_of_loads: selectedPlan.max_number_of_loads,
        custom_plan_id: "6781197f090c7577fa400c10",
        company: companyData.id,
        service: selectedPlan.service,
      });

      // Aseguramos que los servicios del plan estén correctamente seleccionados
      const planServices = selectedPlan.service || [];
      setSelectedServices(planServices);
    } else {
      setSelectedServices([]);
    }
  }, [selectedPlan, form, companyData.id, servicesData]);

  // Función para manejar la selección de servicios
  const handleServiceToggle = (service: ServiceModel) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.code === service.code);
      if (isSelected) {
        return prev.filter((s) => s.code !== service.code);
      } else {
        // When adding a new service, copy all its properties
        return [...prev, { ...service }];
      }
    });
  };

  const periodMap = {
    SEMANAL: "Semanal",
    MENSUAL: "Mensual",
    SEMESTRAL: "Semestral",
  };

  const getServiceValue = (service: ServiceModel, field: string): string => {
    const selectedService = selectedServices.find(
      (s) => s.code === service.code
    );
    if (!selectedService)
      return String(service[field as keyof ServiceModel] || "");

    if (field.startsWith("limit_")) {
      const limitField = field.replace(
        "limit_",
        ""
      ) as keyof typeof service.limit;
      const rawValue = selectedService.limit?.[limitField] || "";
      return periodMap[rawValue as keyof typeof periodMap] || String(rawValue);
    }
    return String(selectedService[field as keyof ServiceModel] || "");
  };

  const handleServiceUpdate = (
    serviceCode: string,
    field: string,
    value: string | number
  ) => {
    setSelectedServices((prev) =>
      prev.map((service) => {
        if (service.code === serviceCode) {
          if (field.startsWith("limit_")) {
            const limitField = field.replace(
              "limit_",
              ""
            ) as keyof typeof service.limit;
            return {
              ...service,
              limit: {
                ...service.limit,
                [limitField]: value,
              },
            } as ServiceModel;
          }
          return {
            ...service,
            [field]: value,
          } as ServiceModel;
        }
        return service;
      })
    );
  };
 const [searchTerm, setSearchTerm] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 10;

const filteredServices = servicesData.filter((service) =>
  service.name.toLowerCase().includes(searchTerm.toLowerCase())
);
const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
const paginatedServices = filteredServices.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  const handleSubmit = async (values: UpdatePlan) => {
    try {
      setMessage("Editando plan");
      await updatePlanInfo({
        ...values,
        service: selectedServices.map((service) => service),
      });
      setMessage("Plan actualizado correctamente");
      toast.success("Plan actualizado correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setMessage("Error al enviar el formulario");
    }
  };
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
      <BannerPlanManager
        planesData={planesData}
        selectedPlanId={selectedPlanId}
        onPlanSelect={setSelectedPlanId}
      />
      <div className="h-full rounded-md px-8 py-5">
        <div className="flex flex-row justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-3xl font-medium">
              {selectedPlan?.name
                ? `${selectedPlan.name} - Información y Servicios`
                : "Plan - Información y Servicios"}
            </h2>
            <p className="text-lg font-medium">
              Agregue o edite la información básica del plan, junto a los
              servicios que este contendra.
            </p>{" "}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              PREVIZUALIZACIÓN
              <EyeIcon />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-1 border border-primary rounded-md p-4">
            <h3 className="text-xl font-medium">Información del Plan</h3>
            <Separator className="my-8" />
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="grid grid-cols-12 gap-4"
                >
                  {/* Campo Identifier */}
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Identificador del Plan{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Identificador único del plan"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Nombre del Plan{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Plan Básico" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Fecha de inicio */}
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Fecha Inicio <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Fecha de fin */}
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Fecha Termino <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Estado */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="col-span-6 flex flex-row items-center gap-2">
                        <div className="space-y-0">
                          <FormLabel className="items-center">
                            Estado <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="bg-primary mt-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Campo Self Managed Load */}
                  <FormField
                    control={form.control}
                    name="self_managed_load"
                    render={({ field }) => (
                      <FormItem className="col-span-6 flex flex-row items-center gap-2">
                        <div className="space-y-0">
                          <FormLabel className="items-center">
                            Cargas Autoadministrables{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="bg-primary mt-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Campo Maximo de holders */}
                  <FormField
                    control={form.control}
                    name="max_number_of_holders"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Cantidad Máxima Titulares{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ej: 100"
                            {...field}
                            value={field.value || ""} // Aseguramos que el valor siempre sea un string o vacío
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            } // Convertimos el valor a número
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Maximo de cargas */}
                  <FormField
                    control={form.control}
                    name="max_number_of_loads"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>
                          Cantidad Máxima Cargas{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ej: 10"
                            {...field}
                            value={field.value || ""} // Aseguramos que el valor siempre sea un string o vacío
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            } // Convertimos el valor a número
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              {message && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  {message}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 border border-primary rounded-md p-4">
  <h3 className="text-xl font-medium">Servicios</h3>
  <input
    type="text"
    placeholder="Buscar servicio..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full p-2 border rounded mb-4"
  />
  <Tabs defaultValue="all" className="w-full">
    <TabsList>
      <TabsTrigger value="all">Todo</TabsTrigger>
    </TabsList>
    <TabsContent value="all">
      <Accordion type="single" collapsible className="w-full">
        {paginatedServices.map((service) => (
          <AccordionItem key={service.uid} value={service.uid}>
            <AccordionTrigger arrowPosition="left" className="justify-start">
              {service.name}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col">
              <div className="px-8 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Código:</label>
                    <Input value={service.code} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descripción:</label>
                    <Input value={service.description} readOnly className="bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio 2B:</label>
                    <Input
                      value={
                        typeof getServiceValue(service, "price_2b") === "string"
                          ? getServiceValue(service, "price_2b")
                          : ""
                      }
                      onChange={(e) =>
                        handleServiceUpdate(service.code, "price_2b", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descuento 2B:</label>
                    <Input
                      value={getServiceValue(service, "discount_2b")}
                      onChange={(e) =>
                        handleServiceUpdate(service.code, "discount_2b", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio 2C:</label>
                    <Input
                      value={getServiceValue(service, "price_2c")}
                      onChange={(e) =>
                        handleServiceUpdate(service.code, "price_2c", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descuento 2C:</label>
                    <Input
                      value={getServiceValue(service, "discount_2c")}
                      onChange={(e) =>
                        handleServiceUpdate(service.code, "discount_2c", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Límite:</label>
                    <Input
                      type="number"
                      value={getServiceValue(service, "limit_limit_quantity")}
                      onChange={(e) =>
                        handleServiceUpdate(service.code, "limit_limit_quantity", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Periodo:</label>
                    <select
                      className="border rounded p-2 w-full"
                      value={getServiceValue(service, "limit_period")}
                      onChange={(e) => {
                        const periodValue = e.target.value;
                        handleServiceUpdate(service.code, "limit_period", periodValue);
                        const periodDays = periodValue === "Semanal" ? 7 : periodValue === "Mensual" ? 30 : 182;
                        handleServiceUpdate(service.code, "limit_period_days", periodDays);
                      }}
                    >
                      <option value="Semanal">Semanal</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Semestral">Semestral</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id={`${service.uid}`}
                    checked={selectedServices.some((s) => s.code === service.code)}
                    onCheckedChange={() => handleServiceToggle(service)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <label htmlFor={`${service.uid}`} className="text-sm font-medium leading-none">
                    Seleccionar servicio
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  </Tabs>
  <div className="flex justify-between mt-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Anterior
    </button>
    <span>
      Página {currentPage} de {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
</div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex flex-row gap-4 justify-end">
        <Button
          onClick={form.handleSubmit(handleSubmit)}
          className="bg-primary rounded-full text-white font-bold text-base"
        >
          GUARDAR CAMBIOS
          <SaveIcon />
        </Button>
      </div>
    </div>
  );
}
