export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PractitionerQualification {
  certificateNumber: string;
  urlCertificate?: string;
  titleCode: string;
  urlTitle?: string;
  titleDisplay: string;
  startDate: string;
  endDate: string;
  issuer: string;
}

export interface PractitionerSpecialization {
  code: string;
  display?: string;
}

export interface PractitionerCreateData {
  firstName: string;
  secondName?: string;
  lastName: string;
  motherLastName?: string;
  document: string;
  documentType: string;
  birthDate: string;
  gender: string;
  country_birth: string;
  timeZone: string;
  phoneNumber?: string;
  emailAddress?: string;
  prefix?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
  };
  password?: string;
  qualifications?: PractitionerQualification[];
  specializations?: PractitionerSpecialization[];
}

export interface PractitionerGetData {
  id: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  motherLastName?: string;
  document: string;
  documentType: string;
  birthDate: string;
  gender: string;
  country_birth: string;
  timeZone: string;
  phoneNumber?: string;
  emailAddress?: string;
  prefix?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
  };
  password?: string;
  qualifications?: PractitionerQualification[];
  specializations?: PractitionerSpecialization[];
}

export interface PractitionerResponseData {
  fhir: {
    address: {
      use: string;
      city: string;
      line: string[];
      state: string;
      country: string;
    }[];
    meta: {
      profile: string[];
      lastUpdated: string;
      versionId: string;
      extension: {
        url: string;
        valueInstant: string;
      }[];
    };
    name: {
      use: string;
      given: string[];
      family: string;
      prefix: string[];
    }[];
    birthDate: string;
    resourceType: string;
    active: boolean;
    id: string;
    identifier: {
      use: string;
      type: {
        coding: {
          code: string;
          system: string;
          display: string;
        }[];
        extension: {
          url: string;
          valueCodeableConcept: {
            coding: {
              code: string;
              system: string;
              display: string;
            }[];
          };
        }[];
      };
      value: string;
      system: string;
    }[];
    qualification: {
      code: {
        text: string;
        coding: {
          code: string;
          system: string;
          display: string;
        }[];
      };
      issuer: {
        display: string;
      };
      period: {
        end: string;
        start: string;
      };
      identifier: {
        value: string;
        system: string;
      }[];
    }[];
    telecom: {
      use: string;
      value: string;
      system: string;
    }[];
    gender: string;
  };
  fhirspecialty: {
    code: string;
    name: string;
  }[];
  clerk: {
    id: string;
    passwordEnabled: boolean;
    totpEnabled: boolean;
    backupCodeEnabled: boolean;
    twoFactorEnabled: boolean;
    banned: boolean;
    locked: boolean;
    createdAt: number;
    updatedAt: number;
    imageUrl: string;
    hasImage: boolean;
    primaryEmailAddressId: string;
    primaryPhoneNumberId: string;
    primaryWeb3WalletId: string | null;
    lastSignInAt: string | null;
    externalId: string | null;
    username: string;
    firstName: string;
    lastName: string;
    publicMetadata: Record<string, unknown>;
    privateMetadata: Record<string, unknown>;
    unsafeMetadata: Record<string, unknown>;
    emailAddresses: {
      id: string;
      emailAddress: string;
      verification: {
        status: string;
        strategy: string;
        externalVerificationRedirectURL: string | null;
        attempts: number | null;
        expireAt: string | null;
        nonce: string | null;
        message: string | null;
      };
      linkedTo: unknown[];
    }[];
    phoneNumbers: {
      id: string;
      phoneNumber: string;
      reservedForSecondFactor: boolean;
      defaultSecondFactor: boolean;
      verification: {
        status: string;
        strategy: string;
        externalVerificationRedirectURL: string | null;
        attempts: number | null;
        expireAt: string | null;
        nonce: string | null;
        message: string | null;
      };
      linkedTo: unknown[];
    }[];
    web3Wallets: unknown[];
    externalAccounts: unknown[];
    samlAccounts: unknown[];
    lastActiveAt: string | null;
    createOrganizationEnabled: boolean;
    createOrganizationsLimit: number | null;
    deleteSelfEnabled: boolean;
    legalAcceptedAt: string | null;
    _raw: Record<string, unknown>;
  };
  mongo: {
    id_patient: string | null;
    id_oauth: string;
    id_practitioner: string;
    plan: unknown[];
    timeZone: string;
    state: boolean;
    createdAt: string;
    updatedAt: string;
    uid: string;
  };
}

export interface PractitionerGetByIdResponse {
  message: string;
  data: PractitionerResponseData;
}

export interface PractitionerUpdateData {
  firstName?: string;
  secondName?: string;
  lastName?: string;
  motherLastName?: string;
  document?: string;
  documentType?: string;
  birthDate?: string;
  gender?: string;
  country_birth?: string;
  timeZone?: string;
  prefix?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
  };
  qualifications?: PractitionerQualification[];
  specializations?: PractitionerSpecialization[];
}

export interface ProfesionalesContentProps {
  data: PractitionerGetData[];
}

