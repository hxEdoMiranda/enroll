'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ButtonBannerProps {
	trigger: React.ReactNode;
	content: React.ReactNode;
	title: string;
	description: string;
	onClick?: () => void;
}

export const ButtonBanner = ({
	trigger,
	title,
	description,
	content,
}: ButtonBannerProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="bg-[#FBFBFB] rounded-lg p-4">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-primary">
							{title}
						</DialogTitle>
						<DialogDescription className="text-sm text-[#262626]">
							{description}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4 ">{content}</div>
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};
