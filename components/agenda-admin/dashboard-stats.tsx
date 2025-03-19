import { Card } from "@/components/ui/card";
import { Users, FileText, UserCheck, UserX } from "lucide-react";

const stats = [
  {
    title: "Profesionales Activos",
    value: "939",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Profesionales Inactivos",
    value: "9",
    icon: UserX,
    color: "text-red-600",
  },
  {
    title: "Convenios Activos",
    value: "50",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Total Profesionales",
    value: "948",
    icon: Users,
    color: "text-purple-600",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}