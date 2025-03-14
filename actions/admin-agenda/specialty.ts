"use server";

interface SnomedCTDescription {
  conceptId: string;
  term: string;
  active: boolean;
  moduleId: string;
  conceptActive: boolean;
}

interface SnomedCTResponse {
  items: SnomedCTDescription[];
  limit: number;
  total: number;
}

export const searchSpecialties = async (searchTerm: string): Promise<{ data: { id: string, name: string }[] } | { error: string }> => {
  if (!searchTerm || searchTerm.length < 3) {
    return { data: [] };
  }

  try {
    const encodedTerm = encodeURIComponent(searchTerm);
    const url = `https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-ES/2024-09-30/descriptions?&limit=100&term=psicologia&active=true&conceptActive=true&lang=english&semanticTags=calificador&groupByConcept=true`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // pasar user agent
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SnomedCTResponse = await response.json();
    
    const specialties = data.items.map(item => ({
      id: item.conceptId,
      name: item.term
    }));

    return { data: specialties };
  } catch (error) {
    console.error("Error fetching specialties:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Ocurrió un error inesperado al buscar especialidades" };
  }
};