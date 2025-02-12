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
