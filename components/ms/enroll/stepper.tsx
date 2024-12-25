import React from "react";

interface Step {
  label: string;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
}

const steps: Step[] = [
  { label: "Datos de la empresa", description: "Ingresa los detalles básicos de la empresa", isActive: true, isCompleted: false },
  { label: "Planes", description:"Crea y vincula los planes", isActive: false, isCompleted: false },
  { label: "Servicios", description:"Configura y asocia los servicios disponibles",isActive: false, isCompleted: false },
  { label: "Cargar usuarios", description:"Registrar y vincular usuarios",isActive: false, isCompleted: false },
  { label: "Personalización", description:"Crea y adapta la personalización",isActive: false, isCompleted: false },
];

const Stepper = () => {
  return (
    <div className="flex flex-col space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="relative flex items-start">
          {/* Line connecting steps */}
          {index < steps.length - 1 && (
            <span
              className="absolute left-5 top-10 h-full w-0.5 bg-gray-300"
              aria-hidden="true"
            />
          )}

          {/* Step Icon */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              step.isCompleted
                ? "border-green-500 bg-green-500 text-white"
                : step.isActive
                ? "border-blue-500 bg-blue-100 text-blue-500"
                : "border-gray-300 bg-white text-gray-500"
            }`}
          >
            {step.isCompleted ? "✓" : index + 1}
          </div>

          {/* Step Label */}
          <div className="ml-4">
            <p
              className={`font-semibold ${
                step.isActive ? "text-primary" : "text-primary opacity-50"
              }`}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-sm text-secondary">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
