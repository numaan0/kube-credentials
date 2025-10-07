export interface CredentialRequest {
  credential: string; 
}

export interface IssuanceResponse {
  message: string;
  credential_hash?: string;  // Return the hash on success
}
