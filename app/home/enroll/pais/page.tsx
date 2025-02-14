
import PaisForm from '@/components/ms/enroll/form-pais'
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import PaisesTable  from "@/components/ms/enroll/grid-country"

const CountryPage = () => {

  return (

<main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 w-full">
  <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex items-center justify-between px-8">
    <div className="flex items-center gap-2">
      <Building2 className="size-10 text-white mr-2" />
      <h1 className="text-white font-bold text-3xl">Gestión de Países</h1>
    </div>
    <div className="flex gap-2 items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Agregar Pais</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Pais</DialogTitle>
            <DialogDescription>Complete los siguientes campos para agregar un país.</DialogDescription>
          </DialogHeader>
          <PaisForm></PaisForm>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  <PaisesTable></PaisesTable>
</main>

  );
};

export default CountryPage;
