"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profesionalFormSchema } from "@/schema/profesionales";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import {
  fetchCreatePostPractitioner,
  fetchGetPractitionerById,
  fetchUpdatePerfilPractitioner,
} from "@/app/actions/admin-agenda/practitioner";
import {  getTimeZones } from "@/lib/utils";
import {
  PractitionerCreateData,
  PractitionerUpdateData,
  PractitionerGetData
} from "@/types/agenda-admin/agenda-admin";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

// Definir la interfaz para compatibilidad con ambos tipos de datos
interface ProfesionalData extends Partial<PractitionerGetData> {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  bio?: string;
  prefijoProfesional?: string;
  tituloProfesional?: string;
  [key: string]: unknown;
}

interface EditProfesionalFormProps {
  id?: string;
  isNew?: boolean;
  initialData?: ProfesionalData;
}

const tituloProfesionalOptions = [
  "Médico Cirujano",
  "Cirujano Dentista",
  "Enfermería (o)",
  "Matrón (o) Enfermera Matrona",
  "Tecnólogo Médico",
  "Psicología",
  "Kinesiología",
  "Químico Farmacéutica",
  "Nutricionista",
  "Fonoaudiólogo",
  "Terapia Ocupacional",
  "Médico Veterinaria",
  "Abogado",
  "Personal Trainer",
  "Médico (o) Psicóloga",
];

const prefijoProfesionalOptions = ["Dr.", "Dra.", "Lic.", "Prof.", "Ing."];

const documentTypeOptions = [
  { value: "DNI", label: "DNI" },
  { value: "RUT", label: "RUT" },
  { value: "CURP", label: "CURP" },
  { value: "CC", label: "CC" },
  { value: "CE", label: "CE" },
  { value: "NIT", label: "NIT" },
  { value: "CI", label: "CI" },
  { value: "RFC", label: "RFC" },
  { value: "PASSPORT", label: "Pasaporte" },
  { value: "NATIONAL_ID", label: "ID Nacional" },
  { value: "OTHER", label: "Otro" },
];

const especialidades = [
  { code: "722162001", display: "psicologia" },
  { code: "394802001", display: "medicina general" },
];

const timeZones = getTimeZones();

