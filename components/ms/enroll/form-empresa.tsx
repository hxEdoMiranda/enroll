"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect } from "react";
import { postCreateEmpresa } from "@/actions/empresa";
import { getPaises } from "@/actions/pais";
import { CountryModel as IPais } from "@/modules/configuration/types/Country.type";
import { CompanySchema } from "@/modules/configuration/schemas/company.model";
import { CompanyModel as IEmpresa } from "@/modules/configuration/types/Company.type";

const CompanyForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [paises, setPaises] = useState<IPais[]>([]);

  const form = useForm<IEmpresa>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      uid: "",
      identifier: "",
      name: "",
      trade_name: "",
      corporate_name: "",
      country: "",
      industry_type: "",
      business_type: "",
      company_phone: "",
      company_email: "",
      contact: [{ name: "", mail: "", phone: "" }],
      commercial_manager: [{ name: "", mail: "", phone: "" }],
      kam: [{ name: "", mail: "" }],
      employee_count: 0,
      state: true,
    },
  });

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const data = await getPaises();
        setPaises(data);
      } catch (error) {
        console.error("Error al obtener los países:", error);
      }
    };

    fetchPaises();
  }, []);

  const handleSubmit = async (values: IEmpresa) => {
    console.log("Formulario enviado con los siguientes valores:", values);
    try {
      const mappedValues = {
        uid: values.uid,
        identifier: values.identifier,
        name: values.name,
        trade_name: values.trade_name,
        corporate_name: values.corporate_name,
        country: values.country,
        industry_type: values.industry_type,
        business_type: values.business_type,
        company_phone: values.company_phone,
        company_email: values.company_email,
        contact: values.contact.map((contact) => ({
          name: contact.name,
          phone: contact.phone || undefined,
          mail: contact.mail || undefined,
        })),
        commercial_manager: values.commercial_manager.map((manager) => ({
          name: manager.name,
          phone: manager.phone || undefined,
          mail: manager.mail || undefined,
        })),
        kam: values.kam.map((kam) => ({
          name: kam.name,
          phone: kam.phone || undefined,
          mail: kam.mail || undefined,
        })),
        employee_count: values.employee_count,
        state: values.state ?? true,
      };

      const result = await postCreateEmpresa(mappedValues);
      console.log(
        "Resultado de la API:999990000000000000000000000000000000",
        result
      );
      //setMessage("Empresa creada exitosamente.");
      router.push("/enroll/menu/empresa/crear-usuario");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage("Error al crear la empresa. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Fila 1 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Identificador
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Identificador"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Nombre
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Nombre"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="corporate_name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Nombre Fantasía
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Nombre Fantasía"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fila 2 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="trade_name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Razón Social
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Razón Social"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    País
                  </span>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        const selectedCountry = paises.find(
                          (pais) => pais.uid === value
                        );
                        if (selectedCountry) {
                          field.onChange(selectedCountry.uid);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione">
                          {field.value
                            ? paises.find((p) => p.uid === field.value)?.name
                            : "Select a country"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {paises.map((pais) => (
                            <SelectItem key={pais.uid} value={pais.uid || ""}>
                              {pais.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="industry_type"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Tipo Industria
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Tipo Industria"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fila 3 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Tipo Negocio
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Tipo Negocio"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="company_email"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Correo Empresa
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Correo Empresa"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="company_phone"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Telefono Empresa
                  </span>
                  <FormControl>
                    <Input placeholder="+56" {...field} className="text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fila 4 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="commercial_manager.0.name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Gerente comercial
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Gerente comercial"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="commercial_manager.0.mail"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Correo Gerente comercial
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Correo"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="kam.0.name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Kam
                  </span>
                  <FormControl>
                    <Input
                      placeholder="KAM Name"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fila 5 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="kam.0.mail"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Correo Kam
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Correo"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="employee_count"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Cantidad de Empleados
                  </span>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Employee Count"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Título Contacto */}

         {/* Título Contacto con Switch */}
<div className="flex items-center gap-4 col-span-1 md:col-span-3 md:col-start-1">
  <span className="block text-lg font-semibold text-foreground">
    Contacto
  </span>
  <div className="flex items-center">
    <Switch className="w-10 h-6 " color="primary" />
    <span className="text-sm text-foreground">Contacto principal</span>
  </div>
</div>


          {/* Fila de Contacto */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contact.0.name"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Nombre
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Nombre"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contact.0.phone"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Telefono
                  </span>
                  <FormControl>
                    <Input placeholder="+56 " {...field} className="text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contact.0.mail"
              render={({ field }) => (
                <FormItem>
                  <span className="block mb-1 text-foreground text-sm font-medium">
                    Correo
                  </span>
                  <FormControl>
                    <Input
                      placeholder="Correo"
                      {...field}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botón Continuar */}
          <div className="col-span-1 md:col-start-3 flex justify-end mt-6">
            <Button type="submit">Continuar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
