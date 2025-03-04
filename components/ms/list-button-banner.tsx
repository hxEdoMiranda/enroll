import { ButtonBanner, ButtonBannerProps } from "./button-banner";

interface ListButtonBannerProps {
	buttons: ButtonBannerProps[];
}

export const ListButtonBanner = ({ buttons }: ListButtonBannerProps) => {
	return (
		<div className="flex flex-row gap-2 items-center">
			{buttons.map((button, index) => (
				<ButtonBanner
					key={index}
					trigger={button.trigger}
					content={button.content}
					title={button.title}
					description={button.description}
					className={button.className}
					onClick={button.onClick}
					titleClassName={button.titleClassName}
					descriptionClassName={button.descriptionClassName}
				/>
			))}
		</div>
	);
};
