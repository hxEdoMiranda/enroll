'use client';

import React, { useState } from 'react';
import PlanForm from '@/components/ms/enroll/form-plan'
import Stepper from '@/components/ms/enroll/stepper';

const PlanesPage = () => {

  return (
    <div className="p-4 md:p-8 bg-white bg-opacity-60 mr-6 mb-4 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
       <PlanForm />

        {/* Columna derecha */}
      <Stepper/>
      </div>
    </div>
  );
};

export default PlanesPage;
