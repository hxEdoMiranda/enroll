"use client";

import { useClerk, useSession } from "@clerk/nextjs";

import { ChevronLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumbs from "./breadcrumbs";

interface HeaderProps {
  className?: string;
  returnButton: boolean;
  root?:string;
}

export function Header({ className, root }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === `/${root}`;

  const { signOut } = useClerk();
  const { session } = useSession();

  return (
    <header
      className={cn(
        "flex bg-white px-8 py-4 h-40 z-30 items-center rounded-tl-3xl",
        isRoot && "bg-transparent && text-white",
        className
      )}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            className={cn(
              "py-2 px-4 border border-gray-600 rounded-full hover:bg-white",
              isRoot && "hidden"
            )}
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver</span>
          </Button>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="border rounded-xl flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xl">
                      {session?.user.fullName}
                    </p>
                    <p className="text-[#0B9DE0] font-mulish text-base font-normal leading-5 underline">
                      Ver tu cuenta
                    </p>
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="#" alt="Avatar del usuario" />
                    <AvatarFallback className="bg-primary">
                      {session?.user.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground"></p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {!isRoot && <Breadcrumbs separator={"/"} />}
      </div>
    </header>
  );
}
