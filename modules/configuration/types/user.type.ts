export interface UserType {
  clerk: Clerk;
  fhir:  Fhir;
  mongo: Mongo;
}

export interface Clerk {
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
  primaryPhoneNumberId:      string;
  primaryWeb3WalletId:       null;
  lastSignInAt:              null;
  externalId:                null;
  username:                  string;
  firstName:                 string;
  lastName:                  string;
  publicMetadata:            PublicMetadata;
  privateMetadata:           EMetadata;
  unsafeMetadata:            EMetadata;
  emailAddresses:            EmailAddressElement[];
  phoneNumbers:              PhoneNumberElement[];
  web3Wallets:               any[];
  externalAccounts:          any[];
  samlAccounts:              any[];
  lastActiveAt:              null;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit:  null;
  deleteSelfEnabled:         boolean;
  legalAcceptedAt:           null;
  _raw:                      Raw;
}

export interface Raw {
  id:                              string;
  object:                          string;
  username:                        string;
  first_name:                      string;
  last_name:                       string;
  image_url:                       string;
  has_image:                       boolean;
  primary_email_address_id:        string;
  primary_phone_number_id:         string;
  primary_web3_wallet_id:          null;
  password_enabled:                boolean;
  two_factor_enabled:              boolean;
  totp_enabled:                    boolean;
  backup_code_enabled:             boolean;
  email_addresses:                 EmailAddress[];
  phone_numbers:                   PhoneNumber[];
  web3_wallets:                    any[];
  passkeys:                        any[];
  external_accounts:               any[];
  saml_accounts:                   any[];
  enterprise_accounts:             any[];
  public_metadata:                 PublicMetadata;
  private_metadata:                EMetadata;
  unsafe_metadata:                 EMetadata;
  external_id:                     null;
  last_sign_in_at:                 null;
  banned:                          boolean;
  locked:                          boolean;
  lockout_expires_in_seconds:      null;
  verification_attempts_remaining: number;
  created_at:                      number;
  updated_at:                      number;
  delete_self_enabled:             boolean;
  create_organization_enabled:     boolean;
  last_active_at:                  null;
  mfa_enabled_at:                  null;
  mfa_disabled_at:                 null;
  legal_accepted_at:               null;
  profile_image_url:               string;
}

export interface EmailAddress {
  id:                     string;
  object:                 string;
  email_address:          string;
  reserved:               boolean;
  verification:           EmailAddressVerification;
  linked_to:              any[];
  matches_sso_connection: boolean;
  created_at:             number;
  updated_at:             number;
}

export interface EmailAddressVerification {
  status:    string;
  strategy:  string;
  attempts:  null;
  expire_at: null;
}

export interface PhoneNumber {
  id:                         string;
  object:                     string;
  phone_number:               string;
  reserved_for_second_factor: boolean;
  default_second_factor:      boolean;
  reserved:                   boolean;
  verification:               EmailAddressVerification;
  linked_to:                  any[];
  backup_codes:               null;
  created_at:                 number;
  updated_at:                 number;
}

export interface EMetadata {
}

export interface PublicMetadata {
  role: string[];
}

export interface EmailAddressElement {
  id:           string;
  emailAddress: string;
  verification: EmailAddressVerificationClass;
  linkedTo:     any[];
}

export interface EmailAddressVerificationClass {
  status:                          string;
  strategy:                        string;
  externalVerificationRedirectURL: null;
  attempts:                        null;
  expireAt:                        null;
  nonce:                           null;
  message:                         null;
}

export interface PhoneNumberElement {
  id:                      string;
  phoneNumber:             string;
  reservedForSecondFactor: boolean;
  defaultSecondFactor:     boolean;
  verification:            EmailAddressVerificationClass;
  linkedTo:                any[];
}

export interface Fhir {
  address:       Address[];
  meta:          Meta;
  name:          Name[];
  birthDate:     Date;
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
  id_practitioner:   null;
  plan:              any[];
  country_residence: string;
  state:             boolean;
  createdAt:         Date;
  updatedAt:         Date;
  uid:               string;
}
