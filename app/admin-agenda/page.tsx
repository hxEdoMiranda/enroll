import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/agenda-admin/calendar";
import { DashboardStats } from "@/components/agenda-admin/dashboard-stats";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Calendario de Eventos</h2>
        <Calendar />
      </Card>
    </div>
  );
}