export function EditProfesionalForm({
  id,
  isNew = false,
  initialData,
}: EditProfesionalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState("");
  const [openSpecialtyPopover, setOpenSpecialtyPopover] = useState(false);

  const filteredTimeZones = timeZones.filter(
    (tz) =>
      searchTerm.length >= 4 &&
      (tz.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.timeZone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const form = useForm<z.infer<typeof profesionalFormSchema>>({
    resolver: zodResolver(profesionalFormSchema),
    defaultValues: {
      firstName: typeof initialData?.nombre === 'string' ? initialData.nombre : 
                 typeof initialData?.firstName === 'string' ? initialData.firstName : "",
      lastName: typeof initialData?.apellido === 'string' ? initialData.apellido : 
                typeof initialData?.lastName === 'string' ? initialData.lastName : "",
      secondName: "",
      motherLastName: "",
      document: typeof initialData?.id === 'string' ? initialData.id : 
                typeof initialData?.document === 'string' ? initialData.document : "",
      documentType: "RUT",
      birthDate: "",
      gender: "MALE",
      country_birth: "CL",
      timeZone: "",
      emailAddress: typeof initialData?.email === 'string' ? initialData.email : 
                    typeof initialData?.emailAddress === 'string' ? initialData.emailAddress : "",
      phoneNumber: typeof initialData?.telefono === 'string' ? initialData.telefono : 
                  typeof initialData?.phoneNumber === 'string' ? initialData.phoneNumber : "",
      addressLine: "",
      addressCity: "Santiago",
      addressState: "RM",
      prefix: typeof initialData?.prefijoProfesional === 'string' ? initialData.prefijoProfesional : 
              typeof initialData?.prefix === 'string' ? initialData.prefix : "Dr.",
      certificateNumber: "",
      titleCode: "MD",
      titleDisplay: typeof initialData?.tituloProfesional === 'string' ? initialData.tituloProfesional : 
                    typeof initialData?.titleDisplay === 'string' ? initialData.titleDisplay : "",
      startDate: "",
      endDate: "",
      issuer: "",
      specialtyCode: [],
      specialtyDisplay: [],
      estado: "active",
      duracionAtencion: "30",
      valorTotal: "",
      valorConvenio: "",
      biografia: "",
      modalidad: "",
    },
  });

  useEffect(() => {
    const fetchPractitioner = async () => {
      if (id && !isNew) {
        try {
          setLoading(true);
          const response = await fetchGetPractitionerById(id);
          if ("data" in response) {
            const data = response.data;

            // const name = data.firstName || {};
            // const telecom = data.phoneNumber || [];
            const address = data.address || {};
            const qualification = data.qualifications?.[0] || {
              titleCode: "",
              titleDisplay: "",
              certificateNumber: "",
              startDate: "",
              endDate: "",
              issuer: "",
            };
            // const specialty = data.specializations?.[0];
            const email = data.emailAddress || "";
            const phone = data.phoneNumber || "";

            const genderMapping: Record<
              string,
              "MALE" | "FEMALE" | "OTHER" | "UNKNOWN"
            > = {
              male: "MALE",
              female: "FEMALE",
              other: "OTHER",
              unknown: "UNKNOWN",
            };

            const mappedGender =
              genderMapping[data.gender?.toLowerCase() || ""] || "MALE";

            form.reset({
              firstName: data.firstName || "",
              secondName: data.secondName || "",
              lastName: data.lastName || "",
              motherLastName: data.motherLastName || "",
              document: data.document || "",
              documentType: data.documentType || "RUT",
              birthDate: data.birthDate || "",
              gender: mappedGender,
              country_birth: data.country_birth || "CL",
              timeZone: data.timeZone || "CL",
              emailAddress: email,
              phoneNumber: phone,
              addressLine: address.line?.[0] || "",
              addressCity: address.city || "Santiago",
              addressState: address.state || "RM",
              prefix: data.prefix || "Dr.",
              certificateNumber:
                "certificateNumber" in qualification
                  ? String(qualification.certificateNumber)
                  : "",
              titleCode: qualification?.titleCode || "MD",
              titleDisplay: qualification?.titleDisplay || "",
              startDate: qualification?.startDate || "",
              endDate: qualification?.endDate || "",
              issuer: qualification?.issuer || "",
              specialtyCode: data.specializations?.map((s) => s.code) || [],
              specialtyDisplay:
                data.specializations?.map((s) => s.display) || [],
              duracionAtencion: "30",
              biografia: "",
              modalidad: "",
            });
          }
        } catch (error) {
          console.error("Error fetching practitioner:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo cargar la información del profesional",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPractitioner();
  }, [id, isNew, form, toast]);

  // useEffect(() => {
  //   const fetchSpecialties = async () => {
  //     if (debouncedSpecialtySearch.length >= 3) {
  //       setSpecialtyLoading(true);
  //       try {
  //         const response = await fetchSpecialties(debouncedSpecialtySearch);
  //         if ('data' in response) {
  //           setSpecialtyOptions(response.data);
  //         } else {
  //           console.error("Error fetching specialties:", response.error);
  //           setSpecialtyOptions([]);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching specialties:", error);
  //         setSpecialtyOptions([]);
  //       } finally {
  //         setSpecialtyLoading(false);
  //       }
  //     }
  //   };

  //   fetchSpecialties();
  // }, [debouncedSpecialtySearch]);

  async function onSubmit(values: z.infer<typeof profesionalFormSchema>) {
    try {
      setLoading(true);

      const specializations = values.specialtyCode.map((code, index) => ({
        code,
        display: values.specialtyDisplay[index],
      }));

      const practitionerData: PractitionerCreateData | PractitionerUpdateData =
        {
          firstName: values.firstName,
          lastName: values.lastName,
          secondName: values.secondName,
          motherLastName: values.motherLastName,
          document: values.document,
          documentType: values.documentType,
          birthDate: values.birthDate,
          gender: values.gender,
          country_birth: values.country_birth,
          timeZone: values.timeZone,
          phoneNumber: values.phoneNumber,
          emailAddress: values.emailAddress,
          prefix: values.prefix,
          address: {
            line: values.addressLine ? [values.addressLine] : undefined,
            city: values.addressCity,
            state: values.addressState,
          },
          qualifications: [
            {
              certificateNumber: values.certificateNumber || "",
              titleCode: values.titleCode,
              titleDisplay: values.titleDisplay || "",
              startDate:
                values.startDate || new Date().toISOString().split("T")[0],
              endDate: values.endDate || new Date().toISOString().split("T")[0],
              issuer: values.issuer || "",
            },
          ],
          specializations,
        };

      const practitionerDataUpdate:
        | PractitionerCreateData
        | PractitionerUpdateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        secondName: values.secondName,
        motherLastName: values.motherLastName,
        document: values.document,
        documentType: values.documentType,
        birthDate: values.birthDate,
        gender: values.gender,
        country_birth: values.country_birth,
        timeZone: values.timeZone,
        phoneNumber: values.phoneNumber,
        emailAddress: values.emailAddress,
        prefix: values.prefix,
        address: {
          line: values.addressLine ? [values.addressLine] : undefined,
          city: values.addressCity,
          state: values.addressState,
        },
        qualifications: [
          {
            certificateNumber: values.certificateNumber || "",
            titleCode: values.titleCode,
            titleDisplay: values.titleDisplay || "",
            startDate:
              values.startDate || new Date().toISOString().split("T")[0],
            endDate: values.endDate || new Date().toISOString().split("T")[0],
            issuer: values.issuer || "",
          },
        ],
      };

      // Add password for new practitioners
      if (isNew) {
        (practitionerData as PractitionerCreateData).password = "Temporal123";
      }

      if (isNew) {
        const response = await fetchCreatePostPractitioner(
          practitionerData as PractitionerCreateData
        );
        if ("error" in response) {
          throw new Error(response.error);
        }
        toast({
          variant: "default",
          title: "Profesional creado",
          description: "El profesional ha sido creado exitosamente",
        });
      } else if (id) {
        const response = await fetchUpdatePerfilPractitioner(
          id,
          practitionerDataUpdate as PractitionerUpdateData
        );
        if ("error" in response) {
          throw new Error(response.error);
        }
        toast({
          variant: "destructive",
          title: "Profesional actualizado",
          description:
            "Los datos del profesional han sido actualizados exitosamente",
        });
      }

      router.push("/admin-agenda/profesionales");
    } catch (error) {
      console.error("Error saving practitioner:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? `Error`
            : "Ocurrió un error al guardar los datos del profesional",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="mb-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-2xl font-bold mb-6">
          {isNew ? "Nuevo Profesional" : "Editar Profesional"}
        </h1>

        <div className="grid grid-cols-12 gap-4">
          {/* Columna izquierda */}
          <div className="col-span-12 md:col-span-3 space-y-4">
            <Card className="p-4">
              <div className="w-full aspect-square relative bg-gray-100 rounded-lg overflow-hidden max-w-[200px] mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-2 right-2">
                  <Button variant="secondary" size="sm" type="button">
                    Cambiar
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="titleDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Profesional</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione título" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tituloProfesionalOptions.map((titulo) => (
                            <SelectItem key={titulo} value={titulo}>
                              {titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefijo Profesional</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione prefijo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {prefijoProfesionalOptions.map((prefijo) => (
                            <SelectItem key={prefijo} value={prefijo}>
                              {prefijo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialtyDisplay"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Especialidades</FormLabel>
                      <div className="border rounded-md p-2 flex flex-wrap gap-1">
                        {Array.isArray(field.value) &&
                          field.value.map(
                            (specialty: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="py-1"
                              >
                                {specialty}
                                <X
                                  className="ml-2 h-3 w-3 cursor-pointer"
                                  onClick={() => {
                                    const currentSpecialtyValues = [
                                      ...field.value,
                                    ];
                                    const currentSpecialtyCodes = [
                                      ...form.getValues("specialtyCode"),
                                    ];
                                    currentSpecialtyValues.splice(index, 1);
                                    currentSpecialtyCodes.splice(index, 1);
                                    form.setValue(
                                      "specialtyDisplay",
                                      currentSpecialtyValues
                                    );
                                    form.setValue(
                                      "specialtyCode",
                                      currentSpecialtyCodes
                                    );
                                  }}
                                />
                              </Badge>
                            )
                          )}

                        {/* Botón simple que muestra/oculta un dropdown sin usar Popover */}
                        <div className="relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-muted-foreground hover:bg-transparent"
                            onClick={() =>
                              setOpenSpecialtyPopover(!openSpecialtyPopover)
                            }
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Añadir especialidad
                          </Button>

                          {openSpecialtyPopover && (
                            <div className="absolute z-10 w-[300px] mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                              <div className="p-2">
                                <Input
                                  placeholder="Buscar especialidad..."
                                  value={specialtySearchTerm}
                                  onChange={(e) =>
                                    setSpecialtySearchTerm(e.target.value)
                                  }
                                  className="mb-2"
                                />
                                <div className="max-h-[200px] overflow-y-auto">
                                  {especialidades.map((especialidad) => (
                                    <div
                                      key={especialidad.code}
                                      className={`py-2 px-3 cursor-pointer hover:bg-gray-100 ${
                                        Array.isArray(field.value) &&
                                        field.value.includes(
                                          especialidad.display
                                        )
                                          ? "bg-gray-100"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        const currentDisplays = Array.isArray(
                                          form.getValues("specialtyDisplay")
                                        )
                                          ? form.getValues("specialtyDisplay")
                                          : [];
                                        const currentCodes = Array.isArray(
                                          form.getValues("specialtyCode")
                                        )
                                          ? form.getValues("specialtyCode")
                                          : [];

                                        if (
                                          !currentDisplays.includes(
                                            especialidad.display
                                          )
                                        ) {
                                          form.setValue("specialtyDisplay", [
                                            ...currentDisplays,
                                            especialidad.display,
                                          ]);
                                          form.setValue("specialtyCode", [
                                            ...currentCodes,
                                            especialidad.code,
                                          ]);
                                        }

                                        setSpecialtySearchTerm("");
                                        setOpenSpecialtyPopover(false);
                                      }}
                                    >
                                      {especialidad.display}
                                      {Array.isArray(field.value) &&
                                        field.value.includes(
                                          especialidad.display
                                        ) && (
                                          <Check className="float-right h-4 w-4" />
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>

          {/* Columna derecha */}
          <div className="col-span-12 md:col-span-9">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombres"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Paterno</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apellido Paterno"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segundo Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Segundo Nombre"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motherLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido Materno</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apellido Materno"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT/Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="12.345.678-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País de Nacimiento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CL">Chile</SelectItem>
                          <SelectItem value="AR">Argentina</SelectItem>
                          <SelectItem value="PE">Perú</SelectItem>
                          <SelectItem value="BO">Bolivia</SelectItem>
                          <SelectItem value="CO">Colombia</SelectItem>
                          <SelectItem value="VE">Venezuela</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Nacimiento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Masculino</SelectItem>
                          <SelectItem value="FEMALE">Femenino</SelectItem>
                          <SelectItem value="OTHER">Otro</SelectItem>
                          <SelectItem value="UNKNOWN">
                            No especificado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Registro</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de registro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Registro</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona Horaria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione cuidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GMT-3">GMT-3</SelectItem>
                          <SelectItem value="GMT-4">GMT-4</SelectItem>
                          <SelectItem value="GMT-5">GMT-5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona Horaria</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Buscar zona horaria (mínimo 3 caracteres)"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              if (e.target.value.length >= 3) {
                                setOpen(true);
                              } else {
                                setOpen(false);
                              }
                            }}
                          />
                        </FormControl>
                        {open && searchTerm.length >= 4 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                            {filteredTimeZones.length === 0 ? (
                              <div className="py-2 px-3 text-sm text-gray-500">
                                No se encontraron zonas horarias
                              </div>
                            ) : (
                              filteredTimeZones.map((tz) => (
                                <div
                                  key={tz.timeZone}
                                  className={`py-2 px-3 cursor-pointer hover:bg-gray-100 ${
                                    field.value === tz.timeZone
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    form.setValue("timeZone", tz.timeZone);
                                    field.onChange(tz.timeZone);
                                    setSearchTerm(
                                      `${tz.city}, ${tz.country} (${tz.timeZone})`
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {tz.city}, {tz.country} ({tz.timeZone})
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {field.value && (
                        <div className="text-xs text-gray-500 mt-1">
                          Zona horaria seleccionada: {field.value}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duracionAtencion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración de Atención</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione duración" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="20">20 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                          <SelectItem value="60">60 min</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universidad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese universidad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Graduación</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modalidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalidad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione modalidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="isapre">Isapre</SelectItem>
                          <SelectItem value="fonasa">Fonasa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          {...field}
                          disabled={!isNew}
                          className={!isNew ? "bg-gray-100" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono móvil</FormLabel>
                      <FormControl>
                        <Input placeholder="+56 9 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 
                <FormField
                  control={form.control}
                  name="valorTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="valorConvenio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Convenio</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="addressLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese dirección" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Región/Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Región" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="biografia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografía</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Biografía profesional"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Firma Digital</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 mt-1">
                    <div className="h-full flex items-center justify-center">
                      <span className="text-gray-500">
                        Área para firma digital
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profesionales")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : isNew
                    ? "Crear profesional"
                    : "Guardar cambios"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
