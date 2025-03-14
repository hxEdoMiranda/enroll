import { Header } from "@/modules/shared/header";
import { Sidebar } from "@/modules/shared/sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header returnButton={true} />
				<main className="flex-1 overflow-auto">{children}</main>
				<Toaster expand={true} richColors closeButton />
			</div>
		</div>
  );
}
