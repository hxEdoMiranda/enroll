"use client";
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
import React, { useState, useEffect } from "react";
import { postCreateEmpresa } from "@/actions/empresa";
import { getPaises } from "@/actions/pais"; 
import { CountryModel as IPais } from "@/modules/configuration/types/Country.type";
import { CompanySchema } from "@/modules/configuration/schemas/company.model";
import { CompanyModel as IEmpresa } from "@/modules/configuration/types/Company.type"; 

const CompanyForm = () => {
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
      setMessage("Empresa creada exitosamente.");
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
                <span className="block mb-1 text-primary text-xs">Identifier</span>
                <FormControl>
                  <Input placeholder="Identifier" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Name</span>
                <FormControl>
                  <Input placeholder="Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Corporate Name</span>
                <FormControl>
                  <Input placeholder="Corporate Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Trade Name</span>
                <FormControl>
                  <Input placeholder="Trade Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Country</span>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      const selectedCountry = paises.find((pais) => pais.uid === value);
                      if (selectedCountry) {
                        field.onChange(selectedCountry.uid);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country">
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
                <span className="block mb-1 text-primary text-xs">Industry Type</span>
                <FormControl>
                  <Input placeholder="Industry Type" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Business Type</span>
                <FormControl>
                  <Input placeholder="Business Type" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Company Email</span>
                <FormControl>
                  <Input placeholder="Company Email" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Company Phone</span>
                <FormControl>
                  <Input placeholder="Company Phone" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Commercial Manager Name</span>
                <FormControl>
                  <Input placeholder="Commercial Manager Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Commercial Manager Email</span>
                <FormControl>
                  <Input placeholder="Commercial Manager Email" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">KAM Name</span>
                <FormControl>
                  <Input placeholder="KAM Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">KAM Email</span>
                <FormControl>
                  <Input placeholder="KAM Email" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Employee Count</span>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Employee Count"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    className="text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
  
        {/* Título Contacto */}
        <div className="mt-8">
          <span className="block text-lg font-semibold text-primary">Contacto</span>
        </div>
  
        {/* Fila de Contacto */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="contact.0.name"
            render={({ field }) => (
              <FormItem>
                <span className="block mb-1 text-primary text-xs">Name</span>
                <FormControl>
                  <Input placeholder="Contact Name" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Phone</span>
                <FormControl>
                  <Input placeholder="Contact Phone" {...field} className="text-xs" />
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
                <span className="block mb-1 text-primary text-xs">Email</span>
                <FormControl>
                  <Input placeholder="Contact Email" {...field} className="text-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
  
        {/* Botón Continuar */}
        <div className="flex justify-end mt-6">
        <Link href="/enroll/menu/empresa">
          <Button type="submit">Continuar</Button>
          </Link>
        </div>
      </form>
    </Form>
  </div>
  
  );
};

export default CompanyForm;
