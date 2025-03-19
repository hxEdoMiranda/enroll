"use server";

import {
  ErrorResponse,
  PractitionerCreateData,
  PractitionerGetByIdResponse,
  PractitionerGetData,
  PractitionerResponseData,
  PractitionerUpdateData,
} from "@/types/agenda-admin/agenda-admin";

const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;


export const fetchGetPractitioner = async (): Promise<
  { data: PractitionerGetData[] } | ErrorResponse
> => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/practitioner/doctor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { data: PractitionerResponseData[] } = await response.json();

    const cleanedData: PractitionerGetData[] = data.data.map((practitioner) => ({
      id: practitioner.fhir.id,
      firstName: practitioner.fhir.name[0]?.given[0] || "",
      secondName: practitioner.fhir.name[0]?.given[1] || "",
      lastName: practitioner.fhir.name[0]?.family || "",
      motherLastName: practitioner.fhir.name[0]?.family || "",
      document: practitioner.fhir.identifier[0]?.value || "",
      documentType: practitioner.fhir.identifier[0]?.type.coding[0]?.code || "",
      birthDate: practitioner.fhir.birthDate || "",
      gender: practitioner.fhir.gender || "",
      country_birth: practitioner.fhir.address[0]?.country || "",
      timeZone: practitioner.mongo.timeZone || "",
      phoneNumber: practitioner.fhir.telecom.find(t => t.system === "phone")?.value || "",
      emailAddress: practitioner.fhir.telecom.find(t => t.system === "email")?.value || "",
      prefix: practitioner.fhir.name[0]?.prefix[0] || "",
      address: {
        line: practitioner.fhir.address[0]?.line || [],
        city: practitioner.fhir.address[0]?.city || "",
        state: practitioner.fhir.address[0]?.state || "",
      },
      qualifications: practitioner.fhir.qualification.map(q => ({
        certificateNumber: q.identifier[0]?.value || "",
        urlCertificate: q.identifier[0]?.system || "",
        titleCode: q.code.coding[0]?.code || "",
        urlTitle: q.code.coding[0]?.system || "",
        titleDisplay: q.code.coding[0]?.display || "",
        startDate: q.period.start || "",
        endDate: q.period.end || "",
        issuer: q.issuer.display || "",
      })),
      specializations: practitioner.fhirspecialty?.map(s => ({
        code: s.code || "",
        display: s.name || "",
      })) || [],
    }));

    return { data: cleanedData };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};

export const fetchGetPractitionerById = async (id: string): Promise<{ data: PractitionerGetData } | ErrorResponse> => {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/practitioner/doctor?idPractitioner=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PractitionerGetByIdResponse = await response.json();
    const practitioner = data.data;

    const cleanedData: PractitionerGetData = {
      id: practitioner.fhir.id,
      firstName: practitioner.fhir.name[0]?.given[0] || "",
      secondName: practitioner.fhir.name[0]?.given[1] || "",
      lastName: practitioner.fhir.name[0]?.family || "",
      motherLastName: practitioner.fhir.name[0]?.family || "",
      document: practitioner.fhir.identifier[0]?.value || "",
      documentType: practitioner.fhir.identifier[0]?.type.coding[0]?.code || "",
      birthDate: practitioner.fhir.birthDate || "",
      gender: practitioner.fhir.gender || "",
      country_birth: practitioner.fhir.address[0]?.country || "",
      timeZone: practitioner.mongo.timeZone || "",
      phoneNumber: practitioner.fhir.telecom.find(t => t.system === "phone")?.value || "",
      emailAddress: practitioner.fhir.telecom.find(t => t.system === "email")?.value || "",
      prefix: practitioner.fhir.name[0]?.prefix[0] || "",
      address: {
        line: practitioner.fhir.address[0]?.line || [],
        city: practitioner.fhir.address[0]?.city || "",
        state: practitioner.fhir.address[0]?.state || "",
      },
      qualifications: practitioner.fhir.qualification.map(q => ({
        certificateNumber: q.identifier[0]?.value || "",
        urlCertificate: q.identifier[0]?.system || "",
        titleCode: q.code.coding[0]?.code || "",
        urlTitle: q.code.coding[0]?.system || "",
        titleDisplay: q.code.coding[0]?.display || "",
        startDate: q.period.start || "",
        endDate: q.period.end || "",
        issuer: q.issuer.display || "",
      })),
      specializations: practitioner.fhirspecialty?.map(s => ({
        code: s.code || "",
        display: s.name || "",
      })) || [],
    };

    console.log(cleanedData);

    return { data: cleanedData };

  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return { error: "Ocurrió un error inesperado", message: "Ocurrió un error inesperado" };
    }
  }
};

export const fetchUpdatePerfilPractitioner = async (
  id: string,
  data: PractitionerUpdateData
): Promise<{ data: PractitionerResponseData } | ErrorResponse> => {
  console.log(data);
  console.log(id)
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/practitioner/doctor/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: PractitionerResponseData = await response.json();
    return { data: responseData };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};

export const fetchCreatePostPractitioner = async (
  data: PractitionerCreateData
): Promise<{ data: PractitionerResponseData } | ErrorResponse> => {
  
  console.log(data);
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/practitioner/doctor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: PractitionerResponseData = await response.json();
    return { data: responseData };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};
