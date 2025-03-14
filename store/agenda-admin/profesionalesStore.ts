import {create} from "zustand";
import { PractitionerGetData } from "@/types/agenda-admin/agenda-admin";

// interface ProfesionalesState {
//   searchQuery: string;
//   filteredData: PractitionerGetData[];
//   setSearchQuery: (query: string) => void;
//   setFilteredData: (data: PractitionerGetData[]) => void;
// }

// export const useProfesionalesStore = create<ProfesionalesState>((set) => ({
//   searchQuery: "",
//   filteredData: [],
//   setSearchQuery: (query) => set({ searchQuery: query }),
//   setFilteredData: (data) => set({ filteredData: data }),
// }));


interface ProfesionalesState {
  searchQuery: string;
  filteredData: PractitionerGetData[];
  currentPage: number;
  itemsPerPage: number;
  setSearchQuery: (query: string) => void;
  setFilteredData: (data: PractitionerGetData[]) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

export const useProfesionalesStore = create<ProfesionalesState>((set) => ({
  searchQuery: "",
  filteredData: [],
  currentPage: 1,
  itemsPerPage: 8,
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }), // Reset to page 1 when searching
  setFilteredData: (data) => set({ filteredData: data }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }), // Reset to page 1 when changing items per page
}));