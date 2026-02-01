export interface ITokenService {
  sign(payload: Record<string, unknown>): Promise<string>;
}
