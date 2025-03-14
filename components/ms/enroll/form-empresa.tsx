'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import {  Select, SelectTrigger,SelectValue,SelectContent,SelectGroup, SelectItem } from '@/components/ui/select'; 
import React, { useState, useEffect } from 'react';
import { postCreateEmpresa } from '@/actions/enroll/empresa'; 
import { getPaises,IPais  } from '@/actions/enroll/pais'; // Importar getPaises desde su archivo

// Definir el esquema de validación
const countrySchema = z.object({
  _id: z.string().min(1, { message: "Country ID is required." }),
  code: z.string().min(1, { message: "Country code is required." }),
  name: z.string().min(1, { message: "Country name is required." }),
  code_phone: z.string().min(1, { message: "Country phone code is required." }),
});

// Definir el esquema de validación
const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Identifier is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  trade_name: z.string().min(1, { message: 'Trade Name is required.' }),
  corporate_name: z.string().min(1, { message: 'Corporate Name is required.' }),
  country: countrySchema,
  industry_type: z.string().min(1, { message: 'Industry Type is required.' }),
  business_type: z.string().min(1, { message: 'Business Type is required.' }),
  company_phone: z.string().min(1, { message: 'Company Phone is required.' }),
  company_email: z.string().email({ message: 'Invalid email format.' }),
  commercial_manager: z.string().min(1, { message: 'Commercial Manager is required.' }),
  commercial_manager_email: z.string().email({ message: 'Invalid email format.' }),
  kam: z.string().min(1, { message: 'KAM is required.' }),
  email_kam: z.string().email({ message: 'Invalid email format.' }),
  employee_count: z.number().min(1, { message: 'Employee Count is required.' }),
  enabled: z.boolean().default(true),
});

const CompanyForm = () => {
  const [message, setMessage] = useState('');
  const [paises, setPaises] = useState<IPais[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      name: '',
      trade_name: '',
      corporate_name: '',
      country: {
        _id: '',
        code: '',
        name: '',
        code_phone: '',
      },
      industry_type: '',
      business_type: '',
      company_phone: '',
      company_email: '',
      commercial_manager: '',
      commercial_manager_email: '',
      kam: '',
      email_kam: '',
      employee_count: 0,
      enabled: true,
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes valores:", values);
    try {
      const mappedValues = {
        identifier: values.identifier,
        name: values.name,
        trade_name: values.trade_name,
        corporate_name: values.corporate_name,
        country: values.country._id,
        industry_type: values.industry_type,
        business_type: values.business_type,
        company_phone: values.company_phone,
        company_email: values.company_email,
        contact: {
          name: values.commercial_manager,
          phone: null, 
          mail: values.commercial_manager_email,
        },
        commercial_manager: values.commercial_manager,
        commercial_manager_email: values.commercial_manager_email,
        kam: values.kam,
        email_kam: values.email_kam,
        employee_count: values.employee_count,
        enabled: values.enabled ?? true, 
      };
  
      const result = await postCreateEmpresa(mappedValues);
      console.log("Resultado de la API:", result);
      setMessage('Empresa creada exitosamente.');
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage('Error al crear la empresa. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    <div className="space-y-8">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          <FormField control={form.control} name="identifier" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Identifier</span>
              <FormControl>
                <Input placeholder="Identifier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Name</span>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="trade_name" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Trade Name</span>
              <FormControl>
                <Input placeholder="Trade Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="corporate_name" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Corporate Name</span>
              <FormControl>
                <Input placeholder="Corporate Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="country" render={({ field }) => (
  <FormItem>
    <span className="block mb-1 text-primary">Country</span>
    <FormControl>
      <Select
        value={field.value?._id || ""}
        onValueChange={(value) => {
          const selectedCountry = paises.find(pais => pais.uid === value);
          if (selectedCountry) {
            field.onChange({
              _id: selectedCountry.uid,
              code: selectedCountry.code,
              name: selectedCountry.name,
              code_phone: selectedCountry.code_phone
            });
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a country">
            {field.value ? field.value.name : "Select a country"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {paises.map(pais => (
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
)} />

        </div>
  
        {/* Columna 2 */}
        <div className="space-y-4">
          <FormField control={form.control} name="industry_type" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Industry Type</span>
              <FormControl>
                <Input placeholder="Industry Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="business_type" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Business Type</span>
              <FormControl>
                <Input placeholder="Business Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="company_phone" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Company Phone</span>
              <FormControl>
                <Input placeholder="Company Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="company_email" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Company Email</span>
              <FormControl>
                <Input placeholder="Company Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="commercial_manager" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Commercial Manager</span>
              <FormControl>
                <Input placeholder="Commercial Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
  
        {/* Columna 3 */}
        <div className="space-y-4">
          <FormField control={form.control} name="commercial_manager_email" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">Commercial Manager Email</span>
              <FormControl>
                <Input placeholder="Commercial Manager Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="kam" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">KAM</span>
              <FormControl>
                <Input placeholder="KAM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email_kam" render={({ field }) => (
            <FormItem>
              <span className="block mb-1 text-primary">KAM Email</span>
              <FormControl>
                <Input placeholder="KAM Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
         <FormField control={form.control} name="employee_count" render={({ field }) => (
  <FormItem>
    <span className="block mb-1 text-primary">Employee Count</span>
    <FormControl>
      <Input
        type="number"
        placeholder="Employee Count"
        value={field.value} // Asegúrate de que el valor sea un número
        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} // Convertir a número
      />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />

          {/* Botón en la última columna */}
          <div className="mt-4 flex justify-end">
            <Button type="submit" className="w-full lg:w-auto">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
    {message && <div className="mt-4 text-center text-primary">{message}</div>}
  </div>
  
  
  );
};

export default CompanyForm;
