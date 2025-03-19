"use client";

import { Home, Calendar, Users, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", href: "/admin-agenda" },
  { icon: Calendar, label: "Agenda profesionales", href: "/admin-agenda/agenda" },
  { icon: Users, label: "Profesionales", href: "/admin-agenda/profesionales" },
];

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  className?: string;
  src?: string;
}


function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-2 text-[10px] max-w-[70px] text-white/70 transition-colors hover:text-white",
        active && "text-white",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({ className, src }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
    className={cn("flex w-32 h-screen items-center flex-col bg-gradient-to-b from-[#2834a0] to-[#1a84d2] text-white", className)}
    >
      <div className="flex justify-center items-center p-5 pb-6">
        {/* <Image src="/img/isotipo-negativo.svg" alt="Logo" width={70} height={51} /> */}
      </div>

      <nav className="flex  flex-col text-center items-center justify-center border rounded-full py-8 gap-2 bg-white/10 ">
        {menuItems.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            icon={<link.icon className="h-6 w-6" />}
            label={link.label}
            active={pathname === link.href}
          />
        ))}
      </nav>
    </aside>
  );
}