"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Home,
  Users2,
  Wrench,
  FileText,
  PieChart,
} from "lucide-react";
import { MedismartIsotipoNegativo } from "../icons";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Building2, label: "Empresas", href: "/empresas" },
  { icon: Users2, label: "Usuarios Admin", href: "/usuarios" },
  { icon: Wrench, label: "Servicios", href: "/servicios" },
  { icon: FileText, label: "Pacientes", href: "/pacientes" },
  { icon: PieChart, label: "Reportería", href: "/reporteria" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen h-full flex flex-col items-center px-8 py-4 overflow-y-auto">
      {/* Ícono Medismart con padding flexible */}
      <div className="flex flex-col gap-2 items-center max-w-[85px] py-4">
        <MedismartIsotipoNegativo className="size-8" />
        <Separator className="w-full" />
        <p className="text-white text-center text-[14px] font-normal leading-[20px] tracking-[8.68px]">
          Enroll
        </p>
      </div>

      {/* Navegación con scroll si es necesario */}
      <nav className="flex flex-col gap-4 border rounded-[42px] bg-white/20 shadow-md backdrop-blur-[87px] p-3 py-6 max-w-[77px] my-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors text-white/90 hover:text-white shrink-0",
                isActive && "text-white"
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-[10px] sm:text-xs text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
