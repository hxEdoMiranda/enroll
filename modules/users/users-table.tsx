"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { ButtonBanner } from "@/components/ms/button-banner";
import { EditUserIcon } from "../icons";
import { EditPatientForm } from "@/components/ms/enroll/form-editar-paciente-individual";
import { UserType } from "../configuration/types/user.type";
import { getAllUsers } from "@/modules/configuration/actions/fetch-user";

export default function UserTable({ users }: { users: UserType[] }) {
	console.log("users received >>>", users);

	const [searchQuery, setSearchQuery] = React.useState("");
	const [filteredUsers, setFilteredUsers] = React.useState(users);
	const [currentPage, setCurrentPage] = React.useState(1);
	const usersPerPage = 8;
	const [isOpen, setIsOpen] = React.useState(false);
	const [tableUsers, setTableUsers] = React.useState(users);

	const refreshTable = async () => {
		try {
			const response = await getAllUsers();
			if (response.ok && response.data) {
				const newUsers = response.data;
				setTableUsers(newUsers);
				const filteredData = searchQuery 
					? newUsers.filter((user: UserType) =>
						user.clerk.firstName.toLowerCase().includes(searchQuery.toLowerCase())
					  )
					: newUsers;
				setFilteredUsers(filteredData);
				setCurrentPage(1);
				toast.success('Tabla actualizada exitosamente');
			} else {
				console.error('Error en la respuesta:', response);
				toast.error('Error al actualizar la tabla');
			}
		} catch (error) {
			console.error('Error refreshing table:', error);
			toast.error('Error al actualizar la tabla');
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		const filtered = tableUsers.filter((user) =>
			user.clerk.firstName.toLowerCase().includes(query.toLowerCase())
		);
		setFilteredUsers(filtered);
		setCurrentPage(1);
	};

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	const calcularEdad = (birthDate: string): number => {
		const fechaNacimiento = new Date(birthDate);
		const hoy = new Date();
		let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
		const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();

		if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
			edad--;
		}

		return edad;
	};

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="gap-1">
						Edad:20-24
						<button className="ml-1 hover:bg-muted rounded-full">
							×
						</button>
					</Badge>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="gap-2"
							>
								Filtros
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuCheckboxItem>
								Edad
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>
								País
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>
								Empresa
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="relative w-72">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Buscar usuario"
						className="pl-8"
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Nombre</TableHead>
							<TableHead>Empresa</TableHead>
							<TableHead>País</TableHead>
							<TableHead>Previsión</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Sexo</TableHead>
							<TableHead>Inicio Contrato</TableHead>
							<TableHead>Término Contrato</TableHead>
							<TableHead>Edad</TableHead>
							<TableHead>Datos paciente</TableHead>
							<TableHead>Habilitado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentUsers.map((user) => (
							<TableRow key={user.clerk.id}>
								<TableCell className="font-medium">
									{user.clerk.firstName || "-"} {user.clerk.lastName || "-"}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Image
											src={
												user.clerk.imageUrl ||
												"/placeholder.svg"
											}
											alt={user.clerk.firstName || "-"}
											width={20}
											height={20}
											className="rounded-full"
										/>
										{user.clerk.firstName || "-"}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Image
											src={
												user.clerk.imageUrl ||
												"/placeholder.svg"
											}
											alt={user.clerk.firstName || "-"}
											width={20}
											height={20}
											className="rounded-sm"
										/>
										{user.clerk.firstName || "-"}
									</div>
								</TableCell>
								<TableCell>Fonasa</TableCell>
								<TableCell>Titular</TableCell>
								<TableCell>{user.fhir.gender || "-"}</TableCell>
								<TableCell>2024-01-01</TableCell>
								<TableCell>2026-01-01</TableCell>
								<TableCell>{calcularEdad(user.fhir.birthDate)} años</TableCell>
								<TableCell>
									<ButtonBanner
										trigger={
											<Button
												variant="ghost"
												className="flex font-semibold flex-row gap-2 shadow-sm text-[#414651] bg-white hover:bg-primary hover:text-white hover:border-primary items-center rounded-full border border-[#D5D7DA]"
											>
												<EditUserIcon fill="currentColor" />
												Editar
											</Button>
										}
										content={
											<EditPatientForm 
												user={user}
												onSuccess={refreshTable}
											/>
										}
										title="Editar Paciente"
										description="Edita los datos del paciente"
										className="w-[1010px] p-8"
									/>
								</TableCell>
								<TableCell>
									<Switch />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Pagination className="mt-4">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 1, 1))
							}
							className={
								currentPage === 1
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
					{[...Array(totalPages)].map((_, i) => (
						<PaginationItem key={i + 1}>
							<PaginationLink
								href="#"
								onClick={() => setCurrentPage(i + 1)}
								isActive={currentPage === i + 1}
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={() =>
								setCurrentPage((prev) =>
									Math.min(prev + 1, totalPages)
								)
							}
							className={
								currentPage === totalPages
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
