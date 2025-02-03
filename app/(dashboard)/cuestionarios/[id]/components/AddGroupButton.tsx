"use client";

import { useModal } from "@/components/modal/provider";
import { Button } from "@/components/ui/button";
import { AddGroupForm } from "./AddGroupForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddGroupButton = () => {
  
  return (
    <Dialog>
      <DialogHeader>
        <DialogTitle hidden>Agregar grupo al cuestionario</DialogTitle>
      </DialogHeader>
      <DialogTrigger asChild>
        <Button>Agregar grupo</Button>
      </DialogTrigger>
      <DialogContent>
        <AddGroupForm />
      </DialogContent>
    </Dialog>
  );
};
