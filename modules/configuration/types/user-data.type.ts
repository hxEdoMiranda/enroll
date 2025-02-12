export interface Address {
    line: string[];
    city: string;
    state: string;
  }
  
  export interface UserData {
    firstName: string;
    secondName?: string;
    lastName: string;
    motherLastName?: string;
    emailAddress: string;
    country: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    document: string;
    documentType: string;
    address: Address;
    maritalStatus?: string;
    plans?: string[];
    roles?: ("admin" | "patient" | "superadmin" | "doctor")[];
    countryResidence: string;
  }
  