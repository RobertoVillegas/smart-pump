/**
 * Slim user shape the auth flow needs: enough to verify credentials,
 * gate inactive accounts, and project a session user response.
 */
export interface AuthUser {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
}
