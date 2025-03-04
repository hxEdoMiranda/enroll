"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import React from "react";

export interface ButtonBannerProps {
	trigger: React.ReactNode;
	content: React.ReactNode;
	title: string;
	description: string;
	onClick?: () => void;
	className?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export const ButtonBanner = ({
	trigger,
	title,
	description,
	content,
	className,
	titleClassName,
	descriptionClassName,
}: ButtonBannerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	console.log("isOpen", isOpen);

	// Clonamos el contenido y le pasamos la función para cerrar el modal
	const contentWithProps = React.cloneElement(content as React.ReactElement, {
		onSuccess: () => setIsOpen(false)
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className={className}>
				<div className="bg-[#FBFBFB] rounded-lg p-6 w-full">
					<DialogHeader>
						<DialogTitle className={`text-3xl font-bold text-primary ${titleClassName}`}>
							{title}
						</DialogTitle>
						<DialogDescription className={`text-sm text-[#262626] ${descriptionClassName}`}>
							{description}
						</DialogDescription>
					</DialogHeader>
					{contentWithProps}
				</div>
			</DialogContent>
		</Dialog>
	);
};
