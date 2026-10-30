// Every token names its purpose, so a password-reset token can never be
// used where an access token is expected.
export interface JwtPayload {
  email: string;
  typ: 'access' | 'reset';
}
