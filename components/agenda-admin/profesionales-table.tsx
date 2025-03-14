"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit2, ToggleLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ProfesionalesContentProps } from "@/types/agenda-admin/agenda-admin";
import { useProfesionalesStore } from "@/store/agenda-admin/profesionalesStore";

export function ProfesionalesTable() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProfesional, setSelectedProfesional] = useState<any>(null);
  const { filteredData } = useProfesionalesStore();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);

  useEffect(() => {
    // Calculate total pages
    const total = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(total);
    
    // Ensure current page is valid
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
    
    // Paginate the data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage]);

  const handleStateChange = (profesional: any) => {
    setSelectedProfesional(profesional);
    setDialogOpen(true);
  };

  const confirmStateChange = async () => {
    setDialogOpen(false);
    setSelectedProfesional(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo de profesional</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((profesional) => (
                  <TableRow key={profesional.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {profesional.firstName + " " + profesional.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* Fecha creación: {profesional.fechaCreacion} */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {profesional.qualifications
                        .map((q: { titleDisplay: string }) => q.titleDisplay)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {profesional.specializations
                        .map((s: { display: string }) => s.display)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{profesional.emailAddress}</TableCell>
                    <TableCell>{profesional.phoneNumber}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}
                      >
                        Activo
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(
                              `/admin-agenda/profesionales/${profesional.id}`
                            )
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleStateChange(profesional)}
                          title={`Cambiar estado`}
                        >
                          <ToggleLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No se encontraron profesionales
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {paginatedData.length} de {filteredData.length} resultados
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                    return <span key={`ellipsis-${index}`} className="mx-1">...</span>;
                  }
                  
                  return (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="px-3"
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cambio de estado</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cambiar el estado de este profesional?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmStateChange}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
