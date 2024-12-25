'use client';

import React, { ReactNode } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Añadir la propiedad children
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
        <DialogTitle className="text-xl font-bold">Modal Title</DialogTitle>
        <DialogDescription className="mb-4">
          {children}
        </DialogDescription>
        <DialogClose asChild>
          <Button onClick={onClose} className="bg-primary text-primary-foreground">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
