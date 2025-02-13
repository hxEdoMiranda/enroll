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
  
  export interface User {
  user:         UserClass;
  organization: Organization;
}

export interface Organization {
  id:                    string;
  name:                  string;
  slug:                  string;
  imageUrl:              string;
  hasImage:              boolean;
  createdAt:             number;
  updatedAt:             number;
  publicMetadata:        Metadata;
  privateMetadata:       Metadata;
  maxAllowedMemberships: number;
  adminDeleteEnabled:    boolean;
}

export interface Metadata {
  [key: string]: string | number | boolean | null;
}

export interface UserClass {
  id:                        string;
  passwordEnabled:           boolean;
  totpEnabled:               boolean;
  backupCodeEnabled:         boolean;
  twoFactorEnabled:          boolean;
  banned:                    boolean;
  locked:                    boolean;
  createdAt:                 number;
  updatedAt:                 number;
  imageUrl:                  string;
  hasImage:                  boolean;
  primaryEmailAddressId:     string;
  primaryPhoneNumberId:      null;
  primaryWeb3WalletId:       null;
  lastSignInAt:              null;
  externalId:                null;
  username:                  string;
  firstName:                 string;
  lastName:                  string;
  publicMetadata:            Metadata;
  privateMetadata:           Metadata;
  unsafeMetadata:            Metadata;
  emailAddresses:            EmailAddress[];
  phoneNumbers:              any[];
  web3Wallets:               any[];
  externalAccounts:          any[];
  samlAccounts:              any[];
  lastActiveAt:              null;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit:  null;
  deleteSelfEnabled:         boolean;
  legalAcceptedAt:           null;
}

export interface EmailAddress {
  id:           string;
  emailAddress: string;
  verification: Verification;
  linkedTo:     any[];
}

export interface Verification {
  status:                          string;
  strategy:                        string;
  externalVerificationRedirectURL: null;
  attempts:                        null;
  expireAt:                        null;
  nonce:                           null;
  message:                         null;
}

export interface UpdateDataUser {
  externalId?: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  motherLastName?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | undefined;
  country?: string;
  address?: {
    line?: string[];
    city?: string;
    state?: string;
  };
  emailAddress?: string;
  language?: string;
  maritalStatus?: string;
  idPlan?: string;
}

// Tipos para pacientes full

export interface Patient {
  message: string;
  data:    Data;
}

export interface Data {
  clerk: Clerk[];
  mongo: Mongo[];
  fhir:  Fhir;
}

export interface Clerk {
  user:         User;
  organization: Organization;
}

export interface Organization {
  id:                    string;
  name:                  string;
  slug:                  string;
  imageUrl:              string;
  hasImage:              boolean;
  createdAt:             number;
  updatedAt:             number;
  publicMetadata:        Metadata;
  privateMetadata:       Metadata;
  maxAllowedMemberships: number;
  adminDeleteEnabled:    boolean;
}

export interface Metadata {
  [key: string]: string | number | boolean | null;
}

export interface User {
  id:                        string;
  passwordEnabled:           boolean;
  totpEnabled:               boolean;
  backupCodeEnabled:         boolean;
  twoFactorEnabled:          boolean;
  banned:                    boolean;
  locked:                    boolean;
  createdAt:                 number;
  updatedAt:                 number;
  imageUrl:                  string;
  hasImage:                  boolean;
  primaryEmailAddressId:     string;
  primaryPhoneNumberId:      null;
  primaryWeb3WalletId:       null;
  lastSignInAt:              null;
  externalId:                null;
  username:                  string;
  firstName:                 string;
  lastName:                  string;
  publicMetadata:            Metadata;
  privateMetadata:           Metadata;
  unsafeMetadata:            Metadata;
  emailAddresses:            EmailAddress[];
  phoneNumbers:              any[];
  web3Wallets:               any[];
  externalAccounts:          any[];
  samlAccounts:              any[];
  lastActiveAt:              null;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit:  null;
  deleteSelfEnabled:         boolean;
  legalAcceptedAt:           null;
}

export interface EmailAddress {
  id:           string;
  emailAddress: string;
  verification: Verification;
  linkedTo:     any[];
}

export interface Verification {
  status:                          string;
  strategy:                        string;
  externalVerificationRedirectURL: null;
  attempts:                        null;
  expireAt:                        null;
  nonce:                           null;
  message:                         null;
}

export interface Fhir {
  address:       Address[];
  meta:          Meta;
  name:          Name[];
  birthDate:     string;
  resourceType:  string;
  active:        boolean;
  communication: Communication[];
  id:            string;
  identifier:    Identifier[];
  telecom:       Identifier[];
  gender:        string;
  maritalStatus: MaritalStatus;
}

export interface Address {
  use:      string;
  city:     string;
  line:     string[];
  state:    string;
  _country: Country;
}

export interface Country {
  extension: CountryExtension[];
}

export interface CountryExtension {
  url:                  string;
  valueCodeableConcept: MaritalStatus;
}

export interface MaritalStatus {
  coding: Coding[];
}

export interface Coding {
  code:    string;
  system:  string;
  display: string;
}

export interface Communication {
  language: MaritalStatus;
}

export interface Identifier {
  use:    string;
  type?:  Type;
  value:  string;
  system: string;
}

export interface Type {
  coding:    Coding[];
  extension: CountryExtension[];
}

export interface Meta {
  profile:     string[];
  lastUpdated: Date;
  versionId:   string;
  extension:   MetaExtension[];
}

export interface MetaExtension {
  url:          string;
  valueInstant: Date;
}

export interface Name {
  use:    string;
  given:  string[];
  family: string;
}

export interface Mongo {
  id_patient:        string;
  id_oauth:          string;
  plan:              Plan[];
  country_residence: string;
  state:             boolean;
  createdAt:         Date;
  updatedAt:         Date;
  uid:               string;
}

export interface Plan {
  id_plan:           IDPlan;
  registration_date: Date;
  cancellation_date: null;
  createdAt:         Date;
  updatedAt:         Date;
}

export interface IDPlan {
  self_managed_load:     boolean;
  max_number_of_loads:   number;
  _id:                   string;
  identifier:            string;
  name:                  string;
  start_validity:        Date;
  end_validity:          Date;
  holder_quantity:       number;
  manage_loads:          boolean;
  load_count_per_holder: number;
  selfmanage_loads:      boolean;
  state:                 boolean;
  createdAt:             Date;
  updatedAt:             Date;
}
