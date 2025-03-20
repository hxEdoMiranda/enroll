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
	className?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
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

	// Clone the content and pass the setIsOpen function
	const contentWithProps = React.cloneElement(content as React.ReactElement, {
		onSuccess: () => {
			setIsOpen(false);
			// Call the original onSuccess if it exists
			if ((content as React.ReactElement).props.onSuccess) {
				(content as React.ReactElement).props.onSuccess();
			}
		}
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
