import { HeaderBackoffice } from "@/components/ms/header-backoffice";
import { ClerkProvider } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <HeaderBackoffice />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ClerkProvider>
  );
}
