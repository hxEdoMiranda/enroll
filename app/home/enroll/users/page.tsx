'use client';

import React, { useState } from 'react';
import PaisForm from '@/components/ms/enroll/form-pais'

const PlanesPage = () => {

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
       <PaisForm />

        {/* Columna derecha */}

      </div>
    </div>
  );
};

export default PlanesPage;
