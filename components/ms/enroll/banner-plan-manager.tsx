"use client";

import Image from "next/image";
import { PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuggageIcon } from "@/modules/icons";
import { ListButtonBanner } from "@/components/ms/list-button-banner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlanModel } from "@/modules/configuration/types/Plan.type";
import React from "react";
import PlanForm from "./form-plan";

interface BannerPlanManagerProps {
	planesData: PlanModel[];
	selectedPlanId: string | null;
	onPlanSelect?: (planId: string) => void;
}

export function BannerPlanManager({ planesData, selectedPlanId, onPlanSelect }: BannerPlanManagerProps) {


	const actionsButtons = [
		{
			trigger: (
				<Button
					variant="ghost"
					className="flex flex-row gap-2 shadow-lg text-white bg-white/20 hover:bg-white/70 items-center rounded-full border border-white"
				>
					AGREGAR PLAN
					<PlusSquare/>
				</Button>
			),
			content: <PlanForm />,
			className: "w-[1010px] p-8",
		},
	];

	// Aseguramos que siempre se use el primer plan como valor inicial
	React.useEffect(() => {
		if (planesData.length > 0 && onPlanSelect) {
			onPlanSelect(planesData[0].uid);
		}
	}, [planesData, onPlanSelect]);

	return (
		<div className="relative bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat h-[156px] rounded-xl mb-4 flex flex-row gap-1 items-center justify-between p-8">
			<div className="flex flex-row gap-2 items-center h-full">
				<Image
					src="/img/enroll/AvatarEmpresa.png"
					alt="logo"
					width={48}
					height={48}
				/>
				<div className="flex flex-col h-fit">
					<h1 className="text-white font-medium text-3xl">
						Gestión Plan
					</h1>
					<p className="text-white font-normal text-base">Plan</p>
				</div>
				<div className="ml-6 flex flex-row gap-2 items-center bg-white/20 rounded-md px-4 py-2 text-white font-bold text-xl">
					Edición Planes
					<LuggageIcon />
				</div>
			</div>
			<div className="flex flex-row gap-4 items-center h-full">
				<div className="flex flex-col gap-1">
					<Label className="text-white font-medium text-sm">
						Seleccionar Plan
					</Label>
					<Select
						onValueChange={(value) => {
							onPlanSelect?.(value);
						}}
						value={selectedPlanId || ""}
					>
						<SelectTrigger className="w-[328px] h-10">
							<SelectValue placeholder="Seleccionar Plan" />
						</SelectTrigger>
						<SelectContent>
							{planesData.map((plane) => (
								<SelectItem key={plane.uid} value={plane.uid}>
									{plane.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<ListButtonBanner buttons={actionsButtons} />
			</div>
		</div>
	);
}
